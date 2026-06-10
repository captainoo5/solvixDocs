import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Search, ShieldAlert, ShieldAlert as ShieldIcon, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [planFilter, setPlanFilter] = useState(''); // '' means all
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUsers = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const planParam = planFilter ? `&plan=${planFilter}` : '';
      const searchParam = debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : '';
      
      const response = await API.get(`/admin/users?page=${page}&limit=10${planParam}${searchParam}`);
      if (response.data?.success) {
        setUsers(response.data.data || []);
        setTotalPages(response.data.pages || 1);
        setTotalItems(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      if (!silent) toast.error('Failed to load user list.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, planFilter, debouncedSearch]);

  // Real-time polling every 30s as specified
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers(true); // Silent refresh
    }, 30000);
    return () => clearInterval(interval);
  }, [page, planFilter, debouncedSearch]);

  const handleTogglePlan = async (id, currentPlan) => {
    const newPlan = currentPlan === 'free' ? 'pro' : 'free';
    const actionLabel = newPlan === 'pro' ? 'GRANT PRO Tier access' : 'REVOKE PRO Tier access';
    
    if (!window.confirm(`Are you sure you want to ${actionLabel} for this user?`)) {
      return;
    }

    try {
      const response = await API.patch(`/admin/users/${id}/plan`, { plan: newPlan });
      if (response.data?.success) {
        toast.success(`Plan updated to ${newPlan.toUpperCase()}`);
        fetchUsers(true);
      }
    } catch (error) {
      toast.error('Failed to update subscription plan');
    }
  };

  const handleDeleteUser = async (id, email) => {
    const doubleCheck = window.confirm(
      `CRITICAL DELETION: Are you sure you want to delete the user "${email}"?\n\nThis will permanently delete their account, their business details, and clean up all their generated PDF files from Cloudinary!`
    );
    if (!doubleCheck) return;

    try {
      const response = await API.delete(`/admin/users/${id}`);
      if (response.data?.success) {
        toast.success('User and all associated details deleted');
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">System Users Registry</h2>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Manage SME client directories</p>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-[#E0E0E0] p-4 rounded-xl shadow-sm">
        
        {/* Plan Filters */}
        <div className="flex gap-1.5">
          {[
            { label: 'All Users', value: '' },
            { label: 'Free Tier', value: 'free' },
            { label: 'Pro Tier', value: 'pro' },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                setPlanFilter(tab.value);
                setPage(1);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                planFilter === tab.value
                  ? 'bg-orange text-white'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by email..."
            className="w-full pl-10 pr-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 text-xs font-semibold"
          />
          <Search className="absolute left-3.5 top-2.5 text-slate-400" size={14} />
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white border border-[#E0E0E0] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-16 text-center text-slate-400 font-semibold text-sm">
            No registered users match your query.
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase border-b border-[#E0E0E0]">
                    <th className="px-6 py-3.5">Business Name</th>
                    <th className="px-6 py-3.5">Email Address</th>
                    <th className="px-6 py-3.5">Sub Plan</th>
                    <th className="px-6 py-3.5 text-center">Docs Created</th>
                    <th className="px-6 py-3.5">Joined Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E0E0] text-sm font-semibold">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50 text-slate-700">
                      <td className="px-6 py-4 font-bold text-navy">{u.businessName}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                            u.subscriptionPlan === 'pro'
                              ? 'bg-orange/10 text-orange'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {u.subscriptionPlan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold">{u.docCount}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(u.createdAt).toISOString().split('T')[0]}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleTogglePlan(u._id, u.subscriptionPlan)}
                            className={`px-3 py-1 rounded text-xxs font-bold uppercase tracking-wider transition-colors ${
                              u.subscriptionPlan === 'free'
                                ? 'bg-orange text-white hover:bg-orange-dark'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-900'
                            }`}
                          >
                            {u.subscriptionPlan === 'free' ? 'Grant Pro' : 'Revoke Pro'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id, u.email)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete User Data"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-slate-50 border-t border-[#E0E0E0] flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">
                  Showing page {page} of {totalPages} ({totalItems} total users)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 border border-[#E0E0E0] bg-white rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeft size={14} className="text-slate-600" />
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-[#E0E0E0] bg-white rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowRight size={14} className="text-slate-600" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
