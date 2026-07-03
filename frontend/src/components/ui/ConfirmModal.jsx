import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", type = "danger" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl border border-gray-100 p-8 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`mb-6 p-4 rounded-2xl ${type === 'danger' ? 'bg-red-50 text-red-600 shadow-xl shadow-red-600/10' : 'bg-primary/10 text-primary-dark'} rotate-3`}>
            <AlertTriangle size={32} />
          </div>
          
          <h2 className="text-2xl font-black text-gray-900 mb-3">{title}</h2>
          <p className="text-sm text-text-secondary font-medium leading-relaxed mb-8">
            {message}
          </p>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button variant="secondary" onClick={onClose} className="w-full py-4 text-xs font-black uppercase tracking-widest">
              Cancel
            </Button>
            <Button 
                variant={type === 'danger' ? 'primary' : 'primary'} 
                onClick={() => {
                    onConfirm();
                    onClose();
                }} 
                className={`w-full py-4 text-xs font-black uppercase tracking-widest shadow-xl ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' : ''}`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
