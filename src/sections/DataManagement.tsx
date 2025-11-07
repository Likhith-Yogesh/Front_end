import { useState } from 'react';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Download, Upload, RefreshCw } from 'lucide-react';

interface DataMetrics {
  totalUsers: number;
  activeAccounts: number;
  totalSoftware: number;
  downloadsThisMonth: number;
}

interface ChartData {
  name: string;
  value: number;
  percentage: number;
}

export default function DataManagement() {
  const [metrics] = useState<DataMetrics>({
    totalUsers: 1523,
    activeAccounts: 847,
    totalSoftware: 42,
    downloadsThisMonth: 125680,
  });

  const [softwareDistribution] = useState<ChartData[]>([
    { name: 'Cloud Manager Pro', value: 15420, percentage: 38 },
    { name: 'Data Analytics', value: 8932, percentage: 22 },
    { name: 'Security Toolkit', value: 2341, percentage: 6 },
    { name: 'Others', value: 13987, percentage: 34 },
  ]);

  const [recentActivity] = useState([
    { id: 1, action: 'New account created', user: 'admin@system.com', timestamp: '2024-11-06 14:30' },
    { id: 2, action: 'Software updated', item: 'Cloud Manager Pro v3.2.1', timestamp: '2024-11-06 13:15' },
    { id: 3, action: 'Admin access granted', user: 'john@admin.com', timestamp: '2024-11-06 12:45' },
    { id: 4, action: 'Account suspended', user: 'old@account.com', timestamp: '2024-11-06 11:20' },
    { id: 5, action: 'Database backup completed', size: '2.4 GB', timestamp: '2024-11-06 10:00' },
  ]);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Data Management & Analytics</h3>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-2">Total Users</p>
              <p className="text-3xl font-bold text-white">{metrics.totalUsers.toLocaleString()}</p>
              <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12.5% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-2">Active Accounts</p>
              <p className="text-3xl font-bold text-white">{metrics.activeAccounts.toLocaleString()}</p>
              <p className="text-blue-400 text-xs mt-2">
                {Math.round((metrics.activeAccounts / metrics.totalUsers) * 100)}% engagement rate
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-2">Total Software</p>
              <p className="text-3xl font-bold text-white">{metrics.totalSoftware}</p>
              <p className="text-slate-400 text-xs mt-2">3 beta versions</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-2">This Month Downloads</p>
              <p className="text-3xl font-bold text-white">{(metrics.downloadsThisMonth / 1000).toFixed(0)}K</p>
              <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +8.3% growth
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Software Distribution */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Software Downloads Distribution
          </h4>
          <div className="space-y-4">
            {softwareDistribution.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300 text-sm">{item.name}</span>
                  <span className="text-white font-semibold text-sm">{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <p className="text-slate-500 text-xs mt-1">{item.value.toLocaleString()} downloads</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Quick Actions
          </h4>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition">
              <Download className="w-4 h-4" />
              <span>Export Data Report</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition">
              <Upload className="w-4 h-4" />
              <span>Import User Data</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Cache</span>
            </button>
            <div className="pt-2 border-t border-slate-700">
              <p className="text-slate-400 text-xs">Last updated: 2024-11-06 15:45 UTC</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Recent Activity Log</h4>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition"
            >
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{activity.action}</p>
                <p className="text-slate-400 text-xs mt-1">
                  {'user' in activity ? activity.user : ('item' in activity ? activity.item : activity.size)}
                </p>
              </div>
              <span className="text-slate-500 text-xs whitespace-nowrap ml-4">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-4">System Health</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-slate-400 text-sm">Database Status</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">Healthy</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-400 text-sm">Server Status</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">Operational</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-400 text-sm">API Response</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">45ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
