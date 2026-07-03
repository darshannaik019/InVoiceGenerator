import api from './api';

export const saveInvoice = async (userId, invoiceData) => {
  try {
    const cleanData = { ...invoiceData };
    const id = cleanData.id || cleanData._id;

    // Remove database metadata to avoid Mongoose immutability errors
    delete cleanData.id;
    delete cleanData._id;
    delete cleanData.__v;
    delete cleanData.createdAt;
    delete cleanData.updatedAt;
    delete cleanData.userId;

    if (id && !id.includes('temp-')) {
      // Update existing
      const { data } = await api.put(`/invoices/${id}`, cleanData);
      return data._id || data.id;
    } else {
      // Create new
      const { data } = await api.post('/invoices', cleanData);
      return data._id || data.id;
    }
  } catch (error) {
    console.error("Error saving invoice: ", error);
    throw error;
  }
};

export const getInvoices = async (userId) => {
  try {
    // Backend filters by userId via JWT token automatically via protect middleware
    const { data } = await api.get('/invoices');
    return data.map(invoice => ({
      ...invoice,
      id: invoice._id,
    }));
  } catch (error) {
    console.error("Error getting invoices: ", error);
    throw error;
  }
};

export const getInvoiceById = async (id) => {
  try {
    const { data } = await api.get(`/invoices/${id}`);
    return {
      ...data,
      id: data._id
    };
  } catch (error) {
    console.error("Error getting invoice: ", error);
    throw error;
  }
};

export const updateInvoiceStatus = async (id, status) => {
  try {
    const { data } = await api.put(`/invoices/${id}`, { status });
    return data;
  } catch (error) {
    console.error("Error updating invoice status: ", error);
    throw error;
  }
};

export const togglePublicStatus = async (id, isPublic) => {
  try {
    const { data } = await api.put(`/invoices/${id}`, { isPublic });
    return data;
  } catch (error) {
    console.error("Error toggling public status: ", error);
    throw error;
  }
};

export const getPublicInvoiceById = async (id) => {
  try {
    // Assuming the backend has the same endpoint but handles public visibility 
    // or you could create a specific /api/invoices/public/:id route
    const { data } = await api.get(`/invoices/${id}`);
    if (data.isPublic) {
      return {
        ...data,
        id: data._id
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting public invoice: ", error);
    throw error;
  }
};

export const deleteInvoice = async (id) => {
  try {
    await api.delete(`/invoices/${id}`);
  } catch (error) {
    console.error("Error deleting invoice: ", error);
    throw error;
  }
};
