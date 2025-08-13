import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AdminUser } from '../types';
import netlifyIdentity from 'netlify-identity-widget';
import { ApiService } from '../services/api';

interface AuthContextType {
  user: User | AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  permissions: string[];
  login: () => void;
  register: () => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User | AdminUser>) => Promise<void>;
  checkPermission: (permission: string) => boolean;
  getToken: () => string | null;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminPermissions, setAdminPermissions] = useState<string[]>([]);

  useEffect(() => {
    // Initialize Netlify Identity
    netlifyIdentity.init();

    // Check for existing user
    const currentUser = netlifyIdentity.currentUser();
    if (currentUser) {
      handleUserLogin(currentUser);
    }
    setLoading(false);

    // Listen for auth events
    netlifyIdentity.on('login', (user) => {
      handleUserLogin(user);
      netlifyIdentity.close();
    });

    netlifyIdentity.on('logout', () => {
      setUser(null);
      setAdminPermissions([]);
    });

    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  const handleUserLogin = async (netlifyUser: any) => {
    try {
      // Call our auth callback to sync with database
      const token = netlifyUser.token?.access_token;
      if (token) {
        const response = await ApiService.authCallback(token);
        
        const userData: User | AdminUser = {
          id: response.user.id,
          email: response.user.email,
          first_name: response.user.first_name,
          last_name: response.user.last_name,
          phone: response.user.phone,
          created_at: response.user.created_at,
          email_verified: response.user.email_verified,
          ...(response.isAdmin && {
            role: response.adminRole,
            permissions: response.permissions,
            last_login: response.user.last_login,
          })
        };
        
        setUser(userData);
        if (response.isAdmin) {
          setAdminPermissions(response.permissions);
        }
      }
    } catch (error) {
      console.error('Error syncing user with database:', error);
      // Fallback to basic user data
      const userData: User = {
        id: netlifyUser.id,
        email: netlifyUser.email || '',
        first_name: netlifyUser.user_metadata?.first_name || netlifyUser.user_metadata?.full_name?.split(' ')[0] || '',
        last_name: netlifyUser.user_metadata?.last_name || netlifyUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
        phone: netlifyUser.user_metadata?.phone,
        created_at: netlifyUser.created_at,
        email_verified: netlifyUser.email_verified_at !== null,
      };
      setUser(userData);
    }
  };
  const isAdmin = () => {
    const currentUser = netlifyIdentity.currentUser();
    const role = currentUser?.app_metadata?.role;
    return role && ['admin', 'super_admin', 'event_manager'].includes(role) || adminPermissions.length > 0;
  };

  const login = () => {
    netlifyIdentity.open('login');
  };

  const register = () => {
    netlifyIdentity.open('signup');
  };

  const resetPassword = async (email: string) => {
    try {
      await ApiService.resetPassword(email);
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const logout = async () => {
    netlifyIdentity.logout();
  };

  const updateProfile = async (data: Partial<User | AdminUser>) => {
    const currentUser = netlifyIdentity.currentUser();
    if (currentUser && user) {
      // Update user metadata through Netlify Identity
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
    }
  };

  const checkPermission = (permission: string): boolean => {
    return adminPermissions.includes(permission);
  };

  const getToken = (): string | null => {
    const currentUser = netlifyIdentity.currentUser();
    return currentUser?.token?.access_token || null;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin: isAdmin(),
      permissions: adminPermissions,
      login,
      register,
      logout,
      resetPassword,
      updateProfile,
      checkPermission,
      getToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}