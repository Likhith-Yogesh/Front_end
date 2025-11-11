import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Activity, Zap, AlertTriangle, CheckCircle, Radio, Box } from 'lucide-react';

interface RobotDevice {
  id: string;
  name: string;
  type: 'ehub' | '3d-robot';
  connected: boolean;
  ipAddress: string;
  port: number;
  lastHeartbeat: string;
  responseTime: number;
  firmware: string;
  status: 'online' | 'offline' | 'warning';
  signalStrength: number;
}

export default function SystemMonitor() {
  const [devices, setDevices] = useState<RobotDevice[]>([
    {
      id: '1',
      name: 'eHub Controller',
      type: 'ehub',
      connected: true,
      ipAddress: '192.168.1.100',
      port: 8080,
      lastHeartbeat: new Date().toISOString(),
      responseTime: 23,
      firmware: 'v4.2.1',
      status: 'online',
      signalStrength: 95,
    },
    {
      id: '2',
      name: 'SPINE 3D Navigation Robot',
      type: '3d-robot',
      connected: false,
      ipAddress: '192.168.1.101',
      port: 5000,
      lastHeartbeat: new Date(Date.now() - 300000).toISOString(),
      responseTime: 0,
      firmware: 'v3.8.5',
      status: 'offline',
      signalStrength: 0,
    },
  ]);

  const [systemLogs, setSystemLogs] = useState([
    { 
      id: 1, 
      level: 'success', 
      message: 'eHub Controller connected successfully', 
      timestamp: new Date().toLocaleString(),
      device: 'eHub'
    },
    { 
      id: 2, 
      level: 'error', 
      message: 'SPINE 3D Robot connection timeout - check network', 
      timestamp: new Date(Date.now() - 60000).toLocaleString(),
      device: '3D Robot'
    },
    { 
      id: 3, 
      level: 'info', 
      message: 'System calibration check passed', 
      timestamp: new Date(Date.now() - 120000).toLocaleString(),
      device: 'System'
    },
  ]);

  // Simulate checking device connection
  const checkDeviceConnection = async (device: RobotDevice): Promise<boolean> => {
    try {
      // In production: await fetch(`http://${device.ipAddress}:${device.port}/api/health`)
      // Simulating random connection for demo
      return Math.random() > 0.2; // 80% success rate
    } catch (error) {
      console.error(`Failed to connect to ${device.name}:`, error);
      return false;
    }
  };

  // Poll device status every 3 seconds
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      const updatedDevices = await Promise.all(
        devices.map(async (device) => {
          const isConnected = await checkDeviceConnection(device);
          const signalStrength = isConnected ? Math.floor(Math.random() * 20) + 80 : 0;
          
          return {
            ...device,
            connected: isConnected,
            lastHeartbeat: isConnected ? new Date().toISOString() : device.lastHeartbeat,
            responseTime: isConnected ? Math.floor(Math.random() * 30) + 10 : 0,
            status: isConnected ? 'online' : 'offline',
            signalStrength,
          } as RobotDevice;
        })
      );

      // Log connection changes
      updatedDevices.forEach((updatedDevice, index) => {
        if (updatedDevice.connected !== devices[index].connected) {
          const newLog = {
            id: Date.now() + index,
            level: updatedDevice.connected ? 'success' : 'error',
            message: `${updatedDevice.name} ${updatedDevice.connected ? 'connected' : 'disconnected'}`,
            timestamp: new Date().toLocaleString(),
            device: updatedDevice.name,
          };
          setSystemLogs((prev) => [newLog, ...prev.slice(0, 9)]);
        }
      });

      setDevices(updatedDevices);
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [devices]);

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'border-l-green-500 bg-green-500/5';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-500/5';
      case 'error':
        return 'border-l-red-500 bg-red-500/5';
      default:
        return 'border-l-blue-500 bg-blue-500/5';
    }
  };

  const connectedDevices = devices.filter(d => d.connected).length;
  const totalDevices = devices.length;
  const allConnected = connectedDevices === totalDevices;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold text-white">System Monitor</h3>
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border-2 ${
          allConnected 
            ? 'bg-green-500/10 border-green-500/50 text-green-300' 
            : connectedDevices > 0 
            ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-300'
            : 'bg-red-500/10 border-red-500/50 text-red-300'
        }`}>
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            allConnected ? 'bg-green-500' : connectedDevices > 0 ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="text-sm font-bold">
            {allConnected 
              ? 'ALL SYSTEMS OPERATIONAL' 
              : `${connectedDevices}/${totalDevices} DEVICES CONNECTED`
            }
          </span>
        </div>
      </div>

      {/* Main Device Display - Featured Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
              device.connected
                ? 'bg-gradient-to-br from-green-900/20 via-slate-800 to-slate-900 border-green-500/50 shadow-green-500/20 shadow-2xl'
                : 'bg-gradient-to-br from-red-900/20 via-slate-800 to-slate-900 border-red-500/50 shadow-red-500/20 shadow-lg'
            }`}
          >
            {/* Animated Background Pattern */}
            <div className={`absolute inset-0 opacity-10 ${device.connected ? 'animate-pulse' : ''}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent" />
            </div>

            {/* Content */}
            <div className="relative p-8">
              {/* Device Icon & Name */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl backdrop-blur-sm ${
                    device.connected 
                      ? 'bg-green-500/20 border-2 border-green-400/50' 
                      : 'bg-red-500/20 border-2 border-red-400/50'
                  }`}>
                    {device.type === 'ehub' ? (
                      <Radio className={`w-10 h-10 ${
                        device.connected ? 'text-green-400' : 'text-red-400'
                      }`} />
                    ) : (
                      <Box className={`w-10 h-10 ${
                        device.connected ? 'text-green-400' : 'text-red-400'
                      }`} />
                    )}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-1">{device.name}</h4>
                    <p className="text-slate-400 text-sm">
                      {device.type === 'ehub' ? 'Hub Controller' : '3D Navigation System'}
                    </p>
                  </div>
                </div>

                {/* Connection Status Badge */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${
                  device.connected
                    ? 'bg-green-500/20 border-green-400/50'
                    : 'bg-red-500/20 border-red-400/50'
                }`}>
                  {device.connected ? (
                    <Wifi className="w-5 h-5 text-green-400 animate-pulse" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`font-bold text-sm uppercase ${
                    device.connected ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {device.connected ? 'CONNECTED' : 'OFFLINE'}
                  </span>
                </div>
              </div>

              {/* Device Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                  <p className="text-slate-400 text-xs mb-1">IP Address</p>
                  <p className="text-white font-mono text-sm">{device.ipAddress}:{device.port}</p>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                  <p className="text-slate-400 text-xs mb-1">Firmware</p>
                  <p className="text-white font-mono text-sm">{device.firmware}</p>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                  <p className="text-slate-400 text-xs mb-1">Response Time</p>
                  <p className={`font-bold text-sm ${
                    device.connected 
                      ? device.responseTime < 50 ? 'text-green-400' : 'text-yellow-400'
                      : 'text-red-400'
                  }`}>
                    {device.connected ? `${device.responseTime}ms` : 'N/A'}
                  </p>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                  <p className="text-slate-400 text-xs mb-1">Signal Strength</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          device.signalStrength > 80 
                            ? 'bg-green-500' 
                            : device.signalStrength > 50 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${device.signalStrength}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${
                      device.signalStrength > 80 
                        ? 'text-green-400' 
                        : device.signalStrength > 50 
                        ? 'text-yellow-400' 
                        : 'text-red-400'
                    }`}>
                      {device.signalStrength}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Last Heartbeat */}
              <div className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Activity className={`w-4 h-4 ${
                    device.connected ? 'text-green-400 animate-pulse' : 'text-slate-500'
                  }`} />
                  <span className="text-slate-400 text-sm">Last Heartbeat</span>
                </div>
                <span className="text-white text-sm font-mono">
                  {device.connected 
                    ? new Date(device.lastHeartbeat).toLocaleTimeString()
                    : 'Connection lost'
                  }
                </span>
              </div>

              {/* Connection Visual Indicator */}
              {device.connected && (
                <div className="mt-4 flex justify-center">
                  <div className="flex items-center gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-8 bg-green-500 rounded-full animate-pulse"
                        style={{
                          animationDelay: `${i * 0.2}s`,
                          height: `${20 + i * 10}px`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center justify-center gap-3 p-4 bg-blue-600/20 hover:bg-blue-600/30 border-2 border-blue-600/50 text-blue-300 rounded-xl transition-all hover:scale-105">
          <Zap className="w-5 h-5" />
          <span className="font-semibold">Reconnect All Devices</span>
        </button>
        <button className="flex items-center justify-center gap-3 p-4 bg-purple-600/20 hover:bg-purple-600/30 border-2 border-purple-600/50 text-purple-300 rounded-xl transition-all hover:scale-105">
          <Activity className="w-5 h-5" />
          <span className="font-semibold">Run Diagnostics</span>
        </button>
        <button className="flex items-center justify-center gap-3 p-4 bg-orange-600/20 hover:bg-orange-600/30 border-2 border-orange-600/50 text-orange-300 rounded-xl transition-all hover:scale-105">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">System Health Check</span>
        </button>
      </div>

      {/* System Logs */}
      <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Real-Time System Logs
          </h4>
          <span className="text-slate-400 text-sm">Auto-updating every 3 seconds</span>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {systemLogs.map((log) => (
            <div
              key={log.id}
              className={`flex items-start gap-3 p-4 rounded-xl border-l-4 transition-all hover:scale-[1.02] ${getLogColor(log.level)}`}
            >
              {getLogIcon(log.level)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded font-mono">
                    {log.device}
                  </span>
                  <p className="text-white text-sm font-medium">{log.message}</p>
                </div>
                <p className="text-slate-500 text-xs font-mono">{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connection Status Summary */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border-2 border-slate-700 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-white mb-4">Connection Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-800/50 rounded-xl">
            <p className="text-slate-400 text-sm mb-2">Total Devices</p>
            <p className="text-4xl font-bold text-white">{totalDevices}</p>
          </div>
          <div className="text-center p-4 bg-green-900/20 rounded-xl border border-green-500/30">
            <p className="text-slate-400 text-sm mb-2">Connected</p>
            <p className="text-4xl font-bold text-green-400">{connectedDevices}</p>
          </div>
          <div className="text-center p-4 bg-red-900/20 rounded-xl border border-red-500/30">
            <p className="text-slate-400 text-sm mb-2">Offline</p>
            <p className="text-4xl font-bold text-red-400">{totalDevices - connectedDevices}</p>
          </div>
        </div>
      </div>
    </div>
  );
}