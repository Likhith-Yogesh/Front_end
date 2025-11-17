import { useState, useEffect } from 'react';
import { Server, CheckCircle, RefreshCw, Clock, Globe, Plus, Edit, Trash2, TestTube2 } from 'lucide-react';
import Modal from '../components/Modal';

interface ModalityConfig {
  AET: string;
  Host: string;
  Port: number;
  Manufacturer: string;
  AllowEcho: boolean;
  AllowStore: boolean;
  AllowFind: boolean;
  AllowGet: boolean;
  AllowMove: boolean;
  AllowNAction: boolean;
  AllowNEventReport: boolean;
}

interface ModalityDisplay extends ModalityConfig {
  name: string;
  status: 'online' | 'offline' | 'testing';
  lastChecked?: string;
  responseTime?: number;
}

interface NewModalityForm {
  aet: string;
  host: string;
  port: string;
  manufacturer: string;
  allowEcho: boolean;
  allowStore: boolean;
  allowFind: boolean;
  allowGet: boolean;
  allowMove: boolean;
  allowNAction: boolean;
  allowNEventReport: boolean;
}

export default function SystemMonitor() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const [orthancUrl] = useState('/orthanc-api');
  const [modalities, setModalities] = useState<ModalityDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedModality, setSelectedModality] = useState<string | null>(null);
  
  const [newModality, setNewModality] = useState<NewModalityForm>({
    aet: '',
    host: '',
    port: '4242',
    manufacturer: 'Generic',
    allowEcho: true,
    allowStore: true,
    allowFind: true,
    allowGet: true,
    allowMove: true,
    allowNAction: false,
    allowNEventReport: false,
  });

  // Update clock
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Fetch modalities from Orthanc on load
  useEffect(() => {
    fetchModalities();
  }, []);

  // Fetch all modalities from Orthanc
  const fetchModalities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${orthancUrl}/modalities?expand`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch modalities');
      }

      const data = await response.json();
      
      const modalityList: ModalityDisplay[] = Object.keys(data).map((key) => {
        const config = data[key];
        return {
          name: key,
          AET: config[0] || config.AET || key,
          Host: config[1] || config.Host || 'Unknown',
          Port: config[2] || config.Port || 4242,
          Manufacturer: config[3] || config.Manufacturer || 'Generic',
          AllowEcho: true,
          AllowStore: true,
          AllowFind: true,
          AllowGet: true,
          AllowMove: true,
          AllowNAction: false,
          AllowNEventReport: false,
          status: 'offline' as const,
          lastChecked: undefined,
          responseTime: undefined,
        };
      });

      setModalities(modalityList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching modalities:', error);
      setLoading(false);
      alert('⚠️ Could not connect to Orthanc server. Make sure it is running.');
    }
  };

  // Create new modality
  const handleCreateModality = async () => {
    if (!newModality.aet || !newModality.host || !newModality.port) {
      alert('Please fill in all required fields (AET, Host, Port)');
      return;
    }

    try {
      const modalityConfig = [
        newModality.aet,
        newModality.host,
        parseInt(newModality.port),
        newModality.manufacturer
      ];

      const response = await fetch(`${orthancUrl}/modalities/${newModality.aet}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modalityConfig),
      });

      if (response.ok) {
        alert(`✅ Modality "${newModality.aet}" created successfully!`);
        setShowCreateModal(false);
        resetForm();
        fetchModalities();
      } else {
        const errorText = await response.text();
        alert(`❌ Failed to create modality: ${errorText}`);
      }
    } catch (error) {
      console.error('Error creating modality:', error);
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Network error'}`);
    }
  };

  // Edit modality
  const handleEditModality = async () => {
    if (!selectedModality) return;

    try {
      const modalityConfig = [
        newModality.aet,
        newModality.host,
        parseInt(newModality.port),
        newModality.manufacturer
      ];

      const response = await fetch(`${orthancUrl}/modalities/${selectedModality}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modalityConfig),
      });

      if (response.ok) {
        alert(`✅ Modality "${selectedModality}" updated successfully!`);
        setShowEditModal(false);
        setSelectedModality(null);
        resetForm();
        fetchModalities();
      } else {
        const errorText = await response.text();
        alert(`❌ Failed to update modality: ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating modality:', error);
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Network error'}`);
    }
  };

  // Delete modality
  const handleDeleteModality = async (aet: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete modality "${aet}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${orthancUrl}/modalities/${aet}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert(`✅ Modality "${aet}" deleted successfully!`);
        fetchModalities();
      } else {
        const errorText = await response.text();
        alert(`❌ Failed to delete modality: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting modality:', error);
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Network error'}`);
    }
  };

  // Test C-ECHO
  const handleTestEcho = async (aet: string) => {
    setModalities(prev => 
      prev.map(m => m.name === aet ? { ...m, status: 'testing' as const } : m)
    );

    try {
      const startTime = Date.now();
      const response = await fetch(`${orthancUrl}/modalities/${aet}/echo`, {
        method: 'POST',
      });

      const responseTime = Date.now() - startTime;

      if (response.ok) {
        setModalities(prev =>
          prev.map(m =>
            m.name === aet
              ? {
                  ...m,
                  status: 'online' as const,
                  lastChecked: new Date().toISOString(),
                  responseTime,
                }
              : m
          )
        );
        alert(`✅ C-ECHO Success!\n\nModality: ${aet}\nResponse Time: ${responseTime}ms`);
      } else {
        setModalities(prev =>
          prev.map(m =>
            m.name === aet
              ? {
                  ...m,
                  status: 'offline' as const,
                  lastChecked: new Date().toISOString(),
                  responseTime: 0,
                }
              : m
          )
        );
        const errorText = await response.text();
        alert(`❌ C-ECHO Failed!\n\nModality: ${aet}\nError: ${errorText}`);
      }
    } catch (error) {
      setModalities(prev =>
        prev.map(m =>
          m.name === aet
            ? {
                ...m,
                status: 'offline' as const,
                lastChecked: new Date().toISOString(),
              }
            : m
        )
      );
      console.error('Error testing C-ECHO:', error);
      alert(`❌ C-ECHO Error!\n\nModality: ${aet}\nError: ${error instanceof Error ? error.message : 'Network error'}`);
    }
  };

  // Open edit modal with pre-filled data
  const openEditModal = (modality: ModalityDisplay) => {
    setSelectedModality(modality.name);
    setNewModality({
      aet: modality.AET,
      host: modality.Host,
      port: modality.Port.toString(),
      manufacturer: modality.Manufacturer,
      allowEcho: modality.AllowEcho,
      allowStore: modality.AllowStore,
      allowFind: modality.AllowFind,
      allowGet: modality.AllowGet,
      allowMove: modality.AllowMove,
      allowNAction: modality.AllowNAction,
      allowNEventReport: modality.AllowNEventReport,
    });
    setShowEditModal(true);
  };

  // Reset form
  const resetForm = () => {
    setNewModality({
      aet: '',
      host: '',
      port: '4242',
      manufacturer: 'Generic',
      allowEcho: true,
      allowStore: true,
      allowFind: true,
      allowGet: true,
      allowMove: true,
      allowNAction: false,
      allowNEventReport: false,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return {
          bg: 'bg-green-500/20',
          text: 'text-green-300',
          border: 'border-green-500/40',
          dot: 'bg-green-500',
          label: 'Online',
        };
      case 'testing':
        return {
          bg: 'bg-blue-500/20',
          text: 'text-blue-300',
          border: 'border-blue-500/40',
          dot: 'bg-blue-500',
          label: 'Testing...',
        };
      case 'offline':
        return {
          bg: 'bg-slate-500/20',
          text: 'text-slate-400',
          border: 'border-slate-500/40',
          dot: 'bg-slate-500',
          label: 'Offline',
        };
      default:
        return {
          bg: 'bg-slate-500/20',
          text: 'text-slate-400',
          border: 'border-slate-500/40',
          dot: 'bg-slate-500',
          label: 'Unknown',
        };
    }
  };

  const onlineModalities = modalities.filter(m => m.status === 'online').length;
  const totalModalities = modalities.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold text-white mb-1">System Monitor</h3>
          <p className="text-slate-400 text-sm">DICOM Modality Management with Orthanc API</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
          >
            <Plus className="w-4 h-4" />
            Create Modality
          </button>
          <button
            onClick={fetchModalities}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-white font-mono">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Overview Cards - KEEPING ONLY Total and Online */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-500/30 rounded-lg">
              <Server className="w-6 h-6 text-blue-300" />
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-xs font-medium">Total Modalities</p>
              <p className="text-3xl font-bold text-white">{totalModalities}</p>
            </div>
          </div>
          <div className="h-1 bg-blue-500/30 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 w-full" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-500/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-300" />
            </div>
            <div className="text-right">
              <p className="text-green-200 text-xs font-medium">Online</p>
              <p className="text-3xl font-bold text-white">{onlineModalities}</p>
            </div>
          </div>
          <div className="h-1 bg-green-500/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400"
              style={{ width: totalModalities > 0 ? `${(onlineModalities / totalModalities) * 100}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* Modalities List */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white">DICOM Modalities from Orthanc</h4>
                <p className="text-slate-400 text-sm">{totalModalities} devices configured</p>
              </div>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-blue-300">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {modalities.length === 0 && !loading ? (
            <div className="text-center py-12">
              <Server className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">No modalities configured</p>
              <p className="text-slate-500 text-sm mb-4">Create your first DICOM modality to get started</p>
              <button
                onClick={() => {
                  resetForm();
                  setShowCreateModal(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Create First Modality
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {modalities.map((modality) => {
                const statusInfo = getStatusBadge(modality.status);
                return (
                  <div
                    key={modality.name}
                    className={`group relative bg-slate-900/50 rounded-lg p-4 border-2 ${statusInfo.border} hover:shadow-lg transition-all duration-200`}
                  >
                    {/* Status Indicator */}
                    <div className="absolute top-3 right-3">
                      <div
                        className={`w-3 h-3 rounded-full ${statusInfo.dot} ${
                          modality.status === 'online' || modality.status === 'testing' ? 'animate-pulse' : ''
                        }`}
                      />
                    </div>

                    {/* Header */}
                    <div className="mb-3">
                      <p className="text-white font-semibold text-lg mb-1">{modality.name}</p>
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 ${statusInfo.bg} ${statusInfo.text} rounded text-xs font-medium`}
                      >
                        {statusInfo.label}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4 pt-3 border-t border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs">AET:</span>
                        <span className="text-slate-300 text-xs font-mono">{modality.AET}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs">Host:</span>
                        <span className="text-slate-300 text-xs font-mono">{modality.Host}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs">Port:</span>
                        <span className="text-slate-300 text-xs font-mono">{modality.Port}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs">Manufacturer:</span>
                        <span className="text-slate-300 text-xs">{modality.Manufacturer}</span>
                      </div>
                      {modality.lastChecked && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-xs">Last Check:</span>
                          <span className="text-slate-300 text-xs">
                            {new Date(modality.lastChecked).toLocaleTimeString()}
                          </span>
                        </div>
                      )}
                      {modality.responseTime !== undefined && modality.responseTime > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-xs">Response:</span>
                          <span className="text-green-400 text-xs font-mono">{modality.responseTime}ms</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleTestEcho(modality.name)}
                        disabled={modality.status === 'testing'}
                        className="flex items-center justify-center gap-1 px-2 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded transition text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <TestTube2 className="w-3 h-3" />
                        <span>Test</span>
                      </button>
                      <button
                        onClick={() => openEditModal(modality)}
                        className="flex items-center justify-center gap-1 px-2 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 rounded transition text-xs"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteModality(modality.name)}
                        className="flex items-center justify-center gap-1 px-2 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded transition text-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Modality Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create DICOM Modality">
        <div className="space-y-4">
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Server className="w-4 h-4" />
              Basic Information
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  AET (Application Entity Title) *
                </label>
                <input
                  type="text"
                  value={newModality.aet}
                  onChange={(e) => setNewModality({ ...newModality, aet: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="E3D_TRACK_OR3"
                  maxLength={16}
                />
                <p className="text-slate-500 text-xs mt-1">Max 16 characters, uppercase recommended</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Host (IP Address) *</label>
                  <input
                    type="text"
                    value={newModality.host}
                    onChange={(e) => setNewModality({ ...newModality, host: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="192.168.1.100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Port *</label>
                  <input
                    type="number"
                    value={newModality.port}
                    onChange={(e) => setNewModality({ ...newModality, port: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="4242"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Manufacturer</label>
                <input
                  type="text"
                  value={newModality.manufacturer}
                  onChange={(e) => setNewModality({ ...newModality, manufacturer: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Generic"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowCreateModal(false)}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateModality}
              disabled={!newModality.aet || !newModality.host || !newModality.port}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Modality
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modality Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedModality(null);
        }}
        title={`Edit Modality: ${selectedModality}`}
      >
        <div className="space-y-4">
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Server className="w-4 h-4" />
              Modality Configuration
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  AET (Application Entity Title) *
                </label>
                <input
                  type="text"
                  value={newModality.aet}
                  onChange={(e) => setNewModality({ ...newModality, aet: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="E3D_TRACK_OR3"
                  maxLength={16}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Host (IP Address) *</label>
                  <input
                    type="text"
                    value={newModality.host}
                    onChange={(e) => setNewModality({ ...newModality, host: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="192.168.1.100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Port *</label>
                  <input
                    type="number"
                    value={newModality.port}
                    onChange={(e) => setNewModality({ ...newModality, port: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="4242"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Manufacturer</label>
                <input
                  type="text"
                  value={newModality.manufacturer}
                  onChange={(e) => setNewModality({ ...newModality, manufacturer: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Generic"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedModality(null);
              }}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleEditModality}
              disabled={!newModality.aet || !newModality.host || !newModality.port}
              className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Modality
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}