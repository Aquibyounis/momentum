'use client';

import React, { useState } from 'react';
import { BlueprintTask, PhaseGroup, ColorTag } from '@/types';
import PhaseGroupComponent from './PhaseGroup';
import AddPhaseButton from './AddPhaseButton';
import EditorToolbar from './EditorToolbar';
import JsonImportModal from './JsonImportModal';
import { useBlueprint } from '@/hooks/useBlueprint';
import { useToast } from '@/components/ui/Toast';

export default function BlueprintEditor() {
  const {
    phases,
    setPhases,
    loading,
    hasUnsavedChanges,
    updateLocalTask,
    addTask,
    deleteTask,
    saveAll,
    discardChanges,
  } = useBlueprint();
  const { showToast } = useToast();
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [importModalOpen, setImportModalOpen] = useState(false);

  const handleSaveAll = async () => {
    const success = await saveAll();
    if (success) {
      showToast('Blueprint saved ✓', 'success');
    } else {
      showToast('Failed to save — please retry', 'error');
    }
  };

  const handleAddPhase = async () => {
    const maxOrder = Math.max(0, ...phases.map((p) => p.phase_order));
    const newPhaseName = `New Phase ${phases.length + 1}`;
    await addTask(newPhaseName, maxOrder + 1);
  };

  const handleDeletePhase = async (phaseName: string) => {
    const phaseTasks = phases.find((p) => p.phase_name === phaseName)?.tasks || [];
    for (const task of phaseTasks) {
      await updateLocalTask(task.id, { phase_name: 'Uncategorized', phase_order: 999 });
    }
    showToast('Phase deleted, tasks moved to Uncategorized', 'success');
  };

  const handleDuplicatePhase = async (phaseName: string) => {
    const phase = phases.find((p) => p.phase_name === phaseName);
    if (!phase) return;

    for (const task of phase.tasks) {
      await addTask(`Copy of ${phaseName}`, phase.phase_order + 1);
    }
    showToast('Phase duplicated', 'success');
  };

  const handlePhaseNameChange = (oldName: string, newName: string) => {
    const phase = phases.find((p) => p.phase_name === oldName);
    if (!phase) return;

    for (const task of phase.tasks) {
      updateLocalTask(task.id, { phase_name: newName });
    }

    setPhases((prev) =>
      prev.map((p) => (p.phase_name === oldName ? { ...p, phase_name: newName } : p))
    );
  };

  const toggleSelectTask = (taskId: number) => {
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    for (const taskId of selectedTasks) {
      await deleteTask(taskId);
    }
    setSelectedTasks(new Set());
    showToast('Selected tasks deleted', 'success');
  };

  const handleBulkMoveToPhase = async (targetPhase: string) => {
    for (const taskId of selectedTasks) {
      const targetP = phases.find((p) => p.phase_name === targetPhase);
      if (targetP) {
        updateLocalTask(taskId, { phase_name: targetPhase, phase_order: targetP.phase_order });
      }
    }
    setSelectedTasks(new Set());
    showToast(`Moved to ${targetPhase}`, 'success');
  };

  const handleExport = () => {
    const allTasks = phases.flatMap((p) => p.tasks);
    const exportData = allTasks.map((t) => ({
      time_label: t.time_label || null,
      title: t.title,
      description: t.description || null,
      phase_name: t.phase_name,
      phase_order: t.phase_order,
      sort_order: t.sort_order,
      color_tag: t.color_tag || null,
      is_active: t.is_active,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blueprint-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) throw new Error('Root must be an array');
      
      // Delete all existing tasks first
      const allTasks = phases.flatMap(p => p.tasks);
      for (const t of allTasks) {
        await deleteTask(t.id);
      }
      
      // Add new tasks
      for (const t of parsed) {
        if (!t.title) continue;
        
        // This is a naive import that relies on the backend to assign IDs
        // and add it to the local state correctly via `addTask` and then updates.
        // For a true bulk import, a dedicated API endpoint would be better,
        // but this works given the existing tools.
        await addTask(t.phase_name || 'Uncategorized', t.phase_order || 999);
        
        // Find the newly added task (it will be the last one in that phase)
        setPhases(currentPhases => {
            const phase = currentPhases.find(p => p.phase_name === (t.phase_name || 'Uncategorized'));
            if(phase) {
                const newTask = phase.tasks[phase.tasks.length - 1];
                if(newTask) {
                    updateLocalTask(newTask.id, {
                        title: t.title,
                        description: t.description || null,
                        time_label: t.time_label || null,
                        sort_order: t.sort_order || 1,
                        color_tag: t.color_tag || null,
                        is_active: t.is_active ?? true
                    });
                }
            }
            return currentPhases;
        });
      }
      
      showToast('Import successful! Remember to click Save All.', 'success');
    } catch (e) {
      showToast('Import failed. Check JSON format.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-4 animate-pulse">
            <div className="h-5 w-48 bg-surface-2 rounded mb-4" />
            <div className="space-y-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-12 bg-surface-2 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <EditorToolbar
        taskCount={phases.reduce((sum, p) => sum + p.tasks.length, 0)}
        hasUnsaved={hasUnsavedChanges}
        onSaveAll={handleSaveAll}
        onDiscard={discardChanges}
        onExport={handleExport}
        onOpenImport={() => setImportModalOpen(true)}
      />

      {/* Warning banner */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-5">
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Changes to the blueprint only affect future days. Today and past days are locked to their snapshot.</span>
      </div>

      <div className="space-y-4">
        {phases.map((phase) => (
          <PhaseGroupComponent
            key={phase.phase_name}
            phase={phase}
            onUpdateTask={updateLocalTask}
            onDeleteTask={deleteTask}
            onAddTask={() => addTask(phase.phase_name, phase.phase_order)}
            onDeletePhase={() => handleDeletePhase(phase.phase_name)}
            onDuplicatePhase={() => handleDuplicatePhase(phase.phase_name)}
            onPhaseNameChange={(newName) => handlePhaseNameChange(phase.phase_name, newName)}
            selectedTasks={selectedTasks}
            onToggleSelect={toggleSelectTask}
          />
        ))}
      </div>

      <AddPhaseButton onClick={handleAddPhase} />

      {/* Bulk action bar */}
      {selectedTasks.size > 0 && (
        <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 bg-surface-3 border border-border rounded-xl px-5 py-3 flex items-center gap-4 shadow-2xl z-50 animate-slide-up">
          <span className="text-sm text-text-secondary">{selectedTasks.size} selected</span>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
          >
            Delete Selected
          </button>
          <select
            onChange={(e) => {
              if (e.target.value) handleBulkMoveToPhase(e.target.value);
            }}
            defaultValue=""
            className="px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-text-secondary text-sm"
          >
            <option value="" disabled>Move to Phase →</option>
            {phases.map((p) => (
              <option key={p.phase_name} value={p.phase_name}>{p.phase_name}</option>
            ))}
          </select>
        </div>
      )}

      <JsonImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}
