import React from 'react';
import { HeapObject } from '../../types';

interface HeapViewProps {
  objects: HeapObject[];
}

const HeapView: React.FC<HeapViewProps> = ({ objects }) => {
  return (
    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 h-full overflow-hidden flex flex-col">
      <h3 className="text-sm font-semibold text-slate-400 mb-2 flex items-center justify-between">
        <span>Space Dimension: Heapdump</span>
        <span className="text-xs bg-slate-800 px-2 py-1 rounded">Dominators: {objects.length}</span>
      </h3>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {objects.map((obj) => (
          <div key={obj.address} className="bg-slate-800/50 p-3 rounded border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <div className="font-mono text-sm text-yellow-500 font-bold truncate max-w-[200px]" title={obj.className}>
                {obj.className.split('.').pop()}
              </div>
              <div className="text-xs font-mono bg-red-900/30 text-red-300 px-2 py-0.5 rounded border border-red-900/50">
                {obj.retainedSize} MB
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-16 text-slate-500">Address:</span>
                <span className="font-mono">{obj.address}</span>
              </div>
              
              {obj.gcRoot && (
                <div className="mt-3 mb-2 relative overflow-hidden rounded border border-emerald-500/30 bg-gradient-to-r from-emerald-950/50 to-transparent">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                  <div className="p-2 pl-3">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Strong Reference (Root)</span>
                    </div>
                    <div className="text-xs text-slate-300 font-mono flex items-center gap-2">
                       <span>Anchored by:</span>
                       <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                         Thread #{obj.gcRoot}
                       </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-xs text-slate-500 mt-2">
                <div className="mb-1">Outgoing References:</div>
                <div className="pl-2 border-l-2 border-slate-700">
                  {obj.outgoingReferences.map((ref, idx) => (
                     <div key={idx} className="font-mono text-slate-400 truncate">{ref}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeapView;