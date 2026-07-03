import React from 'react';
import Input from '../ui/Input';
import { calculateTotals, formatCurrency } from '../../utils/calculations';

const NotesSection = ({ state, dispatch }) => {
  const { subtotal, totalTax, discountAmount, grandTotal } = calculateTotals(
    state.items, 
    state.discount, 
    state.isDiscountPercentage
  );

  const handleFieldChange = (field, value) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {/* Left: Notes and Discount */}
      <div className="space-y-6">
        <div className="card">
          <h3 className="text-lg font-bold mb-4">Additional Info</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">Discount</label>
              <div className="flex space-x-2">
                <Input 
                  type="number" 
                  className="flex-1"
                  placeholder="0"
                  value={state.discount}
                  onChange={(e) => handleFieldChange('discount', parseFloat(e.target.value) || 0)}
                />
                <select 
                  className="w-24 bg-white border border-gray-200 rounded-lg px-2 py-2.5 text-sm font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  value={state.isDiscountPercentage ? 'percent' : 'fixed'}
                  onChange={(e) => handleFieldChange('isDiscountPercentage', e.target.value === 'percent')}
                >
                  <option value="percent">%</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-text-secondary">Notes / Payment Instructions</label>
              <textarea 
                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-text-primary outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 min-h-[100px] resize-none"
                placeholder="Thanks for your business!"
                value={state.notes}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-text-secondary">Terms & Conditions</label>
              <textarea 
                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-text-primary outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 min-h-[100px] resize-none"
                placeholder="Payment is due within 14 days. Interest may apply to late payments."
                value={state.terms || ''}
                onChange={(e) => handleFieldChange('terms', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Summary */}
      <div className="card bg-gray-50/50 border-none shadow-none">
        <h3 className="text-lg font-bold mb-6 border-b border-gray-200 pb-4">Summary</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal</span>
            <span className="font-semibold text-text-primary">{formatCurrency(subtotal, state.currency)}</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>Tax Total</span>
            <span className="font-semibold text-text-primary">{formatCurrency(totalTax, state.currency)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-red-500">
              <span>Discount {state.isDiscountPercentage && `(${state.discount}%)`}</span>
              <span className="font-semibold">-{formatCurrency(discountAmount, state.currency)}</span>
            </div>
          )}
          
          <div className="pt-4 mt-2 border-t border-gray-200 flex justify-between items-center">
            <span className="text-lg font-bold">Grand Total</span>
            <span className="text-2xl font-black text-primary-dark">
              {formatCurrency(grandTotal, state.currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
