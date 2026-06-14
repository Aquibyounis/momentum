'use client';

import React, { useState } from 'react';
import { TaskCompletion } from '@/types';
import TaskRow from './TaskRow';
import PhaseHeader from './PhaseHeader';

interface TaskListProps {
  tasks: TaskCompletion[];
  onToggle: (taskId: number) => void;
  readOnly?: boolean;
}

interface PhaseGroupData {
  phaseName: string;
  tasks: TaskCompletion[];
}

export default function TaskList({ tasks, onToggle, readOnly }: TaskListProps) {
  const [collapsedPhases, setCollapsedPhases] = useState<Set<string>>(new Set());

  const groups: PhaseGroupData[] = [];
  const phaseMap = new Map<string, TaskCompletion[]>();

  for (const task of tasks) {
    const phase = task.phase_snapshot || 'Other';
    if (!phaseMap.has(phase)) {
      phaseMap.set(phase, []);
    }
    phaseMap.get(phase)!.push(task);
  }

  phaseMap.forEach((phaseTasks, phaseName) => {
    groups.push({ phaseName, tasks: phaseTasks });
  });

  const toggleCollapse = (phase: string) => {
    setCollapsedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phase)) {
        next.delete(phase);
      } else {
        next.add(phase);
      }
      return next;
    });
  };

  const phaseNames = groups.map((g) => g.phaseName);

  return (
    <div>
      {/* Phase filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-3">
        {phaseNames.map((name) => (
          <button
            key={name}
            onClick={() => {
              const el = document.getElementById(`phase-${name.replace(/\s/g, '-')}`);
              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium bg-surface-2 border border-border text-text-secondary hover:text-text-primary hover:border-border-light transition-colors"
          >
            {name}
          </button>
        ))}
      </div>

      {/* Task groups */}
      <div className="space-y-4">
        {groups.map((group) => {
          const isCollapsed = collapsedPhases.has(group.phaseName);
          const completed = group.tasks.filter((t) => t.is_completed).length;

          return (
            <div
              key={group.phaseName}
              id={`phase-${group.phaseName.replace(/\s/g, '-')}`}
            >
              <PhaseHeader
                name={group.phaseName}
                completed={completed}
                total={group.tasks.length}
                isCollapsed={isCollapsed}
                onToggle={() => toggleCollapse(group.phaseName)}
              />
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: isCollapsed ? '0px' : `${group.tasks.length * 80 + 20}px`,
                  opacity: isCollapsed ? 0 : 1,
                }}
              >
                <div className="space-y-2 mt-2">
                  {group.tasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggle={() => onToggle(task.blueprint_task_id)}
                      readOnly={readOnly}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TaskListSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-6 w-48 bg-surface-2 animate-pulse rounded mb-2" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-surface border border-border rounded-[10px] p-3 flex items-center gap-3 animate-pulse">
          <div className="w-5 h-5 bg-surface-2 rounded-full" />
          <div className="w-14 h-3 bg-surface-2 rounded" />
          <div className="flex-1 h-4 bg-surface-2 rounded" />
        </div>
      ))}
    </div>
  );
}
