import api from './api';

export const saveUserSettings = async (userId, settingsData) => {
  try {
    const { data } = await api.put('/settings', settingsData);
    return data;
  } catch (error) {
    console.error("Error saving settings: ", error);
    throw error;
  }
};

export const getUserSettings = async (userId) => {
  try {
    const { data } = await api.get('/settings');
    return data;
  } catch (error) {
    console.error("Error getting settings: ", error);
    throw error;
  }
};
