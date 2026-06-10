import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { generateDocNumber } from '../../utils/docNumber';
import { amountToWords } from '../../utils/amountToWords';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Plus, Trash2, FileText, ChevronLeft, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const DocumentForm = ({ type, title }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([
    { description: '', quantity: 1, unitPrice: 0, amount: 0 },
  ]);
  const [documentNumber, setDocumentNumber] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await API.get('/business');
        if (response.data?.success && response.data?.data) {
          const prof = response.data.data;
          setProfile(prof);

          // Calculate next document number
          const currentSeq = prof.docSequence?.[type] || 0;
          const nextSeq = currentSeq + 1;
          const docNum = generateDocNumber(prof.businessName, type, nextSeq);
          setDocumentNumber(docNum);
        }
      } catch (error) {
        console.error('Error loading business profile:', error);
        toast.error('Could not load business profile sequences.');
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [type]);

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) {
      toast.error('Document must contain at least one item');
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    
    if (field === 'description') {
      updated[index][field] = value;
    } else {
      const numValue = Number(value) || 0;
      updated[index][field] = numValue;
      if (field === 'quantity' || field === 'unitPrice') {
        updated[index].amount = updated[index].quantity * updated[index].unitPrice;
      }
    }
    setItems(updated);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const totalInWords = amountToWords(totalAmount);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientName.trim()) {
      toast.error('Client name is required');
      return;
    }

    const emptyDesc = items.some((item) => !item.description.trim());
    if (emptyDesc) {
      toast.error('Please enter a description for all items');
      return;
    }

    const zeroPrice = items.some((item) => item.unitPrice <= 0);
    if (zeroPrice) {
      toast.error('Unit price must be greater than zero');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create the document on the backend
      const response = await API.post(`/documents/${type}`, {
        clientName,
        date,
        items,
      });

      if (response.data?.success && response.data?.data) {
        const createdDoc = response.data.data;
        toast.success(`${title} created successfully!`);
        
        // 2. Trigger Puppeteer PDF generation immediately
        setPdfGenerating(true);
        toast.loading('Rendering PDF document template...');
        
        const pdfResponse = await API.post(`/documents/${createdDoc._id}/pdf`);
        toast.dismiss(); // dismiss loading toast
        
        if (pdfResponse.data?.success) {
          toast.success('PDF generated and secured on Cloudinary!');
        } else {
          toast.error('PDF generated but saving failed.');
        }

        // Redirect to View Document Details page
        navigate(`/document/${createdDoc._id}`);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Error processing document');
    } finally {
      setSubmitting(false);
      setPdfGenerating(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange"></div>
      </div>
    );
  }

  // If business profile doesn't exist or doesn't have an address/phone, show completeness error
  const isProfileComplete = profile && profile.address && profile.phone;
  if (!isProfileComplete) {
    return (
      <div className="bg-white border border-[#E0E0E0] rounded-xl p-8 text-center max-w-xl mx-auto shadow-sm animate-fadeIn">
        <h3 className="text-xl font-bold text-navy mb-4">Complete Business Profile First</h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
          To generate professional serial documents, we need your office address, contact numbers, logo, and banking details.
        </p>
        <Button onClick={() => navigate('/profile')}>
          Set Up Business Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-slate-400 hover:text-navy transition-colors p-1"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-xs text-slate-400 font-semibold uppercase">Back to Dashboard</span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#E0E0E0] rounded-xl shadow-sm overflow-hidden">
        
        {/* Form Header */}
        <div className="px-6 py-5 border-b border-[#E0E0E0] bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-black text-navy uppercase tracking-wider">{title}</h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Fill in document fields to compile.</p>
          </div>
          <div className="bg-orange/10 border border-orange/10 px-4 py-2 rounded-lg text-right">
            <span className="block text-xxs text-slate-500 font-bold uppercase">Assigned Document Number</span>
            <span className="font-extrabold text-orange text-sm">{documentNumber}</span>
          </div>
        </div>

        {/* Client details & meta */}
        <div className="p-6 md:p-8 border-b border-[#E0E0E0] grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Client / Customer Name"
            name="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="e.g. Dangote Group Headquarters"
            required
          />
          <Input
            label="Document Issue Date"
            name="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Dynamic Items Table */}
        <div className="p-6 md:p-8 border-b border-[#E0E0E0]">
          <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4">Line Items</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase border-b border-[#E0E0E0]">
                  <th className="py-3 px-3 w-[6%] text-center">#</th>
                  <th className="py-3 px-3 w-[50%]">Item Description</th>
                  <th className="py-3 px-3 w-[18%]">Unit Price (₦)</th>
                  <th className="py-3 px-3 w-[10%]">QTY</th>
                  <th className="py-3 px-3 w-[16%] text-right">Amount (₦)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0] text-sm">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30">
                    <td className="py-3 px-2 text-center text-slate-400 font-bold">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        placeholder="e.g. Web Development Hosting (annual)"
                        className="w-full px-3 py-1.5 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 text-xs font-semibold"
                        required
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice || ''}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                        placeholder="e.g. 50000"
                        className="w-full px-3 py-1.5 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 text-xs font-semibold"
                        required
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity || ''}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        className="w-full px-3 py-1.5 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 text-xs font-semibold"
                        required
                      />
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-navy">
                      ₦{item.amount.toLocaleString()}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="ml-3 text-slate-300 hover:text-red-500 transition-colors p-1"
                        title="Remove Row"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange hover:text-orange-dark transition-colors bg-orange/5 border border-dashed border-orange/30 px-4 py-2.5 rounded-lg w-full justify-center"
            >
              <Plus size={14} /> Add Additional Line Item
            </button>
          </div>
        </div>

        {/* Totals & verbal amount */}
        <div className="p-6 md:p-8 bg-slate-50/30 flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="w-full md:w-[60%] space-y-2">
            <span className="block text-xxs text-slate-400 font-bold uppercase tracking-wider">Amount In Words (Naira Only)</span>
            <div className="p-4 bg-white border border-[#E0E0E0] rounded-lg text-slate-500 font-bold italic text-xs leading-relaxed">
              {totalInWords}
            </div>
          </div>

          <div className="w-full md:w-[35%] space-y-4">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-500 border-b border-[#E0E0E0] pb-2">
              <span>Subtotal:</span>
              <span className="text-navy font-bold">₦{totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-base font-black text-navy">
              <span>Grand Total:</span>
              <span className="text-orange text-lg">₦{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-5 border-t border-[#E0E0E0] flex justify-end gap-3 bg-slate-50/50">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            disabled={submitting || pdfGenerating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={submitting || pdfGenerating}
            className="flex items-center gap-2"
          >
            <Sparkles size={16} />
            {pdfGenerating ? 'Rendering PDF...' : 'Compile & Save PDF'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DocumentForm;
