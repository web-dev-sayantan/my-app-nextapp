'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiLock, FiArrowLeft, FiLoader, FiCheck, FiX } from 'react-icons/fi';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
    } else {
      setIsValidToken(true);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    // Validate password strength
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        // Redirect to login after success
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  // Loading state while checking token
  if (isValidToken === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="flex items-center text-gray-400">
          <FiLoader className="animate-spin mr-2" />
          Loading...
        </div>
      </div>
    );
  }

  // No token provided
  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <FiX className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Invalid Reset Link</h1>
            <p className="text-gray-400 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex items-center justify-center py-3 px-6 border border-transparent rounded-lg shadow-xs text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-gray-400">
              Enter your new password below
            </p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-900/30 border border-green-800 text-green-400'
                  : 'bg-red-900/30 border border-red-800 text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              {/* Password match indicator */}
              {confirmPassword && (
                <div className="mt-1 flex items-center text-xs">
                  {newPassword === confirmPassword ? (
                    <span className="text-green-400 flex items-center">
                      <FiCheck className="mr-1" /> Passwords match
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center">
                      <FiX className="mr-1" /> Passwords do not match
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || newPassword !== confirmPassword}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-xs text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-gray-400 hover:text-white"
            >
              <FiArrowLeft className="mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="flex items-center text-gray-400">
          <FiLoader className="animate-spin mr-2" />
          Loading...
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
