import React from 'react';
import { ShieldCheck, Share2, AlertOctagon, Info } from 'lucide-react';
import { SLICING_MODES } from '../utils/constants';

export default function SlicingModeToggle({ slicingMode, setSlicingMode }) {
  const modes = [
    {
      id: SLICING_MODES.HARD,
      title: 'Hard Slicing (Dedicated PRBs)',
      subtitle: 'Guaranteed Physical Isolation',
      desc: 'PRBs and bandwidth are strictly partitioned per slice. Zero cross-slice interference; maximum SLA protection even under severe overload.',
      icon: ShieldCheck,
      color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400',
      activeRing: 'ring-2 ring-emerald-500 bg-navy-850',
      badge: '3GPP Rel-16 Compliant',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      id: SLICING_MODES.SOFT,
      title: 'Dynamic Soft Slicing',
      subtitle: 'Priority-Weighted Sharing (5QI)',
      desc: 'Idle spectrum is dynamically shared across slices, but high-priority slices (URLLC 5QI:82) immediately preempt eMBB if latency thresholds are threatened.',
      icon: Share2,
      color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-400',
      activeRing: 'ring-2 ring-cyan-500 bg-navy-850',
      badge: 'High Spectrum Efficiency',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    },
    {
      id: SLICING_MODES.NONE,
      title: 'No Slicing (Legacy 4G Single Pipe)',
      subtitle: 'Best-Effort FIFO Multiplexing',
      desc: 'Single shared queue with no QoS slice isolation. High-throughput video (eMBB) causes bufferbloat, starving URLLC and causing critical SLA failures.',
      icon: AlertOctagon,
      color: 'border-red-500/50 bg-red-950/20 text-red-400',
      activeRing: 'ring-2 ring-red-500 bg-navy-850',
      badge: 'Demonstration: 4G Bottleneck',
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
    },
  ];

  return (
    <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-4 lg:p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Network Slicing Architecture Mode
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          Toggle modes to demonstrate slice isolation vs legacy bufferbloat
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {modes.map((m) => {
          const Icon = m.icon;
          const isSelected = slicingMode === m.id;

          return (
            <button
              key={m.id}
              onClick={() => setSlicingMode(m.id)}
              className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? `${m.activeRing} shadow-lg border-transparent`
                  : 'bg-navy-950/70 border-navy-700/60 hover:border-navy-600 hover:bg-navy-850/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${m.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-white tracking-tight">
                      {m.title}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-cyan-400/90 mb-1">
                  {m.subtitle}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {m.desc}
                </p>
              </div>

              {isSelected && (
                <div className="mt-2.5 pt-2 border-t border-navy-700/50 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">STATUS:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    ACTIVE IN SIMULATION
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
