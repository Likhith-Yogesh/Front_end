import { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'accounts', label: 'Accounts' },
    { id: 'admins', label: 'Admins'},
    { id: 'software', label: 'Software' },
    { id: 'data', label: 'Data Management' },
    { id: 'pacs', label: 'PACS' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex">
      
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-slate-800 border-r border-slate-700 transition-all duration-300 overflow-hidden`}
      >
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <img src={logo} alt="INR Apps Logo" className="h-16 w-auto" />
          </div>
        </div>  

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

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 w-64">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-300 hover:text-white transition"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h2 className="text-xl font-semibold text-white">
            {menuItems.find((item) => item.id === activeSection)?.label}
          </h2>
          <div className="w-6" />
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
