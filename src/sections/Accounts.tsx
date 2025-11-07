import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import Modal from '../components/Modal';

interface Account {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', name: 'Acme Corp', email: 'contact@acme.com', status: 'active', createdAt: '2024-01-15' },
    { id: '2', name: 'Tech Solutions', email: 'info@techsol.com', status: 'active', createdAt: '2024-02-20' },
  ]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleAddAccount = () => {
    setSelectedAccount(null);
    setFormData({ name: '', email: '' });
    setShowModal(true);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setFormData({ name: account.name, email: account.email });
    setShowModal(true);
  };

  const handleSave = () => {
    if (selectedAccount) {
      setAccounts(accounts.map(acc => acc.id === selectedAccount.id ? { ...acc, ...formData } : acc));
    } else {
      const newAccount: Account = {
        id: Date.now().toString(),
        ...formData,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setAccounts([...accounts, newAccount]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Manage Accounts</h3>
        <button
          onClick={handleAddAccount}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add Account
        </button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-white">{account.name}</h4>
                <p className="text-slate-400 text-sm">{account.email}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  account.status === 'active'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-red-500/20 text-red-300'
                }`}
              >
                {account.status}
              </span>
            </div>

            <p className="text-slate-400 text-xs mb-4">Created: {account.createdAt}</p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedAccount(account);
                  setShowDetailsModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded transition text-sm"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button
                onClick={() => handleEditAccount(account)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded transition text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(account.id)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded transition text-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedAccount ? 'Edit Account' : 'Add New Account'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Account Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter account name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter email address"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Account Details"
      >
        {selectedAccount && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400">Name</label>
              <p className="text-white mt-1">{selectedAccount.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400">Email</label>
              <p className="text-white mt-1">{selectedAccount.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400">Status</label>
              <p className="text-white mt-1 capitalize">{selectedAccount.status}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400">Created</label>
              <p className="text-white mt-1">{selectedAccount.createdAt}</p>
            </div>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
