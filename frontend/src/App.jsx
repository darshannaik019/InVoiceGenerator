import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FileText, Settings as SettingsIcon, X, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import InvoiceForm from './pages/InvoiceForm';
import InvoicePreview from './pages/InvoicePreview';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const SidebarLink = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-primary text-text-primary font-semibold' 
          : 'text-text-secondary hover:bg-primary-light hover:text-primary-dark'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

const AppContent = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-primary p-4 rounded-2xl shadow-xl shadow-primary/20 animate-bounce">
            <FileText className="text-white" size={40} />
          </div>
          <p className="font-bold text-text-secondary animate-pulse tracking-widest text-sm uppercase">Synchronizing Workspace...</p>
        </div>
      </div>
    );
  }

  const isPublicRoute = location.pathname.startsWith('/view/');

  if (!user && !isPublicRoute && location.pathname !== '/auth') {
    return <Auth />;
  }

  if (user && location.pathname === '/auth') {
    return <Routes><Route path="*" element={<Dashboard />} /></Routes>;
  }

  return (
    <div className="flex min-h-screen bg-background w-screen overflow-x-hidden relative">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on mobile, Static on desktop */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-surface border-r border-gray-100 p-8 flex flex-col print:hidden shadow-2xl lg:shadow-none z-[70]
        transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        lg:static lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3 transition-transform hover:scale-105 cursor-default">
            <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20">
              <FileText className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900 uppercase">InVoice<span className="text-primary italic">Gen</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-600 transition-all active:scale-90">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-2">
          <div className="px-3 mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40">Navigator</p>
          </div>
          <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" />
          <SidebarLink to="/create" icon={PlusCircle} label="Create Invoice" />
        </nav>
        
        <div className="pt-8 border-t border-gray-50 space-y-2">
          <div className="px-3 mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40">Preferences</p>
          </div>
          <SidebarLink to="/settings" icon={SettingsIcon} label="Settings" />
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-4 rounded-xl transition-all text-red-500 hover:bg-red-50 font-black text-xs mt-6 group bg-gray-50/50"
          >
            <div className="p-2 bg-white rounded-lg group-hover:bg-red-100 transition-colors shadow-sm">
                <LogOut size={16} />
            </div>
            <span className="uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content - Takes full width on mobile, remains flexible on desktop */}
      <main className="flex-1 w-full min-w-0 overflow-y-auto px-4 sm:px-6 lg:p-12 pb-24">
        <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard toggleSidebar={toggleSidebar} />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/create" element={<InvoiceForm />} />
              <Route path="/edit/:id" element={<InvoiceForm />} />
              <Route path="/preview/:id" element={<InvoicePreview />} />
              <Route path="/view/:id" element={<InvoicePreview isPublicView={true} />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
