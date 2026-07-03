import React from 'react';
import { calculateTotals, formatCurrency } from '../../utils/calculations';

const InvoiceTemplate = React.forwardRef(({ invoice }, ref) => {
  const { subtotal, totalTax, discountAmount, grandTotal } = calculateTotals(
    invoice.items, 
    invoice.discount, 
    invoice.isDiscountPercentage
  );

  return (
    <div 
      ref={ref} 
      className="bg-white p-12 shadow-2xl rounded-sm max-w-[800px] mx-auto text-text-primary print:shadow-none print:p-8"
      id="invoice-template"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div className="space-y-4">
          {invoice.businessLogo ? (
            <img src={invoice.businessLogo} alt="Logo" className="h-16 w-auto object-contain" />
          ) : (
            <div className="bg-primary text-white px-4 py-2 rounded-xl font-black text-2xl inline-block shadow-md">
              {invoice.businessInfo.name?.substring(0, 2).toUpperCase() || 'IG'}
            </div>
          )}
          <div className="space-y-1">
            <h2 className="text-xl font-bold">{invoice.businessInfo.name || 'Your Business'}</h2>
            <p className="text-sm text-text-secondary whitespace-pre-wrap">{invoice.businessInfo.address}</p>
            <p className="text-sm text-text-secondary">{invoice.businessInfo.phone}</p>
            <p className="text-sm text-text-secondary">{invoice.businessInfo.email}</p>
            {invoice.businessInfo.taxId && (
              <p className="text-sm text-text-secondary mt-1 font-semibold">GST/Tax ID: {invoice.businessInfo.taxId}</p>
            )}
          </div>
        </div>
        
        <div className="text-right space-y-2">
          <h1 className="text-5xl font-black text-primary mb-4 opacity-20 select-none">INVOICE</h1>
          <div className="space-y-1">
            <p className="text-sm font-bold text-text-secondary">INVOICE NUMBER</p>
            <p className="text-lg font-black font-mono">#{invoice.invoiceNumber}</p>
          </div>
          <div className="pt-2">
            <p className="text-sm font-bold text-text-secondary">DATE</p>
            <p className="text-sm font-semibold">{new Date(invoice.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
          </div>
          <div className="pt-2">
            <p className="text-sm font-bold text-text-secondary">DUE DATE</p>
            <p className="text-sm font-semibold text-red-500">{new Date(invoice.dueDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-primary mb-12 rounded-full opacity-30"></div>

      {/* Client Section */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-text-secondary border-b border-primary/20 pb-2 inline-block">Bill To</h3>
          <div className="space-y-1">
            <p className="text-lg font-bold">{invoice.clientInfo.name || 'Client Name'}</p>
            {invoice.clientInfo.contactName && <p className="text-sm font-medium">{invoice.clientInfo.contactName}</p>}
            <p className="text-sm text-text-secondary whitespace-pre-wrap">{invoice.clientInfo.address}</p>
            <p className="text-sm text-text-secondary">{invoice.clientInfo.email}</p>
            <p className="text-sm text-text-secondary">{invoice.clientInfo.phone}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-bold text-text-secondary">Payment Status</p>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter ${
              invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {invoice.status}
            </span>
          </div>
          <div className="space-y-1">
             <p className="text-sm font-bold text-text-secondary">Amount Due</p>
             <p className="text-3xl font-black text-text-primary">{formatCurrency(grandTotal, invoice.currency)}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-12">
        <thead className="bg-primary/10">
          <tr className="text-left text-xs font-black uppercase tracking-tighter text-text-primary">
            <th className="py-3 px-4 rounded-l-lg">Description</th>
            <th className="py-3 px-4 text-center">Qty</th>
            <th className="py-3 px-4 text-right">Price</th>
            <th className="py-3 px-4 text-center">Tax</th>
            <th className="py-3 px-4 text-right rounded-r-lg">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {invoice.items.map((item, idx) => (
            <tr key={item.id} className="text-sm">
              <td className="py-5 px-4 font-semibold">{item.description || 'Service Description'}</td>
              <td className="py-5 px-4 text-center">{item.quantity}</td>
              <td className="py-5 px-4 text-right">{formatCurrency(item.price, invoice.currency)}</td>
              <td className="py-5 px-4 text-center text-text-secondary">{item.taxPercent}%</td>
              <td className="py-5 px-4 text-right font-bold">
                {formatCurrency(item.quantity * item.price * (1 + item.taxPercent/100), invoice.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer / Totals */}
      <div className="flex justify-between items-start gap-12">
        <div className="flex-1 space-y-6">
          {invoice.notes && (
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-text-secondary">Notes</h4>
              <p className="text-sm text-text-secondary leading-relaxed bg-gray-50 p-4 rounded-lg italic">
                {invoice.notes}
              </p>
            </div>
          )}
          {invoice.terms && (
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-text-secondary">Terms & Conditions</h4>
              <p className="text-xs text-text-secondary leading-tight">
                {invoice.terms}
              </p>
            </div>
          )}
        </div>
        
        <div className="w-64 space-y-3 pt-4">
          <div className="flex justify-between text-sm text-text-secondary">
            <span>Subtotal</span>
            <span className="font-semibold text-text-primary">{formatCurrency(subtotal, invoice.currency)}</span>
          </div>
          <div className="flex justify-between text-sm text-text-secondary">
            <span>Tax Total</span>
            <span className="font-semibold text-text-primary">{formatCurrency(totalTax, invoice.currency)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-red-500">
              <span>Discount</span>
              <span className="font-semibold">-{formatCurrency(discountAmount, invoice.currency)}</span>
            </div>
          )}
          <div className="pt-4 border-t-2 border-primary/20 flex justify-between items-center">
            <span className="text-lg font-black">Grand Total</span>
            <span className="text-2xl font-black text-primary-dark">
              {formatCurrency(grandTotal, invoice.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Very bottom footer */}
      <div className="mt-20 pt-8 border-t border-gray-100 text-center space-y-1">
        <p className="text-sm font-bold text-text-secondary">Thank you for your business!</p>
        <p className="text-xs text-text-secondary opacity-50">Generated by InVoiceGen</p>
      </div>
    </div>
  );
});

export default InvoiceTemplate;
