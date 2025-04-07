import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginTemplate() {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-16">
      <div className="w-full max-w-sm shadow-md p-6 rounded-lg border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-jersey font-bold text-var-primary mb-2">CEYINVOICE</h1>
          <p className="text-gray-600 text-base">Login in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="emailOrUsername" className="block text-gray-700 text-sm font-medium mb-1">
              Email or Username
            </label>
            <input
              type="text"
              id="emailOrUsername"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-var-primary rounded-md focus:outline-none focus:ring-1 focus:ring-var-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-var-primary rounded-md focus:outline-none focus:ring-1 focus:ring-var-primary"
              required
            />
          </div>

          <div className="flex items-center justify-center mt-6">
            <p className="text-gray-600 text-sm text-center">
              Not registered ? <Link to="/signup" className="text-var-primary hover:underline">Create account now</Link>
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-var-primary text-white py-2 px-4 rounded-md text-base font-medium hover:bg-var-primary-90 transition-colors duration-300"
            >
              Login Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginTemplate; 