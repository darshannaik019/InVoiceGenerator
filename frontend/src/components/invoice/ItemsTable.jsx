import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { calculateRowTotal, formatCurrency } from '../../utils/calculations';

const ItemsTable = ({ items, currency, dispatch }) => {
  const handleAddItem = () => {
    dispatch({ type: 'ADD_ITEM' });
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      dispatch({ type: 'REMOVE_ITEM', id });
    }
  };

  const handleItemChange = (id, field, value) => {
    dispatch({ type: 'UPDATE_ITEM', id, field, value });
  };

  return (
    <div className="card !p-0 overflow-hidden border-none shadow-premium">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Services / Items</h3>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black opacity-40">Itemized Breakdown</p>
        </div>
        <div className="bg-primary/20 px-3 py-1 rounded-full">
            <span className="text-[10px] font-black text-primary-dark uppercase">{items.length} Units</span>
        </div>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-text-secondary text-[10px] uppercase font-black tracking-widest opacity-60">
              <th className="py-6 px-8 w-1/3">Project Task / Service</th>
              <th className="py-6 px-4 w-24 text-center">Qty</th>
              <th className="py-6 px-4 w-32 text-right">Unit Rate</th>
              <th className="py-6 px-4 w-28 text-center">Tax %</th>
              <th className="py-6 px-4 w-32 text-right">Subtotal</th>
              <th className="py-6 pr-8 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item) => (
              <tr key={item.id} className="group hover:bg-primary/5 transition-all duration-300">
                <td className="py-6 px-8">
                  <input 
                    type="text"
                    placeholder="Enter service details..." 
                    value={item.description}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm text-text-primary"
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  />
                </td>
                <td className="py-6 px-4">
                  <input 
                    type="number" 
                    value={item.quantity}
                    className="w-full text-center font-black bg-slate-50 border border-slate-100 rounded-lg py-2 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-primary"
                    onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                  />
                </td>
                <td className="py-6 px-4">
                  <input 
                    type="number" 
                    value={item.price}
                    className="w-full text-right font-black bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-primary"
                    onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                  />
                </td>
                <td className="py-6 px-4">
                  <input 
                    type="number" 
                    value={item.taxPercent}
                    className="w-full text-center font-black bg-slate-50 border border-slate-100 rounded-lg py-2 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-primary"
                    onChange={(e) => handleItemChange(item.id, 'taxPercent', e.target.value)}
                  />
                </td>
                <td className="py-6 px-4 text-right">
                  <span className="font-black text-sm text-gray-900 tracking-tight">
                    {formatCurrency(calculateRowTotal(item.quantity, item.price, item.taxPercent), currency)}
                  </span>
                </td>
                <td className="py-6 pr-8 text-right">
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-3 bg-red-50 text-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100 hover:bg-red-100 disabled:opacity-0 shadow-sm"
                    disabled={items.length <= 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card-based Items */}
      <div className="lg:hidden divide-y divide-gray-100">
        {items.map((item, index) => (
          <div key={item.id} className="p-6 space-y-4 bg-white active:bg-gray-50 transition-colors">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-lg tracking-widest">Item #{index + 1}</span>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 text-red-400 hover:text-red-600 active:scale-90 transition-all"
                  disabled={items.length <= 1}
                >
                  <Trash2 size={18} />
                </button>
            </div>
            
            <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-50">Task Description</label>
                <textarea 
                    placeholder="What service are you providing?" 
                    value={item.description}
                    rows={2}
                    className="w-full bg-gray-50 rounded-xl p-4 text-sm font-medium border-none focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-50">Quantity</label>
                    <input 
                        type="number"
                        value={item.quantity}
                        className="w-full bg-gray-50 rounded-xl p-4 text-sm font-black border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-50">Unit Rate</label>
                    <input 
                        type="number"
                        value={item.price}
                        className="w-full bg-gray-50 rounded-xl p-4 text-sm font-black border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-3">
                   <span className="text-[9px] font-black uppercase text-text-secondary opacity-50">Tax %</span>
                   <input 
                        type="number"
                        value={item.taxPercent}
                        className="w-16 bg-gray-50/50 rounded-lg p-2 text-xs font-black border-none focus:ring-1 focus:ring-primary/20 outline-none"
                        onChange={(e) => handleItemChange(item.id, 'taxPercent', e.target.value)}
                    />
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black uppercase text-text-secondary opacity-50 mb-1">Line Subtotal</p>
                    <p className="text-lg font-black text-gray-900 tracking-tight">
                        {formatCurrency(calculateRowTotal(item.quantity, item.price, item.taxPercent), currency)}
                    </p>
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-gray-50/30 border-t border-gray-50">
        <Button 
            variant="secondary" 
            fullWidth 
            icon={Plus} 
            onClick={handleAddItem}
            className="bg-white border-dashed border-2 border-gray-200 hover:border-primary/50 text-text-secondary hover:text-primary font-black uppercase text-xs tracking-widest py-5 rounded-2xl"
        >
          Append New Work Item
        </Button>
      </div>
    </div>
  );
};

export default ItemsTable;
