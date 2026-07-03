import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { Loader2, Calendar, User as UserIcon } from 'lucide-react';
import ConfirmModal from '../components/ui/ConfirmModal';
import { getInvoices, deleteInvoice, updateInvoiceStatus } from '../services/invoiceService';
import { useAuth } from '../contexts/AuthContext';
import { calculateTotals, formatCurrency } from '../utils/calculations';

const Dashboard = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;
      setError(null);
      try {
        const data = await getInvoices(user.uid);
        setInvoices(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load billing history');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [user]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateInvoiceStatus(id, status);
      setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status } : inv));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInvoice(id);
      setInvoices(invoices.filter(inv => inv.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete invoice. Please check your connection.');
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.clientInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { 
      label: 'Estimated Revenue', 
      value: formatCurrency(invoices.reduce((acc, inv) => acc + calculateTotals(inv.items, inv.discount, inv.isDiscountPercentage).grandTotal, 0)), 
      icon: DollarSign, 
      color: 'bg-primary' 
    },
    { 
      label: 'Active Invoices', 
      value: invoices.length, 
      icon: FileText, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Payment Pending', 
      value: invoices.filter(inv => inv.status === 'pending').length, 
      icon: Clock, 
      color: 'bg-amber-500' 
    },
    { 
      label: 'Successful Payments', 
      value: invoices.filter(inv => inv.status === 'paid').length, 
      icon: CheckCircle2, 
      color: 'bg-green-500' 
    },
  ];

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 sm:p-12 text-center">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 text-red-600 shadow-xl shadow-red-600/10">
            <AlertTriangle size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Sync Error</h2>
          <p className="text-gray-600 mb-10 max-w-md mx-auto leading-relaxed font-medium">
            We encountered an issue syncing with the database. Please verify your connection status and reload the application.
          </p>
          <Button variant="primary" onClick={() => window.location.reload()} className="font-black shadow-xl shadow-primary/20">
            Reload Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <Header title="Invoice Hub" toggleSidebar={toggleSidebar} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="card flex items-center space-x-5 p-6 border-none shadow-premium hover:translate-y-[-5px] transition-all duration-300">
            <div className={`${stat.color} p-4 rounded-2xl text-white shadow-xl shadow-${stat.color.split('-')[1]}/20`}>
              <stat.icon size={26} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Invoices List */}
      <div className="card overflow-hidden !p-0 border-none shadow-premium">
        <div className="p-6 sm:p-10 border-b border-gray-50 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Financial Records</h2>
            <div className="flex items-center space-x-2">
                <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black opacity-50">Transaction History</p>
                <span className="bg-primary/10 text-primary-dark text-[9px] font-black px-2 py-0.5 rounded-full uppercase italic">Beta</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-5">
            <div className="flex items-center bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200/50 w-full md:w-auto">
              {['all', 'pending', 'paid'].map(status => (
                <button 
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-white shadow-premium text-gray-900' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Client or #..." 
                className="pl-12 pr-6 py-3.5 border border-gray-200 bg-gray-50/50 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all w-full md:w-72 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="primary" size="lg" icon={Plus} onClick={() => navigate('/create')} className="w-full md:w-auto font-black shadow-xl shadow-primary/20">
              New Project
            </Button>
          </div>
        </div>

        <div className="bg-white">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="relative mb-8">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150"></div>
                  <Loader2 className="animate-spin text-primary relative z-10" size={56} />
              </div>
              <p className="text-text-secondary font-black tracking-[0.3em] text-[10px] uppercase opacity-60">Synchronizing your archive...</p>
            </div>
          ) : filteredInvoices.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 text-text-secondary text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
                      <th className="py-6 px-10">Identifier</th>
                      <th className="py-6 px-6">Client Entity</th>
                      <th className="py-6 px-6 hidden sm:table-cell">Posting Date</th>
                      <th className="py-6 px-6">Total Amount</th>
                      <th className="py-6 px-6">Legal Status</th>
                      <th className="py-6 px-10 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredInvoices.map((inv) => {
                      const totals = calculateTotals(inv.items, inv.discount, inv.isDiscountPercentage);
                      return (
                        <tr key={inv.id} className="group hover:bg-primary/5 transition-all duration-300">
                          <td className="py-7 px-10">
                            <span className="font-black text-gray-900 px-3 py-1.5 bg-gray-100 rounded-lg group-hover:bg-primary group-hover:text-white transition-all text-xs">#{inv.invoiceNumber}</span>
                          </td>
                          <td className="py-7 px-6">
                              <p className="font-black text-sm text-gray-900 leading-none mb-1.5">{inv.clientInfo.name}</p>
                              <p className="text-[10px] text-text-secondary font-bold truncate max-w-[150px]">{inv.clientInfo.email}</p>
                          </td>
                          <td className="py-7 px-6 hidden sm:table-cell">
                            <p className="text-xs font-black text-gray-500">{new Date(inv.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          </td>
                          <td className="py-7 px-6">
                            <span className="font-black text-sm text-gray-900 tracking-tight">{formatCurrency(totals.grandTotal, inv.currency)}</span>
                          </td>
                          <td className="py-7 px-6">
                            <select
                              value={inv.status}
                              onChange={(e) => handleStatusUpdate(inv.id, e.target.value)}
                              className={`px-3 py-1 text-xs font-black uppercase tracking-tighter cursor-pointer outline-none border border-transparent rounded-full transition-all ${
                                inv.status === 'paid' 
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                  : inv.status === 'overdue'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="overdue">Overdue</option>
                            </select>
                          </td>
                          <td className="py-7 px-10 text-right">
                            <div className="flex justify-end items-center space-x-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
                              <button 
                                onClick={() => navigate(`/preview/${inv.id}`)}
                                className="p-3 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm hover:shadow-lg hover:translate-y-[-2px]"
                                title="Preview Document"
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => navigate(`/edit/${inv.id}`)}
                                className="p-3 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm hover:shadow-lg hover:translate-y-[-2px]"
                                title="Adjust Parameters"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirm({ isOpen: true, id: inv.id });
                                }}
                                className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-600 hover:border-red-200 transition-all shadow-sm hover:shadow-lg hover:translate-y-[-2px]"
                                title="Delete Record"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 p-4">
                {filteredInvoices.map((inv) => {
                  const totals = calculateTotals(inv.items, inv.discount, inv.isDiscountPercentage);
                  return (
                    <div key={inv.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm active:scale-[0.98] transition-all duration-300">
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black bg-gray-900 text-white px-3 py-1 rounded-full uppercase tracking-widest">#{inv.invoiceNumber}</span>
                          <h3 className="text-xl font-black text-gray-900 pt-2">{inv.clientInfo.name}</h3>
                          <div className="flex items-center space-x-2 text-text-secondary">
                             <UserIcon size={12} className="opacity-50" />
                             <p className="text-xs font-medium">{inv.clientInfo.email}</p>
                          </div>
                        </div>
                        <select
                          value={inv.status}
                          onChange={(e) => handleStatusUpdate(inv.id, e.target.value)}
                          className={`px-3 py-1 text-xs font-black uppercase tracking-tighter cursor-pointer outline-none border border-transparent rounded-full transition-all ${
                            inv.status === 'paid' 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : inv.status === 'overdue'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="overdue">Overdue</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between py-4 border-y border-gray-50 mb-6">
                        <div className="flex items-center space-x-2">
                           <Calendar size={14} className="text-primary-dark" />
                           <span className="text-xs font-black text-gray-500 uppercase">{new Date(inv.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-lg font-black text-gray-900 tracking-tight">{formatCurrency(totals.grandTotal, inv.currency)}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <button 
                          onClick={() => navigate(`/preview/${inv.id}`)}
                          className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl text-gray-500 active:bg-primary active:text-white transition-all gap-2"
                        >
                          <Eye size={20} />
                          <span className="text-[10px] font-black uppercase">View</span>
                        </button>
                        <button 
                          onClick={() => navigate(`/edit/${inv.id}`)}
                          className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl text-gray-500 active:bg-blue-600 active:text-white transition-all gap-2"
                        >
                          <Edit size={20} />
                          <span className="text-[10px] font-black uppercase">Edit</span>
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm({ isOpen: true, id: inv.id })}
                          className="flex flex-col items-center justify-center p-4 bg-red-50 text-red-500 active:bg-red-600 active:text-white transition-all gap-2"
                        >
                          <Trash2 size={20} />
                          <span className="text-[10px] font-black uppercase">Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="py-24">
              <EmptyState 
                title={searchTerm || statusFilter !== 'all' ? "Dataset Empty" : "No Archives Detected"}
                description={searchTerm || statusFilter !== 'all' ? "No records match your current query parameters." : "Your billing history is currently pristine. Start generating invoices to see them here."}
                actionLabel="Generate New Document"
                onAction={() => navigate('/create')}
                icon={FileText}
              />
            </div>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={() => handleDelete(deleteConfirm.id)}
        title="Delete Record?"
        message="This operation is irreversible. All data associated with this invoice will be purged from the archive."
        confirmText="Purge Record"
      />
    </div>
  );
};

export default Dashboard;
