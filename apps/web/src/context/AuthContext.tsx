import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserDto, UserRole } from '@dustguard/shared';
import { apiRequest } from '../api/client.js';

interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserDto>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  devSwitchRole: (role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeUser(raw: any): UserDto | null {
  if (!raw) return null;
  const u = raw.user || raw;
  if (!u || typeof u !== 'object') return null;
  const fullName = u.fullName || u.full_name || (u.email ? u.email.split('@')[0] : 'Người dùng');
  return {
    ...u,
    fullName,
    full_name: fullName,
    role: u.role || 'citizen',
    avatarUrl: u.avatarUrl || u.avatar_url || null,
    createdAt: u.createdAt || u.created_at || new Date().toISOString()
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('dustguard_token'));
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const userData = await apiRequest<any>('/auth/me');
      setUser(normalizeUser(userData));
    } catch (err) {
      console.warn('Lỗi lấy thông tin người dùng, xóa phiên cũ:', err);
      localStorage.removeItem('dustguard_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email: string, password: string): Promise<UserDto> => {
    const res = await apiRequest<{ token: string; user: UserDto }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    const parsedUser = normalizeUser(res.user || res) || res.user;
    localStorage.setItem('dustguard_token', res.token);
    setToken(res.token);
    setUser(parsedUser);
    return parsedUser;
  };

  const register = async (data: any) => {
    const res = await apiRequest<{ token: string; user: UserDto }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const parsedUser = normalizeUser(res.user || res) || res.user;
    localStorage.setItem('dustguard_token', res.token);
    setToken(res.token);
    setUser(parsedUser);
  };

  const logout = () => {
    localStorage.removeItem('dustguard_token');
    setToken(null);
    setUser(null);
  };

  const devSwitchRole = async (role: UserRole) => {
    const res = await apiRequest<{ token: string; user: UserDto }>('/auth/dev-switch-role', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
    localStorage.setItem('dustguard_token', res.token);
    setToken(res.token);
    const parsedUser = normalizeUser(res.user || res);
    setUser(parsedUser);

    // Fetch lại /auth/me đầy đủ và phát tín hiệu revalidation
    try {
      const fullUser = await apiRequest<any>('/auth/me', {
        headers: { Authorization: `Bearer ${res.token}` }
      });
      const normalized = normalizeUser(fullUser);
      if (normalized) setUser(normalized);
    } catch (e) {
      // Giữ user từ dev-switch-role nếu me lỗi nhẹ
    }

    window.dispatchEvent(new CustomEvent('auth:role_changed', { detail: parsedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        devSwitchRole,
        refreshUser: fetchCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
