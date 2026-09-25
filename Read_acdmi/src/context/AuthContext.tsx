import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getCurrentUser, setCurrentUser as persistCurrentUser, removeToken } from '../services/api';
import { useToast } from '../components/common/Toast';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
export type PortalType = 'public' | 'admin' | 'teacher' | 'student';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string | null;
  admin?: any;
  student?: any;
  teacher?: any;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  activePortal: PortalType;
  setActivePortal: (portal: PortalType) => void;
  login: (identifier: string, password: string, role?: string) => Promise<boolean>;
  updateProfile: (data: any) => Promise<boolean>;
  logout: () => void;
  quickLoginAs: (targetRole: 'admin' | 'teacher' | 'student' | 'parent') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState<AuthUser | null>(() => {
    return getCurrentUser();
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('read_academy_token');
  });
  const [activePortal, setActivePortal] = useState<PortalType>('public');

  // Verify and refresh profile from database on mount if token exists
  useEffect(() => {
    const savedToken = localStorage.getItem('read_academy_token');
    if (savedToken) {
      authApi.getMe().then((res) => {
        if (res?.user) {
          setUser(res.user);
          persistCurrentUser(res.user);
        }
      }).catch((err) => {
        console.warn('Session verification failed:', err);
      });
    }
  }, []);

  const login = async (identifier: string, password: string, role?: string): Promise<boolean> => {
    try {
      const res = await authApi.login({
        email: identifier.trim(),
        password,
        role: role ? (role === 'admin' ? 'SUPER_ADMIN' : role.toUpperCase()) : undefined
      });

      if (res.user) {
        setUser(res.user);
        setToken(res.token);
        persistCurrentUser(res.user);

        const nextPortal: PortalType =
          (res as any).portalTarget ||
          (res.user.role === 'TEACHER'
            ? 'teacher'
            : res.user.role === 'STUDENT' || res.user.role === 'PARENT'
            ? 'student'
            : 'admin');
        setActivePortal(nextPortal);
        showToast(`Welcome Back, ${res.user.fullName}!`, `Role: ${res.user.role} • Loaded ${nextPortal.toUpperCase()} Workspace`, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('API login failed:', err);
      showToast('Authentication Failed', err.message || 'Invalid institutional credentials or password', 'error');
      return false;
    }
  };

  const updateProfile = async (data: any): Promise<boolean> => {
    try {
      const res = await authApi.updateProfile(data);
      if (res?.user) {
        setUser(res.user);
        persistCurrentUser(res.user);
        showToast('Profile Updated', 'Your profile details have been saved to the database', 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Profile update failed:', err);
      showToast('Profile Update Failed', err?.message || 'Could not update profile', 'error');
      return false;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setToken(null);
    removeToken();
    localStorage.removeItem('read_academy_user');
    localStorage.removeItem('read_academy_portal');
    setActivePortal('public');
    showToast('Logged Out Successfully', 'You have been safely signed out.', 'info');
  };

  const quickLoginAs = async (targetRole: 'admin' | 'teacher' | 'student' | 'parent') => {
    const creds = {
      admin: { id: 'admin@readacademy.edu.pk', pass: 'admin1234' },
      teacher: { id: 'teacher@readacademy.edu.pk', pass: 'teacher1234' },
      student: { id: 'student@readacademy.edu.pk', pass: 'student1234' },
      parent: { id: 'parent@readacademy.edu.pk', pass: 'parent1234' }
    }[targetRole];

    const success = await login(creds.id, creds.pass, targetRole);
    if (!success) {
      showToast('Quick Login Failed', `Could not log in as ${targetRole}. Verify real account in database.`, 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        activePortal,
        setActivePortal,
        login,
        updateProfile,
        logout,
        quickLoginAs
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
