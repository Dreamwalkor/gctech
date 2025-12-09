import React, { useState, useMemo } from 'react';
import GCTimeline from './components/Charts/GCTimeline';
import ThreadView from './components/Calculations/ThreadView';
import HeapView from './components/Space/HeapView';
import AIInsight from './components/Analysis/AIInsight';
import { MOCK_SCENARIO } from './constants';
import { Snapshot } from './types';

const App: React.FC = () => {
  // State for the current playback time (simulating navigating through the logs)
  // Default to the end of the scenario where the crash happens
  const [currentTime, setCurrentTime] = useState<number>(1140);

  // Find the closest snapshot to the current time
  const currentSnapshot: Snapshot | undefined = useMemo(() => {
    // In a real app, we would interpolate or find the nearest previous snapshot
    // For this demo, we find the closest match in our sparse snapshot array
    return MOCK_SCENARIO.snapshots.reduce((prev, curr) => {
      return (Math.abs(curr.timestamp - currentTime) < Math.abs(prev.timestamp - currentTime) ? curr : prev);
    });
  }, [currentTime]);

  const handleTimeSelect = (timestamp: number) => {
    setCurrentTime(timestamp);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center font-bold text-white">
              JVM
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Trinity Analyzer</h1>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400">
              Demo Mode: Socket Leak Scenario
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>System Active</span>
             </div>
             <div className="h-4 w-px bg-slate-700"></div>
             <span>Gemini 2.5 Flash</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 space-y-6">
        
        {/* Top Section: Timeline (The "When") */}
        <section>
          <GCTimeline 
            data={MOCK_SCENARIO.gcLogs} 
            currentTime={currentTime}
            onTimeSelect={handleTimeSelect}
          />
        </section>

        {/* Middle Section: Detailed Views (Space & Compute) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
          
          {/* Left: Thread Dump (Javacore) */}
          <div className="lg:col-span-3 h-full">
            <ThreadView threads={currentSnapshot?.threads || []} />
          </div>

          {/* Center: Relationship Visualization (Implicit via UI adjacency) -> to Heap */}
          <div className="lg:col-span-4 h-full">
             <HeapView objects={currentSnapshot?.heapDominators || []} />
          </div>

          {/* Right: AI Analysis Panel */}
          <div className="lg:col-span-5 h-full">
            <AIInsight fullData={MOCK_SCENARIO} currentSnapshot={currentSnapshot} />
          </div>

        </section>

        {/* Footer / Context Info */}
        <section className="bg-slate-900/30 rounded border border-slate-800 p-4 text-xs text-slate-500 flex justify-between">
            <div>
              <strong className="text-slate-400">Cross-Modal Entity Linking Active:</strong>
              <span className="ml-2">Correlating <span className="text-blue-400">nid={currentSnapshot?.threads[1]?.id}</span> (Thread) with <span className="text-yellow-400">GC Root</span> of <span className="text-red-400">ArrayList @ 0x7a</span>.</span>
            </div>
            <div>
              Snapshot Time: {Math.floor(currentTime / 60)}m {currentTime % 60}s
            </div>
        </section>

      </main>
    </div>
  );
};

export default App;
