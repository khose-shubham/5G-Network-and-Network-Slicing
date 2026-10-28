// 5G 3GPP Release 16/17 Slicing Specifications and Constants

export const TOTAL_SYSTEM_BANDWIDTH_MBPS = 100; // 100 Mbps Demonstration Total Bandwidth
export const INITIAL_ALLOCATED_BANDWIDTH_MBPS = 90; // 90 Mbps Initial Allocated Bandwidth
export const INITIAL_CONNECTED_DEVICES = 515; // 515 Connected Simulated Devices

export const SLICE_TYPES = {
  EMBB: 'embb',
  URLLC: 'urllc',
  MMTC: 'mmtc',
};

export const SLICE_DEFINITIONS = {
  [SLICE_TYPES.EMBB]: {
    id: SLICE_TYPES.EMBB,
    name: 'Enhanced Mobile Broadband',
    shortName: 'eMBB',
    sst: 1, // 3GPP Slice/Service Type
    sd: '000001', // Slice Differentiator
    snssai: 'SST-1:eMBB',
    fiveQI: 9, // 5G QoS Identifier (Default Internet / High throughput)
    color: '#06b6d4', // Cyan
    accentClass: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20',
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    description: 'Ultra-high data rates for 4K/8K streaming, cloud gaming, and VR/AR.',
    targetUseCases: 'Mobile UHD Video, AR/VR, Dense Urban Hotspots',
    defaultPrbShare: 55, // % of total spectrum PRBs
    defaultBandwidth: 50, // Capacity in Mbps (Initial demo share of 90 Mbps)
    initialDevices: 250,
    sla: {
      minThroughput: 25, // Mbps minimum guaranteed
      maxLatency: 30, // ms maximum allowed
      maxPacketLoss: 1.0, // % max
    },
    numerology: 'μ = 1 (30 kHz subcarrier spacing)',
    queueDiscipline: 'Fair Queuing with Throughput Bias',
  },
  [SLICE_TYPES.URLLC]: {
    id: SLICE_TYPES.URLLC,
    name: 'Ultra-Reliable Low-Latency',
    shortName: 'URLLC',
    sst: 2,
    sd: '000002',
    snssai: 'SST-2:URLLC',
    fiveQI: 82, // 5G QoS Identifier for Discrete Automation / V2X
    color: '#10b981', // Emerald
    accentClass: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Mission-critical sub-5ms latency and 99.999% reliability.',
    targetUseCases: 'Autonomous Driving (V2X), Remote Surgery, Smart Grids, Industrial Robotics',
    defaultPrbShare: 33,
    defaultBandwidth: 30, // Capacity in Mbps
    initialDevices: 65,
    sla: {
      minThroughput: 5,
      maxLatency: 5, // ms strict threshold
      maxPacketLoss: 0.01, // 99.999% reliability
    },
    numerology: 'μ = 3 (120 kHz mini-slot preemption)',
    queueDiscipline: 'Strict Priority Preemption (Zero-Buffer Queuing)',
  },
  [SLICE_TYPES.MMTC]: {
    id: SLICE_TYPES.MMTC,
    name: 'Massive Machine-Type Comms',
    shortName: 'mMTC',
    sst: 3,
    sd: '000003',
    snssai: 'SST-3:mMTC',
    fiveQI: 79, // 5G QoS Identifier for Sensor Data
    color: '#a855f7', // Purple
    accentClass: 'text-purple-400 border-purple-500/40 bg-purple-950/20',
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    description: 'High connection density with tiny, sporadic telemetry packets.',
    targetUseCases: 'Smart City Sensors, Utility Smart Meters, Environmental Telemetry',
    defaultPrbShare: 12,
    defaultBandwidth: 10, // Capacity in Mbps
    initialDevices: 200,
    sla: {
      minThroughput: 1,
      maxLatency: 150, // ms tolerant
      maxPacketLoss: 3.0,
    },
    numerology: 'μ = 0 (15 kHz subcarrier spacing, high power efficiency)',
    queueDiscipline: 'Aggregation Batching (Energy Optimised)',
  },
};

export const SLICING_MODES = {
  HARD: 'hard', // Dedicated PRBs, zero interference
  SOFT: 'soft', // Shared PRBs with dynamic QoS preemption
  NONE: 'none', // Legacy 4G single pipe best-effort (No slicing)
};

export const PRESET_SCENARIOS = [
  {
    id: 'baseline',
    name: 'Balanced Network State',
    subtitle: 'Standard city traffic across all slices',
    description: 'Normal load with standard day-to-day operations. All slices operate well within SLAs.',
    badge: 'Normal Baseline',
    badgeColor: 'border-slate-600 text-slate-300 bg-slate-800/40',
    loads: {
      embb: 45, // % traffic load
      urllc: 25,
      mmtc: 30,
    },
  },
  {
    id: 'stadium_surge',
    name: 'Stadium / 8K Video Surge',
    subtitle: 'eMBB Bandwidth Hogging',
    description: 'Massive 8K streaming surge from a packed football stadium. In "No Slicing" mode, this suffocates other traffic!',
    badge: 'eMBB Surge (95%)',
    badgeColor: 'border-cyan-500/50 text-cyan-400 bg-cyan-950/40',
    loads: {
      embb: 98,
      urllc: 30,
      mmtc: 25,
    },
  },
  {
    id: 'v2x_emergency',
    name: 'Autonomous Vehicle Incident',
    subtitle: 'URLLC Critical Traffic Burst',
    description: 'Emergency multi-car avoidance collision telemetry broadcast. Requires immediate zero-latency transmission.',
    badge: 'URLLC Priority Peak',
    badgeColor: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/40',
    loads: {
      embb: 50,
      urllc: 95,
      mmtc: 20,
    },
  },
  {
    id: 'smart_city_iot',
    name: 'Smart City Midnight Burst',
    subtitle: 'mMTC High-Density Device Flood',
    description: 'Municipal smart power meters and IoT telemetry reporting simultaneously.',
    badge: 'mMTC Density Burst',
    badgeColor: 'border-purple-500/50 text-purple-400 bg-purple-950/40',
    loads: {
      embb: 30,
      urllc: 20,
      mmtc: 95,
    },
  },
  {
    id: 'severe_congestion',
    name: 'Extreme Network Congestion',
    subtitle: 'High Overload Test (Stress Test)',
    description: 'All slices experience concurrent maximum demands. Demonstrates how Slicing protects life-critical URLLC while degrading best-effort eMBB.',
    badge: 'Critical Congestion',
    badgeColor: 'border-red-500/50 text-red-400 bg-red-950/40',
    loads: {
      embb: 95,
      urllc: 90,
      mmtc: 90,
    },
  },
];
