import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { GCEvent } from '../../types';

interface GCTimelineProps {
  data: GCEvent[];
  currentTime: number;
  onTimeSelect: (time: number) => void;
}

const GCTimeline: React.FC<GCTimelineProps> = ({ data, currentTime, onTimeSelect }) => {
  return (
    <div className="h-64 w-full bg-slate-900/50 rounded-lg p-4 border border-slate-700">
      <h3 className="text-sm font-semibold text-slate-400 mb-4">
        Time Dimension: GC Trends & Memory Usage
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          onClick={(e: any) => {
            if (e && e.activePayload && e.activePayload[0]) {
              onTimeSelect(e.activePayload[0].payload.timestamp);
            }
          }}
          className="cursor-crosshair"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="label" 
            stroke="#94a3b8" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="left" 
            stroke="#94a3b8" 
            tick={{ fontSize: 12 }}
            label={{ value: 'MB', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} 
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#f59e0b"
            tick={{ fontSize: 12 }} 
            label={{ value: 'Duration (ms)', angle: 90, position: 'insideRight', fill: '#f59e0b' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
          />
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="oldGen" 
            stackId="1" 
            stroke="#3b82f6" 
            fill="#3b82f6" 
            fillOpacity={0.3} 
            name="Old Gen"
          />
           <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="youngGen" 
            stackId="1" 
            stroke="#10b981" 
            fill="#10b981" 
            fillOpacity={0.3} 
            name="Young Gen"
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="duration" 
            stroke="#f59e0b" 
            strokeWidth={2}
            dot={false}
            name="STW Duration"
          />
          
          {/* Current Time Cursor */}
          <ReferenceLine x={Math.floor(currentTime / 60) + 'm'} stroke="white" strokeDasharray="3 3" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GCTimeline;