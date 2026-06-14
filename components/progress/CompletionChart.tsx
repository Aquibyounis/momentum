'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { DayListItem } from '@/types';

interface CompletionChartProps {
  days: DayListItem[];
  targetMonth: Date;
}

export default function CompletionChart({ days, targetMonth }: CompletionChartProps) {
  const year = targetMonth.getFullYear();
  const month = targetMonth.getMonth(); // 0-11
  
  // Get number of days in the month
  const numDays = new Date(year, month + 1, 0).getDate();

  // Create a map of existing days for quick lookup
  const daysMap = new Map(days.map(d => [d.entry_date, d]));

  const chartData = [];

  for (let i = 1; i <= numDays; i++) {
    // Format to YYYY-MM-DD
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    
    // Check if we have data for this date
    const dayData = daysMap.get(dateStr);
    
    let taskPercent = 0;
    let prayerPercent = 0;

    if (dayData) {
      taskPercent = dayData.tasks_total > 0
        ? Math.round((dayData.tasks_completed / dayData.tasks_total) * 100)
        : 0;
      prayerPercent = Math.round((dayData.prayers_completed / 5) * 100);
    }

    chartData.push({
      date: `${month + 1}/${i}`, // e.g. 6/14
      tasks: taskPercent,
      prayers: prayerPercent,
      fullDate: dateStr,
    });
  }

  // Custom tooltip to show date and percentage properly
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#161b24] border border-[#1e2330] rounded-lg p-3 text-xs text-[#f1f5f9]">
          <p className="font-semibold mb-2">{payload[0].payload.fullDate}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-text-secondary">{entry.name}:</span>
              <span className="font-medium">{entry.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5">
      {/* Tasks Chart */}
      <div className="bg-surface border border-border rounded-xl p-4 md:p-6">
        <h3 className="text-sm font-medium text-text-primary mb-6">Tasks Completion Trend</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2330" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748b', fontSize: 11 }}
                stroke="#1e2330"
                tickMargin={10}
                minTickGap={20}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 11 }}
                stroke="#1e2330"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#38bdf8"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#38bdf8', stroke: '#0d0f12', strokeWidth: 2 }}
                name="Tasks Completion"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prayers Chart */}
      <div className="bg-surface border border-border rounded-xl p-4 md:p-6">
        <h3 className="text-sm font-medium text-text-primary mb-6">Prayers Completion Trend</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2330" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748b', fontSize: 11 }}
                stroke="#1e2330"
                tickMargin={10}
                minTickGap={20}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 11 }}
                stroke="#1e2330"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="prayers"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#22c55e', stroke: '#0d0f12', strokeWidth: 2 }}
                name="Prayers Completion"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
