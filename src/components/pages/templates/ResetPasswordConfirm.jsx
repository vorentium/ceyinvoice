import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../utils/AuthContext';

const ResetPasswordConfirm = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  // Check if we have access to reset token
  useEffect(() => {
    // Auth is handled by Supabase and AuthContext
    // If user is not in password reset flow, they'll be redirected
  }, []);

  // Countdown timer after successful password reset
  useEffect(() => {
    if (success && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (success && timeLeft === 0) {
      navigate('/auth');
    }
  }, [success, timeLeft, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password
    if (!password) {
      setError('Please enter a new password');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Update the user's password using AuthContext
      const { error: updateError } = await updatePassword(password);
      
      if (updateError) {
        throw updateError;
      }
      
      setSuccess(true);
    } catch (err) {
      console.error('Password update error:', err);
      setError('Failed to update password. Please try again or request a new reset link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen font-poppins">
      {/* Left section - black background with information */}
      <div className="hidden md:flex md:w-1/2 bg-black text-white flex-col justify-between p-10">
        <div className="mt-10 flex justify-center">
          <h1 className="text-5xl font-poppins-bold tracking-wider">CEYINVOICE</h1>
        </div>
        
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-md">
            <h2 className="text-3xl font-poppins-bold mb-6">Set New Password</h2>
            <p className="text-white opacity-80 font-poppins-regular mb-4">
              You're just one step away from securing your account with a new password.
            </p>
            <p className="text-white opacity-80 font-poppins-regular">
              Create a strong, unique password that you don't use for other accounts.
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-10">
          <div className="text-sm text-white">VER 1.1</div>
          <button 
            className="cursor-pointer active:scale-90 transition-all duration-300 bg-white text-black py-2 px-4 rounded-full text-sm font-poppins-medium"
            onClick={() => window.open('/change-log', '_blank')}
          >
            CLICKE HERE TO CHECK CHANGELOG
          </button>
        </div>
      </div>
      
      {/* Right section - white background with form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile-only logo */}
          <div className="md:hidden text-center mb-10">
            <h1 className="text-4xl font-poppins-bold text-black">CEYINVOICE</h1>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-poppins-bold mb-2">
              {success ? 'Password Updated!' : 'Create New Password'}
            </h2>
            <p className="text-gray-600 text-sm font-poppins-regular">
              {success 
                ? `Redirecting to login page in ${timeLeft} seconds...`
                : 'Enter your new password below'}
            </p>
          </div>
          
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md font-poppins-regular text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="password" className="block text-sm font-poppins-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md font-poppins-regular focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your new password"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-poppins-medium mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md font-poppins-regular focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm your new password"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-2/3 py-3 px-4 bg-[var(--color-black-900)] text-white font-poppins-medium rounded-md hover:bg-[var(--color-black-800)] transition-colors active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <p className="text-gray-700 font-poppins-regular">
                Your password has been successfully updated!
              </p>
              
              <p className="text-gray-700 font-poppins-regular">
                You will be redirected to the login page in {timeLeft} seconds.
              </p>
              
              <button
                onClick={() => navigate('/auth')}
                className="text-blue-600 hover:underline font-poppins-medium"
              >
                Login Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm; 