import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';

/**
 * PrivateRoute component that checks if user is authenticated
 * Redirects to /auth if not authenticated
 */
const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data?.user) {
          setAuthenticated(false);
        } else {
          setAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Also subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setAuthenticated(false);
        }
      }
    );

    checkAuth();

    return () => {
      // Cleanup auth listener
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-poppins-medium">Checking authentication...</p>
      </div>
    );
  }

  return authenticated ? <Outlet /> : <Navigate to="/auth" />;
};

export default PrivateRoute; 