import React, { useState, useEffect } from 'react';
import { Save, Building2, Mail, Phone, MapPin, Hash, Image as ImageIcon, CheckCircle2, Loader2 } from 'lucide-react';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { saveUserSettings, getUserSettings } from '../services/settingsService';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    businessName: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    logo: null
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      try {
        const data = await getUserSettings(user.uid);
        if (data) {
          setSettings(state => ({ ...state, ...data }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setSuccess(false);
    try {
      await saveUserSettings(user.uid, settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-text-secondary font-medium tracking-widest text-xs">LOADING PROFILE...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <Header title="Settings" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-lg font-bold mb-2">Business Profile</h2>
          <p className="text-sm text-text-secondary">
            This information will be used as the default sender details for all your invoices.
          </p>
          
          <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10">
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-primary-dark">Logo Preview</h3>
            <div className="aspect-square bg-white rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
              {settings.logo ? (
                <img src={settings.logo} alt="Logo" className="w-full h-full object-contain p-4" />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="mx-auto text-gray-300 mb-2" size={32} />
                  <p className="text-xs text-gray-400 font-medium">No logo uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="card space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Input
                label="Business Name"
                name="businessName"
                value={settings.businessName}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
                icon={Building2}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  placeholder="hello@acme.com"
                  icon={Mail}
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  icon={Phone}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-text-primary ml-1 uppercase tracking-tight">
                  Business Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full pl-10 pr-4 py-3 border border-gray-100 bg-gray-50 rounded-xl text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                    placeholder="123 Business St, City, Country"
                  ></textarea>
                </div>
              </div>

              <Input
                label="GST / Tax ID (Optional)"
                name="taxId"
                value={settings.taxId}
                onChange={handleChange}
                placeholder="GSTIN12345678"
                icon={Hash}
              />

              <div className="space-y-1">
                <label className="block text-sm font-bold text-text-primary ml-1 uppercase tracking-tight">
                  Business Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-gray-100">
              {success ? (
                <div className="flex items-center text-green-600 font-semibold animate-in fade-in slide-in-from-left-4">
                  <CheckCircle2 className="mr-2" size={20} />
                  Settings saved successfully!
                </div>
              ) : <div></div>}
              
              <Button 
                type="submit" 
                variant="primary" 
                icon={saving ? Loader2 : Save} 
                disabled={saving}
                loading={saving}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
