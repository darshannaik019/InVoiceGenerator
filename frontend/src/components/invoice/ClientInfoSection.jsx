import React from 'react';
import Input from '../ui/Input';

const ClientInfoSection = ({ clientInfo, dispatch }) => {
  const handleInputChange = (field, value) => {
    dispatch({ type: 'UPDATE_CLIENT_INFO', field, value });
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-6 border-b border-gray-100 pb-4">Client Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Client Business Name" 
          placeholder="e.g. Global Solutions" 
          className="md:col-span-2"
          value={clientInfo.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
        <Input 
          label="Contact Person" 
          placeholder="Jane Smith" 
          value={clientInfo.contactName}
          onChange={(e) => handleInputChange('contactName', e.target.value)}
        />
        <Input 
          label="Email Address" 
          placeholder="jane@globalsol.com" 
          type="email"
          value={clientInfo.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
        <Input 
          label="Phone Number" 
          placeholder="+1 (555) 123-4567" 
          value={clientInfo.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
        />
        <Input 
          label="Client Address" 
          placeholder="Full address" 
          value={clientInfo.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
      </div>
    </div>
  );
};

export default ClientInfoSection;
