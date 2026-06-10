import React, { useState, useEffect, useRef } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Upload, Check, Eye, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const BusinessProfile = () => {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState({
    businessName: '',
    tagline: '',
    address: '',
    phone: '',
    email: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    selectedTemplate: 'classic',
    logo: { url: '', publicId: '' },
    qrCode: { url: '', publicId: '' },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [qrUploading, setQrUploading] = useState(false);

  const logoInputRef = useRef(null);
  const qrInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const response = await API.get('/business');
      if (response.data?.success && response.data?.data) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load business profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const selectTemplate = (templateName) => {
    setProfile({ ...profile, selectedTemplate: templateName });
  };

  // Upload Logo
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo file size must be less than 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('logo', file);

    setLogoUploading(true);
    try {
      const response = await API.post('/business/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data?.success) {
        setProfile((prev) => ({ ...prev, logo: response.data.data.logo }));
        toast.success('Business logo uploaded successfully');
        refreshUser();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload logo');
    } finally {
      setLogoUploading(false);
    }
  };

  // Upload QR Code
  const handleQrUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('QR code file size must be less than 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('qrCode', file);

    setQrUploading(true);
    try {
      const response = await API.post('/business/qrcode', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data?.success) {
        setProfile((prev) => ({ ...prev, qrCode: response.data.data.qrCode }));
        toast.success('Payment QR Code uploaded successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload QR code');
    } finally {
      setQrUploading(false);
    }
  };

  // Submit Profile Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await API.put('/business', profile);
      if (response.data?.success) {
        setProfile(response.data.data);
        toast.success('Business profile updated successfully!');
        refreshUser(); // Updates layout status banner
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const templates = [
    {
      id: 'classic',
      name: 'Classic Layout',
      desc: 'Double border styling with structured table formatting.',
      styles: 'bg-orange/5 border-orange/30',
      tag: 'Classic',
    },
    {
      id: 'modern',
      name: 'Modern Accent',
      desc: 'Sleek layout with vertical left-side orange strip.',
      styles: 'bg-blue-50/50 border-blue-500/20',
      tag: 'Modern',
    },
    {
      id: 'bold',
      name: 'Corporate Bold',
      desc: 'Navy top banner strip with strong high-contrast dividers.',
      styles: 'bg-navy/5 border-navy/20',
      tag: 'Bold',
    },
    {
      id: 'minimal',
      name: 'Scandinavian Minimalist',
      desc: 'Typographic layout, pure spacing design without colors.',
      styles: 'bg-slate-50 border-slate-300/30',
      tag: 'Minimal',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fadeIn">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns - Detailed inputs */}
        <div className="lg:col-span-2 space-y-6 bg-white border border-[#E0E0E0] p-6 md:p-8 rounded-xl shadow-sm">
          <h3 className="text-base font-bold text-navy uppercase tracking-wider border-b border-[#E0E0E0] pb-3">
            Business Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Business Name"
              name="businessName"
              value={profile.businessName}
              onChange={handleChange}
              placeholder="e.g. SolvixGo Logistics"
              required
            />
            <Input
              label="Tagline / Motto"
              name="tagline"
              value={profile.tagline}
              onChange={handleChange}
              placeholder="e.g. Speed, Safety, and Trust"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="e.g. +234 803 123 4567"
              required
            />
            <Input
              label="Contact Email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="e.g. logistics@solvixgo.com"
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-semibold text-navy mb-1.5 text-left">
              Business Physical Address
            </label>
            <textarea
              name="address"
              rows="3"
              value={profile.address}
              onChange={handleChange}
              placeholder="e.g. Block 4A, Suite 12, Ikeja Shopping Complex, Lagos, Nigeria"
              className="w-full px-4 py-2.5 bg-white border border-[#E0E0E0] rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all duration-200 text-sm"
              required
            />
          </div>

          <h3 className="text-base font-bold text-navy uppercase tracking-wider border-b border-[#E0E0E0] pt-4 pb-3">
            Bank Transfer Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Bank Name"
              name="bankName"
              value={profile.bankName}
              onChange={handleChange}
              placeholder="e.g. Zenith Bank"
            />
            <Input
              label="Account Name"
              name="accountName"
              value={profile.accountName}
              onChange={handleChange}
              placeholder="e.g. SolvixGo Logistics Ltd"
            />
            <Input
              label="Account Number"
              name="accountNumber"
              value={profile.accountNumber}
              onChange={handleChange}
              placeholder="e.g. 1012345678"
            />
          </div>

          <div className="pt-4 border-t border-[#E0E0E0] flex justify-end">
            <Button
              type="submit"
              isLoading={saving}
              className="px-8"
            >
              Save Profile Settings
            </Button>
          </div>
        </div>

        {/* Right Column - Image Uploads & Previews */}
        <div className="space-y-6">
          
          {/* Logo Card */}
          <div className="bg-white border border-[#E0E0E0] p-6 rounded-xl shadow-sm text-center">
            <h4 className="font-bold text-navy text-sm uppercase tracking-wider text-left mb-4">
              Company Logo
            </h4>
            <div className="border border-dashed border-[#E0E0E0] rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 min-h-48 relative">
              {profile.logo && profile.logo.url ? (
                <div className="space-y-4">
                  <img
                    src={profile.logo.url}
                    alt="Business Logo Preview"
                    className="max-h-28 max-w-full object-contain mx-auto rounded shadow-sm bg-white p-2"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current.click()}
                    className="text-xs font-bold text-orange hover:underline block mx-auto"
                  >
                    Replace Logo
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Upload size={20} />
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Upload company logo</p>
                  <p className="text-xxs text-slate-400">JPG, PNG, WEBP (Max 2MB)</p>
                  <button
                    type="button"
                    onClick={() => logoInputRef.current.click()}
                    className="mt-4 bg-orange text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-dark transition-colors"
                  >
                    Select Logo File
                  </button>
                </div>
              )}

              {logoUploading && (
                <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange"></div>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={logoInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* QR Code Card */}
          <div className="bg-white border border-[#E0E0E0] p-6 rounded-xl shadow-sm text-center">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-navy text-sm uppercase tracking-wider">
                Payment QR Code
              </h4>
              <span className="text-xxs bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full uppercase">
                Optional
              </span>
            </div>
            <div className="border border-dashed border-[#E0E0E0] rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 min-h-48 relative">
              {profile.qrCode && profile.qrCode.url ? (
                <div className="space-y-4">
                  <img
                    src={profile.qrCode.url}
                    alt="Payment QR Code Preview"
                    className="h-28 w-28 object-contain mx-auto rounded border bg-white p-2 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => qrInputRef.current.click()}
                    className="text-xs font-bold text-orange hover:underline block mx-auto"
                  >
                    Replace QR Code
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Upload size={20} />
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Upload banking QR code</p>
                  <p className="text-xxs text-slate-400">Scan-to-pay graphic (Max 2MB)</p>
                  <button
                    type="button"
                    onClick={() => qrInputRef.current.click()}
                    className="mt-4 bg-orange text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-dark transition-colors"
                  >
                    Select QR File
                  </button>
                </div>
              )}

              {qrUploading && (
                <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange"></div>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={qrInputRef}
              onChange={handleQrUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </form>

      {/* Premium Template Selector Deck */}
      <div className="bg-white border border-[#E0E0E0] p-6 md:p-8 rounded-xl shadow-sm">
        <h3 className="text-base font-bold text-navy uppercase tracking-wider border-b border-[#E0E0E0] pb-3 mb-6">
          PDF Template Stylesheet Selector
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((temp) => {
            const isSelected = profile.selectedTemplate === temp.id;
            return (
              <button
                type="button"
                key={temp.id}
                onClick={() => selectTemplate(temp.id)}
                className={`text-left border rounded-xl p-5 flex flex-col justify-between h-48 transition-all duration-200 relative ${
                  isSelected
                    ? 'border-orange ring-2 ring-orange/10 bg-orange/5 shadow-sm'
                    : 'border-[#E0E0E0] hover:border-orange/30 bg-slate-50/20'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 bg-orange text-white rounded-full p-0.5">
                    <Check size={14} />
                  </span>
                )}
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider mb-3 bg-white border shadow-sm text-navy`}>
                    {temp.tag}
                  </span>
                  <h4 className="font-bold text-navy text-sm">{temp.name}</h4>
                  <p className="text-xxs text-slate-500 mt-2 font-medium leading-relaxed">
                    {temp.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
