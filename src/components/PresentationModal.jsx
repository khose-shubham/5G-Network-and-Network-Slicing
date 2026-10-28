import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  CheckCircle, 
  Layers, 
  Radio, 
  Cpu, 
  AlertTriangle, 
  HelpCircle,
  PlayCircle
} from 'lucide-react';

export default function PresentationModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: '1. What is 5G Network Slicing?',
      subtitle: 'Motivation & Architectural Shift from 4G LTE',
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-slate-300">
          <div className="p-3.5 rounded-xl bg-navy-950/80 border border-navy-800 text-slate-200">
            <span className="font-semibold text-cyan-400 block mb-1">
              Core Definition (3GPP TS 23.501):
            </span>
            <p>
              Network Slicing allows mobile telecom operators to partition a single, shared physical 5G infrastructure into multiple dedicated, customized, and isolated <strong>logical virtual networks</strong> tailored to distinct QoS (Quality of Service) requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30">
              <h4 className="text-red-400 font-bold mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                <span>The 4G LTE Limitation: "One-Size-Fits-All"</span>
              </h4>
              <p className="text-xs text-slate-300">
                4G treats all IP packets similarly in a single shared best-effort pipe. When someone streams heavy 4K/8K video, high bandwidth chunks cause <em>bufferbloat</em>, causing severe queuing delay and packet loss for critical emergency packets.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <h4 className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                <span>The 5G Solution: End-to-End Slicing</span>
              </h4>
              <p className="text-xs text-slate-300">
                5G partitions resources at every tier: <strong>Radio (PRBs & Numerology)</strong>, <strong>Transport (SDN Tunnels)</strong>, and <strong>Core (Dedicated UPF & NSSF routing)</strong>. High video load is isolated and cannot contaminate mission-critical slices.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-navy-950/60 border border-navy-800 text-xs">
            <span className="font-semibold text-white block mb-1.5">
              Key Enabling Technologies:
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong>NFV (Network Functions Virtualization):</strong> Running network functions as software microservices on commodity cloud hardware.</li>
              <li><strong>SDN (Software-Defined Networking):</strong> Dynamic program-controlled separation of Control Plane and User Plane.</li>
              <li><strong>5G NR Flexible Numerology:</strong> Variable subcarrier spacing (15 kHz, 30 kHz, 120 kHz mini-slots) for latency optimization.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: '2. The Three 3GPP Slice Archetypes',
      subtitle: 'Technical Characteristics: eMBB vs. URLLC vs. mMTC',
      content: (
        <div className="space-y-4 text-sm text-slate-300">
          <p className="text-xs text-slate-400">
            3GPP defines three standardized <strong>Slice/Service Types (SST)</strong> within the <strong>S-NSSAI</strong> identifier:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-navy-800 rounded-xl overflow-hidden font-mono">
              <thead className="bg-navy-950 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-2.5 border-b border-navy-800">Slice Parameter</th>
                  <th className="p-2.5 border-b border-navy-800 text-cyan-400">eMBB (SST: 1)</th>
                  <th className="p-2.5 border-b border-navy-800 text-emerald-400">URLLC (SST: 2)</th>
                  <th className="p-2.5 border-b border-navy-800 text-purple-400">mMTC (SST: 3)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60">
                <tr>
                  <td className="p-2 font-sans font-medium text-slate-300">Primary Goal</td>
                  <td className="p-2 text-slate-300">Peak Data Throughput</td>
                  <td className="p-2 text-slate-300">Ultra-Low Latency & High Reliability</td>
                  <td className="p-2 text-slate-300">Massive Connection Density</td>
                </tr>
                <tr className="bg-navy-950/40">
                  <td className="p-2 font-sans font-medium text-slate-300">Target Latency</td>
                  <td className="p-2 text-slate-300">10 – 30 ms</td>
                  <td className="p-2 text-emerald-400 font-bold">&lt; 1 – 5 ms</td>
                  <td className="p-2 text-slate-300">Tolerant (seconds/minutes)</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans font-medium text-slate-300">Throughput</td>
                  <td className="p-2 text-cyan-400 font-bold">100 Mbps – 10 Gbps</td>
                  <td className="p-2 text-slate-300">10 – 100 Mbps</td>
                  <td className="p-2 text-slate-300">10 kbps – 1 Mbps</td>
                </tr>
                <tr className="bg-navy-950/40">
                  <td className="p-2 font-sans font-medium text-slate-300">Reliability SLA</td>
                  <td className="p-2 text-slate-300">99% (Standard)</td>
                  <td className="p-2 text-emerald-400 font-bold">99.999% (Five-Nines)</td>
                  <td className="p-2 text-slate-300">95% – 99%</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans font-medium text-slate-300">5G Numerology (SCS)</td>
                  <td className="p-2 text-slate-300">μ = 1 (30 kHz)</td>
                  <td className="p-2 text-slate-300">μ = 3 (120 kHz Mini-slot)</td>
                  <td className="p-2 text-slate-300">μ = 0 (15 kHz Power Save)</td>
                </tr>
                <tr className="bg-navy-950/40">
                  <td className="p-2 font-sans font-medium text-slate-300">Target Applications</td>
                  <td className="p-2 text-slate-300">4K/8K Video, AR/VR, Gaming</td>
                  <td className="p-2 text-slate-300">V2X Cars, Telesurgery, Smart Grid</td>
                  <td className="p-2 text-slate-300">Smart Water/Power Meters, IoT</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-2.5 rounded-lg bg-navy-950/50 border border-navy-800 text-xs text-slate-400">
            <strong>S-NSSAI Structure:</strong> Composed of a mandatory 8-bit <em>SST (Slice/Service Type)</em> and an optional 24-bit <em>SD (Slice Differentiator)</em> to distinguish multiple slices of the same type.
          </div>
        </div>
      ),
    },
    {
      title: '3. 5G Core Architecture & Slicing Control',
      subtitle: 'The Role of NSSF, AMF, SMF, and User Plane Functions (UPF)',
      content: (
        <div className="space-y-4 text-sm text-slate-300">
          <p className="text-xs text-slate-400">
            How does a 5G network ensure that an autonomous car's packet doesn't end up on the YouTube streaming slice?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800">
              <h4 className="text-cyan-400 font-semibold mb-1 text-xs">
                1. NSSF (Network Slice Selection Function)
              </h4>
              <p className="text-xs text-slate-400">
                The brain of network slicing in the 5G Core (5GC). When a device attaches, the NSSF selects the appropriate Network Slice Instances (NSIs) based on subscription data, requested S-NSSAI, and operator policies.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800">
              <h4 className="text-cyan-400 font-semibold mb-1 text-xs">
                2. AMF & SMF (Access & Session Mgmt)
              </h4>
              <p className="text-xs text-slate-400">
                The AMF handles common signaling and registration, while dedicated or shared SMFs manage the PDU sessions for specific slices and program the UPF forwarding tables.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800">
              <h4 className="text-emerald-400 font-semibold mb-1 text-xs">
                3. Dedicated UPF & Multi-Access Edge Computing (MEC)
              </h4>
              <p className="text-xs text-slate-400">
                For URLLC, the UPF is deployed at the <strong>network edge (Edge MEC)</strong> close to the base station, avoiding long transport backhaul to the cloud. For eMBB, central cloud UPFs maximize peering bandwidth.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800">
              <h4 className="text-purple-400 font-semibold mb-1 text-xs">
                4. Radio PRB Allocation (RAN Slicing)
              </h4>
              <p className="text-xs text-slate-400">
                The gNodeB scheduler assigns Physical Resource Blocks (PRBs) dynamically or via strict reservation. 5G NR introduces <strong>mini-slot puncturing</strong>: URLLC can immediately interrupt ongoing eMBB transmission symbols!
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '4. Live Presentation Walkthrough Script',
      subtitle: 'Step-by-Step Script to Wow Your Professor & Class',
      content: (
        <div className="space-y-3.5 text-xs text-slate-300">
          <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/30 text-blue-200">
            <strong>Presenter Tip:</strong> Follow these 4 steps in front of the classroom to visually prove the power and necessity of 5G Network Slicing.
          </div>

          <div className="space-y-2.5 font-mono">
            <div className="p-2.5 rounded-lg bg-navy-950/80 border border-navy-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
                <PlayCircle className="w-4 h-4" />
                <span>STEP 1: Show the Baseline (Hard Slicing)</span>
              </div>
              <p className="font-sans text-slate-400">
                Select <em>"Balanced Network State"</em> and <em>"Hard Slicing"</em>. Point to the green <em>"SLA MET"</em> badges and show that URLLC latency is resting at 1.8ms and eMBB has healthy throughput.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-navy-950/80 border border-navy-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                <PlayCircle className="w-4 h-4" />
                <span>STEP 2: Trigger Massive eMBB Surge</span>
              </div>
              <p className="font-sans text-slate-400">
                Click <em>"Stadium / 8K Video Surge"</em>. eMBB load jumps to 98%. Point out that in Hard Slicing, <strong>URLLC is completely insulated</strong>—latency stays strictly under 2.5ms because PRBs are isolated!
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-navy-950/80 border border-red-500/30 bg-red-950/10">
              <div className="flex items-center gap-2 text-red-400 font-bold mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>STEP 3: THE CLIMAX — Switch to "No Slicing (Legacy)"</span>
              </div>
              <p className="font-sans text-slate-300">
                Switch mode to <strong>"No Slicing (Legacy 4G Single Pipe)"</strong>. Watch the audience react as <strong>URLLC Latency skyrockets from 2ms to 50ms+</strong>, crossing the red SLA line! Point to the Red <em>"SLA BREACH"</em> alert: 
                <br />
                <span className="italic text-red-300">
                  "Class, this demonstrates bufferbloat. Without slice isolation, heavy video streaming kills the emergency autonomous car signal."
                </span>
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-navy-950/80 border border-navy-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                <PlayCircle className="w-4 h-4" />
                <span>STEP 4: Demonstrate Soft Slicing & Preemption</span>
              </div>
              <p className="font-sans text-slate-400">
                Switch to <em>"Dynamic Soft Slicing"</em>. Explain how 5QI preemption restores the URLLC SLA while allowing eMBB to borrow unused capacity during downtime.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '5. Key Takeaways & Exam / Viva Questions',
      subtitle: 'Common Technical Questions Asked in College Examinations',
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1.5">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Q1: What is S-NSSAI in 5G?
            </h4>
            <p className="text-slate-400">
              <strong>Answer:</strong> Single Network Slice Selection Assistance Information. An identifier consisting of an 8-bit SST (Slice/Service Type) and an optional 24-bit SD (Slice Differentiator) that identifies a specific network slice.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1.5">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Q2: What is the primary function of the NSSF?
            </h4>
            <p className="text-slate-400">
              <strong>Answer:</strong> The Network Slice Selection Function (NSSF) selects the set of Network Slice Instances serving the UE, determines the allowed NSSAI, and assigns the appropriate AMF set to handle the user session.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1.5">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Q3: What is the difference between Hard Slicing and Soft Slicing?
            </h4>
            <p className="text-slate-400">
              <strong>Answer:</strong> Hard Slicing allocates dedicated, non-overlapping physical resource blocks (PRBs) ensuring absolute isolation. Soft Slicing dynamically shares physical spectrum, using priority queues and QoS preemption (5QI) to protect critical flows while maximizing spectral efficiency.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1.5">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Q4: Why does URLLC require Edge Computing (MEC)?
            </h4>
            <p className="text-slate-400">
              <strong>Answer:</strong> Speed of light through fiber optics induces ~1ms round-trip delay per 100km. To meet sub-1-5ms URLLC SLAs, the User Plane Function (UPF) and application servers must be located at the Edge (near the gNodeB), eliminating long backhaul propagation delay.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-navy-900 border border-navy-700 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-navy-800 flex items-center justify-between bg-navy-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                5G Network Slicing • College Presentation Guide
              </h2>
              <p className="text-xs text-slate-400">
                Interactive Slides, Architecture Concepts, and Demo Walkthrough
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 border border-navy-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-navy-800 bg-navy-950/40 px-4 overflow-x-auto scrollbar-none">
          {slides.map((slide, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`py-3 px-3.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === idx
                  ? 'border-cyan-400 text-cyan-300 font-bold bg-navy-900/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {slide.title.split('.')[0]}. {slide.title.split('.')[1]?.trim()}
            </button>
          ))}
        </div>

        {/* Slide Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-navy-900/90">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white mb-0.5">
              {slides[activeTab].title}
            </h3>
            <p className="text-xs text-cyan-400 font-mono">
              {slides[activeTab].subtitle}
            </p>
          </div>

          {slides[activeTab].content}
        </div>

        {/* Footer Navigation Controls */}
        <div className="p-4 border-t border-navy-800 bg-navy-950 flex items-center justify-between">
          <button
            onClick={() => setActiveTab((prev) => Math.max(0, prev - 1))}
            disabled={activeTab === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              activeTab === 0
                ? 'opacity-40 cursor-not-allowed border-navy-800 text-slate-500'
                : 'border-navy-700 text-slate-300 hover:bg-navy-800 hover:text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Slide</span>
          </button>

          <div className="text-xs font-mono text-slate-400">
            Slide <span className="text-white font-bold">{activeTab + 1}</span> of {slides.length}
          </div>

          <button
            onClick={() => setActiveTab((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={activeTab === slides.length - 1}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              activeTab === slides.length - 1
                ? 'opacity-40 cursor-not-allowed border-navy-800 text-slate-500'
                : 'border-cyan-500/40 bg-cyan-600 text-white hover:bg-cyan-500'
            }`}
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
