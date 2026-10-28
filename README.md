# 5G Network Slicing Simulator (Computer Networks Presentation)

An interactive, frontend-only telecommunications **Network Operations Center (NOC) Dashboard** and simulation testbed demonstrating **5G Network Slicing (3GPP Release 16/17)** for Computer Networking presentations and demonstrations.

---

## 🚀 Live Demo Quickstart

Ensure Node.js is installed, then run in the project root:

```bash
npm install
npm run dev
```

Then open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🎯 Presentation Objectives & Demonstrated Concepts

This application was engineered specifically to answer the core questions professors and students explore in modern cellular network architecture:

1. **Why Slicing is Essential:** Why 4G LTE's "one-size-fits-all" best-effort single pipe cannot simultaneously handle 8K video streaming and autonomous vehicle emergency brakes.
2. **The 3 Canonical 3GPP Slice Types (S-NSSAI):**
   - **eMBB (Enhanced Mobile Broadband - SST: 1):** High bandwidth (Gbps), relaxed latency (10-30ms), fair queuing.
   - **URLLC (Ultra-Reliable Low-Latency Communication - SST: 2):** Sub-5ms strict latency, 99.999% reliability, zero packet loss tolerance, 5QI:82 mini-slot preemption.
   - **mMTC (Massive Machine-Type Communications - SST: 3):** High device density (up to 1,000,000 nodes/km²), energy-efficient battery conservation, tolerant of latency.
3. **5G Architecture Pipeline:** Visualizing traffic flow across:
   - **User Equipment (UE)**
   - **5G RAN (gNodeB)** with 273 PRBs (100MHz NR) and flexible numerology ($\mu=0, 1, 3$)
   - **5G Core Control Plane (NSSF, AMF, SMF)**
   - **Dedicated User Plane Functions (UPF)** at Central Cloud vs. Local Edge Multi-Access Computing (MEC)
   - **Data Networks (DN)**

---

## 🎙️ Step-by-Step Live Classroom Presentation Walkthrough

Follow this scripted 4-step sequence during your presentation:

### Step 1: Establish the Baseline
- Select **"Hard Slicing (Dedicated PRBs)"** and click **"Balanced Network State"**.
- Point out the **green "SLA MET • OPTIMAL" badges** across all three slices.
- Note that URLLC operates at **~1.8 ms** latency, well below its **5.0 ms** critical ceiling.

### Step 2: Trigger the Video Spike
- Click **"Stadium / 8K Video Surge"**.
- Show that eMBB traffic load surges to **98%**, consuming heavy throughput.
- **Key Observation:** Because Hard Slicing reserves isolated Physical Resource Blocks (PRBs), **URLLC latency remains rock-solid (< 2.5 ms)**. Cross-slice interference is zero.

### Step 3: The Climax — Demonstrate the 4G Problem ("No Slicing")
- Toggle to **"No Slicing (Legacy 4G Single Pipe)"**.
- **Watch the Recharts Latency Chart:** In a single shared FIFO queue, the heavy video chunks cause massive **bufferbloat**.
- URLLC latency spikes from **2 ms to 45–80+ ms**, crossing the red dashed **5.0 ms SLA threshold line**!
- Point to the red **"SLA BREACHED"** alarm:
  > *"Class, this demonstrates why 4G fails for autonomous vehicles. When crowds stream video at a stadium, emergency vehicle brake signals get stuck in the buffer queue, leading to dangerous delays."*

### Step 4: Show Modern Efficiency with "Dynamic Soft Slicing"
- Toggle to **"Dynamic Soft Slicing"**.
- Show how **5QI priority preemption** immediately restores URLLC latency under 5.0 ms, while allowing eMBB to opportunistically borrow unused spectrum when other slices are quiet.

---

## 🛠️ Tech Stack

- **React 18** (Functional components, hooks, local simulation state)
- **Vite** (Next-generation lightning-fast dev server)
- **Tailwind CSS** (Custom telecommunications NOC dark palette)
- **Recharts** (Real-time time-series latency, throughput, PRB allocation, packet loss)
- **Lucide React** (Clean telecom and networking icons)
- **Pure JavaScript Simulation Engine** (M/M/1/K queuing theory & 3GPP QoS models)
