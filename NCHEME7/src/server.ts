import express from "express";
import { createServer as createViteServer } from "vite";
import session from "express-session";
import path from "path";
import fs from "fs";
import multer from "multer";
import { rateLimit } from "express-rate-limit";
import { body, validationResult, param } from "express-validator";
import { PasswordSecurity } from "./security.ts";
import db from "./db.ts";

// Extend session type
declare module "express-session" {
  interface SessionData {
    user: {
      id: number;
      username: string;
      role: string;
    };
  }
}

const app = express();

async function startServer() {
  const PORT = 3000;

  // Trust proxy for rate limiting and session cookies behind nginx
  app.set('trust proxy', 1);

  app.use(express.json());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
    validate: { trustProxy: false }, // Disable internal check since we set app.set('trust proxy')
  });
  app.use(limiter);

  // Auth rate limiting (stricter)
  const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 10, // Limit each IP to 10 login/register attempts per hour
    message: { error: "Too many authentication attempts, please try again later." },
    validate: { trustProxy: false },
  });

  app.use(session({
    secret: process.env.SESSION_SECRET || "ncheme-dev-secret-key-fallback",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      httpOnly: true,
    }
  }));

  // Validation Middleware
  const validate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };

  // Logging helper
  const logAction = (userId: number | null, action: string, ip: string) => {
    const stmt = db.prepare("INSERT INTO logs (user_id, action, ip_address) VALUES (?, ?, ?)");
    stmt.run(userId, action, ip);
  };

  // Auth Routes
  app.post("/api/auth/register", 
    authLimiter,
    [
      body("username").trim().isLength({ min: 3, max: 20 }).escape(),
      body("password").custom(PasswordSecurity.validatePasswordStrength),
      body("role").isIn(["Artist", "Fan"]),
    ],
    validate,
    async (req: express.Request, res: express.Response) => {
      const { username, password, role } = req.body;

    try {
      const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
      if (existing) return res.status(400).json({ error: "Username taken" });

      const hash = await PasswordSecurity.hashPassword(password);
      const stmt = db.prepare("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)");
      const result = stmt.run(username, hash, role);
      
      logAction(Number(result.lastInsertRowid), "User Registered", req.ip || "unknown");
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", 
    authLimiter,
    [
      body("username").trim().notEmpty().escape(),
      body("password").notEmpty(),
    ],
    validate,
    async (req: express.Request, res: express.Response) => {
      const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as any;

    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    if (user.is_locked) return res.status(403).json({ error: "Account locked" });

    const valid = await PasswordSecurity.verifyPassword(password, user.password_hash);

    if (valid) {
      db.prepare("UPDATE users SET failed_attempts = 0 WHERE id = ?").run(user.id);
      req.session.user = { id: user.id, username: user.username, role: user.role };
      logAction(user.id, "User Login", req.ip || "unknown");
      res.json({ user: req.session.user });
    } else {
      const attempts = user.failed_attempts + 1;
      const isLocked = attempts >= 3 ? 1 : 0;
      db.prepare("UPDATE users SET failed_attempts = ?, is_locked = ? WHERE id = ?").run(attempts, isLocked, user.id);
      logAction(user.id, `Failed Login Attempt (${attempts})`, req.ip || "unknown");
      res.status(401).json({ error: isLocked ? "Account locked due to failed attempts" : "Invalid credentials" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    if (req.session.user) {
      logAction(req.session.user.id, "User Logout", req.ip || "unknown");
    }
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    res.json({ user: req.session.user || null });
  });

  // Music Routes
  const isVercel = process.env.VERCEL === '1';
  const uploadDir = isVercel ? "/tmp/uploads/" : (process.env.UPLOAD_DIR || "uploads/");
  const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
      const allowed = [".mp3", ".wav", ".pdf"];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowed.includes(ext)) cb(null, true);
      else cb(new Error("Invalid file type"));
    }
  });

  app.post("/api/music/upload", 
    (req, res, next) => {
      if (!req.session.user || req.session.user.role !== "Artist") {
        return res.status(403).json({ error: "Artist only" });
      }
      next();
    }, 
    upload.single("file"), 
    [
      body("title").trim().isLength({ min: 1, max: 100 }).escape(),
      body("priceType").isIn(["Single", "Mixtape", "Album"]),
      body("genre").trim().notEmpty().escape(),
    ],
    validate,
    (req: express.Request, res: express.Response) => {
      const { title, priceType, genre } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file" });

    const stmt = db.prepare("INSERT INTO music (artist_id, title, price_type, genre, filename) VALUES (?, ?, ?, ?, ?)");
    stmt.run(req.session.user!.id, title, priceType, genre || 'Other', req.file.filename);
    
    logAction(req.session.user!.id, `Uploaded Music: ${title}`, req.ip || "unknown");
    res.json({ success: true });
  });

  app.get("/api/music", (req, res) => {
    const music = db.prepare(`
      SELECT m.*, u.username as artist_name 
      FROM music m 
      JOIN users u ON m.artist_id = u.id 
      ORDER BY upload_date DESC
    `).all();
    res.json(music);
  });

  app.get("/api/music/trending", (req, res) => {
    const music = db.prepare(`
      SELECT m.*, u.username as artist_name, COUNT(s.id) as sales_count
      FROM music m 
      JOIN users u ON m.artist_id = u.id 
      LEFT JOIN sales s ON m.id = s.music_id
      GROUP BY m.id
      ORDER BY sales_count DESC, upload_date DESC
      LIMIT 10
    `).all();
    res.json(music);
  });

  app.get("/api/music/recommended", (req, res) => {
    const music = db.prepare(`
      SELECT m.*, u.username as artist_name 
      FROM music m 
      JOIN users u ON m.artist_id = u.id 
      ORDER BY RANDOM()
      LIMIT 10
    `).all();
    res.json(music);
  });

  app.get("/api/music/artist/:username", 
    [param("username").trim().notEmpty().escape()],
    validate,
    (req: express.Request, res: express.Response) => {
      const music = db.prepare(`
      SELECT m.*, u.username as artist_name 
      FROM music m 
      JOIN users u ON m.artist_id = u.id 
      WHERE u.username = ?
      ORDER BY upload_date DESC
    `).all(req.params.username);
    res.json(music);
  });

  app.get("/api/music/download/:id", 
    [param("id").isInt()],
    validate,
    (req: express.Request, res: express.Response) => {
      if (!req.session.user) return res.status(401).json({ error: "Login required" });
    
    const track = db.prepare("SELECT * FROM music WHERE id = ?").get(req.params.id) as any;
    if (!track) return res.status(404).json({ error: "Not found" });

    // Record sale if not already recorded for this user (simulating purchase on download)
    const existingSale = db.prepare("SELECT id FROM sales WHERE music_id = ? AND fan_id = ?").get(track.id, req.session.user.id);
    if (!existingSale) {
      const prices = { Single: 20, Mixtape: 40, Album: 50 };
      const amount = prices[track.price_type as keyof typeof prices] || 0;
      db.prepare("INSERT INTO sales (music_id, fan_id, amount) VALUES (?, ?, ?)").run(track.id, req.session.user.id, amount);
    }

    const isVercel = process.env.VERCEL === '1';
    const uploadDir = isVercel ? "/tmp/uploads/" : (process.env.UPLOAD_DIR || "uploads/");
    const filePath = path.resolve(uploadDir, track.filename);
    if (fs.existsSync(filePath)) {
      logAction(req.session.user.id, `Downloaded Track: ${track.title}`, req.ip || "unknown");
      res.download(filePath, track.title + path.extname(track.filename));
    } else {
      res.status(404).json({ error: "File missing" });
    }
  });

  // Artist Performance
  app.get("/api/artist/performance", (req, res) => {
    if (!req.session.user || req.session.user.role !== "Artist") {
      return res.status(403).json({ error: "Artist only" });
    }

    const sales = db.prepare(`
      SELECT s.*, m.title, u.username as fan_name, m.price_type
      FROM sales s
      JOIN music m ON s.music_id = m.id
      JOIN users u ON s.fan_id = u.id
      WHERE m.artist_id = ?
      ORDER BY s.timestamp DESC
    `).all(req.session.user.id);

    res.json(sales);
  });

  // Admin Logs
  app.get("/api/admin/logs", (req, res) => {
    if (!req.session.user || req.session.user.role !== "Admin") {
      return res.status(403).json({ error: "Admin only" });
    }
    const logs = db.prepare(`
      SELECT l.*, u.username 
      FROM logs l 
      LEFT JOIN users u ON l.user_id = u.id 
      ORDER BY timestamp DESC 
      LIMIT 100
    `).all();
    res.json(logs);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => res.sendFile(path.resolve("dist/index.html")));
  }

  if (process.env.NODE_ENV !== "production" && process.env.VERCEL !== '1') {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
