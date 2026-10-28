import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import TopMetricCards from './components/TopMetricCards';
import SliceCard from './components/SliceCard';
import ScenarioSelector from './components/ScenarioSelector';
import SlicingModeToggle from './components/SlicingModeToggle';
import ArchitectureTopology from './components/ArchitectureTopology';
import NetworkCharts from './components/NetworkCharts';
import EventLog from './components/EventLog';
import PresentationModal from './components/PresentationModal';
import { 
  SLICE_TYPES, 
  SLICE_DEFINITIONS, 
  SLICING_MODES, 
  PRESET_SCENARIOS 
} from './utils/constants';
import { 
  calculateSliceMetrics, 
  generateEventLog 
} from './utils/simulationEngine';

export default function App() {
  // Simulation Controls State
  const [isRunning, setIsRunning] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [tickCount, setTickCount] = useState(1);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  // Slicing Mode
  const [slicingMode, setSlicingMode] = useState(SLICING_MODES.HARD);

  // Active Scenario
  const [activeScenarioId, setActiveScenarioId] = useState('baseline');

  // Slice Configurations (Traffic Demand and PRB Quotas)
  const [slicesConfig, setSlicesConfig] = useState({
    [SLICE_TYPES.EMBB]: {
      load: 45,
      prbShare: 55,
    },
    [SLICE_TYPES.URLLC]: {
      load: 25,
      prbShare: 33,
    },
    [SLICE_TYPES.MMTC]: {
      load: 30,
      prbShare: 12,
    },
  });

  // Current Metrics
  const [metrics, setMetrics] = useState(() => 
    calculateSliceMetrics(slicesConfig, slicingMode, 0)
  );

  // Telemetry History for Recharts (Rolling 20 points)
  const [historyData, setHistoryData] = useState(() => {
    const initial = [];
    for (let i = 10; i >= 1; i--) {
      const mockMetrics = calculateSliceMetrics(slicesConfig, slicingMode, i);
      initial.push({
        time: `-${i}s`,
        embbLatency: mockMetrics[SLICE_TYPES.EMBB].latency,
        urllcLatency: mockMetrics[SLICE_TYPES.URLLC].latency,
        mmtcLatency: mockMetrics[SLICE_TYPES.MMTC].latency,
        embbThroughput: mockMetrics[SLICE_TYPES.EMBB].throughput,
        urllcThroughput: mockMetrics[SLICE_TYPES.URLLC].throughput,
        mmtcThroughput: mockMetrics[SLICE_TYPES.MMTC].throughput,
      });
    }
    return initial;
  });

  // Event Logs
  const [logs, setLogs] = useState([
    {
      id: 'init-1',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'normal',
      slice: 'SYSTEM',
      message: '5G Core NSSF initialized with 3 Network Slice Instances (S-NSSAI: SST 1, 2, 3)',
    },
    {
      id: 'init-2',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'normal',
      slice: 'URLLC',
      message: 'Dedicated Edge MEC User Plane Function (UPF) deployed for sub-5ms SLA',
    },
    {
      id: 'init-3',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'normal',
      slice: 'eMBB',
      message: '100MHz NR Carrier (273 PRBs) configured at 30kHz SCS numerology',
    },
  ]);

  // Ref to track previous status for event notifications
  const prevStatusRef = useRef({
    [SLICE_TYPES.EMBB]: 'NORMAL',
    [SLICE_TYPES.URLLC]: 'NORMAL',
    [SLICE_TYPES.MMTC]: 'NORMAL',
  });

  // Simulation Tick Loop
  useEffect(() => {
    if (!isRunning) return;

    const intervalTime = Math.max(250, Math.round(900 / simSpeed));

    const interval = setInterval(() => {
      setTickCount((prev) => prev + 1);

      // Compute new metrics with slight randomized jitter seed
      const currentTick = tickCount + 1;
      const newMetrics = calculateSliceMetrics(slicesConfig, slicingMode, currentTick);
      setMetrics(newMetrics);

      // Log generation on status changes
      const newEvents = generateEventLog(
        newMetrics, 
        slicingMode, 
        prevStatusRef.current
      );

      if (newEvents.length > 0) {
        setLogs((prev) => [...newEvents, ...prev].slice(0, 50));
      }

      // Update previous status ref
      prevStatusRef.current = {
        [SLICE_TYPES.EMBB]: newMetrics[SLICE_TYPES.EMBB].slaStatus,
        [SLICE_TYPES.URLLC]: newMetrics[SLICE_TYPES.URLLC].slaStatus,
        [SLICE_TYPES.MMTC]: newMetrics[SLICE_TYPES.MMTC].slaStatus,
      };

      // Append to rolling Recharts history
      const nowStr = `${currentTick}s`;
      setHistoryData((prev) => {
        const next = [
          ...prev.slice(-19),
          {
            time: nowStr,
            embbLatency: newMetrics[SLICE_TYPES.EMBB].latency,
            urllcLatency: newMetrics[SLICE_TYPES.URLLC].latency,
            mmtcLatency: newMetrics[SLICE_TYPES.MMTC].latency,
            embbThroughput: newMetrics[SLICE_TYPES.EMBB].throughput,
            urllcThroughput: newMetrics[SLICE_TYPES.URLLC].throughput,
            mmtcThroughput: newMetrics[SLICE_TYPES.MMTC].throughput,
          },
        ];
        return next;
      });

    }, intervalTime);

    return () => clearInterval(interval);
  }, [isRunning, simSpeed, slicesConfig, slicingMode, tickCount]);

  // Handlers
  const handleSelectScenario = (scenario) => {
    setActiveScenarioId(scenario.id);
    setSlicesConfig({
      [SLICE_TYPES.EMBB]: {
        ...slicesConfig[SLICE_TYPES.EMBB],
        load: scenario.loads.embb,
      },
      [SLICE_TYPES.URLLC]: {
        ...slicesConfig[SLICE_TYPES.URLLC],
        load: scenario.loads.urllc,
      },
      [SLICE_TYPES.MMTC]: {
        ...slicesConfig[SLICE_TYPES.MMTC],
        load: scenario.loads.mmtc,
      },
    });

    setLogs((prev) => [
      {
        id: Math.random().toString(36).substr(2, 9),
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        type: 'normal',
        slice: 'SCENARIO',
        message: `Applied scenario [${scenario.name}]: eMBB ${scenario.loads.embb}%, URLLC ${scenario.loads.urllc}%, mMTC ${scenario.loads.mmtc}%`,
      },
      ...prev,
    ]);
  };

  const handleUpdateConfig = (sliceKey, field, value) => {
    setActiveScenarioId('custom');
    setSlicesConfig((prev) => ({
      ...prev,
      [sliceKey]: {
        ...prev[sliceKey],
        [field]: value,
      },
    }));
  };

  const handleReset = () => {
    setSlicingMode(SLICING_MODES.HARD);
    setActiveScenarioId('baseline');
    setSlicesConfig({
      [SLICE_TYPES.EMBB]: { load: 45, prbShare: 55 },
      [SLICE_TYPES.URLLC]: { load: 25, prbShare: 33 },
      [SLICE_TYPES.MMTC]: { load: 30, prbShare: 12 },
    });
    setLogs([
      {
        id: Math.random().toString(36).substr(2, 9),
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        type: 'normal',
        slice: 'RESET',
        message: 'System reset to default 3GPP Rel-16 baseline configuration',
      },
    ]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-navy-950">
      
      {/* Top Navigation Header */}
      <Header
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        simSpeed={simSpeed}
        setSimSpeed={setSimSpeed}
        handleReset={handleReset}
        tickCount={tickCount}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        
        {/* Main Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-navy-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              5G Network Slicing Simulator
              <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">
                NOC Operations
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Interactive simulation of network resources, traffic, and performance.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>3GPP Rel-16 • 100 MHz NR Carrier</span>
          </div>
        </div>

        {/* Top Metric Cards (Total Bandwidth: 100 Mbps, Allocated: 90 Mbps, Active Slices: 3, Devices: 515) & Network Status Indicator */}
        <TopMetricCards globalMetrics={metrics._global} />

        {/* Display Three Network Slice Cards */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Active Network Slice Instances (S-NSSAI Controllers)
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Adjust sliders below to live test QoS and PRB allocation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            <SliceCard
              sliceKey={SLICE_TYPES.EMBB}
              metric={metrics[SLICE_TYPES.EMBB]}
              sliceConfig={slicesConfig[SLICE_TYPES.EMBB]}
              onUpdateConfig={handleUpdateConfig}
              slicingMode={slicingMode}
            />
            <SliceCard
              sliceKey={SLICE_TYPES.URLLC}
              metric={metrics[SLICE_TYPES.URLLC]}
              sliceConfig={slicesConfig[SLICE_TYPES.URLLC]}
              onUpdateConfig={handleUpdateConfig}
              slicingMode={slicingMode}
            />
            <SliceCard
              sliceKey={SLICE_TYPES.MMTC}
              metric={metrics[SLICE_TYPES.MMTC]}
              sliceConfig={slicesConfig[SLICE_TYPES.MMTC]}
              onUpdateConfig={handleUpdateConfig}
              slicingMode={slicingMode}
            />
          </div>
        </div>

        {/* Architecture Mode Selector (Hard vs Soft vs None) */}
        <SlicingModeToggle
          slicingMode={slicingMode}
          setSlicingMode={setSlicingMode}
        />

        {/* 1-Click Scenario Preset Buttons */}
        <ScenarioSelector
          activeScenarioId={activeScenarioId}
          onSelectScenario={handleSelectScenario}
        />

        {/* Visual 5G Network Slice Architecture Topology & Flow */}
        <ArchitectureTopology
          metrics={metrics}
          slicingMode={slicingMode}
          isRunning={isRunning}
        />

        {/* Real-time Telemetry Charts (Recharts) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Real-time NOC Telemetry & SLA Compliance Analytics
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Updated live every cycle
            </span>
          </div>

          <NetworkCharts
            historyData={historyData}
            metrics={metrics}
          />
        </div>

        {/* Live NOC Telemetry & SLA Event Log Console */}
        <EventLog
          logs={logs}
          onClearLogs={handleClearLogs}
        />

      </main>

      {/* College Presentation Guide Modal */}
      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-navy-800 bg-navy-950 py-4 px-4 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>5G Network Slicing Simulator • Computer Networking Project</span>
          <span className="text-slate-400">
            Frontend-only Local Simulation • 3GPP TS 23.501 / TS 38.300
          </span>
        </div>
      </footer>

    </div>
  );
}
