import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Background from '../assets/bg.png'

const AuthForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  // Function to handle user sign-in
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/gemini/signin', { email, password });
      localStorage.setItem('authToken', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      navigate('/main');
    } catch (err) {
      setError('Error signing in. Please try again.');
    }
  };

  // Function to handle user sign-up
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/gemini/signup', { email, password });
      localStorage.setItem('authToken', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      navigate('/main');
    } catch (err) {
      setError('Error signing up. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="hidden md:block md:w-1/2 lg:w-2/3">
        <img src={Background} alt="Background" className="w-full h-full object-cover" />
      </div>
      <div className="flex justify-center items-center bg-white p-12 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl">
        <div className="w-full">
          <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">{isRegistering ? 'Sign Up' : 'Sign In'}</h2>
          <form onSubmit={isRegistering ? handleSignUp : handleSignIn}>
            <div className="mb-6">
              <label className="block text-gray-700 text-lg">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-lg">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-6">{error}</p>}
            <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-300">
              {isRegistering ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-gray-700 mt-6">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span onClick={() => setIsRegistering(!isRegistering)} className="text-purple-600 cursor-pointer font-semibold">
              {isRegistering ? 'Sign In' : 'Sign Up'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
