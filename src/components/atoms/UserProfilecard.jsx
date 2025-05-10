import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const UserProfilecard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async (userId) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Get profile data from the profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, currency')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Error fetching profile:', error);
        
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          const authUser = await supabase.auth.getUser();
          if (authUser?.data?.user) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: userId,
                  email: authUser.data.user.email,
                  created_at: new Date().toISOString(),
                  // Initialize full_name with display_name from auth if available
                  full_name: authUser.data.user.user_metadata?.display_name || null,
                  currency: 'USD' // Default currency
                }
              ]);
              
            if (insertError) console.error('Error creating profile:', insertError);
          }
        }
      }

      // Get the latest auth user data
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        // Get display name from profile first, or from metadata, but keep it null if none is available
        let displayName = null;
        
        if (profile?.full_name && profile.full_name.trim() !== '') {
          displayName = profile.full_name;
        } else if (authUser.user_metadata?.display_name && authUser.user_metadata.display_name.trim() !== '') {
          displayName = authUser.user_metadata.display_name;
        }
        
        // Remove any localStorage fullName to prevent it from being used
        localStorage.removeItem('userFullName');
        
        setUser({
          ...authUser,
          full_name: displayName,
          currency: profile?.currency || 'USD'
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get initial auth state
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        fetchUserProfile(user.id);
      } else {
        setLoading(false);
      }
    };
    
    checkUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Clean up subscription on unmount
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const navigateToSettings = () => {
    navigate('/settings');
  };

  const handleProfileUpdate = (updatedData) => {
    // Update the user state with the new profile data
    setUser(prev => ({
      ...prev,
      ...updatedData
    }));
    
    // After a profile update, refresh the user data to ensure everything is in sync
    if (user?.id) {
      setTimeout(() => {
        fetchUserProfile(user.id);
      }, 500); // Small delay to allow time for database updates
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-200 rounded-full px-3 py-2 flex items-center justify-between animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </div>
        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
      </div>
    );
  }

  // Show placeholder if no user
  if (!user) {
    return (
      <div className="bg-gray-200 rounded-full px-3 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span>U</span>
          </div>
          <span className="text-sm font-medium">Not logged in</span>
        </div>
      </div>
    );
  }

  // Get initial letter for avatar
  const getInitial = () => {
    if (user?.full_name && user.full_name.trim() !== '') {
      return user.full_name.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <>
      <div className="bg-gray-200 rounded-full px-3 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden"
          >
            <span>{getInitial()}</span>
          </div>
          <div className="flex flex-col">
            {user?.full_name ? (
              <span className="text-sm font-semibold leading-tight">
                {user.full_name}
              </span>
            ) : null}
            <span className="text-xs text-gray-600 truncate max-w-[120px]">
              {user?.email || 'user email'}
            </span>
          </div>
        </div>
        <button
          onClick={navigateToSettings}
          className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-300"
          title="Settings"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      </div>
    </>
  );
};

export default UserProfilecard;
