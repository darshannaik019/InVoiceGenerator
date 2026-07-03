import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import Input from '../ui/Input';

const BusinessInfoSection = ({ businessInfo, businessLogo, dispatch }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({ type: 'UPDATE_FIELD', field: 'businessLogo', value: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    dispatch({ type: 'UPDATE_FIELD', field: 'businessLogo', value: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleInputChange = (field, value) => {
    dispatch({ type: 'UPDATE_BUSINESS_INFO', field, value });
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-6 border-b border-gray-100 pb-4">Business Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Logo Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-text-secondary">Business Logo</label>
          <div 
            className={`relative border-2 border-dashed rounded-xl transition-all h-36 flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
              businessLogo ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary hover:bg-gray-50'
            }`}
            onClick={() => !businessLogo && fileInputRef.current.click()}
          >
            {businessLogo ? (
              <>
                <img src={businessLogo} alt="Logo" className="h-full w-full object-contain p-4" />
                <button 
                  onClick={(e) => { e.stopPropagation(); removeLogo(); }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <>
                <div className="bg-primary/10 p-3 rounded-full text-primary mb-2">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-medium">Click to upload logo</p>
                <p className="text-xs text-text-secondary mt-1">SVG, PNG, JPG (max 800x400px)</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
        </div>

        {/* Info Fields */}
        <div className="space-y-4">
          <Input 
            label="Business Name" 
            placeholder="e.g. Acme Corp" 
            value={businessInfo.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
          <Input 
            label="Email Address" 
            placeholder="hello@acme.com" 
            type="email"
            value={businessInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Input 
          label="Phone Number" 
          placeholder="+1 (555) 000-0000" 
          value={businessInfo.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
        />
        <Input 
          label="GST / Tax ID" 
          placeholder="Optional" 
          value={businessInfo.taxId}
          onChange={(e) => handleInputChange('taxId', e.target.value)}
        />
        <div className="md:col-span-1">
           <Input 
            label="Business Address" 
            placeholder="City, State, Country" 
            value={businessInfo.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoSection;
