import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Edit, Share2, Globe, Lock, Copy, Check, Loader2 } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Button from '../components/ui/Button';
import InvoiceTemplate from '../components/invoice/InvoiceTemplate';
import { getInvoiceById, getPublicInvoiceById, togglePublicStatus, updateInvoiceStatus } from '../services/invoiceService';
import { useAuth } from '../contexts/AuthContext';

const InvoicePreview = ({ isPublicView = false }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchInvoice = async () => {
      if (id) {
        try {
          const data = isPublicView ? await getPublicInvoiceById(id) : await getInvoiceById(id);
          if (data) {
            setInvoice(data);
            setIsPublic(data.isPublic || false);
          } else {
            if (!isPublicView) navigate('/');
          }
        } catch (err) {
          console.error(err);
          if (!isPublicView) navigate('/');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchInvoice();
  }, [id, navigate, isPublicView]);

  const handleDownloadPDF = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2, // high quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice_${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Falling back to native print.');
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      await updateInvoiceStatus(id, status);
      setInvoice(prev => ({ ...prev, status }));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleTogglePublic = async () => {
    try {
      const nextStatus = !isPublic;
      await togglePublicStatus(id, nextStatus);
      setIsPublic(nextStatus);
    } catch (err) {
      alert('Failed to update share settings');
    }
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}/view/${id}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    const url = `${window.location.origin}/view/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice #${invoice.invoiceNumber}`,
          text: `View my invoice from ${invoice.businessInfo.name}`,
          url: url,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      copyShareLink();
    }
  };

  if (loading || !invoice) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
          <Loader2 className="animate-spin text-primary relative z-10" size={48} />
        </div>
        <p className="text-text-secondary font-black tracking-widest text-[10px] uppercase">
          {isPublicView ? 'FETCHING PUBLIC DOCUMENT...' : 'PREPARING YOUR DOCUMENT...'}
        </p>
      </div>
    );
  }

  return (
    <div className={`pb-10 min-h-screen ${isPublicView ? 'bg-background pt-10 px-4' : ''}`}>
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between mb-8 print:hidden px-4 sm:px-0 gap-6">
        <div className="flex items-center space-x-4">
          {!isPublicView && (
            <button 
              onClick={() => navigate('/')}
              className="p-3 bg-white border border-gray-100 rounded-2xl text-text-secondary hover:text-primary transition-all shadow-md active:scale-95 flex items-center justify-center"
            >
              <ArrowLeft size={20} />
            </button>
          )}
           <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 leading-tight">
                {isPublicView ? 'Document Viewer' : 'Review & Export'}
              </h1>
              {!isPublicView && (
                <select
                  value={invoice.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  className={`px-3 py-1 text-xs font-black uppercase tracking-tighter cursor-pointer outline-none border border-transparent rounded-full transition-all ${
                    invoice.status === 'paid' 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : invoice.status === 'overdue'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              )}
            </div>
            {!isPublicView && <p className="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-50">Validation & Final Distribution</p>}
          </div>
        </div>
        
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {!isPublicView && (
            <Button variant="secondary" icon={Printer} onClick={() => window.print()} className="hidden md:flex font-bold">
              Print
            </Button>
          )}
          <Button 
            variant="primary" 
            icon={isDownloading ? Loader2 : Download} 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex-1 sm:flex-none font-black px-8 shadow-xl shadow-primary/20"
          >
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto shadow-2xl shadow-primary/5 rounded-sm overflow-hidden">
        <InvoiceTemplate ref={invoiceRef} invoice={invoice} />
      </div>

      {/* Share Actions - Fixed Bottom for Desktop/Mobile */}
      {!isPublicView && user && (
        <div className="fixed bottom-8 right-8 flex flex-col items-end space-y-4 print:hidden z-50">
          {showShareModal && (
            <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 w-80 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <Share2 size={16} className="text-primary-dark" />
                </div>
                <span>Share Invoice</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center space-x-2">
                    {isPublic ? (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <Globe size={16} />
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                            <Lock size={16} />
                        </div>
                    )}
                    <div>
                        <p className="text-xs font-bold leading-none">{isPublic ? 'Public' : 'Private'}</p>
                        <p className="text-[10px] text-text-secondary">{isPublic ? 'Visible to anyone with link' : 'Only you can see this'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleTogglePublic}
                    className={`w-11 h-6 rounded-full transition-colors relative ${isPublic ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isPublic ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                {isPublic && (
                  <div className="space-y-2 pt-2 border-t border-gray-50">
                    <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest px-1">Quick Share</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={copyShareLink}
                        className="flex items-center justify-center space-x-2 py-3 bg-white border border-gray-100 hover:border-primary/30 rounded-xl transition-all text-xs font-bold shadow-sm"
                      >
                        {isCopied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                        <span>{isCopied ? 'Copied' : 'Link'}</span>
                      </button>
                      <button 
                        onClick={handleNativeShare}
                        className="flex items-center justify-center space-x-2 py-3 bg-primary text-text-primary hover:bg-primary-dark rounded-xl transition-all text-xs font-bold shadow-sm"
                      >
                        <Share2 size={14} />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <button 
            className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 ${showShareModal ? 'bg-gray-900 text-white rotate-[135deg]' : 'bg-primary text-text-primary'}`}
            onClick={() => setShowShareModal(!showShareModal)}
          >
            {showShareModal ? <div className="rotate-[-135deg] font-black text-xl">×</div> : <Share2 size={24} />}
          </button>
        </div>
      )}

      {isPublicView && (
        <footer className="mt-12 text-center text-text-secondary pb-10">
          <p className="text-xs font-bold tracking-widest uppercase opacity-40">Powered by InVoiceGen</p>
        </footer>
      )}
    </div>
  );
};

export default InvoicePreview;
