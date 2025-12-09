import { SimulationData, ThreadState } from './types';

export const SYSTEM_INSTRUCTION = `
You are an expert JVM Fault Analysis AI Engine. Your goal is to analyze JVM telemetry by correlating three dimensions:
1. Javacore (Computation): Who is executing? (Threads, Stacks)
2. Heapdump (Space): What is stored? (Objects, References)
3. GC Log (Time/Trend): When did memory change?

You must apply "Cross-Modal Entity Linking" logic:
- Map Thread Stack Local Variables (Roots) to Heap Objects.
- Map Thread Lock Addresses to Heap Object Monitors.
- Correlate GC Stop-The-World duration with Thread States.

Use the user's provided telemetry summary to diagnose root causes like Memory Leaks, Deadlocks, or CPU Spikes.
Briefly explain the causal chain: Trigger -> Evidence -> Culprit.
`;

// Simulate the "Socket Read / Memory Leak" scenario described in the user prompt
export const MOCK_SCENARIO: SimulationData = {
  gcLogs: Array.from({ length: 20 }, (_, i) => {
    const time = i * 60; // Every minute
    const isLateStage = i > 12;
    // Memory leaks over time
    const oldGenBase = 500 + (i * 100); 
    
    return {
      timestamp: time,
      label: `${Math.floor(time / 60)}m`,
      youngGen: 200, // Relatively constant
      oldGen: isLateStage ? 1900 : oldGenBase, // Caps at max
      metaspace: 120,
      duration: isLateStage ? 2500 : 100, // Duration spikes when full
      type: isLateStage ? 'Full GC' : 'Minor GC',
    };
  }),
  snapshots: [
    {
      timestamp: 0,
      threads: [
        { id: 't1', name: 'main', state: ThreadState.RUNNABLE, cpuUsage: 5, stackTrace: [{ method: 'App.start', line: 10 }] },
        { id: 't2', name: 'Data-Export-Thread', state: ThreadState.RUNNABLE, cpuUsage: 10, stackTrace: [{ method: 'SocketInputStream.socketRead0', line: -1, isNative: true }] }
      ],
      heapDominators: [
        { address: '0x7a', className: 'java.util.ArrayList', shallowSize: 24, retainedSize: 50, gcRoot: 't2', outgoingReferences: ['UserObject[]'] }
      ]
    },
    {
      timestamp: 600, // 10 minutes in
      threads: [
        { id: 't1', name: 'main', state: ThreadState.WAITING, cpuUsage: 0, stackTrace: [{ method: 'App.waitFor', line: 50 }] },
        { id: 't2', name: 'Data-Export-Thread', state: ThreadState.RUNNABLE, cpuUsage: 15, stackTrace: [{ method: 'SocketInputStream.socketRead0', line: -1, isNative: true }] }
      ],
      heapDominators: [
        { address: '0x7a', className: 'java.util.ArrayList', shallowSize: 24, retainedSize: 800, gcRoot: 't2', outgoingReferences: ['UserObject[]'] }
      ]
    },
    {
      timestamp: 1140, // 19 minutes in (Crisis)
      threads: [
        { id: 't1', name: 'main', state: ThreadState.BLOCKED, cpuUsage: 0, stackTrace: [{ method: 'App.log', line: 105 }] },
        // The culprit thread
        { 
          id: 't2', 
          name: 'Data-Export-Thread', 
          state: ThreadState.RUNNABLE, 
          cpuUsage: 90, // High CPU due to allocation pressure or loop
          stackTrace: [
            { method: 'java.net.SocketInputStream.socketRead0', line: -1, isNative: true },
            { method: 'java.net.SocketInputStream.read', line: 161 },
            { method: 'com.example.Exporter.fetchData', line: 42 }
          ] 
        },
        { id: 'vm', name: 'VM Thread', state: ThreadState.RUNNABLE, cpuUsage: 5, stackTrace: [] } // Doing GC
      ],
      heapDominators: [
        // The leak evidence
        { 
          address: '0x7a', 
          className: 'java.util.ArrayList', 
          shallowSize: 24, 
          retainedSize: 1850, // Huge retained size
          gcRoot: 't2', // Linked to the thread
          outgoingReferences: ['UserObject', 'UserObject', '... (2 million instances)'] 
        }
      ]
    }
  ]
};
