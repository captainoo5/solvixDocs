import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await API.post('/auth/forgot-password', { email });
      if (response.data?.success) {
        setSubmitted(true);
        toast.success('Reset email sent successfully!');
      } else {
        toast.error(response.data?.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send password reset request.');
      toast.error('Failed to request reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-navy tracking-tight text-center">
        Reset Password
      </h2>
      <p className="mt-1.5 text-sm text-slate-500 font-medium text-center">
        We will send you a link to recover your access.
      </p>

      {submitted ? (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-sm font-semibold text-green-800">
            Check your email inbox.
          </p>
          <p className="mt-1 text-xs text-green-600 font-medium">
            We have sent a secure password reset link to <span className="font-bold">{email}</span>.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block text-xs font-bold text-orange hover:text-orange-dark transition-colors"
          >
            Back to Login
          </Link>
        </div>
      ) : (
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            placeholder="business@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            error={error}
            required
          />

          <Button
            type="submit"
            className="w-full mt-6"
            isLoading={loading}
          >
            Send Reset Link
          </Button>
        </form>
      )}

      {!submitted && (
        <div className="mt-6 text-center text-sm font-semibold">
          <Link to="/login" className="text-orange hover:text-orange-dark transition-colors">
            Back to login
          </Link>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
