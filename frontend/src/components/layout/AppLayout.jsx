import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Building2,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  FileSpreadsheet,
  AlertTriangle,
  PlusCircle
} from 'lucide-react';

export const AppLayout = ({ children }) => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If auth is loading, show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange"></div>
      </div>
    );
  }

  // Route guard: Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Business Profile', path: '/profile', icon: Building2 },
    { name: 'Document History', path: '/history', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-navy text-white px-4 py-3 flex items-center justify-between shadow-md z-30">
        <Link to="/dashboard" className="flex items-center gap-1.5">
          <span className="text-xl font-black text-white tracking-tight">
            Solvix<span className="text-orange">Docs</span>
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white hover:text-orange transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar - Desktop & Mobile overlay */}
      <aside
        className={`fixed inset-y-0 left-0 bg-navy text-white w-64 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40 md:relative md:flex md:flex-col shadow-xl flex flex-col justify-between h-screen`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-navy-dark flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl font-black text-white tracking-tight">
                Solvix<span className="text-orange">Docs</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-white hover:text-orange"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-orange text-white'
                      : 'text-slate-300 hover:bg-navy-light/20 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-white' : 'text-slate-400'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-navy-dark bg-navy-dark">
          <div className="mb-4 px-2">
            <p className="text-xs text-slate-400 truncate font-medium">{user.email}</p>
            <div className="mt-1 flex items-center justify-between">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-bold uppercase tracking-wider bg-orange-light text-orange">
                {user.subscriptionPlan || 'Free'} Plan
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Profile Completion Warning Banner */}
        {user && !user.profileCompleted && (
          <div className="bg-[#FFF3E0] border-b border-orange/20 text-orange-dark px-4 py-3 flex items-center justify-between gap-3 text-xs md:text-sm font-semibold shadow-sm z-20 shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-orange animate-bounce" />
              <span>
                Your business profile is incomplete. Fill out your details to enable invoice & receipt sequences, templating, and download features.
              </span>
            </div>
            <Link
              to="/profile"
              className="bg-orange text-white px-3 py-1.5 rounded-lg text-xs hover:bg-orange-dark transition-colors whitespace-nowrap shadow-sm"
            >
              Complete Profile
            </Link>
          </div>
        )}

        {/* Dashboard Top Header - Desktop Only */}
        <header className="hidden md:flex bg-white h-16 border-b border-[#E0E0E0] items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-bold text-navy">
            {location.pathname.startsWith('/profile')
              ? 'Business Profile Setup'
              : location.pathname.startsWith('/history')
              ? 'Document History'
              : location.pathname.startsWith('/settings')
              ? 'Account Settings'
              : location.pathname.startsWith('/create')
              ? 'Create New Document'
              : location.pathname.startsWith('/document')
              ? 'View Document Details'
              : 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 font-medium">Logged in: {user.email}</span>
            <span className="bg-orange/10 text-orange text-xs font-bold uppercase px-2.5 py-1 rounded-full">
              {user.subscriptionPlan}
            </span>
          </div>
        </header>

        {/* Sub-page Content wrapper */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
