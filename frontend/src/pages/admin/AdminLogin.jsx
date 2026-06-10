import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminLogin = () => {
  const { admin, adminLogin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // If already logged in as admin, redirect to admin dashboard
  if (admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Admin email is required';
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
    const result = await adminLogin(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      toast.success('Admin authorized successfully!');
      navigate('/admin/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <ShieldCheck className="mx-auto text-orange h-12 w-12" />
        <h2 className="mt-4 text-3xl font-black text-white tracking-tight">
          Solvix<span className="text-orange">Admin</span>
        </h2>
        <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          Systems Operations Dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-slate-700 shadow-xl rounded-xl sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Admin Email Address"
              name="email"
              type="email"
              placeholder="admin@solvixinnovations.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              label="Security Access Key"
              name="password"
              type="password"
              placeholder="Enter security key"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Button
              type="submit"
              variant="secondary"
              className="w-full mt-6 bg-slate-900 hover:bg-slate-850"
              isLoading={loading}
            >
              Authenticate Admin
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
