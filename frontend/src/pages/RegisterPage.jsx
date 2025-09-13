import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import PasswordInput from '../components/PasswordInput';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { signup } = useAuth();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (password.length < 8 || password.length > 16) {
      newErrors.password = 'Password must be 8-16 characters long.';
    } else {
      const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_])/;
      if (!passwordRegex.test(password)) {
        newErrors.password = 'Password must contain an alphabet, a digit, and a symbol.';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    signup(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="px-8 py-6 text-left bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">Create an account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300" htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-600 dark:border-gray-600'}`}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
              <PasswordInput 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            <div className="flex">
              <button type="submit" className="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                Create Account
              </button>
            </div>
            <div className="mt-6 text-gray-600 dark:text-gray-400">
              Already have an account?
              <Link to="/login" className="text-blue-600 hover:underline ml-2">
                Log in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}