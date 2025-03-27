import { createContext, useContext, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Handle authentication state changes
  useEffect(() => {
    // If on a protected route and not authenticated, redirect to login
    const isProtectedRoute = router.pathname.startsWith('/profile') || 
                           router.pathname.startsWith('/problems');
    
    if (status === 'unauthenticated' && isProtectedRoute) {
      router.push(`/login?callbackUrl=${router.pathname}`);
    }
    
    // If on auth pages and authenticated, redirect to problems
    const isAuthPage = router.pathname === '/login' || router.pathname === '/signup';
    if (status === 'authenticated' && isAuthPage) {
      router.push('/problems');
    }
  }, [status, router.pathname]);

  const login = async (email, password) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // On successful login
      if (!result.error) {
        const callbackUrl = router.query.callbackUrl || '/problems';
        router.push(callbackUrl);
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user: session?.user,
    login,
    logout,
    loading: status === 'loading',
    isAuthenticated: status === 'authenticated'
  };

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