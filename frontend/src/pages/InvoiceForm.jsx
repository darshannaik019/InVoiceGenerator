import React, { useReducer, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Eye, ArrowLeft, Trash2 } from 'lucide-react';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import BusinessInfoSection from '../components/invoice/BusinessInfoSection';
import ClientInfoSection from '../components/invoice/ClientInfoSection';
import InvoiceDetailsSection from '../components/invoice/InvoiceDetailsSection';
import ItemsTable from '../components/invoice/ItemsTable';
import NotesSection from '../components/invoice/NotesSection';
import { initialState, invoiceReducer } from '../utils/invoiceState';
import { saveInvoice, getInvoiceById, deleteInvoice } from '../services/invoiceService';
import { getUserSettings } from '../services/settingsService';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const InvoiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [state, dispatch] = useReducer(invoiceReducer, initialState);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (id) {
        try {
          const existing = await getInvoiceById(id);
          if (existing) {
            dispatch({ type: 'SET_INVOICE', invoice: existing });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      } else if (user) {
        try {
          const settings = await getUserSettings(user.uid);
          if (settings) {
            if (settings.businessName) dispatch({ type: 'UPDATE_BUSINESS_INFO', field: 'name', value: settings.businessName });
            if (settings.email) dispatch({ type: 'UPDATE_BUSINESS_INFO', field: 'email', value: settings.email });
            if (settings.phone) dispatch({ type: 'UPDATE_BUSINESS_INFO', field: 'phone', value: settings.phone });
            if (settings.address) dispatch({ type: 'UPDATE_BUSINESS_INFO', field: 'address', value: settings.address });
            if (settings.taxId) dispatch({ type: 'UPDATE_BUSINESS_INFO', field: 'taxId', value: settings.taxId });
            if (settings.logo) dispatch({ type: 'UPDATE_FIELD', field: 'businessLogo', value: settings.logo });
          }
        } catch (err) {
          console.error("Error fetching settings for autofill:", err);
        }
      }
    };
    fetchInvoice();
  }, [id, user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await saveInvoice(user.uid, state);
      navigate('/');
    } catch (err) {
      alert('Failed to save invoice');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoice(id);
        navigate('/');
      } catch (err) {
        alert('Failed to delete invoice');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2.5 bg-white border border-gray-100 rounded-full text-text-secondary hover:text-primary transition-colors shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold tracking-tight">
            {id ? 'Edit Invoice' : 'New Invoice'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          {id && (
            <Button variant="danger" icon={Trash2} onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button variant="secondary" icon={Eye} onClick={() => id && navigate(`/preview/${id}`)} disabled={!id}>
            Preview
          </Button>
          <Button 
            variant="primary" 
            icon={isSaving ? Loader2 : Save} 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Invoice'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-primary mb-4" size={40} />
          <p className="text-text-secondary font-black tracking-widest text-[10px] uppercase opacity-60">LOADING INVOICE DETAILS...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="block lg:hidden mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2 opacity-50">Quick Actions</p>
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="secondary" size="sm" icon={Eye} onClick={() => id && navigate(`/preview/${id}`)} disabled={!id} className="w-full">Preview</Button>
                    <Button variant="primary" size="sm" icon={isSaving ? Loader2 : Save} onClick={handleSave} disabled={isSaving} className="w-full">Save Draft</Button>
                </div>
            </div>

            <BusinessInfoSection 
              businessInfo={state.businessInfo} 
              businessLogo={state.businessLogo} 
              dispatch={dispatch} 
            />
            <ClientInfoSection 
              clientInfo={state.clientInfo} 
              dispatch={dispatch} 
            />
            <ItemsTable 
              items={state.items} 
              currency={state.currency} 
              dispatch={dispatch} 
            />
            <NotesSection 
              state={state} 
              dispatch={dispatch} 
            />
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              <InvoiceDetailsSection 
                state={state} 
                dispatch={dispatch} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceForm;
