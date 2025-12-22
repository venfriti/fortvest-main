'use client'; // <--- This is required for interactivity in Next.js

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For redirecting

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Send data to your Backend
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // 2. Save the Token (Cookie or LocalStorage)
      localStorage.setItem('token', data.token);

      // 3. Redirect to Dashboard
      router.push('/dashboard');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-[#FFF5F2] relative flex-col justify-between p-8">
        <div className="absolute top-8 left-8">
          <Image src="/fortvest-logo.png" alt="Logo" width={150} height={40} priority />
        </div>
        <div className="flex-grow flex items-center justify-center">
            <Image src="/fortvest-logo.png" alt="Auth" width={500} height={600} className="object-contain" priority />
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Sign in</h2>
            <p className="mt-2 text-sm text-gray-600">Enter your login details below</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Error Message Display */}
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-gray-50 border border-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#F24E1E] focus:border-[#F24E1E] sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-gray-50 border border-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#F24E1E] focus:border-[#F24E1E] sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#F24E1E] hover:bg-[#D23C12] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F24E1E] disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}