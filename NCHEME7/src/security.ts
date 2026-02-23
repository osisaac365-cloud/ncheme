import bcrypt from 'bcryptjs';

export class PasswordSecurity {
  static validatePasswordStrength(password: string): boolean {
    // 8+ chars, Uppercase, Lowercase, Number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export interface User {
  id: number;
  username: string;
  password_hash: string;
  role: 'Artist' | 'Fan' | 'Admin';
  is_locked: number;
  failed_attempts: number;
}
