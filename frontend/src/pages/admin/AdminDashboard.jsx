import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { Users, UserMinus, ShieldAlert, Layers, CalendarRange } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    freeUsers: 0,
    proUsers: 0,
    totalDocs: 0,
    docsGeneratedToday: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await API.get('/admin/stats');
      if (response.data?.success && response.data?.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Failed to load system dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const metricCards = [
    { title: 'Total Registered Users', val: stats.totalUsers, icon: Users, color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Free Tier Accounts', val: stats.freeUsers, icon: UserMinus, iconColor: 'text-slate-400', color: 'bg-slate-100 text-slate-700' },
    { title: 'Pro Tier Accounts', val: stats.proUsers, icon: ShieldAlert, color: 'bg-orange/10 text-orange' },
    { title: 'System Documents Generated', val: stats.totalDocs, icon: Layers, color: 'bg-blue-50 text-blue-600' },
    { title: 'PDF Compile Queries Today', val: stats.docsGeneratedToday, icon: CalendarRange, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">System Performance & Stats</h2>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">SolvixDocs Global Metrics</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metricCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white border border-[#E0E0E0] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{card.title}</p>
                  <p className="text-3xl font-black text-slate-900 mt-2">{card.val}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Quick Links */}
      <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,123,0,0.15),transparent)] pointer-events-none"></div>
        <div className="relative z-10 md:flex justify-between items-center gap-6">
          <div className="max-w-xl">
            <h3 className="text-lg font-bold">Manage Customer Accounts</h3>
            <p className="text-slate-400 text-xs mt-1 leading-normal font-medium">
              Grant or revoke Pro subscription tier upgrades, view aggregated document counts per user, and delete user database entries directly.
            </p>
          </div>
          <Link
            to="/admin/users"
            className="mt-4 md:mt-0 inline-block bg-orange hover:bg-orange-dark text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all duration-150 whitespace-nowrap shadow"
          >
            Open Users Registry &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
