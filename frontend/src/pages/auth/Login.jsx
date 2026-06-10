import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-navy tracking-tight text-center">
        Welcome Back
      </h2>
      <p className="mt-1.5 text-sm text-slate-500 font-medium text-center">
        Log in to your business documents.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="business@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <div className="relative">
          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-slate-400 hover:text-navy transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex items-center justify-end text-xs font-semibold">
          <Link
            to="/forgot-password"
            className="text-orange hover:text-orange-dark transition-colors"
          >
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full mt-6"
          isLoading={loading}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-sm font-semibold">
        <span className="text-slate-400">New to SolvixDocs? </span>
        <Link to="/register" className="text-orange hover:text-orange-dark transition-colors">
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default Login;
