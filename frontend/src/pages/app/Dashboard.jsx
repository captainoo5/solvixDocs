import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import {
  FileText,
  FileSignature,
  Receipt,
  Layers,
  Plus,
  Eye,
  Download,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    quotations: 0,
    proformas: 0,
    receipts: 0,
  });
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats and recent documents concurrently
      const [
        totalRes,
        quotationRes,
        proformaRes,
        receiptRes,
        recentRes,
      ] = await Promise.all([
        API.get('/documents?limit=1'),
        API.get('/documents?type=quotation&limit=1'),
        API.get('/documents?type=proforma&limit=1'),
        API.get('/documents?type=receipt&limit=1'),
        API.get('/documents?limit=5'),
      ]);

      setStats({
        total: totalRes.data?.total || 0,
        quotations: quotationRes.data?.total || 0,
        proformas: proformaRes.data?.total || 0,
        receipts: receiptRes.data?.total || 0,
      });

      setRecentDocs(recentRes.data?.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteDoc = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document? This will remove the PDF copy too.')) {
      return;
    }

    try {
      const response = await API.delete(`/documents/${id}`);
      if (response.data?.success) {
        toast.success('Document deleted');
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const statCards = [
    { title: 'Total Documents', count: stats.total, icon: Layers, color: 'bg-navy text-white' },
    { title: 'Quotations', count: stats.quotations, icon: FileText, color: 'bg-orange/10 text-orange' },
    { title: 'Proformas', count: stats.proformas, icon: FileSignature, color: 'bg-blue-50 text-blue-600' },
    { title: 'Receipts', count: stats.receipts, icon: Receipt, color: 'bg-green-50 text-green-600' },
  ];

  const quickActions = [
    { name: 'Quotation', path: '/create/quotation', desc: 'Price estimate', icon: FileText },
    { name: 'Proforma Invoice', path: '/create/proforma', desc: 'Pre-shipment bill', icon: FileSignature },
    { name: 'Receipt', path: '/create/receipt', desc: 'Payment confirmation', icon: Receipt },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-navy rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-navy-dark">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(244,123,0,0.15),transparent)] pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Welcome back, {user?.businessName || 'Business Owner'}!
          </h2>
          <p className="mt-2 text-sm text-slate-300 max-w-xl font-medium">
            Monitor document sequences, generate professional PDF billing sheets, and review your client transactions easily.
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white border border-[#E0E0E0] rounded-xl p-5 shadow-sm flex items-center justify-between hover:border-orange/20 transition-all duration-150"
            >
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{card.title}</p>
                <p className="mt-2 text-2xl md:text-3xl font-black text-navy">{card.count}</p>
              </div>
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action panels */}
      <div>
        <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4">Quick Document Creators</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                to={action.path}
                className="bg-white border border-[#E0E0E0] p-6 rounded-xl shadow-sm hover:shadow-md hover:border-orange flex items-center gap-4 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange/10 text-orange flex items-center justify-center group-hover:bg-orange group-hover:text-white transition-all duration-200">
                  <Icon size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-navy group-hover:text-orange transition-colors">
                    Create {action.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{action.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Documents Table */}
      <div className="bg-white border border-[#E0E0E0] rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E0E0E0] flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-navy text-sm uppercase tracking-wider">Recent Documents</h3>
          <Link
            to="/history"
            className="text-xs font-bold text-orange hover:text-orange-dark transition-colors flex items-center gap-1"
          >
            View All Documents <span className="text-base">&rarr;</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange"></div>
          </div>
        ) : recentDocs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 text-sm font-medium">No documents created yet.</p>
            <Link
              to="/create/quotation"
              className="mt-4 inline-flex items-center gap-1.5 bg-orange text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-dark transition-colors shadow-sm"
            >
              <Plus size={14} /> Create First Document
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase border-b border-[#E0E0E0]">
                  <th className="px-6 py-3.5">Doc Number</th>
                  <th className="px-6 py-3.5">Client</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0] text-sm">
                {recentDocs.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/50 font-medium text-dark-text">
                    <td className="px-6 py-4 font-bold text-navy">{doc.documentNumber}</td>
                    <td className="px-6 py-4">{doc.clientName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                          doc.documentType === 'quotation'
                            ? 'bg-orange/10 text-orange'
                            : doc.documentType === 'proforma'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-green-50 text-green-600'
                        }`}
                      >
                        {doc.documentType === 'proforma' ? 'Proforma' : doc.documentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(doc.date).toISOString().split('T')[0]}
                    </td>
                    <td className="px-6 py-4 font-bold">₦{doc.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2.5">
                        <Link
                          to={`/document/${doc._id}`}
                          className="p-1.5 text-navy hover:text-orange transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>
                        {doc.pdfUrl && (
                          <a
                            href={doc.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-navy hover:text-green-600 transition-colors"
                            title="Download PDF"
                          >
                            <Download size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => handleDeleteDoc(doc._id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete"
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;
