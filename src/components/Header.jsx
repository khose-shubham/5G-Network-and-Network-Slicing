import React from 'react';
import { 
  Radio, 
  Play, 
  Pause, 
  RotateCcw, 
  BookOpen, 
  Activity, 
  FastForward,
  Cpu,
  Layers
} from 'lucide-react';

export default function Header({ 
  isRunning, 
  setIsRunning, 
  simSpeed, 
  setSimSpeed, 
  handleReset, 
  tickCount, 
  onOpenPresentation 
}) {
  return (
    <header className="border-b border-navy-700 bg-navy-900/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5 shadow-xl shadow-navy-950/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title and Branding */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-navy-800 border border-cyan-500/40 shadow-lg shadow-cyan-500/10">
            <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                5G Network Slicing Simulator
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">
                  NOC Testbed
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive simulation of network resources, traffic, and performance.
            </p>
          </div>
        </div>

        {/* Live Simulation Controls & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Ticks & State Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-navy-700 bg-navy-950 text-xs font-mono text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-400">CYCLE:</span>
            <span className="font-semibold text-white">{tickCount}</span>
          </div>

          {/* Speed multiplier toggle */}
          <div className="flex items-center bg-navy-950 rounded-lg p-0.5 border border-navy-700">
            {[1, 2, 4].map((speed) => (
              <button
                key={speed}
                onClick={() => setSimSpeed(speed)}
                className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                  simSpeed === speed
                    ? 'bg-blue-600 text-white font-semibold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Simulation speed ${speed}x`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Play / Pause Button */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shadow-md ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume</span>
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-navy-850 hover:bg-navy-800 border border-navy-700 hover:border-slate-500 transition-all"
            title="Reset simulation parameters to default baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Presentation Mode / Explainer Guide Button */}
          <button
            onClick={onOpenPresentation}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/30 shadow-lg shadow-cyan-600/20 transition-all transform hover:-translate-y-0.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Presentation Guide</span>
          </button>

        </div>
      </div>
    </header>
  );
}
