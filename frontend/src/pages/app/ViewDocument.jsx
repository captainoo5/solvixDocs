import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';
import {
  ChevronLeft,
  Download,
  Share2,
  Printer,
  Copy,
  Check,
  Send,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ViewDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const docRes = await API.get(`/documents/${id}`);
        if (docRes.data?.success) {
          setDoc(docRes.data.data);
          
          // Load profile to match banking details
          const profRes = await API.get('/business');
          if (profRes.data?.success) {
            setProfile(profRes.data.data);
          }
        }
      } catch (error) {
        console.error('Error loading details:', error);
        toast.error('Failed to load document details.');
        navigate('/history');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id, navigate]);

  const handleCopyLink = () => {
    if (!doc?.pdfUrl) return;
    navigator.clipboard.writeText(doc.pdfUrl);
    setCopied(true);
    toast.success('PDF Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    if (!doc?.pdfUrl) return;
    const docTypeLabel = doc.documentType === 'proforma' ? 'Proforma Invoice' : doc.documentType.toUpperCase();
    const text = `Hello, please find attached our official ${docTypeLabel} (${doc.documentNumber}) for your review:\n\n${doc.pdfUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange"></div>
      </div>
    );
  }

  if (!doc || !profile) {
    return (
      <div className="text-center py-16 bg-white border border-[#E0E0E0] rounded-xl shadow-sm max-w-md mx-auto">
        <p className="text-slate-500 font-semibold text-sm">Failed to retrieve document details.</p>
        <Link to="/history" className="mt-4 inline-block text-xs font-bold text-orange hover:underline">
          Return to History
        </Link>
      </div>
    );
  }

  const activeTemplate = doc.template || 'classic';

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      
      {/* Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        {/* Back Link */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/history')}
            className="text-slate-400 hover:text-navy transition-colors p-1"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-xs text-slate-400 font-bold uppercase">Back to Document History</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {doc.pdfUrl && (
            <>
              <a
                href={doc.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-navy hover:bg-navy-dark text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 shadow-sm"
              >
                <Download size={14} /> Download PDF
              </a>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 border border-[#E0E0E0] bg-white text-navy hover:bg-slate-50 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                Copy Link
              </button>
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 shadow-sm"
              >
                <Send size={14} /> WhatsApp Share
              </button>
            </>
          )}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 border border-[#E0E0E0] bg-white text-navy hover:bg-slate-50 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150"
          >
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      {/* HTML PREVIEW WRAPPER */}
      <div className="bg-white border border-[#E0E0E0] rounded-xl shadow-md p-6 md:p-10 max-w-full overflow-x-auto print:border-none print:shadow-none print:p-0">
        
        {/* RENDER - CLASSIC TEMPLATE */}
        {activeTemplate === 'classic' && (
          <div className="font-sans text-xs text-slate-900 border border-slate-900 p-6 min-w-[700px]">
            <div className="flex justify-between items-start mb-6">
              <div>
                {profile.logo?.url && <img src={profile.logo.url} alt="Logo" className="max-h-16 max-w-36 object-contain mb-3" />}
                <div className="text-base font-bold uppercase text-navy">{profile.businessName}</div>
                {profile.tagline && <div className="text-[10px] italic text-slate-500 mt-0.5">{profile.tagline}</div>}
              </div>
              <div className="text-right text-[10px] text-slate-500 max-w-64 leading-normal">
                <strong className="text-navy">ADDRESS:</strong><br />
                {profile.address}
              </div>
            </div>

            <div className="flex justify-between font-bold border-b border-slate-950 pb-2 mb-4 text-[11px]">
              <div>Doc No.: <span className="text-navy">{doc.documentNumber}</span></div>
              <div>DATE: {new Date(doc.date).toISOString().split('T')[0]}</div>
            </div>

            <div className="text-center text-lg font-black text-orange underline tracking-wide mb-6 uppercase">
              {doc.documentType === 'proforma' ? 'Proforma Invoice' : doc.documentType}
            </div>

            <div className="font-bold mb-4 text-slate-800">
              Client/Location: <span className="underline">{doc.clientName}</span>
            </div>

            <table className="w-full border-collapse border border-slate-900 mb-6 text-center">
              <thead>
                <tr className="bg-slate-100 font-bold border-b border-slate-900">
                  <th className="border border-slate-900 py-2 w-[8%]">S/No</th>
                  <th className="border border-slate-900 py-2 text-left px-3 w-[50%]">Description</th>
                  <th className="border border-slate-900 py-2 w-[14%]">Unit Price</th>
                  <th className="border border-slate-900 py-2 w-[10%]">QTY</th>
                  <th className="border border-slate-900 py-2 w-[18%]">Amount</th>
                </tr>
              </thead>
              <tbody>
                {doc.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-900">
                    <td className="border border-slate-900 py-2">{idx + 1}</td>
                    <td className="border border-slate-900 py-2 text-left px-3">{item.description}</td>
                    <td className="border border-slate-900 py-2">₦{item.unitPrice.toLocaleString()}</td>
                    <td className="border border-slate-900 py-2">{item.quantity}</td>
                    <td className="border border-slate-900 py-2">₦{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-slate-50">
                  <td colSpan="2" className="border border-slate-900 py-2 text-left px-3">TOTAL</td>
                  <td className="border border-slate-900 py-2">₦{doc.items.reduce((s, i) => s + i.unitPrice, 0).toLocaleString()}</td>
                  <td className="border border-slate-900 py-2">{doc.items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td className="border border-slate-900 py-2">₦{doc.totalAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div className="border-2 border-slate-900 p-2.5 mb-2 font-semibold">
              Total For Whole Set of The Description Is:
              <span className="float-right font-bold text-orange">₦{doc.totalAmount.toLocaleString()}</span>
            </div>

            <div className="border-2 border-slate-900 p-2.5 flex justify-between font-bold bg-orange-light/10">
              <span className="text-navy uppercase">Grand Total</span>
              <span className="text-right">Say Total In Naira: {doc.totalInWords}</span>
            </div>

            {profile.bankName && (
              <div className="mt-6 border border-dashed border-slate-300 p-3 rounded max-w-sm">
                <div className="font-bold underline text-navy text-[11px] mb-1">Bank Information:</div>
                <div className="font-bold text-[10px] text-slate-700 leading-relaxed">
                  Beneficiary Bank: {profile.bankName}<br />
                  Account No.: {profile.accountNumber}<br />
                  Beneficiary Name: {profile.accountName || profile.businessName}
                </div>
              </div>
            )}

            <div className="flex justify-between items-end mt-8">
              <div>
                {profile.phone && <span className="bg-orange text-white px-3 py-1.5 rounded text-[10px] font-bold">Tel: {profile.phone}</span>}
                <br />
                {profile.tagline && <span className="inline-block bg-green-600 text-white px-3 py-1 rounded text-[10px] italic mt-2">{profile.tagline}</span>}
              </div>
              {profile.qrCode?.url && <img src={profile.qrCode.url} alt="QR Code" className="h-16 w-16 border p-1 rounded bg-white object-contain" />}
            </div>
          </div>
        )}

        {/* RENDER - MODERN TEMPLATE */}
        {activeTemplate === 'modern' && (
          <div className="font-sans text-xs text-slate-800 border-l-[8px] border-orange p-6 min-w-[700px]">
            <div className="flex justify-between items-start mb-8">
              <div>
                {profile.logo?.url && <img src={profile.logo.url} alt="Logo" className="max-h-16 max-w-36 object-contain mb-3" />}
                <div className="text-xl font-bold text-navy">{profile.businessName}</div>
                {profile.tagline && <div className="text-xs italic text-slate-400 mt-0.5">{profile.tagline}</div>}
              </div>
              <div className="text-right text-xs text-slate-500 max-w-64 leading-normal">
                {profile.address}
              </div>
            </div>

            <div className="flex justify-between items-end mb-6">
              <div className="bg-orange text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                {doc.documentType === 'proforma' ? 'Proforma Invoice' : doc.documentType}
              </div>
              <div className="text-right font-bold text-navy leading-relaxed">
                Doc Number: <span className="text-orange">{doc.documentNumber}</span><br />
                Date: {new Date(doc.date).toISOString().split('T')[0]}
              </div>
            </div>

            <div className="mb-6 p-3 bg-slate-100 rounded">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client / Billing Address</div>
              <div className="font-bold text-sm text-slate-800 mt-1">{doc.clientName}</div>
            </div>

            <table className="w-full border-collapse mb-6 text-left">
              <thead>
                <tr className="bg-navy text-white text-[11px] font-bold">
                  <th className="py-2.5 px-3 rounded-l w-[8%] text-center">#</th>
                  <th className="py-2.5 px-3 w-[50%]">Description</th>
                  <th className="py-2.5 px-3 w-[15%]">Unit Price</th>
                  <th className="py-2.5 px-3 w-[10%]">QTY</th>
                  <th className="py-2.5 px-3 rounded-r w-[17%] text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {doc.items.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/50' : ''}>
                    <td className="py-3 px-3 text-center text-slate-400 font-bold">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{item.description}</td>
                    <td className="py-3 px-3">₦{item.unitPrice.toLocaleString()}</td>
                    <td className="py-3 px-3">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-bold">₦{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mb-6">
              <table className="w-72">
                <tbody>
                  <tr className="font-bold">
                    <td className="py-2 text-slate-400 text-right">Subtotal:</td>
                    <td className="py-2 text-right">₦{doc.totalAmount.toLocaleString()}</td>
                  </tr>
                  <tr className="font-black text-orange bg-orange-light/20 text-sm">
                    <td className="py-2.5 px-3 rounded-l text-right">Grand Total:</td>
                    <td className="py-2.5 px-3 rounded-r text-right">₦{doc.totalAmount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-orange-light/20 border-l-4 border-orange p-3 rounded-r mb-6 font-bold text-slate-800 text-xs">
              Amount in Words: <span className="text-orange-dark">{doc.totalInWords}</span>
            </div>

            <div className="flex justify-between items-start pt-6 border-t border-slate-200">
              {profile.bankName ? (
                <div className="bg-slate-100 p-3 rounded max-w-sm">
                  <div className="font-bold text-navy uppercase text-[10px] mb-1">Bank Transfer Details</div>
                  <div className="font-bold text-[10px] text-slate-600 leading-normal">
                    Bank: {profile.bankName}<br />
                    Account: {profile.accountNumber}<br />
                    Name: {profile.accountName || profile.businessName}
                  </div>
                </div>
              ) : <div />}
              <div className="text-right flex flex-col items-end gap-2">
                {profile.phone && <div className="font-bold text-orange">📞 {profile.phone}</div>}
                {profile.qrCode?.url && <img src={profile.qrCode.url} alt="QR" className="h-16 w-16 border rounded p-0.5 object-contain bg-white" />}
              </div>
            </div>
          </div>
        )}

        {/* RENDER - BOLD TEMPLATE */}
        {activeTemplate === 'bold' && (
          <div className="font-sans text-xs text-slate-800 p-6 min-w-[700px]">
            <div className="bg-navy text-white p-5 rounded-lg flex justify-between items-center mb-6">
              <div>
                <div className="text-lg font-black uppercase tracking-wide">{profile.businessName}</div>
                {profile.tagline && <div className="text-xs italic text-slate-300 mt-0.5">{profile.tagline}</div>}
              </div>
              <div className="text-right text-[10px] text-slate-300 leading-relaxed">
                <strong>Office Address:</strong><br />
                {profile.address}
              </div>
            </div>

            <div className="flex justify-between items-end border-b-2 border-navy pb-2 mb-6">
              <div className="text-2xl font-black text-navy uppercase">
                {doc.documentType === 'proforma' ? 'Proforma Invoice' : doc.documentType}
              </div>
              <div className="text-right font-bold leading-normal">
                No: <span className="text-orange">{doc.documentNumber}</span><br />
                Date: {new Date(doc.date).toISOString().split('T')[0]}
              </div>
            </div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Prepared For:</div>
                <div className="font-bold text-sm text-navy underline">{doc.clientName}</div>
              </div>
              {profile.logo?.url && <img src={profile.logo.url} alt="Logo" className="max-h-14 max-w-28 object-contain bg-white border p-1 rounded" />}
            </div>

            <table className="w-full border border-slate-200 mb-6 text-left border-collapse">
              <thead>
                <tr className="bg-navy text-white text-[11px] font-bold">
                  <th className="py-2.5 px-3 w-[8%] text-center">S/No</th>
                  <th className="py-2.5 px-3 w-[52%]">Item & Description</th>
                  <th className="py-2.5 px-3 w-[13%]">Rate</th>
                  <th className="py-2.5 px-3 w-[10%]">Qty</th>
                  <th className="py-2.5 px-3 w-[17%] text-right">Total (₦)</th>
                </tr>
              </thead>
              <tbody>
                {doc.items.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-orange/5' : 'border-b border-slate-100'}>
                    <td className="py-3 px-3 text-center border-r border-slate-100 font-bold">{idx + 1}</td>
                    <td className="py-3 px-3 border-r border-slate-100"><strong>{item.description}</strong></td>
                    <td className="py-3 px-3 border-r border-slate-100">₦{item.unitPrice.toLocaleString()}</td>
                    <td className="py-3 px-3 border-r border-slate-100">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-bold">₦{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-start gap-4 mb-6">
              <div className="w-[55%] border p-3 rounded bg-slate-50">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Say Total In Words</div>
                <div className="font-bold text-xs text-slate-700 leading-normal">{doc.totalInWords}</div>
              </div>
              <div className="w-[40%] bg-navy text-white p-3.5 rounded text-right">
                <div className="text-[9px] font-bold uppercase tracking-wider opacity-80 mb-1">Grand Total Due</div>
                <div className="text-xl font-black text-orange">₦{doc.totalAmount.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex justify-between items-end pt-4 border-t border-slate-200 mt-6">
              <div>
                {profile.bankName && (
                  <div className="text-[10px] text-slate-600 leading-relaxed font-semibold">
                    <strong className="text-navy">Payment Information:</strong><br />
                    Bank Name: {profile.bankName} | Account Name: {profile.accountName || profile.businessName}<br />
                    Account Number: <strong className="text-navy text-xs">{profile.accountNumber}</strong>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                {profile.phone && <span className="bg-orange text-white px-2.5 py-1 rounded text-[10px] font-bold">Call: {profile.phone}</span>}
                {profile.qrCode?.url && <img src={profile.qrCode.url} alt="QR" className="h-14 w-14 border p-0.5 object-contain bg-white" />}
              </div>
            </div>
          </div>
        )}

        {/* RENDER - MINIMAL TEMPLATE */}
        {activeTemplate === 'minimal' && (
          <div className="font-sans text-xs text-slate-800 p-6 min-w-[700px] leading-relaxed">
            <div className="flex justify-between items-start mb-8 border-b border-slate-200 pb-5">
              <div>
                {profile.logo?.url && <img src={profile.logo.url} alt="Logo" className="max-h-12 max-w-28 object-contain mb-2" />}
                <div className="text-sm font-bold uppercase tracking-wide">{profile.businessName}</div>
                {profile.tagline && <div className="text-[9px] text-slate-400 mt-0.5">{profile.tagline}</div>}
              </div>
              <div className="text-right text-[10px] text-slate-400 max-w-64 leading-normal">
                {profile.address}
              </div>
            </div>

            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-base font-light uppercase tracking-wider text-slate-800">
                  {doc.documentType === 'proforma' ? 'Proforma Invoice' : doc.documentType}
                </div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-4 mb-1">Billed To</div>
                <div className="font-bold text-xs text-slate-800">{doc.clientName}</div>
              </div>
              <div className="text-right font-medium text-slate-500 leading-relaxed text-[10px]">
                No. <strong>{doc.documentNumber}</strong><br />
                Date. <strong>{new Date(doc.date).toISOString().split('T')[0]}</strong>
              </div>
            </div>

            <table className="w-full text-left mb-6 border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 font-bold text-[10px] text-slate-400 uppercase">
                  <th className="py-2 px-1 w-[5%]">#</th>
                  <th className="py-2 px-1 w-[60%]">Description</th>
                  <th className="py-2 px-1 w-[15%]">Unit Price</th>
                  <th className="py-2 px-1 w-[8%]">Qty</th>
                  <th className="py-2 px-1 w-[12%] text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {doc.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100 text-slate-600 font-medium">
                    <td className="py-2.5 px-1">{idx + 1}</td>
                    <td className="py-2.5 px-1 text-slate-700">{item.description}</td>
                    <td className="py-2.5 px-1">₦{item.unitPrice.toLocaleString()}</td>
                    <td className="py-2.5 px-1">{item.quantity}</td>
                    <td className="py-2.5 px-1 text-right font-bold text-slate-900">₦{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-start gap-4 mb-8">
              <div className="w-[60%] text-[10px] text-slate-400">
                <strong>In Words:</strong><br />
                <span className="italic">{doc.totalInWords}</span>
              </div>
              <div className="w-[35%] text-right text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="font-semibold text-slate-700">₦{doc.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-900 pt-2 font-black text-orange text-xs">
                  <span>Total Due:</span>
                  <span>₦{doc.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 flex justify-between items-start mt-8">
              {profile.bankName ? (
                <div className="text-[9px] text-slate-400 leading-normal">
                  <strong>Payment Information</strong><br />
                  Bank: {profile.bankName} &bull; Name: {profile.accountName || profile.businessName}<br />
                  Acc No: {profile.accountNumber}
                </div>
              ) : <div />}
              <div className="text-right text-[9px] text-slate-400 flex items-center gap-3">
                <div>
                  {profile.phone && <span>T. {profile.phone}<br /></span>}
                  {profile.email && <span>E. {profile.email}</span>}
                </div>
                {profile.qrCode?.url && <img src={profile.qrCode.url} alt="QR" className="h-12 w-12 opacity-80 object-contain bg-white" />}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ViewDocument;
