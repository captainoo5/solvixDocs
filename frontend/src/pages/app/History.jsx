import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { Eye, Download, Trash2, Search, SlidersHorizontal, ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const History = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [typeFilter, setTypeFilter] = useState(''); // '' means all
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // reset to first page on search
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const typeParam = typeFilter ? `&type=${typeFilter}` : '';
      const searchParam = debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : '';
      
      const response = await API.get(`/documents?page=${page}&limit=10${typeParam}${searchParam}`);
      if (response.data?.success) {
        setDocuments(response.data.data || []);
        setTotalPages(response.data.pages || 1);
        setTotalItems(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load document history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [page, typeFilter, debouncedSearch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document? This will also remove the PDF file permanently.')) {
      return;
    }

    try {
      const response = await API.delete(`/documents/${id}`);
      if (response.data?.success) {
        toast.success('Document deleted successfully');
        // If we deleted the last item on the page, go back a page
        if (documents.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchDocuments();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete document');
    }
  };

  const filterTabs = [
    { label: 'All Documents', value: '' },
    { label: 'Quotations', value: 'quotation' },
    { label: 'Proformas', value: 'proforma' },
    { label: 'Receipts', value: 'receipt' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-[#E0E0E0] p-4 rounded-xl shadow-sm">
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 border-b md:border-b-0 pb-2 md:pb-0 w-full md:w-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                setTypeFilter(tab.value);
                setPage(1);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                typeFilter === tab.value
                  ? 'bg-orange text-white'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-navy'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client or serial no..."
            className="w-full pl-10 pr-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 text-xs font-semibold"
          />
          <Search className="absolute left-3.5 top-2.5 text-slate-400" size={14} />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#E0E0E0] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-slate-400 text-sm font-semibold">No records match your filters.</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Create a new document or modify search keywords.</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase border-b border-[#E0E0E0]">
                    <th className="px-6 py-3.5">Serial No</th>
                    <th className="px-6 py-3.5">Client / Customer</th>
                    <th className="px-6 py-3.5">Doc Type</th>
                    <th className="px-6 py-3.5">Created Date</th>
                    <th className="px-6 py-3.5">Amount (₦)</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E0E0] text-sm font-semibold">
                  {documents.map((doc) => (
                    <tr key={doc._id} className="hover:bg-slate-50/50 text-dark-text">
                      <td className="px-6 py-4 text-navy font-extrabold">{doc.documentNumber}</td>
                      <td className="px-6 py-4">{doc.clientName}</td>
                      <td className="px-6 py-4 text-xs">
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
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(doc.date).toISOString().split('T')[0]}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">
                        ₦{doc.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2.5">
                          <Link
                            to={`/document/${doc._id}`}
                            className="p-1.5 text-navy hover:text-orange transition-colors"
                            title="View / Share"
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
                            onClick={() => handleDelete(doc._id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete Document"
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-slate-50 border-t border-[#E0E0E0] flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">
                  Showing page {page} of {totalPages} ({totalItems} total items)
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

export default History;
