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
      const userData = await apiRequest<UserDto>('/auth/me');
      setUser(userData);
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
    localStorage.setItem('dustguard_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (data: any) => {
    const res = await apiRequest<{ token: string; user: UserDto }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    localStorage.setItem('dustguard_token', res.token);
    setToken(res.token);
    setUser(res.user);
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
    setUser(res.user);

    // Fetch lại /auth/me đầy đủ và phát tín hiệu revalidation
    try {
      const fullUser = await apiRequest<UserDto>('/auth/me', {
        headers: { Authorization: `Bearer ${res.token}` }
      });
      setUser(fullUser);
    } catch (e) {
      // Giữ user từ dev-switch-role nếu me lỗi nhẹ
    }

    window.dispatchEvent(new CustomEvent('auth:role_changed', { detail: res.user }));
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
