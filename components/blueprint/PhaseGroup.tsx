'use client';

import React, { useState } from 'react';
import { PhaseGroup as PhaseGroupType, BlueprintTask } from '@/types';
import TaskEditorRow from './TaskEditorRow';
import AddTaskButton from './AddTaskButton';
import { ChevronDown, ChevronRight, Copy, Trash2 } from 'lucide-react';
import { colorTagToBorder } from '@/lib/utils';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface PhaseGroupProps {
  phase: PhaseGroupType;
  onUpdateTask: (id: number, updates: Partial<BlueprintTask>) => void;
  onDeleteTask: (id: number) => void;
  onAddTask: () => void;
  onDeletePhase: () => void;
  onDuplicatePhase: () => void;
  onPhaseNameChange: (newName: string) => void;
  selectedTasks: Set<number>;
  onToggleSelect: (id: number) => void;
}

export default function PhaseGroupComponent({
  phase,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
  onDeletePhase,
  onDuplicatePhase,
  onPhaseNameChange,
  selectedTasks,
  onToggleSelect,
}: PhaseGroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(phase.phase_name);
  const [confirmDeletePhase, setConfirmDeletePhase] = useState(false);

  const borderColor = colorTagToBorder(phase.tasks[0]?.color_tag);

  const handleNameSubmit = () => {
    setEditingName(false);
    if (nameValue.trim() && nameValue !== phase.phase_name) {
      onPhaseNameChange(nameValue.trim());
    } else {
      setNameValue(phase.phase_name);
    }
  };

  return (
    <>
      <div className={`border-l-2 ${borderColor} rounded-xl bg-surface border border-border overflow-hidden`}>
        {/* Phase header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-surface-2/50">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-text-muted hover:text-text-secondary transition-colors"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </button>

          {editingName ? (
            <input
              autoFocus
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              className="flex-1 bg-transparent text-sm font-medium text-text-primary focus:outline-none border-b border-accent-blue"
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="flex-1 text-left text-sm font-medium text-text-primary hover:text-accent-blue transition-colors"
            >
              {phase.phase_name}
            </button>
          )}

          <span className="text-[10px] text-text-muted bg-surface-3 px-2 py-0.5 rounded-full">
            {phase.tasks.length} tasks
          </span>

          <button
            onClick={onDuplicatePhase}
            className="text-text-muted hover:text-text-secondary transition-colors"
            title="Duplicate Phase"
          >
            <Copy size={14} />
          </button>

          <button
            onClick={() => setConfirmDeletePhase(true)}
            className="text-text-muted hover:text-red-400 transition-colors"
            title="Delete Phase"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Tasks */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isCollapsed ? '0px' : `${phase.tasks.length * 70 + 60}px`,
            opacity: isCollapsed ? 0 : 1,
          }}
        >
          <div className="p-3 space-y-1.5">
            {phase.tasks.map((task) => (
              <TaskEditorRow
                key={task.id}
                task={task}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
                selected={selectedTasks.has(task.id)}
                onToggleSelect={onToggleSelect}
              />
            ))}
            <AddTaskButton onClick={onAddTask} />
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmDeletePhase}
        title="Delete Phase"
        message={`All tasks in "${phase.phase_name}" will be moved to Uncategorized. Continue?`}
        confirmLabel="Delete Phase"
        onConfirm={() => {
          onDeletePhase();
          setConfirmDeletePhase(false);
        }}
        onCancel={() => setConfirmDeletePhase(false)}
      />
    </>
  );
}
