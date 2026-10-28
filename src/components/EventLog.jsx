import React, { useState } from 'react';
import { Terminal, Trash2, Filter, AlertTriangle, CheckCircle, AlertOctagon, Info } from 'lucide-react';

export default function EventLog({ logs, onClearLogs }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'critical' | 'warning' | 'normal'

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.type === filter;
  });

  const getLogIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertOctagon className="w-3.5 h-3.5 text-red-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'normal':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      default:
        return <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-4 lg:p-5 shadow-xl flex flex-col justify-between">
      
      {/* Header and Filter Controls */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              5G NOC Telemetry & SLA Event Log
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-navy-950 text-cyan-400 border border-navy-800">
              {logs.length} Events
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="flex items-center bg-navy-950 rounded-lg p-0.5 border border-navy-800 text-[10px] font-mono">
              <button
                onClick={() => setFilter('all')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  filter === 'all' ? 'bg-navy-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('critical')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  filter === 'critical' ? 'bg-red-900/60 text-red-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Critical
              </button>
              <button
                onClick={() => setFilter('warning')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  filter === 'warning' ? 'bg-amber-900/60 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Warnings
              </button>
            </div>

            {/* Clear logs */}
            <button
              onClick={onClearLogs}
              className="p-1.5 rounded-lg bg-navy-950 hover:bg-navy-800 border border-navy-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Clear event logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Log Viewer Console */}
        <div className="bg-navy-950 rounded-xl p-3 border border-navy-800/80 font-mono text-xs max-h-52 overflow-y-auto space-y-1.5 scrollbar-thin">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-500 text-center py-6 italic text-[11px]">
              No events recorded matching filter. Run simulation to stream 5G telemetry...
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-2.5 py-1 px-1.5 rounded hover:bg-navy-900/60 transition-colors border-b border-navy-900/50 last:border-0"
              >
                <span className="text-[10px] text-slate-500 shrink-0 mt-0.5">
                  [{log.time}]
                </span>
                {getLogIcon(log.type)}
                <span className={`text-[10px] font-bold shrink-0 px-1.5 py-0.2 rounded border ${
                  log.slice === 'eMBB'
                    ? 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30'
                    : log.slice === 'URLLC'
                    ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30'
                    : 'text-purple-400 border-purple-500/30 bg-purple-950/30'
                }`}>
                  {log.slice}
                </span>
                <span className={`text-[11px] leading-snug break-words ${
                  log.type === 'critical'
                    ? 'text-red-300 font-semibold'
                    : log.type === 'warning'
                    ? 'text-amber-300'
                    : 'text-slate-300'
                }`}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between">
        <span>3GPP Service Based Interface (SBI) Event Stream</span>
        <span>Standard: 3GPP TS 23.501 / TS 28.531</span>
      </div>

    </div>
  );
}
