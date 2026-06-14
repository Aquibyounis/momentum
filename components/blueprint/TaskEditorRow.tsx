'use client';

import React, { useState } from 'react';
import { BlueprintTask, ColorTag } from '@/types';
import { Trash2, GripVertical, Eye, EyeOff, ChevronDown } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface TaskEditorRowProps {
  task: BlueprintTask;
  onUpdate: (id: number, updates: Partial<BlueprintTask>) => void;
  onDelete: (id: number) => void;
  selected: boolean;
  onToggleSelect: (id: number) => void;
}

const colorOptions: ColorTag[] = ['green', 'blue', 'amber', 'red', 'purple', 'gray'];

const colorSwatchMap: Record<string, string> = {
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  gray: 'bg-gray-500',
};

export default function TaskEditorRow({
  task,
  onUpdate,
  onDelete,
  selected,
  onToggleSelect,
}: TaskEditorRowProps) {
  const [showDesc, setShowDesc] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      <div className={`flex items-center gap-2 bg-surface border rounded-lg px-3 py-2.5 transition-all ${
        task.is_active ? 'border-border' : 'border-border opacity-50'
      }`}>
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(task.id)}
          className="w-4 h-4 rounded accent-accent-blue bg-surface-2 border-border flex-shrink-0"
        />

        {/* Drag handle */}
        <div className="cursor-grab text-text-muted hover:text-text-secondary flex-shrink-0">
          <GripVertical size={16} />
        </div>

        {/* Time */}
        <input
          type="text"
          value={task.time_label || ''}
          onChange={(e) => onUpdate(task.id, { time_label: e.target.value })}
          placeholder="07:30 AM"
          maxLength={10}
          className="w-[80px] bg-surface-2 border border-border rounded px-2 py-1 text-[11px] font-mono text-accent-blue placeholder:text-text-muted/40 focus:outline-none focus:border-border-light flex-shrink-0"
        />

        {/* Color dot */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowColors(!showColors)}
            className={`w-3 h-3 rounded-full ${colorSwatchMap[task.color_tag || 'gray']}`}
          />
          {showColors && (
            <div className="absolute top-6 left-0 bg-surface-3 border border-border rounded-lg p-2 flex gap-1.5 z-10 shadow-lg">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    onUpdate(task.id, { color_tag: c });
                    setShowColors(false);
                  }}
                  className={`w-5 h-5 rounded-full ${colorSwatchMap[c]} ${
                    task.color_tag === c ? 'ring-2 ring-white ring-offset-1 ring-offset-surface-3' : ''
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <input
          type="text"
          value={task.title}
          onChange={(e) => onUpdate(task.id, { title: e.target.value })}
          placeholder="Activity name"
          className="flex-1 bg-transparent text-sm text-text-secondary placeholder:text-text-muted/40 focus:outline-none min-w-0"
        />

        {/* Expand description */}
        <button
          onClick={() => setShowDesc(!showDesc)}
          className="text-text-muted hover:text-text-secondary flex-shrink-0 transition-colors"
        >
          <ChevronDown size={14} className={`transition-transform ${showDesc ? 'rotate-180' : ''}`} />
        </button>

        {/* Active toggle */}
        <button
          onClick={() => onUpdate(task.id, { is_active: !task.is_active })}
          className="text-text-muted hover:text-text-secondary flex-shrink-0 transition-colors"
        >
          {task.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>

        {/* Delete */}
        <button
          onClick={() => setConfirmDelete(true)}
          className="text-text-muted hover:text-red-400 flex-shrink-0 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Description area */}
      {showDesc && (
        <div className="ml-[52px] mt-1 mb-2">
          <textarea
            value={task.description || ''}
            onChange={(e) => onUpdate(task.id, { description: e.target.value })}
            placeholder="Optional description..."
            className="w-full bg-surface-2 border border-border rounded-lg p-2.5 text-xs text-text-muted placeholder:text-text-muted/40 resize-none focus:outline-none focus:border-border-light"
            rows={2}
          />
        </div>
      )}

      <ConfirmModal
        open={confirmDelete}
        title="Delete Task"
        message={`Are you sure you want to remove "${task.title}" from the blueprint?`}
        onConfirm={() => {
          onDelete(task.id);
          setConfirmDelete(false);
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}
