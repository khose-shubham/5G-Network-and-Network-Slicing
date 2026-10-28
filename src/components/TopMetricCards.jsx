import React from 'react';
import { 
  Gauge, 
  Layers, 
  Users, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Info 
} from 'lucide-react';

export default function TopMetricCards({ globalMetrics }) {
  const {
    totalBandwidth = 100,
    allocatedBandwidth = 90,
    activeSlices = 3,
    totalConnectedDevices = 515,
    networkStatus = 'NORMAL',
  } = globalMetrics || {};

  // Status configuration for NORMAL, WARNING, CONGESTED
  const statusConfig = {
    NORMAL: {
      label: 'NORMAL',
      desc: 'All slices within SLA thresholds',
      color: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/30',
      dot: 'bg-emerald-400',
      icon: CheckCircle2,
    },
    WARNING: {
      label: 'WARNING',
      desc: 'Elevated latency or high PRB utilization',
      color: 'text-amber-400',
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/30',
      dot: 'bg-amber-400',
      icon: AlertTriangle,
    },
    CONGESTED: {
      label: 'CONGESTED',
      desc: 'Bufferbloat or critical SLA breach detected',
      color: 'text-red-400',
      border: 'border-red-500/50',
      bg: 'bg-red-950/30',
      dot: 'bg-red-400 animate-ping',
      icon: AlertOctagon,
    },
  };

  const currentStatus = statusConfig[networkStatus] || statusConfig.NORMAL;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="space-y-3.5">
      
      {/* Network Status Indicator Banner */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${currentStatus.border} ${currentStatus.bg}`}>
            <StatusIcon className={`w-5 h-5 ${currentStatus.color}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                Network Status:
              </span>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${currentStatus.border} ${currentStatus.bg} ${currentStatus.color} flex items-center gap-1.5`}>
                <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`} />
                {currentStatus.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentStatus.desc}
            </p>
          </div>
        </div>

        {/* 3 Status states comparison pills */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {['NORMAL', 'WARNING', 'CONGESTED'].map((statusKey) => {
            const isCurrent = networkStatus === statusKey;
            const config = statusConfig[statusKey];
            return (
              <div
                key={statusKey}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all border ${
                  isCurrent
                    ? `${config.bg} ${config.border} ${config.color} font-bold shadow-sm`
                    : 'bg-navy-950/60 border-navy-800 text-slate-400 opacity-60'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? config.dot : 'bg-slate-500'}`} />
                <span>{statusKey}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Card 1: Total Bandwidth */}
        <div className="bg-navy-900 border border-navy-700/80 hover:border-navy-600 rounded-2xl p-4 shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span className="uppercase tracking-wider">Total Bandwidth</span>
              <div className="p-1.5 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
                <Gauge className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-white tracking-tight">
                {totalBandwidth}
              </span>
              <span className="text-xs font-mono text-cyan-400 font-semibold">Mbps</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-navy-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Cell Spectrum:</span>
            <span className="text-slate-300 font-medium">100 MHz NR Carrier</span>
          </div>
        </div>

        {/* Card 2: Allocated Bandwidth */}
        <div className="bg-navy-900 border border-navy-700/80 hover:border-navy-600 rounded-2xl p-4 shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span className="uppercase tracking-wider">Allocated Bandwidth</span>
              <div className="p-1.5 rounded-lg bg-blue-950/50 border border-blue-500/30 text-blue-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-white tracking-tight">
                {allocatedBandwidth}
              </span>
              <span className="text-xs font-mono text-blue-400 font-semibold">Mbps</span>
              <span className="text-[11px] font-mono text-slate-400 ml-1">
                ({Math.round((allocatedBandwidth / totalBandwidth) * 100)}%)
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-navy-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Quota Reserve:</span>
            <span className="text-emerald-400 font-medium">10 Mbps Overhead</span>
          </div>
        </div>

        {/* Card 3: Active Slices */}
        <div className="bg-navy-900 border border-navy-700/80 hover:border-navy-600 rounded-2xl p-4 shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span className="uppercase tracking-wider">Active Slices</span>
              <div className="p-1.5 rounded-lg bg-purple-950/50 border border-purple-500/30 text-purple-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white tracking-tight">
                {activeSlices}
              </span>
              <span className="text-xs font-mono text-purple-400 font-semibold">Slices</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-navy-800/80 flex items-center gap-2 text-[10px] font-mono">
            <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">eMBB</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">URLLC</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-500/30">mMTC</span>
          </div>
        </div>

        {/* Card 4: Connected Simulated Devices */}
        <div className="bg-navy-900 border border-navy-700/80 hover:border-navy-600 rounded-2xl p-4 shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span className="uppercase tracking-wider">Simulated Devices</span>
              <div className="p-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-white tracking-tight">
                {totalConnectedDevices}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">Active UEs</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-navy-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Demo Baseline:</span>
            <span className="text-slate-300 font-medium">515 Devices</span>
          </div>
        </div>

      </div>

      {/* Subtle note about demonstration settings */}
      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 px-1">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>Initial demonstration settings, not real network measurements.</span>
      </div>

    </div>
  );
}
