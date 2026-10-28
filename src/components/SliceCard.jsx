import React from 'react';
import { 
  Wifi, 
  Clock, 
  Activity, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Radio, 
  Layers,
  Users
} from 'lucide-react';
import { SLICE_DEFINITIONS, SLICING_MODES } from '../utils/constants';

export default function SliceCard({ 
  sliceKey, 
  metric, 
  sliceConfig, 
  onUpdateConfig, 
  slicingMode 
}) {
  const def = SLICE_DEFINITIONS[sliceKey];
  if (!def || !metric) return null;

  const isNoSlicing = slicingMode === SLICING_MODES.NONE;

  // SLA status color helpers
  const getStatusBadge = () => {
    if (metric.slaStatus === 'NORMAL') {
      return {
        icon: CheckCircle2,
        label: 'SLA MET • OPTIMAL',
        className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-400',
      };
    } else if (metric.slaStatus === 'WARNING') {
      return {
        icon: AlertTriangle,
        label: 'SLA WARNING',
        className: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        dot: 'bg-amber-400',
      };
    } else {
      return {
        icon: XCircle,
        label: 'SLA BREACHED',
        className: 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse',
        dot: 'bg-red-400',
      };
    }
  };

  const status = getStatusBadge();
  const StatusIcon = status.icon;

  return (
    <div className={`bg-navy-900 border rounded-2xl p-4 lg:p-5 shadow-xl transition-all relative overflow-hidden flex flex-col justify-between ${
      metric.slaStatus === 'CRITICAL' 
        ? 'border-red-500/60 ring-1 ring-red-500/40' 
        : 'border-navy-700/80 hover:border-navy-600'
    }`}>
      
      {/* Top Slice Identity Bar */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${def.accentClass}`}>
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {def.shortName}
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${def.badgeClass}`}>
                  {def.snssai}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-navy-700 bg-navy-950 text-slate-300">
                  {metric.allocatedBw || def.defaultBandwidth} Mbps Quota
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-none mt-1">
                {def.name}
              </p>
            </div>
          </div>

          {/* SLA Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border ${status.className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{status.label}</span>
          </div>
        </div>

        {/* Breach Alert banner if any */}
        {metric.slaBreaches && metric.slaBreaches.length > 0 && (
          <div className="mb-3 p-2 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-start gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="font-semibold block text-[11px] uppercase tracking-wider text-red-400">
                SLA Quality Violation Detected:
              </span>
              <span className="text-[11px] text-red-200">
                {metric.slaBreaches[0]}
              </span>
            </div>
          </div>
        )}

        {/* Primary KPIs Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          
          {/* Latency KPI */}
          <div className="bg-navy-950/70 p-2.5 rounded-xl border border-navy-800">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                Latency
              </span>
              <span className="text-[10px] text-slate-500">
                Target &lt;{def.sla.maxLatency}ms
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xl font-bold font-mono ${
                metric.latency > def.sla.maxLatency 
                  ? 'text-red-400' 
                  : metric.latency > def.sla.maxLatency * 0.8 
                  ? 'text-amber-400' 
                  : 'text-white'
              }`}>
                {metric.latency}
              </span>
              <span className="text-xs text-slate-400 font-mono">ms</span>
            </div>
          </div>

          {/* Throughput KPI */}
          <div className="bg-navy-950/70 p-2.5 rounded-xl border border-navy-800">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-400" />
                Throughput
              </span>
              <span className="text-[10px] text-slate-500">
                Min {def.sla.minThroughput}M
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono text-white">
                {metric.throughput}
              </span>
              <span className="text-xs text-slate-400 font-mono">Mbps</span>
            </div>
          </div>

          {/* Packet Loss KPI */}
          <div className="bg-navy-950/70 p-2.5 rounded-xl border border-navy-800">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-amber-400" />
                Packet Loss
              </span>
              <span className="text-[10px] text-slate-500">
                &lt;{def.sla.maxPacketLoss}%
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-lg font-bold font-mono ${
                metric.packetLoss > def.sla.maxPacketLoss ? 'text-red-400' : 'text-white'
              }`}>
                {metric.packetLoss}%
              </span>
            </div>
          </div>

          {/* Connected Devices */}
          <div className="bg-navy-950/70 p-2.5 rounded-xl border border-navy-800">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-purple-400" />
                Connected
              </span>
              <span className="text-[10px] text-slate-500">
                5QI: {def.fiveQI}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono text-white">
                {metric.activeDevices > 1000 
                  ? `${(metric.activeDevices / 1000).toFixed(1)}k` 
                  : metric.activeDevices}
              </span>
              <span className="text-xs text-slate-400 font-mono">UEs</span>
            </div>
          </div>

        </div>

        {/* PRB Spectrum Allocation Bar */}
        <div className="bg-navy-950/70 p-2.5 rounded-xl border border-navy-800 mb-3.5">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-blue-400" />
              PRB Allocation (100MHz NR):
            </span>
            <span className="text-white font-semibold">
              {metric.prbAllocated} PRBs ({metric.prbUtilization}% utilized)
            </span>
          </div>

          <div className="w-full h-2 bg-navy-900 rounded-full overflow-hidden border border-navy-800">
            <div 
              style={{ width: `${metric.prbUtilization}%` }}
              className={`h-full transition-all duration-300 ${
                metric.prbUtilization > 90 
                  ? 'bg-red-500' 
                  : metric.prbUtilization > 75 
                  ? 'bg-amber-400' 
                  : 'bg-cyan-400'
              }`}
            />
          </div>
        </div>

        {/* 3GPP Specification details */}
        <div className="text-[11px] font-mono text-slate-400 space-y-1 mb-3.5 p-2 rounded-lg bg-navy-950/50 border border-navy-800/80">
          <div className="flex justify-between">
            <span className="text-slate-500">Numerology:</span>
            <span className="text-slate-300">{def.numerology}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Queue Discipline:</span>
            <span className="text-slate-300">{def.queueDiscipline}</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Sliders */}
      <div className="pt-3 border-t border-navy-800 space-y-3">
        
        {/* Traffic Load Slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-slate-300 font-medium flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Traffic Demand / Load:
            </span>
            <span className="font-bold text-white font-mono">
              {sliceConfig.load}%
            </span>
          </div>
          <input 
            type="range"
            min="5"
            max="100"
            step="1"
            value={sliceConfig.load}
            onChange={(e) => onUpdateConfig(sliceKey, 'load', Number(e.target.value))}
            className="w-full h-1.5 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
            <span>Low (5%)</span>
            <span>Nominal (50%)</span>
            <span>Overload (100%)</span>
          </div>
        </div>

        {/* PRB Spectrum Share Slider (Only customizable in Hard Slicing mode) */}
        {!isNoSlicing && (
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                Dedicated PRB Quota:
              </span>
              <span className="font-bold text-white font-mono">
                {sliceConfig.prbShare}%
              </span>
            </div>
            <input 
              type="range"
              min="10"
              max="70"
              step="1"
              value={sliceConfig.prbShare}
              onChange={(e) => onUpdateConfig(sliceKey, 'prbShare', Number(e.target.value))}
              className="w-full h-1.5 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
              <span>Min 10%</span>
              <span>Reserve Spectrum</span>
              <span>Max 70%</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
