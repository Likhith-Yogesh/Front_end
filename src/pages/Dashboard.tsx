import { useState } from 'react';
import { LogOut, ChevronDown, User } from 'lucide-react';
import WorkList from '../sections/WorkList';
import PACS from '../sections/PACS';
import logo from '../static/inr-apps logo.png';
import Header from '../components/header';

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<'worklist' | 'pacs'>('pacs');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const menuItems = [  
    { id: 'worklist', label: 'WorkList' },    
    { id: 'pacs', label: 'PACS' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#263740' }}>
      
      {/* Header */}
      <Header application={<img src={logo} alt="INR Apps Logo" className="h-15 w-60" />} userName="Test User" onLogout={onLogout} />

      {/* Main Content Area - Sidebar and Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800 border-r-4 border-slate-700" style={{backgroundColor: '#263740'}}>
          <nav className="p-4 space-y-2"> 
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as typeof activeSection)}
                className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">                  
          {activeSection === 'worklist' && <WorkList />}          
          {activeSection === 'pacs' && <PACS />}
        </div>
      </div>
    </div>
  );
}