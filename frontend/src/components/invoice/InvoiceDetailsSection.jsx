import React from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';

const InvoiceDetailsSection = ({ state, dispatch }) => {
  const currencies = [
    { label: 'USD - US Dollar', value: 'USD' },
    { label: 'EUR - Euro', value: 'EUR' },
    { label: 'GBP - British Pound', value: 'GBP' },
    { label: 'INR - Indian Rupee', value: 'INR' },
    { label: 'CAD - Canadian Dollar', value: 'CAD' },
  ];

  const statuses = [
    { label: 'Pending', value: 'pending' },
    { label: 'Paid', value: 'paid' },
    { label: 'Overdue', value: 'overdue' },
  ];

  const handleFieldChange = (field, value) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  return (
    <div className="card h-full">
      <h3 className="text-lg font-bold mb-6 border-b border-gray-100 pb-4">Invoice Details</h3>
      
      <div className="space-y-4">
        <Input 
          label="Invoice Number" 
          value={state.invoiceNumber}
          onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Invoice Date" 
            type="date"
            value={state.date}
            onChange={(e) => handleFieldChange('date', e.target.value)}
          />
          <Input 
            label="Due Date" 
            type="date"
            value={state.dueDate}
            onChange={(e) => handleFieldChange('dueDate', e.target.value)}
          />
        </div>
        
        <Select 
          label="Currency" 
          options={currencies}
          value={state.currency}
          onChange={(e) => handleFieldChange('currency', e.target.value)}
        />

        <Select 
          label="Status" 
          options={statuses}
          value={state.status}
          onChange={(e) => handleFieldChange('status', e.target.value)}
        />
      </div>
    </div>
  );
};

export default InvoiceDetailsSection;
