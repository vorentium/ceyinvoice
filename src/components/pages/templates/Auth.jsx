import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../../utils/supabaseClient';

const Auth = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true); // Default to login view
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    // Check if the user is already logged in
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (data?.user && !error) {
                    // User is already logged in, redirect to dashboard
                    navigate('/dashboard');
                }
            } catch (err) {
                console.error('Error checking auth status:', err);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, [navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        if (errors[id]) {
            setErrors(prev => ({
                ...prev,
                [id]: null
            }));
        }
        // Clear success message when user types
        if (success) {
            setSuccess('');
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!isLogin && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }
        if (!isLogin && !formData.displayName.trim()) {
            newErrors.displayName = 'Display name is required';
        }
        return newErrors;
    };
    
    // Helper function to check if an error is about email already registered
    const isEmailAlreadyRegisteredError = (errorMessage) => {
        if (!errorMessage) return false;
        
        const lowerErrorMsg = errorMessage.toLowerCase();
        return (
            lowerErrorMsg.includes('already registered') || 
            lowerErrorMsg.includes('already exists') || 
            lowerErrorMsg.includes('email exists') ||
            lowerErrorMsg.includes('user already registered') ||
            lowerErrorMsg.includes('duplicate key')
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});
        setSuccess('');
        
        try {
            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });

                if (error) {
                    setErrors({ submit: error.message });
                } else {
                    // Redirect to dashboard after successful login
                    navigate('/dashboard');
                }
            } else {
                // Check if user exists in profiles table first
                const { data: existingProfiles, error: profilesError } = await supabase
                    .from('profiles')
                    .select('email')
                    .eq('email', formData.email);
                
                if (existingProfiles && existingProfiles.length > 0) {
                    setErrors({ submit: 'This email is already registered. Please use a different email or log in instead.' });
                    setIsSubmitting(false);
                    return;
                }
                
                // Try the signup process with Supabase Auth
                const { data, error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            email: formData.email,
                            display_name: formData.displayName
                        }
                    }
                });

                if (error) {
                    // Handle different error types
                    if (isEmailAlreadyRegisteredError(error.message)) {
                        setErrors({ submit: 'This email is already registered. Please use a different email or log in instead.' });
                    } else {
                        setErrors({ submit: error.message });
                    }
                } else if (data?.user) {
                    // Try to add to profiles table but continue even if it fails
                    try {
                        const { error: profileError } = await supabase
                            .from('profiles')
                            .insert([
                                {
                                    id: data.user.id,
                                    email: formData.email,
                                    full_name: formData.displayName,
                                    created_at: new Date().toISOString(),
                                }
                            ]);
                        
                        if (profileError) {
                            console.log('Profile creation error:', profileError);
                            // Show a warning but continue with success flow
                            if (isEmailAlreadyRegisteredError(profileError.message)) {
                                console.warn('Email already exists in profiles table');
                            }
                        }
                    } catch (profileError) {
                        console.log('Profile creation exception:', profileError);
                    }
                    
                    // Show success message regardless of profile creation result
                    setSuccess('Account created successfully! You can now log in.');
                    setFormData({
                        email: '',
                        password: '',
                        displayName: ''
                    });
                    setIsLogin(true);
                }
            }
        } catch (error) {
            console.error('Auth error:', error.message);
            // Check if the error is about existing user
            if (isEmailAlreadyRegisteredError(error.message)) {
                setErrors({ submit: 'This email is already registered. Please use a different email or log in instead.' });
            } else {
                setErrors({ submit: 'An unexpected error occurred. Please try again.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Auth state change listener
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                navigate('/dashboard');
            } else if (event === 'SIGNED_OUT') {
                // Make sure we're in the login view when logged out
                setIsLogin(true);
            }
        });
        
        return () => {
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
    }, [navigate]);
    
    if (loading) {
        return (
            <div className="font-poppins h-full flex flex-col justify-center items-center p-8">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }
  
    return (
        <div className="font-poppins h-full flex flex-col justify-center p-8">
            <div className="max-w-md mx-auto w-full">
                <h1 className="text-2xl font-poppins-bold text-center mb-2">
                    {isLogin ? 'LOGIN' : 'CREATE USER'}
                </h1>
                <p className="text-center text-gray-600 text-sm mb-8 font-poppins-regular">
                    Invoice management made simple
                </p>

                {errors.submit && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-poppins-regular">
                        {errors.submit}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 font-poppins-regular">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label htmlFor="displayName" className="block text-sm font-poppins-medium mb-1">Display Name</label>
                            <input
                                type="text"
                                id="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border ${errors.displayName ? 'border-red-500' : 'border-gray-300'} rounded-md font-poppins-regular`}
                            />
                            {errors.displayName && <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-poppins-medium mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md font-poppins-regular`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-poppins-medium mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md font-poppins-regular`}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {isLogin && (
                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-sm text-neutral-900 hover:underline font-poppins-medium">
                                Forgot Password?
                            </Link>
                        </div>
                    )}

                    <div className="pt-4 flex justify-center">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-neutral-900 text-white py-2 rounded-md hover:bg-neutral-800 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600 font-poppins-regular">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setErrors({});
                                setSuccess('');
                            }}
                            className="ml-1 text-[--color-black-900] hover:underline font-poppins-medium"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
