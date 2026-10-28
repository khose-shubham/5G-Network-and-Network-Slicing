import React from 'react';
import { 
  Smartphone, 
  Car, 
  Cpu, 
  Radio, 
  Network, 
  Server, 
  Cloud, 
  Layers, 
  Zap,
  Globe,
  HardDrive,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { SLICE_TYPES, SLICING_MODES } from '../utils/constants';

export default function ArchitectureTopology({ metrics, slicingMode, isRunning }) {
  const isNoSlicing = slicingMode === SLICING_MODES.NONE;

  return (
    <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-4 lg:p-6 shadow-xl relative overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              End-to-End 5G Network Slice Architecture (3GPP Rel-16)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualizing packet flows from User Equipment through gNodeB RAN, NSSF Slice Routing, to Core UPFs & Edge MEC
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-cyan-400">eMBB</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-400">URLLC</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <span className="text-purple-400">mMTC</span>
          </div>
        </div>
      </div>

      {/* Architecture Pipeline Canvas */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-3 lg:gap-4 items-stretch">
        
        {/* STEP 1: USER EQUIPMENT (UE) */}
        <div className="bg-navy-950/80 border border-navy-700/80 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>1. User Equipment</span>
              <span className="text-slate-500">UE Layer</span>
            </div>

            <div className="space-y-2">
              {/* eMBB Devices */}
              <div className="p-2 rounded-lg bg-navy-900 border border-cyan-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-medium text-slate-200">5G Smartphones / VR</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">
                  {metrics[SLICE_TYPES.EMBB]?.activeDevices} UEs
                </span>
              </div>

              {/* URLLC Devices */}
              <div className="p-2 rounded-lg bg-navy-900 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-medium text-slate-200">V2X Autonomous Cars</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">
                  {metrics[SLICE_TYPES.URLLC]?.activeDevices} UEs
                </span>
              </div>

              {/* mMTC Devices */}
              <div className="p-2 rounded-lg bg-navy-900 border border-purple-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-medium text-slate-200">Smart City IoT Nodes</span>
                </div>
                <span className="text-[10px] font-mono text-purple-400">
                  {(metrics[SLICE_TYPES.MMTC]?.activeDevices / 1000).toFixed(1)}k UEs
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-navy-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Air Interface:</span>
            <span className="text-slate-300">5G NR Uu</span>
          </div>
        </div>

        {/* STEP 2: 5G RAN (gNodeB) */}
        <div className="bg-navy-950/80 border border-navy-700/80 rounded-xl p-3.5 flex flex-col justify-between relative">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>2. 5G RAN (gNodeB)</span>
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            </div>

            <div className="bg-navy-900 rounded-lg p-2.5 border border-navy-700/70 mb-2">
              <div className="text-[10px] font-mono text-slate-400 mb-1 flex justify-between">
                <span>PRB Scheduling:</span>
                <span className="text-white font-semibold">273 PRBs (100MHz)</span>
              </div>

              {/* PRB visual strip */}
              <div className="w-full h-3 rounded bg-navy-950 overflow-hidden flex border border-navy-800 mb-2">
                <div 
                  style={{ width: `${(metrics[SLICE_TYPES.EMBB]?.prbAllocated / 273) * 100}%` }}
                  className="bg-cyan-500 transition-all duration-300"
                  title="eMBB PRBs"
                />
                <div 
                  style={{ width: `${(metrics[SLICE_TYPES.URLLC]?.prbAllocated / 273) * 100}%` }}
                  className="bg-emerald-500 transition-all duration-300"
                  title="URLLC PRBs"
                />
                <div 
                  style={{ width: `${(metrics[SLICE_TYPES.MMTC]?.prbAllocated / 273) * 100}%` }}
                  className="bg-purple-500 transition-all duration-300"
                  title="mMTC PRBs"
                />
              </div>

              <div className="text-[10px] text-slate-400 leading-tight">
                {isNoSlicing ? (
                  <span className="text-red-400 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    Shared FIFO queue without slice isolation
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Flexible 5G Numerology (μ=0,1,3)
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5 text-[10px] font-mono">
              <div className="flex justify-between p-1 rounded bg-navy-900/60 text-slate-300">
                <span className="text-cyan-400">eMBB Numerology:</span>
                <span>μ=1 (30 kHz SCS)</span>
              </div>
              <div className="flex justify-between p-1 rounded bg-navy-900/60 text-slate-300">
                <span className="text-emerald-400">URLLC Numerology:</span>
                <span>μ=3 (120 kHz Mini-slot)</span>
              </div>
              <div className="flex justify-between p-1 rounded bg-navy-900/60 text-slate-300">
                <span className="text-purple-400">mMTC Numerology:</span>
                <span>μ=0 (15 kHz Power Save)</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-navy-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Interface:</span>
            <span className="text-slate-300">F1 / eCPRI Fronthaul</span>
          </div>
        </div>

        {/* STEP 3: TRANSPORT & NSSF (Slice Selection) */}
        <div className="bg-navy-950/80 border border-navy-700/80 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>3. 5G Core NSSF</span>
              <Network className="w-3.5 h-3.5 text-blue-400" />
            </div>

            <div className="bg-navy-900 rounded-lg p-2.5 border border-navy-700/70 mb-2">
              <div className="text-[11px] font-bold text-white mb-0.5 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-blue-400" />
                <span>NSSF & AMF Control</span>
              </div>
              <p className="text-[10px] text-slate-400 mb-2">
                Network Slice Selection Function evaluates S-NSSAI (SST & SD) to steer traffic.
              </p>

              <div className="space-y-1 text-[10px] font-mono">
                <div className="flex items-center justify-between p-1 rounded bg-navy-950 border border-cyan-500/20">
                  <span className="text-cyan-400">SST-1: 000001</span>
                  <span className="text-slate-400">→ 5QI: 9</span>
                </div>
                <div className="flex items-center justify-between p-1 rounded bg-navy-950 border border-emerald-500/20">
                  <span className="text-emerald-400">SST-2: 000002</span>
                  <span className="text-slate-400">→ 5QI: 82</span>
                </div>
                <div className="flex items-center justify-between p-1 rounded bg-navy-950 border border-purple-500/20">
                  <span className="text-purple-400">SST-3: 000003</span>
                  <span className="text-slate-400">→ 5QI: 79</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-navy-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Protocol:</span>
            <span className="text-slate-300">N2 / N3 GTP-U / SRv6</span>
          </div>
        </div>

        {/* STEP 4: USER PLANE FUNCTIONS (UPF) */}
        <div className="bg-navy-950/80 border border-navy-700/80 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>4. Slice UPFs</span>
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            <div className="space-y-2">
              {/* UPF eMBB */}
              <div className={`p-2 rounded-lg border transition-colors ${
                isNoSlicing 
                  ? 'bg-navy-900 border-navy-700 opacity-60' 
                  : 'bg-navy-900 border-cyan-500/40 shadow-sm'
              }`}>
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span className="text-cyan-400">UPF #1 (Central)</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {metrics[SLICE_TYPES.EMBB]?.throughput} Mbps
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  High-throughput packet buffer
                </span>
              </div>

              {/* UPF URLLC */}
              <div className={`p-2 rounded-lg border transition-colors ${
                isNoSlicing 
                  ? 'bg-navy-900 border-red-500/50 bg-red-950/20' 
                  : 'bg-navy-900 border-emerald-500/40 shadow-sm'
              }`}>
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span className="text-emerald-400">UPF #2 (Edge MEC)</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {metrics[SLICE_TYPES.URLLC]?.throughput} Mbps
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Local breakout, sub-1ms transit
                </span>
              </div>

              {/* UPF mMTC */}
              <div className={`p-2 rounded-lg border transition-colors ${
                isNoSlicing 
                  ? 'bg-navy-900 border-navy-700 opacity-60' 
                  : 'bg-navy-900 border-purple-500/40 shadow-sm'
              }`}>
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span className="text-purple-400">UPF #3 (Cloud)</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {metrics[SLICE_TYPES.MMTC]?.throughput} Mbps
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  CoAP / MQTT Telemetry aggregation
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-navy-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Plane:</span>
            <span className="text-slate-300">5GC User Plane (N6)</span>
          </div>
        </div>

        {/* STEP 5: DATA NETWORKS & MEC */}
        <div className="bg-navy-950/80 border border-navy-700/80 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>5. Data Network</span>
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            <div className="space-y-2">
              {/* Internet */}
              <div className="p-2 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-medium text-slate-200">Public Internet / CDN</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">eMBB</span>
              </div>

              {/* Edge MEC */}
              <div className="p-2 rounded-lg bg-navy-900 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-medium text-slate-200">Local Edge MEC</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">URLLC</span>
              </div>

              {/* Cloud IoT */}
              <div className="p-2 rounded-lg bg-navy-900 border border-purple-500/30 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs font-medium text-slate-200">Smart City IoT Cloud</span>
                </div>
                <span className="text-[10px] font-mono text-purple-400">mMTC</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-navy-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Destination:</span>
            <span className="text-slate-300">Application Servers</span>
          </div>
        </div>

      </div>

      {/* Dynamic Animated Packet Flow Track */}
      <div className="mt-4 pt-3 border-t border-navy-800/80">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            Live Packet Ingestion & Transmission Pipeline:
          </span>
          <span className="text-[11px] text-cyan-400 font-semibold">
            {isNoSlicing ? '⚠️ Uncontrolled Congestion in Shared Pipeline' : '✓ Guaranteed Isolation Enforced'}
          </span>
        </div>

        <div className="relative h-7 bg-navy-950 rounded-lg border border-navy-700/60 overflow-hidden flex items-center px-3">
          {/* Animated SVG Stream */}
          <svg className="w-full h-full absolute inset-0 pointer-events-none">
            <line 
              x1="0" 
              y1="14" 
              x2="100%" 
              y2="14" 
              stroke="#1e293b" 
              strokeWidth="2" 
            />
            {isRunning && !isNoSlicing && (
              <>
                {/* eMBB stream */}
                <line 
                  x1="0" 
                  y1="9" 
                  x2="100%" 
                  y2="9" 
                  stroke="#06b6d4" 
                  strokeWidth="2" 
                  strokeDasharray="12 18" 
                  className="animate-flow-fast" 
                />
                {/* URLLC stream */}
                <line 
                  x1="0" 
                  y1="14" 
                  x2="100%" 
                  y2="14" 
                  stroke="#10b981" 
                  strokeWidth="2.5" 
                  strokeDasharray="6 24" 
                  className="animate-flow-fast" 
                />
                {/* mMTC stream */}
                <line 
                  x1="0" 
                  y1="19" 
                  x2="100%" 
                  y2="19" 
                  stroke="#a855f7" 
                  strokeWidth="1.5" 
                  strokeDasharray="3 14" 
                  className="animate-flow-fast" 
                />
              </>
            )}
            {isRunning && isNoSlicing && (
              <line 
                x1="0" 
                y1="14" 
                x2="100%" 
                y2="14" 
                stroke="#ef4444" 
                strokeWidth="4" 
                strokeDasharray="18 8" 
                className="animate-flow-fast" 
              />
            )}
          </svg>

          {/* Legend notes */}
          <div className="relative z-10 w-full flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Radio Ingress (gNodeB)</span>
            <div className="flex items-center gap-4">
              <span className="text-cyan-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                eMBB: {metrics[SLICE_TYPES.EMBB]?.throughput} Mbps
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                URLLC: {metrics[SLICE_TYPES.URLLC]?.latency} ms
              </span>
              <span className="text-purple-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                mMTC: {metrics[SLICE_TYPES.MMTC]?.activeDevices} UEs
              </span>
            </div>
            <span className="text-slate-400">Core Egress (DN)</span>
          </div>
        </div>
      </div>

    </div>
  );
}
