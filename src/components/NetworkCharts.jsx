import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Activity, Clock, Layers, ShieldCheck, AlertCircle } from 'lucide-react';
import { SLICE_DEFINITIONS } from '../utils/constants';

// Custom NOC Tooltip for Recharts
const CustomNocTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-950 border border-navy-700 p-2.5 rounded-xl shadow-2xl text-xs font-mono">
        <div className="text-slate-400 mb-1 border-b border-navy-800 pb-1">
          Tick Time: {label}
        </div>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold text-white">
              {entry.value} {entry.unit || ''}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function NetworkCharts({ historyData, metrics }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
      
      {/* CHART 1: Real-time Latency with SLA Limit Line */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-4 lg:p-5 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                End-to-End Latency vs. URLLC SLA Limit
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/30 text-emerald-400">
              URLLC SLA Limit: 5.0 ms
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Real-time latency. Demonstrates how legacy mode violates URLLC SLAs (&gt;5ms) under heavy eMBB load.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false}
                  domain={[0, 'dataMax + 10']}
                  unit="ms"
                />
                <Tooltip content={<CustomNocTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={30}
                  iconType="circle"
                  formatter={(val) => <span className="text-xs text-slate-300 font-mono">{val}</span>}
                />
                {/* 5ms URLLC SLA threshold reference line */}
                <ReferenceLine 
                  y={5} 
                  stroke="#ef4444" 
                  strokeDasharray="4 4" 
                  label={{ 
                    value: 'URLLC 5ms Limit', 
                    fill: '#ef4444', 
                    fontSize: 10, 
                    position: 'insideTopRight' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="urllcLatency" 
                  name="URLLC Latency" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                  dot={false}
                  unit="ms"
                  isAnimationActive={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="embbLatency" 
                  name="eMBB Latency" 
                  stroke="#06b6d4" 
                  strokeWidth={2} 
                  dot={false}
                  unit="ms"
                  isAnimationActive={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="mmtcLatency" 
                  name="mMTC Latency" 
                  stroke="#a855f7" 
                  strokeWidth={1.5} 
                  dot={false}
                  unit="ms"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-navy-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Current URLLC:</span>
          <span className={`font-bold ${metrics.urllc?.latency > 5 ? 'text-red-400' : 'text-emerald-400'}`}>
            {metrics.urllc?.latency} ms {metrics.urllc?.latency > 5 ? '⚠️ (SLA BREACH)' : '✓ (PASSED)'}
          </span>
        </div>
      </div>

      {/* CHART 2: Throughput over time (Area Chart) */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-4 lg:p-5 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Dynamic Slice Throughput (Mbps)
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-navy-700 bg-navy-950 text-cyan-400">
              Total Bandwidth: 100 Mbps
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Real-time data rate served across active slices in the 100 Mbps shared allocation pool.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="embbGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="urllcGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="mmtcGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false}
                  unit="M"
                />
                <Tooltip content={<CustomNocTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={30}
                  iconType="circle"
                  formatter={(val) => <span className="text-xs text-slate-300 font-mono">{val}</span>}
                />
                <Area 
                  type="monotone" 
                  dataKey="embbThroughput" 
                  name="eMBB Bandwidth" 
                  stroke="#06b6d4" 
                  fillOpacity={1} 
                  fill="url(#embbGrad)" 
                  unit="Mbps"
                  isAnimationActive={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="urllcThroughput" 
                  name="URLLC Bandwidth" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#urllcGrad)" 
                  unit="Mbps"
                  isAnimationActive={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="mmtcThroughput" 
                  name="mMTC Bandwidth" 
                  stroke="#a855f7" 
                  fillOpacity={1} 
                  fill="url(#mmtcGrad)" 
                  unit="Mbps"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-navy-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Aggregate Cell Throughput:</span>
          <span className="font-bold text-white">
            {(
              (metrics.embb?.throughput || 0) +
              (metrics.urllc?.throughput || 0) +
              (metrics.mmtc?.throughput || 0)
            ).toFixed(0)} Mbps
          </span>
        </div>
      </div>

      {/* CHART 3: Radio Resource PRBs (Physical Resource Blocks) */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-4 lg:p-5 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">
                5G RAN PRB Distribution (273 PRBs Total)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              3GPP 100MHz Carrier
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Physical Resource Blocks allocated and utilized per slice.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={[
                  { 
                    slice: 'eMBB', 
                    Allocated: metrics.embb?.prbAllocated || 0,
                    Utilized: Math.round((metrics.embb?.prbAllocated || 0) * ((metrics.embb?.prbUtilization || 0) / 100)),
                    fill: '#06b6d4'
                  },
                  { 
                    slice: 'URLLC', 
                    Allocated: metrics.urllc?.prbAllocated || 0,
                    Utilized: Math.round((metrics.urllc?.prbAllocated || 0) * ((metrics.urllc?.prbUtilization || 0) / 100)),
                    fill: '#10b981'
                  },
                  { 
                    slice: 'mMTC', 
                    Allocated: metrics.mmtc?.prbAllocated || 0,
                    Utilized: Math.round((metrics.mmtc?.prbAllocated || 0) * ((metrics.mmtc?.prbUtilization || 0) / 100)),
                    fill: '#a855f7'
                  },
                ]}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="slice" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit=" PRB" />
                <Tooltip content={<CustomNocTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={30}
                  formatter={(val) => <span className="text-xs text-slate-300 font-mono">{val}</span>}
                />
                <Bar dataKey="Allocated" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Utilized" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-navy-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>PRB Allocation Ratio:</span>
          <span className="text-slate-200">
            eMBB: {metrics.embb?.prbAllocated} | URLLC: {metrics.urllc?.prbAllocated} | mMTC: {metrics.mmtc?.prbAllocated}
          </span>
        </div>
      </div>

      {/* CHART 4: Reliability & Packet Loss Breakdown */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-4 lg:p-5 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Packet Loss & Reliability Compliance
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-navy-700 bg-navy-950 text-slate-300">
              URLLC Target: 99.999%
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Measured packet drop rates. Highlights buffer tail-drop when slicing is deactivated.
          </p>

          {/* Reliability Comparison Table / Visuals */}
          <div className="space-y-3 pt-2">
            
            {/* eMBB Loss */}
            <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-cyan-400 font-semibold">eMBB (Video / AR)</span>
                <span className="text-white">
                  Drop Rate: <span className="font-bold">{metrics.embb?.packetLoss}%</span> (SLA: &lt;1.0%)
                </span>
              </div>
              <div className="w-full h-2 bg-navy-900 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min(100, (metrics.embb?.packetLoss / 2) * 100)}%` }}
                  className={`h-full ${metrics.embb?.packetLoss > 1 ? 'bg-red-500' : 'bg-cyan-400'}`}
                />
              </div>
            </div>

            {/* URLLC Loss */}
            <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-emerald-400 font-semibold">URLLC (Mission Critical)</span>
                <span className="text-white">
                  Drop Rate: <span className={`font-bold ${metrics.urllc?.packetLoss > 0.01 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {metrics.urllc?.packetLoss}%
                  </span> (SLA: &lt;0.01%)
                </span>
              </div>
              <div className="w-full h-2 bg-navy-900 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min(100, (metrics.urllc?.packetLoss / 0.05) * 100)}%` }}
                  className={`h-full ${metrics.urllc?.packetLoss > 0.01 ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`}
                />
              </div>
            </div>

            {/* mMTC Loss */}
            <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-purple-400 font-semibold">mMTC (Smart Sensors)</span>
                <span className="text-white">
                  Drop Rate: <span className="font-bold">{metrics.mmtc?.packetLoss}%</span> (SLA: &lt;3.0%)
                </span>
              </div>
              <div className="w-full h-2 bg-navy-900 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min(100, (metrics.mmtc?.packetLoss / 5) * 100)}%` }}
                  className={`h-full ${metrics.mmtc?.packetLoss > 3 ? 'bg-red-500' : 'bg-purple-400'}`}
                />
              </div>
            </div>

          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-navy-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Reliability Guarantee:</span>
          <span className="text-emerald-400 font-semibold">
            {metrics.urllc?.packetLoss <= 0.01 ? '99.999% Five-Nines Achieved' : 'Reliability Degraded'}
          </span>
        </div>
      </div>

    </div>
  );
}
