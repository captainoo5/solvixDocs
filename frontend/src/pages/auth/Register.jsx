import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const result = await register(formData.businessName, formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      toast.success('Registration successful! Setup your profile.');
      navigate('/profile');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-navy tracking-tight text-center">
        Create Your Account
      </h2>
      <p className="mt-1.5 text-sm text-slate-500 font-medium text-center">
        Start creating professional documents.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Business Name"
          name="businessName"
          placeholder="e.g. SolvixGo Logistics"
          value={formData.businessName}
          onChange={handleChange}
          error={errors.businessName}
          required
        />

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

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Minimum 6 characters"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        <Button
          type="submit"
          className="w-full mt-6"
          isLoading={loading}
        >
          Register Business
        </Button>
      </form>

      <div className="mt-6 text-center text-sm font-semibold">
        <span className="text-slate-400">Already have an account? </span>
        <Link to="/login" className="text-orange hover:text-orange-dark transition-colors">
          Login here
        </Link>
      </div>
    </div>
  );
};

export default Register;
