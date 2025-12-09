import React from 'react';
import { ThreadInfo, ThreadState } from '../../types';

interface ThreadViewProps {
  threads: ThreadInfo[];
}

const ThreadView: React.FC<ThreadViewProps> = ({ threads }) => {
  const getStatusColor = (state: ThreadState) => {
    switch (state) {
      case ThreadState.RUNNABLE: return 'text-green-400';
      case ThreadState.BLOCKED: return 'text-red-400';
      case ThreadState.WAITING: return 'text-yellow-400';
      case ThreadState.TIMED_WAITING: return 'text-orange-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 h-full overflow-hidden flex flex-col">
      <h3 className="text-sm font-semibold text-slate-400 mb-2 flex items-center justify-between">
        <span>Calculation Dimension: Javacore</span>
        <span className="text-xs bg-slate-800 px-2 py-1 rounded">Active Threads: {threads.length}</span>
      </h3>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {threads.map((thread) => (
          <div key={thread.id} className="bg-slate-800/50 p-3 rounded border border-slate-700 hover:border-blue-500/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-mono text-sm text-slate-200 font-bold">{thread.name}</div>
                <div className={`text-xs font-mono mt-1 ${getStatusColor(thread.state)}`}>
                  {thread.state} {thread.cpuUsage > 0 && `(CPU: ${thread.cpuUsage}%)`}
                </div>
              </div>
              <div className="text-xs text-slate-500 font-mono">#{thread.id}</div>
            </div>
            
            <div className="bg-slate-950 p-2 rounded text-xs font-mono text-slate-400 overflow-x-auto whitespace-nowrap">
              {thread.stackTrace.length === 0 ? (
                <span className="italic opacity-50">No stack trace available</span>
              ) : (
                thread.stackTrace.map((frame, idx) => (
                  <div key={idx} className={idx === 0 ? 'text-blue-300' : ''}>
                    at {frame.method}({frame.isNative ? 'Native Method' : `${frame.line}`})
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreadView;
