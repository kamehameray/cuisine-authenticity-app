import { useAuth } from '../context/AuthContext';

export default function useAuthentication() {
  const auth = useAuth();
  
  return {
    // User state
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user: auth.user,
    
    // Auth methods
    login: auth.login,
    logout: auth.logout,
    getAccessToken: auth.getAccessToken,
    
    // Utility methods
    getUserName: () => auth.user?.name || 'Guest',
    getUserEmail: () => auth.user?.email,
    getUserAvatar: () => auth.user?.picture,
    
    // Checking if user can perform certain actions
    canContribute: () => auth.isAuthenticated,
  };
}