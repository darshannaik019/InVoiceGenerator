import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  id: { type: String },
  description: { type: String },
  quantity: { type: Number },
  price: { type: Number },
  taxPercent: { type: Number, default: 0 }
});

const invoiceSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  invoiceNumber: { type: String, required: true },
  date: { type: String, required: true },
  dueDate: { type: String, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, default: 'pending' },
  businessLogo: { type: String },
  businessInfo: {
    name: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    taxId: { type: String },
  },
  clientInfo: {
    name: { type: String, required: true },
    contactName: { type: String },
    address: { type: String },
    email: { type: String },
    phone: { type: String },
  },
  items: [itemSchema],
  discount: { type: Number, default: 0 },
  isDiscountPercentage: { type: Boolean, default: true },
  notes: { type: String },
  terms: { type: String },
  isPublic: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
