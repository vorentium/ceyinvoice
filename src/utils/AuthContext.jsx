import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session) {
        setUser(session.user);
      }
      
      setLoading(false);
    };
    
    getSession();
    
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'PASSWORD_RECOVERY') {
          // Handle password recovery event
          // This could redirect to reset password page
        } else if (event === 'USER_UPDATED') {
          // Refresh user data when updated
          setUser(session.user);
        }
      }
    );
    
    // Cleanup subscription
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);
  
  // Auth methods
  const signIn = async (email, password) => {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  };
  
  const signUp = async (email, password) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          email: email,
        }
      }
    });
  };
  
  const signOut = async () => {
    return supabase.auth.signOut();
  };
  
  const resetPassword = async (email) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password-confirm',
    });
  };
  
  const updatePassword = async (password) => {
    return supabase.auth.updateUser({
      password: password
    });
  };
  
  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 