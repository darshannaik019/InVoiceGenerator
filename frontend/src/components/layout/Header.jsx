import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Menu, X, Check, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ title, toggleSidebar }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, text: 'Welcome to InVoiceGen!', time: 'Just now', type: 'info' },
    { id: 2, text: 'Your last invoice was generated correctly.', time: '2h ago', type: 'success' },
  ];

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4 px-2 sm:px-0">
      <div className="flex items-center justify-between w-full lg:w-auto">
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-3 bg-white border border-gray-100 rounded-2xl text-text-secondary hover:text-primary transition-all shadow-md active:scale-95"
          >
            <Menu size={24} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 leading-tight">{title}</h1>
            <div className="hidden sm:flex items-center space-x-2 mt-1">
              <p className="text-xs text-text-secondary font-medium uppercase tracking-widest opacity-50">Professional Billing Suite</p>
              <span className="flex items-center space-x-1 text-[9px] font-black bg-green-50 text-green-600 px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm border border-green-100">
                <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                <span>Active</span>
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Actions Overlay */}
        <div className="lg:hidden flex items-center space-x-3">
          <div className="relative" ref={notificationRef}>
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-full transition-all duration-300 shadow-sm relative ${showNotifications ? 'bg-primary text-text-primary' : 'bg-white border border-gray-100 text-text-secondary'}`}
            >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm"></span>
            </button>
            
            {showNotifications && (
                <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Notifications</span>
                        <span className="text-[10px] font-bold text-primary hover:underline cursor-pointer">Clear all</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.map(n => (
                            <div key={n.id} className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 flex items-start space-x-3">
                                <div className={`mt-0.5 p-1 rounded-full ${n.type === 'info' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                    {n.type === 'info' ? <Info size={12} /> : <Check size={12} />}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900 leading-tight">{n.text}</p>
                                    <p className="text-[10px] text-text-secondary mt-1">{n.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl border-2 border-white shadow-lg flex items-center justify-center text-white">
            <User size={20} />
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 w-full lg:w-auto">
        <div className="relative group flex-1 lg:flex-none">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search across history..." 
            className="pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm w-full lg:w-72 font-medium"
          />
        </div>
        
        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2.5 rounded-full transition-all duration-300 shadow-sm relative ${showNotifications ? 'bg-primary text-text-primary scale-110' : 'bg-white border border-gray-100 text-text-secondary hover:text-primary'}`}
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-text-secondary">Notifications</span>
                  <span className="text-[10px] font-bold text-primary hover:underline cursor-pointer">Clear all</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 flex items-start space-x-3">
                      <div className={`mt-0.5 p-1 rounded-full ${n.type === 'info' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                        {n.type === 'info' ? <Info size={12} /> : <Check size={12} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 leading-tight">{n.text}</p>
                        <p className="text-[10px] text-text-secondary mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-100 ml-2">
            <div className="text-right">
              <p className="text-sm font-black text-gray-900 leading-none">{user?.displayName || 'Business Owner'}</p>
              <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mt-1">Admin Account</p>
            </div>
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary-dark rounded-xl border-2 border-white shadow-xl flex items-center justify-center text-white rotate-3 hover:rotate-0 transition-all duration-300">
              <User size={22} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
