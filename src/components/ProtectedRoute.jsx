"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * Component that protects routes from unauthenticated access
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.redirectPath - Path to redirect to if not authenticated
 */
export default function ProtectedRoute({ 
  children, 
  redirectPath = '/login' 
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    let redirectTimeout;
    
    // Only redirect after auth check is complete and we're sure user isn't authenticated
    if (!loading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      const currentPath = window.location.pathname;
      
      // Small delay to prevent redirect loops
      redirectTimeout = setTimeout(() => {
        router.push(`${redirectPath}?redirect=${encodeURIComponent(currentPath)}`);
      }, 100);
    }
    
    return () => {
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [isAuthenticated, loading, redirectPath, router]);
  
  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Only render children if authenticated
  return isAuthenticated ? children : null;
}