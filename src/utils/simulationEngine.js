import { 
  SLICE_TYPES, 
  SLICE_DEFINITIONS, 
  SLICING_MODES, 
  TOTAL_SYSTEM_BANDWIDTH_MBPS, 
  INITIAL_ALLOCATED_BANDWIDTH_MBPS,
  INITIAL_CONNECTED_DEVICES 
} from './constants';

export const TOTAL_SYSTEM_PRBS = 273; // 100 MHz NR Carrier at 30kHz Subcarrier Spacing (3GPP Rel-16)
export const TOTAL_SYSTEM_BANDWIDTH = TOTAL_SYSTEM_BANDWIDTH_MBPS; // 100 Mbps aggregate cell capacity

/**
 * Calculates real-time telemetry metrics for each slice based on current configuration and load.
 */
export function calculateSliceMetrics(slicesConfig, slicingMode, jitterSeed = 0) {
  const result = {};

  // Extract loads
  const embbLoad = slicesConfig[SLICE_TYPES.EMBB].load; // 0 - 100%
  const urllcLoad = slicesConfig[SLICE_TYPES.URLLC].load; // 0 - 100%
  const mmtcLoad = slicesConfig[SLICE_TYPES.MMTC].load; // 0 - 100%

  // Normalize PRB shares
  const rawShareSum = (
    slicesConfig[SLICE_TYPES.EMBB].prbShare +
    slicesConfig[SLICE_TYPES.URLLC].prbShare +
    slicesConfig[SLICE_TYPES.MMTC].prbShare
  ) || 100;

  const embbShare = slicesConfig[SLICE_TYPES.EMBB].prbShare / rawShareSum;
  const urllcShare = slicesConfig[SLICE_TYPES.URLLC].prbShare / rawShareSum;
  const mmtcShare = slicesConfig[SLICE_TYPES.MMTC].prbShare / rawShareSum;

  // Aggregate load for the whole cell
  const aggregateLoadRatio = (embbLoad * 0.60 + urllcLoad * 0.25 + mmtcLoad * 0.15) / 100;

  // Jitter factor for realistic live fluctuation
  const noise = (Math.sin(jitterSeed) * 0.04 + Math.cos(jitterSeed * 1.5) * 0.02);

  // -------------------------------------------------------------
  // CASE 1: NO SLICING (Legacy Best Effort Single Shared FIFO Pipe)
  // -------------------------------------------------------------
  if (slicingMode === SLICING_MODES.NONE) {
    const isOverloaded = aggregateLoadRatio > 0.70;
    const extremeOverload = aggregateLoadRatio > 0.85;

    // Bufferbloat queuing delay
    const baseQueueDelay = Math.max(0, Math.pow(aggregateLoadRatio, 3.2) * 55);
    const commonLoss = extremeOverload 
      ? (aggregateLoadRatio - 0.85) * 18 + Math.abs(noise) * 2
      : isOverloaded ? (aggregateLoadRatio - 0.70) * 5 : 0.02;

    // eMBB in No Slicing
    const embbCap = 70; // Mbps
    const embbThroughput = Math.min(embbCap, (embbLoad / 100) * embbCap * (1 + noise));
    const embbLatency = 16 + baseQueueDelay + (embbLoad > 85 ? 12 : 0) + noise * 3;

    result[SLICE_TYPES.EMBB] = {
      allocatedBw: 50,
      throughput: Math.max(1, Math.round(embbThroughput)),
      latency: Math.max(12, Number(embbLatency.toFixed(1))),
      jitter: Number((3.5 + baseQueueDelay * 0.15 + noise).toFixed(1)),
      packetLoss: Number(Math.max(0, Math.min(100, commonLoss)).toFixed(2)),
      prbAllocated: Math.round(TOTAL_SYSTEM_PRBS * (aggregateLoadRatio > 0.8 ? 0.75 : 0.60)),
      prbUtilization: Math.min(100, Math.round(embbLoad * (aggregateLoadRatio > 0.85 ? 1.05 : 0.95))),
      activeDevices: Math.round(250 + (embbLoad - 45) * 1.5 + noise * 4),
    };

    // URLLC in No Slicing: Suffers severe queuing delays due to eMBB bufferbloat!
    const urllcThroughput = Math.min(25, (urllcLoad / 100) * 25 * (1 + noise));
    const urllcLatency = 2.0 + baseQueueDelay * 1.05 + (isOverloaded ? 15 : 0) + noise * 2;
    const urllcLoss = commonLoss * 1.5;

    result[SLICE_TYPES.URLLC] = {
      allocatedBw: 30,
      throughput: Math.max(1, Math.round(urllcThroughput)),
      latency: Math.max(1.8, Number(urllcLatency.toFixed(1))),
      jitter: Number((1.2 + baseQueueDelay * 0.2 + noise).toFixed(1)),
      packetLoss: Number(Math.max(0, Math.min(100, urllcLoss)).toFixed(3)),
      prbAllocated: Math.round(TOTAL_SYSTEM_PRBS * 0.20),
      prbUtilization: Math.min(100, Math.round(urllcLoad * 0.85)),
      activeDevices: Math.round(65 + (urllcLoad - 25) * 0.6 + noise * 2),
    };

    // mMTC in No Slicing
    const mmtcThroughput = Math.min(8, (mmtcLoad / 100) * 8 * (1 + noise));
    const mmtcLatency = 35 + baseQueueDelay * 1.2 + noise * 4;

    result[SLICE_TYPES.MMTC] = {
      allocatedBw: 10,
      throughput: Math.max(0.5, Number(mmtcThroughput.toFixed(1))),
      latency: Math.max(30, Number(mmtcLatency.toFixed(1))),
      jitter: Number((8 + baseQueueDelay * 0.25 + noise).toFixed(1)),
      packetLoss: Number(Math.max(0, Math.min(100, commonLoss * 1.8)).toFixed(2)),
      prbAllocated: Math.round(TOTAL_SYSTEM_PRBS * 0.10),
      prbUtilization: Math.min(100, Math.round(mmtcLoad * 0.75)),
      activeDevices: Math.round(200 + (mmtcLoad - 30) * 1.2 + noise * 3),
    };
  }

  // -------------------------------------------------------------
  // CASE 2: HARD SLICING (Dedicated PRB Reservation & Zero Interference)
  // -------------------------------------------------------------
  else if (slicingMode === SLICING_MODES.HARD) {
    // 1. eMBB Slice (Isolated)
    const embbPrbs = Math.round(TOTAL_SYSTEM_PRBS * embbShare);
    const embbCap = Math.round(INITIAL_ALLOCATED_BANDWIDTH_MBPS * (50 / 90) * (embbShare / 0.55));
    const embbCongested = embbLoad > 85;
    const embbThroughput = Math.min(embbCap, (embbLoad / 100) * embbCap * (1 + noise * 0.5));
    const embbLatency = 14 + (embbCongested ? Math.pow((embbLoad - 80) / 20, 2) * 18 : (embbLoad / 100) * 6) + noise * 2;
    const embbLoss = embbCongested ? Math.pow((embbLoad - 85) / 15, 2) * 3.8 : 0.01;

    result[SLICE_TYPES.EMBB] = {
      allocatedBw: 50,
      throughput: Math.max(2, Math.round(embbThroughput)),
      latency: Math.max(12, Number(embbLatency.toFixed(1))),
      jitter: Number((2.5 + (embbCongested ? 3.0 : 0.5) + noise).toFixed(1)),
      packetLoss: Number(Math.max(0, Math.min(100, embbLoss)).toFixed(2)),
      prbAllocated: embbPrbs,
      prbUtilization: Math.min(100, Math.round((embbLoad / 100) * 100)),
      activeDevices: Math.round(250 + (embbLoad - 45) * 1.6 + noise * 4),
    };

    // 2. URLLC Slice (100% Shielded & Dedicated Mini-slots)
    const urllcPrbs = Math.round(TOTAL_SYSTEM_PRBS * urllcShare);
    const urllcCap = Math.round(INITIAL_ALLOCATED_BANDWIDTH_MBPS * (30 / 90) * (urllcShare / 0.33));
    const urllcThroughput = Math.min(urllcCap, (urllcLoad / 100) * urllcCap * (1 + noise * 0.2));
    const urllcLatency = 1.2 + (urllcLoad / 100) * 1.8 + noise * 0.2;
    const urllcLoss = urllcLoad > 95 ? 0.005 : 0.000;

    result[SLICE_TYPES.URLLC] = {
      allocatedBw: 30,
      throughput: Math.max(1, Math.round(urllcThroughput)),
      latency: Math.max(0.9, Number(urllcLatency.toFixed(2))),
      jitter: Number((0.2 + (urllcLoad / 100) * 0.3 + Math.abs(noise * 0.1)).toFixed(2)),
      packetLoss: Number(urllcLoss.toFixed(4)),
      prbAllocated: urllcPrbs,
      prbUtilization: Math.min(100, Math.round((urllcLoad / 100) * 90)),
      activeDevices: Math.round(65 + (urllcLoad - 25) * 0.6 + noise * 2),
    };

    // 3. mMTC Slice (Isolated Low-Power)
    const mmtcPrbs = Math.round(TOTAL_SYSTEM_PRBS * mmtcShare);
    const mmtcCap = 10;
    const mmtcThroughput = Math.min(mmtcCap, (mmtcLoad / 100) * mmtcCap * (1 + noise * 0.3));
    const mmtcLatency = 38 + (mmtcLoad / 100) * 22 + noise * 3;
    const mmtcLoss = mmtcLoad > 90 ? (mmtcLoad - 90) * 0.35 : 0.02;

    result[SLICE_TYPES.MMTC] = {
      allocatedBw: 10,
      throughput: Math.max(0.5, Number(mmtcThroughput.toFixed(1))),
      latency: Math.max(30, Number(mmtcLatency.toFixed(1))),
      jitter: Number((5.0 + (mmtcLoad / 100) * 3.5 + noise).toFixed(1)),
      packetLoss: Number(Math.max(0, mmtcLoss).toFixed(2)),
      prbAllocated: mmtcPrbs,
      prbUtilization: Math.min(100, Math.round((mmtcLoad / 100) * 95)),
      activeDevices: Math.round(200 + (mmtcLoad - 30) * 1.2 + noise * 3),
    };
  }

  // -------------------------------------------------------------
  // CASE 3: SOFT SLICING (Dynamic Sharing with QoS Preemption)
  // -------------------------------------------------------------
  else {
    const idleUrllc = Math.max(0, 1 - urllcLoad / 100) * 0.30;
    const idleMmtc = Math.max(0, 1 - mmtcLoad / 100) * 0.10;
    const borrowedShareByEmbb = (idleUrllc * 0.5 + idleMmtc * 0.6);

    const embbCap = Math.round(50 + borrowedShareByEmbb * 30);
    const urllcPreemptPenalty = (urllcLoad > 70) ? (urllcLoad - 70) * 0.3 : 0;
    const embbLatency = 15 + (embbLoad / 100) * 10 + urllcPreemptPenalty + noise * 2;
    const embbLoss = (embbLoad > 90 && urllcLoad > 70) ? 1.5 : (embbLoad > 90 ? 0.6 : 0.02);

    result[SLICE_TYPES.EMBB] = {
      allocatedBw: 50,
      throughput: Math.max(2, Math.round((embbLoad / 100) * embbCap * (1 + noise * 0.4))),
      latency: Math.max(12, Number(embbLatency.toFixed(1))),
      jitter: Number((2.8 + urllcPreemptPenalty * 0.1 + noise).toFixed(1)),
      packetLoss: Number(Math.max(0, Math.min(100, embbLoss)).toFixed(2)),
      prbAllocated: Math.round(TOTAL_SYSTEM_PRBS * (embbShare + borrowedShareByEmbb * 0.2)),
      prbUtilization: Math.min(100, Math.round((embbLoad / 100) * 98)),
      activeDevices: Math.round(250 + (embbLoad - 45) * 1.6 + noise * 4),
    };

    // URLLC in Soft Slicing: Preemption keeps latency low
    result[SLICE_TYPES.URLLC] = {
      allocatedBw: 30,
      throughput: Math.max(1, Math.round((urllcLoad / 100) * 30 * (1 + noise * 0.2))),
      latency: Math.max(1.1, Number((1.3 + (urllcLoad / 100) * 2.1 + noise * 0.2).toFixed(2))),
      jitter: Number((0.3 + (urllcLoad / 100) * 0.4 + Math.abs(noise * 0.1)).toFixed(2)),
      packetLoss: Number((urllcLoad > 96 ? 0.008 : 0.001).toFixed(4)),
      prbAllocated: Math.round(TOTAL_SYSTEM_PRBS * urllcShare),
      prbUtilization: Math.min(100, Math.round(urllcLoad * 0.9)),
      activeDevices: Math.round(65 + (urllcLoad - 25) * 0.6 + noise * 2),
    };

    // mMTC in Soft Slicing
    result[SLICE_TYPES.MMTC] = {
      allocatedBw: 10,
      throughput: Math.max(0.5, Number(((mmtcLoad / 100) * 10 * (1 + noise * 0.3)).toFixed(1))),
      latency: Math.max(28, Number((35 + (mmtcLoad / 100) * 20 + noise * 3).toFixed(1))),
      jitter: Number((4.5 + (mmtcLoad / 100) * 3.2 + noise).toFixed(1)),
      packetLoss: Number(Math.max(0, mmtcLoad > 88 ? (mmtcLoad - 88) * 0.25 : 0.03).toFixed(2)),
      prbAllocated: Math.round(TOTAL_SYSTEM_PRBS * mmtcShare),
      prbUtilization: Math.min(100, Math.round(mmtcLoad * 0.92)),
      activeDevices: Math.round(200 + (mmtcLoad - 30) * 1.2 + noise * 3),
    };
  }

  // -------------------------------------------------------------
  // SLA EVALUATION & GLOBAL NETWORK STATUS
  // -------------------------------------------------------------
  let criticalCount = 0;
  let warningCount = 0;

  Object.keys(result).forEach((sliceKey) => {
    const data = result[sliceKey];
    const def = SLICE_DEFINITIONS[sliceKey];
    const breaches = [];

    // Latency evaluation
    if (data.latency > def.sla.maxLatency * 1.5) {
      breaches.push(`Critical Latency: ${data.latency}ms exceeds SLA limit of ${def.sla.maxLatency}ms`);
    } else if (data.latency > def.sla.maxLatency) {
      breaches.push(`High Latency: ${data.latency}ms > ${def.sla.maxLatency}ms threshold`);
    }

    // Packet loss evaluation
    if (data.packetLoss > def.sla.maxPacketLoss * 2) {
      breaches.push(`Severe Packet Loss: ${data.packetLoss}% exceeds SLA limit of ${def.sla.maxPacketLoss}%`);
    } else if (data.packetLoss > def.sla.maxPacketLoss) {
      breaches.push(`Packet Loss: ${data.packetLoss}% > ${def.sla.maxPacketLoss}% threshold`);
    }

    let status = 'NORMAL';
    if (breaches.length > 0) {
      if (
        data.latency > def.sla.maxLatency * 1.3 ||
        data.packetLoss > def.sla.maxPacketLoss * 2 ||
        (sliceKey === SLICE_TYPES.URLLC && data.latency > def.sla.maxLatency)
      ) {
        status = 'CRITICAL';
        criticalCount++;
      } else {
        status = 'WARNING';
        warningCount++;
      }
    } else if (data.prbUtilization > 85) {
      status = 'WARNING';
      warningCount++;
    }

    data.slaStatus = status;
    data.slaBreaches = breaches;
  });

  // Calculate Global Network Status: NORMAL | WARNING | CONGESTED
  let overallNetworkStatus = 'NORMAL';
  if (criticalCount > 0 || aggregateLoadRatio > 0.88 || (slicingMode === SLICING_MODES.NONE && aggregateLoadRatio > 0.75)) {
    overallNetworkStatus = 'CONGESTED';
  } else if (warningCount > 0 || aggregateLoadRatio > 0.70) {
    overallNetworkStatus = 'WARNING';
  }

  // Total allocated bandwidth across active slices
  const totalAllocatedBw = INITIAL_ALLOCATED_BANDWIDTH_MBPS; // 90 Mbps
  const totalConnectedDevices = (
    result[SLICE_TYPES.EMBB].activeDevices +
    result[SLICE_TYPES.URLLC].activeDevices +
    result[SLICE_TYPES.MMTC].activeDevices
  );

  return {
    ...result,
    _global: {
      totalBandwidth: TOTAL_SYSTEM_BANDWIDTH_MBPS, // 100 Mbps
      allocatedBandwidth: totalAllocatedBw, // 90 Mbps
      activeSlices: 3,
      totalConnectedDevices: totalConnectedDevices || INITIAL_CONNECTED_DEVICES,
      networkStatus: overallNetworkStatus, // 'NORMAL' | 'WARNING' | 'CONGESTED'
      aggregateLoadRatio,
    }
  };
}

/**
 * Generates an event log record when notable network events happen.
 */
export function generateEventLog(metrics, slicingMode, prevStatus) {
  const logs = [];
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

  [SLICE_TYPES.EMBB, SLICE_TYPES.URLLC, SLICE_TYPES.MMTC].forEach((sliceKey) => {
    const metric = metrics[sliceKey];
    if (!metric) return;
    const def = SLICE_DEFINITIONS[sliceKey];
    const currentStatus = metric.slaStatus;
    const oldStatus = prevStatus?.[sliceKey];

    if (currentStatus === 'CRITICAL' && oldStatus !== 'CRITICAL') {
      logs.push({
        id: Math.random().toString(36).substr(2, 9),
        time: timestamp,
        type: 'critical',
        slice: def.shortName,
        message: `SLA BREACH on [${def.snssai}]: ${metric.slaBreaches[0] || 'Quality parameters violated'}`,
      });
    } else if (currentStatus === 'WARNING' && oldStatus === 'NORMAL') {
      logs.push({
        id: Math.random().toString(36).substr(2, 9),
        time: timestamp,
        type: 'warning',
        slice: def.shortName,
        message: `QoS Warning on [${def.snssai}]: Resource utilization high (${metric.prbUtilization}%), latency rising`,
      });
    } else if (currentStatus === 'NORMAL' && (oldStatus === 'CRITICAL' || oldStatus === 'WARNING')) {
      logs.push({
        id: Math.random().toString(36).substr(2, 9),
        time: timestamp,
        type: 'normal',
        slice: def.shortName,
        message: `SLA Restored on [${def.snssai}]: Operating in nominal boundary (${metric.latency}ms, ${metric.throughput} Mbps)`,
      });
    }
  });

  return logs;
}
