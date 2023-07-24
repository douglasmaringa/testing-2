import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [marketingEmailsOptIn, setMarketingEmailsOptIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
      timezone,
      marketingEmailsOptIn,
    };

    setIsLoading(true);
    setErrorMessage('');

    try {
        const response = await axios.post('https://monitornew.zc.al/api/user/register', userData);
      
      console.log(response)

      if (response.status === 201) {
        // Registration successful
        alert('User registered successfully!');
      } else {
        // Handle registration error
        alert('Registration failed.');
      }
    } catch (error) {
      console.error('Error occurred during registration:', error);
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md px-6 py-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-center">Register</h2>
        {errorMessage && (
          <div className="mb-4 text-red-500">
            <p>{errorMessage}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium">
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 font-medium">
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="timezone" className="block mb-1 font-medium">
              Timezone:
            </label>
            <input
              id="timezone"
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              <input
                type="checkbox"
                checked={marketingEmailsOptIn}
                onChange={(e) => setMarketingEmailsOptIn(e.target.checked)}
                className="mr-2"
              />
              Receive marketing emails
            </label>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Register'}
          </button>
          
        </form>
        <Link
           to={"/login"}
            className=""
          >
            Login if already have account
          </Link>
      </div>
    </div>
  );
}

export default Register;
