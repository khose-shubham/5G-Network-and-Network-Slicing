import React from 'react';
import { Sparkles, Flame, Car, Cpu, AlertTriangle } from 'lucide-react';
import { PRESET_SCENARIOS } from '../utils/constants';

export default function ScenarioSelector({ activeScenarioId, onSelectScenario }) {
  const getScenarioIcon = (id) => {
    switch (id) {
      case 'baseline':
        return Sparkles;
      case 'stadium_surge':
        return Flame;
      case 'v2x_emergency':
        return Car;
      case 'smart_city_iot':
        return Cpu;
      case 'severe_congestion':
        return AlertTriangle;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-4 lg:p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Live Traffic Scenarios (1-Click Presentation Demos)
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Load patterns to trigger slice stress & isolation checks
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {PRESET_SCENARIOS.map((scenario) => {
          const Icon = getScenarioIcon(scenario.id);
          const isActive = activeScenarioId === scenario.id;

          return (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-950/60 border-blue-500/80 ring-1 ring-blue-500 shadow-md shadow-blue-500/10'
                  : 'bg-navy-950/60 border-navy-700/50 hover:bg-navy-850 hover:border-navy-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className={`p-1.5 rounded-lg ${
                    isActive ? 'bg-blue-600/30 text-cyan-300' : 'bg-navy-800 text-slate-400'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border ${scenario.badgeColor}`}>
                    {scenario.badge}
                  </span>
                </div>

                <div className="text-xs font-bold text-white mb-0.5 leading-snug">
                  {scenario.name}
                </div>
                <div className="text-[10px] text-cyan-400/80 font-mono mb-1.5">
                  {scenario.subtitle}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                  {scenario.description}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-navy-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Traffic Loads:</span>
                <span className="text-slate-300">
                  <span className="text-cyan-400">{scenario.loads.embb}%</span> /{' '}
                  <span className="text-emerald-400">{scenario.loads.urllc}%</span> /{' '}
                  <span className="text-purple-400">{scenario.loads.mmtc}%</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
