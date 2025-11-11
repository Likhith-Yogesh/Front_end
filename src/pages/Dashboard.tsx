import { useState } from 'react';
import { LogOut, ChevronDown, User } from 'lucide-react';
import Accounts from '../sections/Accounts';
import Admins from '../sections/Admins';
import Software from '../sections/Software';
import DataManagement from '../sections/DataManagement';
import ExamViewTable from '../sections/ExamViewTable';
import logo from '../static/inr-apps logo.png';
import backgroundImage from '../static/INR-Admin-Login.png';

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<'accounts' | 'admins' | 'software' | 'data' | 'pacs'>('accounts');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const menuItems = [
    { id: 'accounts', label: 'Accounts' },
    { id: 'admins', label: 'Admins'},
    { id: 'software', label: 'Software' },
    { id: 'data', label: 'Data Management' },
    { id: 'pacs', label: 'PACS' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      
      {/* Header - Full Width */}
      <div className="border-b border-slate-700 px-4 py-2 flex items-center justify-between" style={{ backgroundColor: '#171E22' }}>
        {/* left side - Logo */}
        <div className="flex items-center">
          <img src={logo} alt="INR Apps Logo" className="h-15 w-60" />
        </div>
        {/* right side - User Avatar */}
        <div className="flex items-center gap-4">
          {/* User Avatar with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <span className="text-white text-lg font-medium">Test User</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - Sidebar and Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800 border-r border-slate-700">
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
          {activeSection === 'accounts' && <Accounts />}
          {activeSection === 'admins' && <Admins />}
          {activeSection === 'software' && <Software />}
          {activeSection === 'data' && <DataManagement />}
          {activeSection === 'pacs' && <ExamViewTable />}
        </div>
      </div>
    </div>
  );
}
