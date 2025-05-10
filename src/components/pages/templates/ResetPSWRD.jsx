import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../utils/AuthContext';

const ResetPSWRD = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Use AuthContext to reset password
      const { error: resetError } = await resetPassword(email);
      
      if (resetError) {
        throw resetError;
      }
      
      setEmailSent(true);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to send reset link. Please try again.');
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
            <h2 className="text-3xl font-poppins-bold mb-6">Reset Your Password</h2>
            <p className="text-white opacity-80 font-poppins-regular mb-4">
              We understand that forgetting passwords happens to the best of us. Don't worry, we've got you covered!
            </p>
            <p className="text-white opacity-80 font-poppins-regular">
              Enter your email address in the form, and we'll send you a link to reset your password securely.
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
              {emailSent ? 'Check Your Email' : 'Reset Password'}
            </h2>
            <p className="text-gray-600 text-sm font-poppins-regular">
              {emailSent 
                ? 'We sent you an email with instructions to reset your password'
                : 'Enter your email to receive password reset instructions'}
            </p>
          </div>
          
          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md font-poppins-regular text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-poppins-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md font-poppins-regular focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email address"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-2/3 py-3 px-4 bg-[var(--color-black-900)] text-white font-poppins-medium rounded-md hover:bg-[var(--color-black-800)] transition-colors active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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
                If we find an account associated with that email, you'll receive instructions to reset your password shortly.
              </p>
              
              <p className="text-gray-700 font-poppins-regular">
                Make sure to check your spam folder if you don't see the email in your inbox.
              </p>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <p className="text-sm font-poppins-regular">
              Remember your password?{' '}
              <Link 
                to="/auth" 
                className="text-blue-600 hover:underline font-poppins-medium"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPSWRD;
