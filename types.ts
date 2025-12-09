export enum ThreadState {
  RUNNABLE = 'RUNNABLE',
  BLOCKED = 'BLOCKED',
  WAITING = 'WAITING',
  TIMED_WAITING = 'TIMED_WAITING',
}

export interface GCEvent {
  timestamp: number; // Seconds since start
  label: string;
  youngGen: number; // MB
  oldGen: number; // MB
  metaspace: number; // MB
  duration: number; // ms
  type: 'Minor GC' | 'Full GC' | 'CMSTrigger';
}

export interface StackFrame {
  method: string;
  line: number;
  isNative?: boolean;
}

export interface ThreadInfo {
  id: string;
  name: string;
  state: ThreadState;
  cpuUsage: number; // Percentage
  stackTrace: StackFrame[];
  lockAddress?: string; // Hex
}

export interface HeapObject {
  address: string;
  className: string;
  shallowSize: number;
  retainedSize: number; // MB
  gcRoot?: string; // Thread ID if it is a root
  outgoingReferences: string[]; // Class names or addresses
}

export interface Snapshot {
  timestamp: number;
  threads: ThreadInfo[];
  heapDominators: HeapObject[];
}

export interface SimulationData {
  gcLogs: GCEvent[];
  snapshots: Snapshot[]; // Snapshots taken at specific intervals
}
