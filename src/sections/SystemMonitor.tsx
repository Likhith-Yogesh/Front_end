import { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity, Server, AlertTriangle, CheckCircle, Wifi, Monitor, RefreshCw, Clock, Globe, Layers, Zap, Network } from 'lucide-react';

interface ModalityStatus {
  name: string;
  aet: string;
  ipAddress: string;
  port: number;
  modalityType: 'E3D' | 'GPS' | 'EHUB';
  expectedStatus: 'online' | 'maintenance' | 'offline';
  location: string;
}

interface ServiceStatus {
  name: string;
  port: number;
  description: string;
  category: 'core' | 'tracking' | 'database';
}

export default function SystemMonitor() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [performanceMetrics, setPerformanceMetrics] = useState({
    memory: 0,
    cpuCores: 0,
    connection: 'Unknown',
  });

  // Multiple systems/locations
  const [systems] = useState([
    {
      location: 'Operating Room 1',
      modalities: [
        {
          name: 'E3D Tracking System',
          aet: 'E3D_TRACK_OR1',
          ipAddress: '192.168.1.100',
          port: 4242,
          modalityType: 'E3D' as const,
          expectedStatus: 'online' as const,
          location: 'OR1',
        },
        {
          name: 'GPS Navigation',
          aet: 'GPS_NAV_OR1',
          ipAddress: '192.168.1.101',
          port: 4242,
          modalityType: 'GPS' as const,
          expectedStatus: 'online' as const,
          location: 'OR1',
        },
        {
          name: 'EHUB Integration',
          aet: 'EHUB_SYS_OR1',
          ipAddress: '192.168.1.102',
          port: 4242,
          modalityType: 'EHUB' as const,
          expectedStatus: 'online' as const,
          location: 'OR1',
        },
      ],
    },
    {
      location: 'Operating Room 2',
      modalities: [
        {
          name: 'E3D Tracking System',
          aet: 'E3D_TRACK_OR2',
          ipAddress: '192.168.1.110',
          port: 4242,
          modalityType: 'E3D' as const,
          expectedStatus: 'online' as const,
          location: 'OR2',
        },
        {
          name: 'GPS Navigation',
          aet: 'GPS_NAV_OR2',
          ipAddress: '192.168.1.111',
          port: 4242,
          modalityType: 'GPS' as const,
          expectedStatus: 'maintenance' as const,
          location: 'OR2',
        },
        {
          name: 'EHUB Integration',
          aet: 'EHUB_SYS_OR2',
          ipAddress: '192.168.1.112',
          port: 4242,
          modalityType: 'EHUB' as const,
          expectedStatus: 'online' as const,
          location: 'OR2',
        },
      ],
    },
    {
      location: 'Testing Lab',
      modalities: [
        {
          name: 'E3D Tracking System',
          aet: 'E3D_TRACK_LAB',
          ipAddress: '192.168.1.120',
          port: 4242,
          modalityType: 'E3D' as const,
          expectedStatus: 'offline' as const,
          location: 'LAB',
        },
        {
          name: 'GPS Navigation',
          aet: 'GPS_NAV_LAB',
          ipAddress: '192.168.1.121',
          port: 4242,
          modalityType: 'GPS' as const,
          expectedStatus: 'online' as const,
          location: 'LAB',
        },
      ],
    },
  ]);

  const [expectedServices] = useState<ServiceStatus[]>([
    { name: 'Orthanc DICOM', port: 8042, description: 'Main server', category: 'core' },
    { name: 'Worklist SCP', port: 4242, description: 'Worklist', category: 'core' },
    { name: 'Modality Monitor', port: 5000, description: 'Device monitoring', category: 'tracking' },
    { name: 'Navigation Service', port: 3000, description: 'Nav system', category: 'tracking' },
    { name: 'PostgreSQL', port: 5432, description: 'Database', category: 'database' },
    { name: 'Redis Cache', port: 6379, description: 'Cache layer', category: 'database' },
  ]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    if (performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      setPerformanceMetrics({
        memory: memory.usedJSHeapSize / memory.jsHeapSizeLimit,
        cpuCores: navigator.hardwareConcurrency || 0,
        connection: (navigator as any).connection?.effectiveType || 'Unknown',
      });
    }

    return () => clearInterval(timeInterval);
  }, []);

  const getModalityIcon = (type: string) => {
    switch (type) {
      case 'E3D':
        return '🎯';
      case 'GPS':
        return '🧭';
      case 'EHUB':
        return '🔗';
      default:
        return '📡';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return {
          bg: 'bg-green-500/20',
          text: 'text-green-300',
          border: 'border-green-500/40',
          dot: 'bg-green-500',
          label: 'Expected Online',
        };
      case 'maintenance':
        return {
          bg: 'bg-yellow-500/20',
          text: 'text-yellow-300',
          border: 'border-yellow-500/40',
          dot: 'bg-yellow-500',
          label: 'Maintenance',
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core':
        return <Zap className="w-4 h-4" />;
      case 'tracking':
        return <Network className="w-4 h-4" />;
      case 'database':
        return <HardDrive className="w-4 h-4" />;
      default:
        return <Server className="w-4 h-4" />;
    }
  };

  const totalModalities = systems.reduce((acc, sys) => acc + sys.modalities.length, 0);
  const onlineModalities = systems.reduce(
    (acc, sys) => acc + sys.modalities.filter(m => m.expectedStatus === 'online').length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold text-white mb-1">System Monitor</h3>
          <p className="text-slate-400 text-sm">Multi-location DICOM device configuration</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30">
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">Config View</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-white font-mono">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-500/30 rounded-lg">
              <Layers className="w-6 h-6 text-blue-300" />
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-xs font-medium">Total Locations</p>
              <p className="text-3xl font-bold text-white">{systems.length}</p>
            </div>
          </div>
          <div className="h-1 bg-blue-500/30 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 w-full" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-500/30 rounded-lg">
              <Server className="w-6 h-6 text-purple-300" />
            </div>
            <div className="text-right">
              <p className="text-purple-200 text-xs font-medium">Total Modalities</p>
              <p className="text-3xl font-bold text-white">{totalModalities}</p>
            </div>
          </div>
          <div className="h-1 bg-purple-500/30 rounded-full overflow-hidden">
            <div className="h-full bg-purple-400 w-full" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-500/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-300" />
            </div>
            <div className="text-right">
              <p className="text-green-200 text-xs font-medium">Expected Online</p>
              <p className="text-3xl font-bold text-white">{onlineModalities}</p>
            </div>
          </div>
          <div className="h-1 bg-green-500/30 rounded-full overflow-hidden">
            <div className="h-full bg-green-400" style={{ width: `${(onlineModalities / totalModalities) * 100}%` }} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border border-orange-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-orange-500/30 rounded-lg">
              <Cpu className="w-6 h-6 text-orange-300" />
            </div>
            <div className="text-right">
              <p className="text-orange-200 text-xs font-medium">Browser Memory</p>
              <p className="text-3xl font-bold text-white">{(performanceMetrics.memory * 100).toFixed(0)}%</p>
            </div>
          </div>
          <div className="h-1 bg-orange-500/30 rounded-full overflow-hidden">
            <div className="h-full bg-orange-400" style={{ width: `${performanceMetrics.memory * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Systems by Location */}
      {systems.map((system, index) => (
        <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
          {/* Location Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">{system.location}</h4>
                  <p className="text-slate-400 text-sm">{system.modalities.length} DICOM devices configured</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {system.modalities.filter(m => m.expectedStatus === 'online').length === system.modalities.length ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-300 rounded-lg border border-green-500/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium">All Expected Online</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg border border-slate-600">
                    <span className="text-xs font-medium">
                      {system.modalities.filter(m => m.expectedStatus === 'online').length}/{system.modalities.length} Expected Online
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modalities Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {system.modalities.map((modality) => {
                const statusInfo = getStatusBadge(modality.expectedStatus);
                return (
                  <div
                    key={modality.aet}
                    className={`group relative bg-slate-900/50 rounded-lg p-4 border-2 ${statusInfo.border} hover:shadow-lg hover:scale-[1.02] transition-all duration-200`}
                  >
                    {/* Status Indicator */}
                    <div className="absolute top-3 right-3">
                      <div className={`w-3 h-3 rounded-full ${statusInfo.dot} ${modality.expectedStatus === 'online' ? 'animate-pulse' : ''}`} />
                    </div>

                    {/* Icon */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-3 ${statusInfo.bg} rounded-lg text-2xl`}>
                        {getModalityIcon(modality.modalityType)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm mb-1">{modality.name}</p>
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 ${statusInfo.bg} ${statusInfo.text} rounded text-xs font-medium`}>
                          {statusInfo.label}
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mt-4 pt-3 border-t border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs">AET:</span>
                        <span className="text-slate-300 text-xs font-mono">{modality.aet}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs">IP Address:</span>
                        <span className="text-slate-300 text-xs font-mono">{modality.ipAddress}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs">Port:</span>
                        <span className="text-slate-300 text-xs font-mono">{modality.port}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs">Type:</span>
                        <span className="text-slate-300 text-xs font-semibold">{modality.modalityType}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      {/* Services Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expected Services */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            PACS Services Configuration
          </h4>
          <div className="space-y-2">
            {expectedServices.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    service.category === 'core' ? 'bg-blue-500/20 text-blue-400' :
                    service.category === 'tracking' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {getCategoryIcon(service.category)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{service.name}</p>
                    <p className="text-slate-400 text-xs">{service.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs font-mono">:{service.port}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-green-400" />
            Browser Environment
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300 text-sm">CPU Cores</span>
              </div>
              <span className="text-white font-semibold">{performanceMetrics.cpuCores}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300 text-sm">JS Heap Usage</span>
              </div>
              <span className="text-white font-semibold">{(performanceMetrics.memory * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-slate-300 text-sm">Connection</span>
              </div>
              <span className="text-white font-semibold">{performanceMetrics.connection}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-400" />
                <span className="text-slate-300 text-sm">Online Status</span>
              </div>
              <span className="text-white font-semibold">{navigator.onLine ? '✅ Online' : '❌ Offline'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-300 text-sm">Platform</span>
              </div>
              <span className="text-white font-semibold text-xs">{navigator.platform}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-blue-900/30 border-2 border-blue-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/20 rounded-lg flex-shrink-0">
            <Monitor className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-blue-300 font-semibold text-lg mb-2">Live Monitoring Integration</h4>
            <p className="text-blue-200/70 text-sm leading-relaxed mb-3">
              This dashboard displays the expected system configuration. To enable real-time monitoring of DICOM modalities, 
              implement backend integration using one of these approaches:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <p className="text-white font-semibold text-sm mb-1">🔌 REST API</p>
                <p className="text-slate-400 text-xs">Poll Orthanc endpoints for C-ECHO results</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <p className="text-white font-semibold text-sm mb-1">⚡ WebSocket</p>
                <p className="text-slate-400 text-xs">Real-time status updates via socket connection</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <p className="text-white font-semibold text-sm mb-1">🔧 XML-RPC</p>
                <p className="text-slate-400 text-xs">Direct communication with robots</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}