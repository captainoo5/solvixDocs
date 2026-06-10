import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ShieldCheck, Users, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';

export const AdminLayout = ({ children }) => {
  const { admin, adminLogout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Guard: Redirect if not logged in as Admin
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users Management', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Admin Header */}
      <header className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-md z-30">
        <Link to="/admin/dashboard" className="flex items-center gap-1.5">
          <ShieldCheck className="text-orange" size={22} />
          <span className="text-lg font-black text-white tracking-tight">
            Solvix<span className="text-orange">Admin</span>
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white hover:text-orange transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-slate-900 text-white w-64 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40 md:relative md:flex md:flex-col shadow-xl flex flex-col justify-between h-screen`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <ShieldCheck className="text-orange" size={24} />
              <span className="text-xl font-black text-white tracking-tight">
                Solvix<span className="text-orange">Admin</span>
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
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-orange text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-white' : 'text-slate-400'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="mb-4 px-2">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">SYSTEM PANEL</p>
            <p className="mt-1 text-sm text-slate-300 truncate font-semibold">{admin.name}</p>
            <span className="text-xs text-slate-500 font-medium">Role: {admin.role}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            Logout Panel
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="hidden md:flex bg-white h-16 border-b border-[#E0E0E0] items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-bold text-slate-800">
            System Administration Workspace
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 font-medium">Admin: {admin.email}</span>
            <span className="bg-red-100 text-red-700 text-xs font-bold uppercase px-2.5 py-1 rounded-full">
              System Admin
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
