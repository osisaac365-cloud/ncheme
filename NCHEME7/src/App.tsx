import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate, useParams, useLocation } from 'react-router-dom';
import { 
  Music, 
  Upload, 
  User, 
  LogOut, 
  Download, 
  Shield, 
  LayoutDashboard, 
  Store, 
  UserCircle,
  Activity,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  FileMusic,
  Lock,
  Mail,
  ExternalLink,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PRICING = {
  Single: '20 KSH',
  Mixtape: '40 KSH',
  Album: '50 KSH'
};

const GENRES = ['Afrobeats', 'Hip Hop', 'R&B', 'Gospel', 'Reggae', 'Gengetone', 'Other'];

// --- Components ---
const Navbar = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Music className="text-black w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">NCHEME</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {!isLandingPage && (
            <Link to="/store" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Music Store</Link>
          )}
          {user && (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Dashboard</Link>
              {user.role === 'Artist' && (
                <Link to="/upload" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Upload</Link>
              )}
              {user.role === 'Admin' && (
                <Link to="/admin" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Admin Logs</Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-white uppercase tracking-widest">{user.username}</span>
                <span className="text-[10px] text-emerald-500 font-mono">{user.role}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-500 transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-emerald-500 transition-colors"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-black border-t border-white/10 py-12 mt-20">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-2">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Music className="text-black w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tighter text-white">NCHEME</span>
        </Link>
        <p className="text-zinc-500 text-sm max-w-xs">
          Empowering the next generation of sound. Built for artists, by people who love music.
        </p>
      </div>
      <div>
        <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Platform</h4>
        <ul className="space-y-4">
          <li><Link to="/auth?role=Fan" className="text-zinc-500 hover:text-white text-sm transition-colors">Browse as Fan</Link></li>
          <li><Link to="/auth?role=Artist" className="text-zinc-500 hover:text-white text-sm transition-colors">Join as Artist</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Support</h4>
        <ul className="space-y-4">
          <li><Link to="/support" className="text-zinc-500 hover:text-white text-sm transition-colors">Help Center</Link></li>
          <li><Link to="/privacy" className="text-zinc-500 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-zinc-600 text-xs">© 2026 NCHEME. All rights reserved.</p>
      <div className="flex gap-6">
        <a href="#" className="text-zinc-600 hover:text-white transition-colors"><Activity className="w-4 h-4" /></a>
      </div>
    </div>
  </footer>
);

// --- Pages ---

const LandingPage = ({ user }: { user: any }) => (
  <div className="min-h-screen pt-16 flex flex-col items-center justify-center px-4 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-4xl relative z-10"
    >
      <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-6 leading-none">
        THE SOUND OF <br />
        <span className="text-emerald-500">TOMORROW.</span>
      </h1>
      <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
        NCHEME is the premier platform for upcoming artists to share their craft and for fans to discover the next big thing.
      </p>
      {!user && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/auth?role=Artist" className="w-full sm:w-auto px-10 py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:scale-105 transition-transform">
            Join as Artist
          </Link>
          <Link to="/auth?role=Fan" className="w-full sm:w-auto px-10 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            Browse as Fan
          </Link>
        </div>
      )}
      {user && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/dashboard" className="w-full sm:w-auto px-10 py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:scale-105 transition-transform">
            Go to Dashboard
          </Link>
        </div>
      )}
    </motion.div>
  </div>
);

const PrivacyPolicy = () => (
  <div className="min-h-screen pt-32 px-4 max-w-4xl mx-auto pb-20">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-5xl font-black text-white mb-8 tracking-tight">PRIVACY POLICY</h1>
      <div className="space-y-8 text-zinc-400 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" /> 1. Data Collection
          </h2>
          <p>We collect information you provide directly to us, such as when you create an account, upload music, or communicate with us. This includes your username, password (hashed), and role.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-500" /> 2. Security
          </h2>
          <p>We implement industry-standard security measures to protect your data. Passwords are hashed using bcrypt, and we monitor system logs for unauthorized access.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-emerald-500" /> 3. Usage
          </h2>
          <p>Your data is used to provide the NCHEME platform services, including music hosting, artist profiles, and download management. We do not sell your personal data to third parties.</p>
        </section>
      </div>
    </motion.div>
  </div>
);

const Support = () => (
  <div className="min-h-screen pt-32 px-4 max-w-4xl mx-auto pb-20">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-5xl font-black text-white mb-8 tracking-tight">SUPPORT CENTER</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl">
          <Mail className="w-10 h-10 text-emerald-500 mb-6" />
          <h3 className="text-2xl font-bold text-white mb-2">Email Support</h3>
          <p className="text-zinc-500 mb-6">Get in touch with our team for technical issues or account inquiries.</p>
          <a href="mailto:support@ncheme.com" className="inline-flex items-center gap-2 text-emerald-500 font-bold hover:underline">
            support@ncheme.com <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl">
          <Info className="w-10 h-10 text-emerald-500 mb-6" />
          <h3 className="text-2xl font-bold text-white mb-2">Knowledge Base</h3>
          <p className="text-zinc-500 mb-6">Learn how to optimize your artist profile and manage your uploads.</p>
          <button className="text-zinc-400 font-bold cursor-not-allowed">Coming Soon</button>
        </div>
      </div>
    </motion.div>
  </div>
);

const AuthPage = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Artist' | 'Fan'>('Fan');
  const [error, setError] = useState('');
  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get('role');
    if (r === 'Artist' || r === 'Fan') setRole(r);
  }, []);

  const validatePassword = (p: string) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    setStrength(score);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { username, password } : { username, password, role };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        if (isLogin) {
          onLogin(data.user);
          navigate('/dashboard');
        } else {
          setIsLogin(true);
          setError('Registration successful! Please login.');
        }
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError('Connection failed');
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-900 border border-white/10 p-8 rounded-3xl"
      >
        <div className="flex gap-4 mb-8 p-1 bg-black rounded-xl">
          <button 
            onClick={() => setIsLogin(true)}
            className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all", isLogin ? "bg-zinc-800 text-white" : "text-zinc-500")}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all", !isLogin ? "bg-zinc-800 text-white" : "text-zinc-500")}
          >
            Sign Up
          </button>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
              required
            />
            {!isLogin && (
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={cn("h-1 flex-1 rounded-full transition-all", strength >= i ? "bg-emerald-500" : "bg-zinc-800")} />
                ))}
              </div>
            )}
          </div>
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none appearance-none"
              >
                <option value="Fan">Fan</option>
                <option value="Artist">Artist</option>
              </select>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex gap-4 mt-4">
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 py-4 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button className="flex-[2] py-4 bg-emerald-500 text-black font-bold rounded-xl hover:scale-[1.02] transition-transform">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ user }: { user: any }) => {
  const [music, setMusic] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [view, setView] = useState<'uploads' | 'performance' | 'trending' | 'recommended'>('uploads');
  const navigate = useNavigate();

  useEffect(() => {
    // Default view for fans should be trending or recommended
    if (user.role === 'Fan') setView('trending');

    fetch('/api/music')
      .then(res => res.json())
      .then(setMusic);
    
    fetch('/api/music/trending')
      .then(res => res.json())
      .then(setTrending);

    fetch('/api/music/recommended')
      .then(res => res.json())
      .then(setRecommended);

    if (user.role === 'Artist') {
      fetch('/api/artist/performance')
        .then(res => res.json())
        .then(setSales);
    }
  }, [user.role]);

  const handleDownload = (id: number) => {
    window.location.href = `/api/music/download/${id}`;
  };

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">DASHBOARD</h1>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest mt-1">
            {user.role} Account • {user.username}
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {user.role === 'Artist' && (
            <>
              <button 
                onClick={() => setView('uploads')}
                className={cn(
                  "px-6 py-2 rounded-xl font-bold text-sm transition-all",
                  view === 'uploads' ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-400 border border-white/10"
                )}
              >
                My Uploads
              </button>
              <button 
                onClick={() => setView('performance')}
                className={cn(
                  "px-6 py-2 rounded-xl font-bold text-sm transition-all",
                  view === 'performance' ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-400 border border-white/10"
                )}
              >
                Performance
              </button>
            </>
          )}
          <button 
            onClick={() => setView('uploads')}
            className={cn(
              "px-6 py-2 rounded-xl font-bold text-sm transition-all",
              user.role === 'Fan' && view === 'uploads' ? "bg-emerald-500 text-black" : (user.role === 'Artist' ? "hidden" : "bg-zinc-900 text-zinc-400 border border-white/10")
            )}
          >
            Recents
          </button>
          {user.role === 'Artist' && view !== 'uploads' && view !== 'performance' && (
             <button 
              onClick={() => setView('uploads')}
              className="px-6 py-2 rounded-xl font-bold text-sm bg-zinc-900 text-zinc-400 border border-white/10"
            >
              Recents
            </button>
          )}
          {/* Simplified tab logic */}
          <button 
            onClick={() => setView('trending')}
            className={cn(
              "px-6 py-2 rounded-xl font-bold text-sm transition-all",
              view === 'trending' ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-400 border border-white/10"
            )}
          >
            Trending
          </button>
          <button 
            onClick={() => setView('recommended')}
            className={cn(
              "px-6 py-2 rounded-xl font-bold text-sm transition-all",
              view === 'recommended' ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-400 border border-white/10"
            )}
          >
            Recommended
          </button>
          {user.role === 'Artist' && (
            <div className="bg-zinc-900 border border-white/10 p-4 rounded-2xl">
              <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Uploads</span>
              <span className="text-2xl font-black text-white">{music.filter(m => m.artist_id === user.id).length}</span>
            </div>
          )}
        </div>
      </div>

      {view === 'uploads' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(user.role === 'Artist' ? music.filter(m => m.artist_id === user.id) : music).map((track) => (
            <TrackCard key={track.id} track={track} onDownload={handleDownload} />
          ))}
        </div>
      )}

      {view === 'trending' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((track) => (
            <TrackCard key={track.id} track={track} onDownload={handleDownload} />
          ))}
        </div>
      )}

      {view === 'recommended' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommended.map((track) => (
            <TrackCard key={track.id} track={track} onDownload={handleDownload} />
          ))}
        </div>
      )}

      {view === 'performance' && user.role === 'Artist' && (
        <div className="bg-zinc-900 border border-white/10 rounded-[2rem] overflow-hidden">
          <div className="p-8 border-b border-white/10 bg-black/20">
            <h2 className="text-2xl font-bold text-white">Sales Report</h2>
            <p className="text-zinc-500 text-sm">Detailed view of individual track sales</p>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-black/50">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Track</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Fan</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{sale.title}</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{sale.price_type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-400">@{sale.fan_name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-emerald-500">{sale.amount} KSH</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-zinc-500">{new Date(sale.timestamp).toLocaleDateString()}</span>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 italic">
                    No sales recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const UploadPage = ({ user }: { user: any }) => {
  const [title, setTitle] = useState('');
  const [priceType, setPriceType] = useState('Single');
  const [genre, setGenre] = useState('Afrobeats');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (user.role !== 'Artist') return <Navigate to="/dashboard" />;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('priceType', priceType);
    formData.append('genre', genre);

    try {
      const res = await fetch('/api/music/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (e) {
      setError('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-zinc-900 border border-white/10 p-10 rounded-[2rem]"
      >
        <h1 className="text-3xl font-black text-white mb-8">UPLOAD NEW TRACK</h1>
        
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Track Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Release Type</label>
              <select 
                value={priceType}
                onChange={(e) => setPriceType(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none appearance-none"
              >
                <option value="Single">Single</option>
                <option value="Mixtape">Mixtape</option>
                <option value="Album">Album</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Genre</label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenre(g)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold transition-all",
                    genre === g ? "bg-emerald-500 text-black" : "bg-black text-zinc-500 border border-white/10 hover:border-white/20"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div 
            className={cn(
              "border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer",
              file ? "border-emerald-500 bg-emerald-500/5" : "border-white/10 hover:border-white/20 bg-black"
            )}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input 
              id="fileInput"
              type="file" 
              className="hidden" 
              accept=".mp3,.wav,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Upload className={cn("w-12 h-12 mb-4", file ? "text-emerald-500" : "text-zinc-500")} />
            <p className="text-white font-bold">{file ? file.name : 'Click to select file'}</p>
            <p className="text-zinc-500 text-sm mt-1">MP3, WAV, or PDF (Max 50MB)</p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-500 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Upload successful! Redirecting...
            </div>
          )}

          <button 
            disabled={isUploading || !file}
            className="w-full py-4 bg-emerald-500 disabled:bg-zinc-800 text-black font-bold rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            {isUploading ? 'Uploading...' : 'Publish Track'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const TrackCard = ({ track, onDownload }: { track: any, onDownload: (id: number) => void, key?: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-zinc-900 border border-white/10 p-6 rounded-3xl group hover:border-emerald-500/50 transition-all"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
        <FileMusic className="text-emerald-500 w-6 h-6" />
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="px-3 py-1 bg-black border border-white/10 rounded-full text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          {track.price_type}
        </span>
        <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-tighter">{track.genre}</span>
      </div>
    </div>
    <h3 className="text-xl font-bold text-white mb-1">{track.title}</h3>
    <Link to={`/artist/${track.artist_name}`} className="text-sm text-emerald-500 hover:underline mb-6 block">
      @{track.artist_name}
    </Link>
    
    <button 
      onClick={() => onDownload(track.id)}
      className="w-full py-3 bg-white/5 hover:bg-white text-white hover:text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
    >
      <Download className="w-4 h-4" />
      Download
    </button>
  </motion.div>
);

const MusicStore = () => {
  const [music, setMusic] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    fetch('/api/music')
      .then(res => res.json())
      .then(setMusic);
  }, []);

  const filteredMusic = music.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(search.toLowerCase()) ||
                         track.artist_name.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || track.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">MUSIC STORE</h1>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest mt-1">Discover & Support Artists</p>
        </div>
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search tracks or artists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        <button
          onClick={() => setSelectedGenre('All')}
          className={cn(
            "px-6 py-2 rounded-full text-xs font-bold transition-all",
            selectedGenre === 'All' ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-500 border border-white/10 hover:border-white/20"
          )}
        >
          All Genres
        </button>
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            className={cn(
              "px-6 py-2 rounded-full text-xs font-bold transition-all",
              selectedGenre === g ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-500 border border-white/10 hover:border-white/20"
            )}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMusic.map((track) => (
          <motion.div 
            key={track.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 overflow-hidden rounded-[2rem] group"
          >
            <div className="aspect-square bg-black flex items-center justify-center relative">
              <Music className="w-24 h-24 text-zinc-800 group-hover:text-emerald-500/20 transition-colors" />
              <div className="absolute top-6 left-6 px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                {track.genre}
              </div>
              <div className="absolute top-6 right-6 px-4 py-2 bg-emerald-500 text-black text-xs font-black rounded-full">
                {PRICING[track.price_type as keyof typeof PRICING]}
              </div>
            </div>
            <div className="p-8">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">{track.price_type}</span>
              <h3 className="text-2xl font-bold text-white mb-1">{track.title}</h3>
              <Link to={`/artist/${track.artist_name}`} className="text-sm text-emerald-500 hover:underline mb-6 block">
                @{track.artist_name}
              </Link>
              <button 
                onClick={() => window.location.href = `/api/music/download/${track.id}`}
                className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Get Track
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ArtistProfile = () => {
  const { username } = useParams();
  const [music, setMusic] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/music/artist/${username}`)
      .then(res => res.json())
      .then(setMusic);
  }, [username]);

  return (
    <div className="min-h-screen pt-32 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-16">
        <div className="w-32 h-32 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mb-6">
          <UserCircle className="w-20 h-20 text-black" />
        </div>
        <h1 className="text-5xl font-black text-white tracking-tight">@{username}</h1>
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest mt-2">Verified Artist</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {music.map((track) => (
          <div key={track.id} className="bg-zinc-900 border border-white/10 p-8 rounded-3xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">{track.price_type}</span>
              <h3 className="text-2xl font-bold text-white">{track.title}</h3>
            </div>
            <button 
              onClick={() => window.location.href = `/api/music/download/${track.id}`}
              className="px-8 py-3 bg-white/5 hover:bg-white text-white hover:text-black font-bold rounded-xl transition-all"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminLogs = ({ user }: { user: any }) => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/logs')
      .then(res => res.json())
      .then(setLogs);
  }, []);

  if (user.role !== 'Admin') return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight">SYSTEM LOGS</h1>
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest mt-1">Security & Activity Audit</p>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 bg-black/50">
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">User</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Action</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">IP Address</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-white">{log.username || 'System'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-zinc-400">{log.action}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-mono text-zinc-500">{log.ip_address}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-zinc-500">{new Date(log.timestamp).toLocaleString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500 selection:text-black">
      <BrowserRouter>
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<LandingPage user={user} />} />
          <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage onLogin={setUser} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/auth" />} />
          <Route path="/upload" element={user ? <UploadPage user={user} /> : <Navigate to="/auth" />} />
          <Route path="/store" element={<MusicStore />} />
          <Route path="/artist/:username" element={<ArtistProfile />} />
          <Route path="/admin" element={user ? <AdminLogs user={user} /> : <Navigate to="/auth" />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/support" element={<Support />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
