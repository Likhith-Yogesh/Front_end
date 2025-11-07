import { useState } from 'react';
import { Plus, Edit2, Trash2, Download, Lock, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal';

interface Software {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'inactive' | 'beta';
  downloads: number;
  releaseDate: string;
  size: string;
}

export default function Software() {
  const [software, setSoftware] = useState<Software[]>([
    {
      id: '1',
      name: 'Cloud Manager Pro',
      version: '3.2.1',
      status: 'active',
      downloads: 15420,
      releaseDate: '2024-11-01',
      size: '245 MB',
    },
    {
      id: '2',
      name: 'Data Analytics Suite',
      version: '2.1.0',
      status: 'active',
      downloads: 8932,
      releaseDate: '2024-10-15',
      size: '892 MB',
    },
    {
      id: '3',
      name: 'Security Toolkit',
      version: '1.5.3',
      status: 'beta',
      downloads: 2341,
      releaseDate: '2024-10-20',
      size: '156 MB',
    },
    {
      id: '4',
      name: 'Legacy System',
      version: '1.0.0',
      status: 'inactive',
      downloads: 45123,
      releaseDate: '2023-01-10',
      size: '512 MB',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(null);
  const [formData, setFormData] = useState({ name: '', version: '', size: '' });

  const handleAddSoftware = () => {
    setSelectedSoftware(null);
    setFormData({ name: '', version: '', size: '' });
    setShowModal(true);
  };

  const handleEditSoftware = (soft: Software) => {
    setSelectedSoftware(soft);
    setFormData({ name: soft.name, version: soft.version, size: soft.size });
    setShowModal(true);
  };

  const handleSave = () => {
    if (selectedSoftware) {
      setSoftware(software.map(soft =>
        soft.id === selectedSoftware.id ? { ...soft, ...formData } : soft
      ));
    } else {
      const newSoftware: Software = {
        id: Date.now().toString(),
        ...formData,
        status: 'beta',
        downloads: 0,
        releaseDate: new Date().toISOString().split('T')[0],
      };
      setSoftware([...software, newSoftware]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setSoftware(software.filter(soft => soft.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300';
      case 'beta':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'inactive':
        return 'bg-slate-600/20 text-slate-400';
      default:
        return 'bg-slate-600/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Manage Software</h3>
        <button
          onClick={handleAddSoftware}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add Software
        </button>
      </div>

      {/* Software Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {software.map((soft) => (
          <div
            key={soft.id}
            className="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition flex flex-col"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-white truncate">{soft.name}</h4>
                <p className="text-slate-400 text-xs">v{soft.version}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2 ${getStatusColor(soft.status)}`}>
                {soft.status}
              </span>
            </div>

            <div className="space-y-2 mb-4 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Downloads:</span>
                <span className="text-white font-medium">{soft.downloads.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Size:</span>
                <span className="text-white font-medium">{soft.size}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Released:</span>
                <span className="text-white font-medium">{soft.releaseDate}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedSoftware(soft);
                  setShowDetailsModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded transition text-xs"
              >
                <Download className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleEditSoftware(soft)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded transition text-xs"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleDelete(soft.id)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded transition text-xs"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Beta Notice */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-yellow-300 font-semibold">Beta Software Warning</h4>
          <p className="text-yellow-200/70 text-sm mt-1">
            Beta versions may contain bugs and are not recommended for production use.
          </p>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedSoftware ? 'Edit Software' : 'Add New Software'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Software Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter software name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Version</label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g., 1.0.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Size</label>
            <input
              type="text"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g., 245 MB"
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
        title="Software Details"
      >
        {selectedSoftware && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400">Name</label>
              <p className="text-white mt-1">{selectedSoftware.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400">Version</label>
                <p className="text-white mt-1">{selectedSoftware.version}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400">Size</label>
                <p className="text-white mt-1">{selectedSoftware.size}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400">Status</label>
                <p className="text-white mt-1 capitalize">{selectedSoftware.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400">Downloads</label>
                <p className="text-white mt-1">{selectedSoftware.downloads.toLocaleString()}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400">Release Date</label>
              <p className="text-white mt-1">{selectedSoftware.releaseDate}</p>
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
