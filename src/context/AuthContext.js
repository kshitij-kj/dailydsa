import { createContext, useContext, useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (session?.user) {
      setUser(session.user);
      // If we're on the login page and have a session, redirect to problems
      if (router.pathname === '/login') {
        router.push('/problems');
      }
    } else {
      setUser(null);
      // If we're on a protected route and don't have a session, redirect to login
      const protectedRoutes = ['/profile', '/problems'];
      if (protectedRoutes.includes(router.pathname)) {
        router.push('/login');
      }
    }
    setLoading(false);
  }, [session, status, router.pathname]);

  const login = async (email, password, rememberMe = false) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/problems'
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (!result.error && result.url) {
        router.push(result.url);
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/'
      });
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user && !!session
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 