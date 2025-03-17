import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/layout/Layout';

// Create a react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function MyApp({ Component, pageProps, router }: AppProps) {
  const authRedirectUri = typeof window !== 'undefined' 
    ? `${window.location.origin}/auth/callback`
    : 'http://localhost:3000/auth/callback';

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ''}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ''}
      authorizationParams={{
        redirect_uri: authRedirectUri,
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        scope: 'openid profile email',
      }}
    >
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </QueryClientProvider>
      </AuthProvider>
    </Auth0Provider>
  );
}

export default MyApp;