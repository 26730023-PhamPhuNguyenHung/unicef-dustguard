import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import type { Role, User, Permission } from '@dustguard-operations/shared';
import { can as canCheck, ROLE_PERMISSIONS } from '@dustguard-operations/shared';

interface AuthContextType {
  user: User | null;
  permissions: Permission[];
  loading: boolean;
  login: (username: string, password?: string) => Promise<User>;
  logout: () => Promise<void>;
  switchRole: (role: Role) => Promise<void>;
  can: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEV_ACCOUNTS: Record<Role, { username: string; label: string; name: string }> = {
  staff: { username: 'staff1', label: 'Cán bộ Hiện trường', name: 'Nguyễn Văn Hùng' },
  supervisor: { username: 'supervisor1', label: 'Lãnh đạo Điều phối', name: 'Võ Minh Trí' },
  legal_reviewer: { username: 'legal1', label: 'Chuyên viên Pháp chế', name: 'Luật sư Đặng Thu Thảo' },
  admin: { username: 'admin', label: 'Quản trị Hệ thống', name: 'Quản trị viên' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.auth.me();
      setUser(res.user);
      setPermissions(res.permissions as Permission[]);
    } catch {
      setUser(null);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('dustguard_token');
    const loggedOut = localStorage.getItem('dustguard_logged_out');
    if (token) {
      fetchCurrentUser();
    } else if (!loggedOut) {
      // Auto-authenticate default staff role for smooth operations and seamless testing
      login('staff1', 'password123').catch(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  const login = async (username: string, password = 'password123'): Promise<User> => {
    setLoading(true);
    try {
      const res = await api.auth.login({ username, password });
      localStorage.setItem('dustguard_token', res.token);
      localStorage.removeItem('dustguard_dev_user_id');
      localStorage.removeItem('dustguard_logged_out');
      setUser(res.user);
      setPermissions(res.permissions as Permission[]);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {}
    localStorage.removeItem('dustguard_token');
    localStorage.removeItem('dustguard_dev_user_id');
    localStorage.setItem('dustguard_logged_out', '1');
    setUser(null);
    setPermissions([]);
  };

  const switchRole = async (role: Role) => {
    const account = DEV_ACCOUNTS[role];
    if (account) {
      await login(account.username, 'password123');
    }
  };

  const can = (permission: Permission): boolean => {
    if (!user) return false;
    return canCheck(user.role, permission);
  };

  return (
    <AuthContext.Provider value={{ user, permissions, loading, login, logout, switchRole, can }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
