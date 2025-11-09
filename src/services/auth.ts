import { getDatabase, saveDatabase } from './database';
import bcrypt from 'bcryptjs';
import type { User } from '../types';

// Secure password hashing using bcrypt
function hashPassword(password: string): string {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
}

// Verify password against hash
function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

// Register new user
export function register(
  name: string,
  email: string,
  password: string,
  phone?: string
): { success: boolean; error?: string; user?: User } {
  try {
    const db = getDatabase();

    // Check if email already exists
    const existing = db.exec(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0 && existing[0].values.length > 0) {
      return { success: false, error: 'Email already registered' };
    }

    // Create new user
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const hashedPassword = hashPassword(password);
    const createdAt = new Date().toISOString();

    db.run(
      `INSERT INTO users (id, name, email, password, phone, role, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, email, hashedPassword, phone || '', 'farmer', createdAt]
    );

    // Create default settings
    db.run(
      `INSERT INTO user_settings (user_id) VALUES (?)`,
      [userId]
    );

    saveDatabase();

    const user: User = {
      id: userId,
      name,
      email,
      phone: phone || '',
      role: 'farmer',
      createdAt: new Date(createdAt),
    };

    return { success: true, user };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed' };
  }
}

// Login user
export function login(
  email: string,
  password: string
): { success: boolean; error?: string; user?: User; sessionId?: string } {
  try {
    const db = getDatabase();

    // Find user by email first
    const result = db.exec(
      `SELECT id, name, email, phone, avatar, role, created_at, password
       FROM users
       WHERE email = ?`,
      [email]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return { success: false, error: 'Invalid email or password' };
    }

    const row = result[0].values[0];
    const storedPasswordHash = row[7] as string;

    // Verify password using bcrypt
    if (!verifyPassword(password, storedPasswordHash)) {
      return { success: false, error: 'Invalid email or password' };
    }

    const user: User = {
      id: row[0] as string,
      name: row[1] as string,
      email: row[2] as string,
      phone: row[3] as string,
      avatar: row[4] as string | undefined,
      role: row[5] as 'farmer' | 'admin',
      createdAt: new Date(row[6] as string),
    };

    // Create session
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

    db.run(
      `INSERT INTO sessions (id, user_id, created_at, expires_at)
       VALUES (?, ?, ?, ?)`,
      [sessionId, user.id, createdAt, expiresAt]
    );

    saveDatabase();

    return { success: true, user, sessionId };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
}

// Verify session
export function verifySession(sessionId: string): { valid: boolean; user?: User } {
  try {
    const db = getDatabase();

    // Get session and user
    const result = db.exec(
      `SELECT u.id, u.name, u.email, u.phone, u.avatar, u.role, u.created_at, s.expires_at
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`,
      [sessionId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return { valid: false };
    }

    const row = result[0].values[0];
    const expiresAt = new Date(row[7] as string);

    // Check if session expired
    if (expiresAt < new Date()) {
      // Delete expired session
      db.run('DELETE FROM sessions WHERE id = ?', [sessionId]);
      saveDatabase();
      return { valid: false };
    }

    const user: User = {
      id: row[0] as string,
      name: row[1] as string,
      email: row[2] as string,
      phone: row[3] as string,
      avatar: row[4] as string | undefined,
      role: row[5] as 'farmer' | 'admin',
      createdAt: new Date(row[6] as string),
    };

    return { valid: true, user };
  } catch (error) {
    console.error('Session verification error:', error);
    return { valid: false };
  }
}

// Logout user
export function logout(sessionId: string): boolean {
  try {
    const db = getDatabase();
    db.run('DELETE FROM sessions WHERE id = ?', [sessionId]);
    saveDatabase();
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}

// Update user profile
export function updateProfile(
  userId: string,
  updates: Partial<Pick<User, 'name' | 'email' | 'phone' | 'avatar'>>
): { success: boolean; error?: string } {
  try {
    const db = getDatabase();

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.email !== undefined) {
      fields.push('email = ?');
      values.push(updates.email);
    }
    if (updates.phone !== undefined) {
      fields.push('phone = ?');
      values.push(updates.phone);
    }
    if (updates.avatar !== undefined) {
      fields.push('avatar = ?');
      values.push(updates.avatar);
    }

    if (fields.length === 0) {
      return { success: false, error: 'No fields to update' };
    }

    values.push(userId);

    db.run(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    saveDatabase();

    return { success: true };
  } catch (error) {
    console.error('Profile update error:', error);
    return { success: false, error: 'Update failed' };
  }
}

// Change password
export function changePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
): { success: boolean; error?: string } {
  try {
    const db = getDatabase();

    // Get current password hash
    const result = db.exec(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return { success: false, error: 'User not found' };
    }

    const storedPasswordHash = result[0].values[0][0] as string;

    // Verify old password using bcrypt
    if (!verifyPassword(oldPassword, storedPasswordHash)) {
      return { success: false, error: 'Incorrect current password' };
    }

    // Hash new password
    const newHash = hashPassword(newPassword);

    // Update password
    db.run('UPDATE users SET password = ? WHERE id = ?', [newHash, userId]);

    // Invalidate all existing sessions
    db.run('DELETE FROM sessions WHERE user_id = ?', [userId]);

    saveDatabase();

    return { success: true };
  } catch (error) {
    console.error('Password change error:', error);
    return { success: false, error: 'Password change failed' };
  }
}

// Get user by ID
export function getUserById(userId: string): User | null {
  try {
    const db = getDatabase();

    const result = db.exec(
      `SELECT id, name, email, phone, avatar, role, created_at
       FROM users
       WHERE id = ?`,
      [userId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    const row = result[0].values[0];
    return {
      id: row[0] as string,
      name: row[1] as string,
      email: row[2] as string,
      phone: row[3] as string,
      avatar: row[4] as string | undefined,
      role: row[5] as 'farmer' | 'admin',
      createdAt: new Date(row[6] as string),
    };
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}
