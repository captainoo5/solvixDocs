import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ShieldAlert, Key, User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (passwords.newPassword !== passwords.confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      if (response.data?.success) {
        toast.success('Password updated successfully!');
        setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const doubleCheck = window.confirm(
      'CRITICAL WARNING: Are you absolutely sure you want to delete your account? This action is IRREVERSIBLE and will permanently delete your business details, logos, generated PDFs, and all historical documents.'
    );
    if (!doubleCheck) return;

    const finalCode = window.prompt(
      'Type "DELETE" below to authorize account deletion.'
    );
    if (finalCode !== 'DELETE') {
      toast.error('Deletion cancelled. Authorization code did not match.');
      return;
    }

    setDeleting(true);
    try {
      const response = await API.delete('/auth/delete-account');
      if (response.data?.success) {
        toast.success('Your account has been deleted.');
        logout();
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fadeIn">
      
      {/* Account Info Card */}
      <div className="bg-white border border-[#E0E0E0] p-6 md:p-8 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-[#E0E0E0] pb-4 md:pb-0 md:pr-6">
          <div className="w-12 h-12 rounded-xl bg-orange/10 text-orange flex items-center justify-center mb-3">
            <User size={22} />
          </div>
          <h3 className="font-bold text-navy text-sm uppercase tracking-wider">Account Profile</h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">Your account identifiers.</p>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div>
            <span className="block text-xxs text-slate-400 font-bold uppercase tracking-wider">Registered Email</span>
            <span className="font-bold text-navy text-sm mt-1 block">{user?.email}</span>
          </div>
          <div>
            <span className="block text-xxs text-slate-400 font-bold uppercase tracking-wider">Subscription Tier</span>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                user?.subscriptionPlan === 'pro'
                  ? 'bg-orange/10 text-orange'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}>
                {user?.subscriptionPlan || 'Free'} Plan
              </span>
              {user?.subscriptionPlan === 'free' && (
                <span className="text-xxs text-slate-400 font-semibold">
                  (Pro upgrades are managed by administrators)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white border border-[#E0E0E0] p-6 md:p-8 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-[#E0E0E0] pb-4 md:pb-0 md:pr-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Key size={22} />
          </div>
          <h3 className="font-bold text-navy text-sm uppercase tracking-wider">Security Settings</h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">Update your account credentials.</p>
        </div>
        <form onSubmit={handleUpdatePassword} className="md:col-span-2 space-y-4">
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            placeholder="Enter current password"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            required
          />
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="Minimum 6 characters"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            required
          />
          <Input
            label="Confirm New Password"
            name="confirmNewPassword"
            type="password"
            placeholder="Re-enter new password"
            value={passwords.confirmNewPassword}
            onChange={handlePasswordChange}
            required
          />
          <div className="pt-2 flex justify-end">
            <Button type="submit" isLoading={loading}>
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border border-red-200 p-6 md:p-8 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 bg-red-50/10">
        <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-red-100 pb-4 md:pb-0 md:pr-6">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
            <ShieldAlert size={22} />
          </div>
          <h3 className="font-bold text-red-600 text-sm uppercase tracking-wider">Danger Zone</h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">Irreversible system commands.</p>
        </div>
        <div className="md:col-span-2 flex flex-col justify-between items-start">
          <p className="text-slate-500 font-semibold text-xs leading-relaxed mb-6">
            Deleting your account will immediately remove all your business profiles, branding logotypes, payment codes, and delete every PDF document currently saved on Cloudinary. This action cannot be undone.
          </p>
          <Button
            variant="danger"
            isLoading={deleting}
            onClick={handleDeleteAccount}
          >
            Permanently Delete Account
          </Button>
        </div>
      </div>

    </div>
  );
};

export default Settings;
