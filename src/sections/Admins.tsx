import { useState } from 'react';
import { Plus, Edit2, Trash2, Lock, Unlock } from 'lucide-react';
import Modal from '../components/Modal';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  active: boolean;
  lastLogin: string;
}

export default function Admins() {
  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@admin.com',
      role: 'Super Admin',
      permissions: ['read', 'write', 'delete', 'manage_users'],
      active: true,
      lastLogin: '2024-11-06',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@admin.com',
      role: 'Admin',
      permissions: ['read', 'write', 'manage_users'],
      active: true,
      lastLogin: '2024-11-05',
    },
    {
      id: '3',
      name: 'Mike Brown',
      email: 'mike@admin.com',
      role: 'Moderator',
      permissions: ['read', 'write'],
      active: false,
      lastLogin: '2024-10-15',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Moderator' });

  const handleAddAdmin = () => {
    setSelectedAdmin(null);
    setFormData({ name: '', email: '', role: 'Moderator' });
    setShowModal(true);
  };

  const handleEditAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setFormData({ name: admin.name, email: admin.email, role: admin.role });
    setShowModal(true);
  };

  const handleSave = () => {
    if (selectedAdmin) {
      setAdmins(admins.map(admin => admin.id === selectedAdmin.id ? { ...admin, ...formData } : admin));
    } else {
      const newAdmin: Admin = {
        id: Date.now().toString(),
        ...formData,
        permissions: ['read', 'write'],
        active: true,
        lastLogin: new Date().toISOString().split('T')[0],
      };
      setAdmins([...admins, newAdmin]);
    }
    setShowModal(false);
  };

  const handleToggleActive = (id: string) => {
    setAdmins(admins.map(admin => admin.id === id ? { ...admin, active: !admin.active } : admin));
  };

  const handleDelete = (id: string) => {
    setAdmins(admins.filter(admin => admin.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Manage Admins</h3>
        <button
          onClick={handleAddAdmin}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      {/* Admin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white">{admin.name}</h4>
                <p className="text-slate-400 text-sm">{admin.email}</p>
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded">
                    {admin.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleToggleActive(admin.id)}
                className={`p-2 rounded transition ${
                  admin.active
                    ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                    : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                }`}
              >
                {admin.active ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </button>
            </div>

            <div className="mb-4 space-y-2">
              <p className="text-slate-400 text-xs">
                Last Login: <span className="text-slate-300">{admin.lastLogin}</span>
              </p>
              <div className="flex flex-wrap gap-1">
                {admin.permissions.map((perm) => (
                  <span key={perm} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                    {perm}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedAdmin(admin);
                  setShowDetailsModal(true);
                }}
                className="flex-1 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded transition text-sm"
              >
                View
              </button>
              <button
                onClick={() => handleEditAdmin(admin)}
                className="flex-1 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded transition text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(admin.id)}
                className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded transition text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedAdmin ? 'Edit Admin' : 'Add New Admin'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Admin Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter admin name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option>Moderator</option>
              <option>Admin</option>
              <option>Super Admin</option>
            </select>
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
        title="Admin Details"
      >
        {selectedAdmin && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400">Name</label>
              <p className="text-white mt-1">{selectedAdmin.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400">Email</label>
              <p className="text-white mt-1">{selectedAdmin.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400">Role</label>
              <p className="text-white mt-1">{selectedAdmin.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400">Permissions</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedAdmin.permissions.map((perm) => (
                  <span key={perm} className="px-3 py-1 bg-blue-600/30 text-blue-300 text-sm rounded">
                    {perm}
                  </span>
                ))}
              </div>
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
