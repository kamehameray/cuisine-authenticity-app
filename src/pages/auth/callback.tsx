import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuthentication from '../../hooks/useAuth';

export default function Callback() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthentication();

  useEffect(() => {
    if (!isLoading) {
      // Once the authentication is complete and not loading, redirect to home
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-4">Logging you in...</h1>
        <div className="w-12 h-12 border-t-4 border-primary-600 border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}