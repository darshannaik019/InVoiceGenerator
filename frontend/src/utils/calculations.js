export const calculateRowTotal = (quantity, price, taxPercent) => {
  const q = parseFloat(quantity) || 0;
  const p = parseFloat(price) || 0;
  const t = parseFloat(taxPercent) || 0;
  const sub = q * p;
  const tax = sub * (t / 100);
  return sub + tax;
};

export const calculateTotals = (items, discount = 0, isDiscountPercentage = true) => {
  const safeItems = items || [];
  const d = parseFloat(discount) || 0;
  
  const subtotal = safeItems.reduce((acc, item) => {
    const q = parseFloat(item.quantity) || 0;
    const p = parseFloat(item.price) || 0;
    return acc + (q * p);
  }, 0);
  
  const totalTax = safeItems.reduce((acc, item) => {
    const q = parseFloat(item.quantity) || 0;
    const p = parseFloat(item.price) || 0;
    const t = parseFloat(item.taxPercent) || 0;
    const itemSub = q * p;
    return acc + (itemSub * (t / 100));
  }, 0);
  
  let discountAmount = 0;
  if (isDiscountPercentage) {
    discountAmount = subtotal * (d / 100);
  } else {
    discountAmount = d;
  }
  
  const grandTotal = subtotal + totalTax - discountAmount;
  
  return {
    subtotal,
    totalTax,
    discountAmount,
    grandTotal: Math.max(0, grandTotal),
  };
};

export const formatCurrency = (amount, currency = 'USD') => {
  const validAmount = isNaN(amount) ? 0 : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(validAmount);
};
