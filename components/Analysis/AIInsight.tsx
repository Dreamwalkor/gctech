import React, { useState } from 'react';
import { analyzeTelemetry } from '../../services/geminiService';
import { SimulationData, Snapshot } from '../../types';

interface AIInsightProps {
  fullData: SimulationData;
  currentSnapshot: Snapshot | undefined;
}

const AIInsight: React.FC<AIInsightProps> = ({ fullData, currentSnapshot }) => {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleDeepAnalysis = async () => {
    setLoading(true);
    setAnalysis("Establishing cross-modal links between Threads, Heap, and GC Logs...");
    
    // Prepare a summarized context for the AI
    const context = JSON.stringify({
      gcTrend: "Old Gen increased from 500MB to 1900MB over 20 minutes. Full GC duration spiked to 2.5s.",
      currentSnapshot: currentSnapshot || "No specific snapshot selected",
      keyThreads: currentSnapshot?.threads.filter(t => t.cpuUsage > 5 || t.state === 'BLOCKED'),
      keyHeapObjects: currentSnapshot?.heapDominators.filter(h => h.retainedSize > 100)
    }, null, 2);

    const prompt = "Analyze this specific time slice. Identify the root cause by correlating the high retained heap with the running threads. Is there a leak? Who is causing it?";

    const result = await analyzeTelemetry(context, prompt);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 rounded-lg p-6 border border-slate-700 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-purple-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Gemini Intelligence Engine
        </h2>
        <button
          onClick={handleDeepAnalysis}
          disabled={loading}
          className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
            loading 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20'
          }`}
        >
          {loading ? 'Correlating Data...' : 'Run Root Cause Analysis'}
        </button>
      </div>

      <div className="flex-1 bg-slate-950 rounded border border-slate-800 p-4 font-mono text-sm leading-relaxed overflow-y-auto custom-scrollbar">
        {analysis ? (
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-slate-300">{analysis}</p>
          </div>
        ) : (
          <div className="text-slate-600 flex flex-col items-center justify-center h-full">
            <p className="mb-2">Ready to analyze 3-Dimensional Telemetry</p>
            <ul className="text-xs list-disc pl-4 space-y-1">
              <li>Check Javacore for compute bottlenecks</li>
              <li>Scan Heapdump for space anomalies</li>
              <li>Verify trends with GC Logs</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsight;
