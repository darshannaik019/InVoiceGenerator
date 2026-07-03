import { v4 as uuidv4 } from 'uuid';

export const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}${random}`;
};

export const createEmptyItem = () => ({
  id: uuidv4(),
  description: '',
  quantity: 1,
  price: 0,
  taxPercent: 0,
});

export const initialState = {
  invoiceNumber: generateInvoiceNumber(),
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currency: 'USD',
  status: 'pending',
  businessLogo: null,
  businessInfo: {
    name: '',
    address: '',
    phone: '',
    email: '',
    taxId: '',
  },
  clientInfo: {
    name: '',
    contactName: '',
    address: '',
    email: '',
    phone: '',
  },
  items: [createEmptyItem()],
  discount: 0,
  isDiscountPercentage: true,
  notes: '',
  terms: '',
};

export const invoiceReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'UPDATE_BUSINESS_INFO':
      return { ...state, businessInfo: { ...state.businessInfo, [action.field]: action.value } };
    case 'UPDATE_CLIENT_INFO':
      return { ...state, clientInfo: { ...state.clientInfo, [action.field]: action.value } };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, createEmptyItem()] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.id) };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.id ? { ...item, [action.field]: action.value } : item
        )
      };
    case 'SET_INVOICE':
      return { ...action.invoice };
    case 'RESET':
      return { ...initialState, invoiceNumber: generateInvoiceNumber() };
    default:
      return state;
  }
};
