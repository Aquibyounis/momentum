'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BlueprintTask, PhaseGroup } from '@/types';

export function useBlueprint() {
  const [phases, setPhases] = useState<PhaseGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const serverDataRef = useRef<string>('');
  const debounceTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const fetchBlueprint = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/blueprint');
      if (!res.ok) throw new Error('Failed to fetch blueprint');
      const json = await res.json();
      setPhases(json.phases || []);
      serverDataRef.current = JSON.stringify(json.phases || []);
      setHasUnsavedChanges(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlueprint();
  }, [fetchBlueprint]);

  const updateLocalTask = useCallback((taskId: number, updates: Partial<BlueprintTask>) => {
    setPhases((prev) => {
      const newPhases = prev.map((phase) => ({
        ...phase,
        tasks: phase.tasks.map((t) =>
          t.id === taskId ? { ...t, ...updates } : t
        ),
      }));
      setHasUnsavedChanges(JSON.stringify(newPhases) !== serverDataRef.current);
      return newPhases;
    });

    const existingTimer = debounceTimers.current.get(taskId);
    if (existingTimer) clearTimeout(existingTimer);

    const timer = setTimeout(async () => {
      try {
        await fetch(`/api/blueprint/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    }, 1500);

    debounceTimers.current.set(taskId, timer);
  }, []);

  const addTask = useCallback(async (phaseName: string, phaseOrder: number) => {
    try {
      const res = await fetch('/api/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Task',
          time_label: '',
          description: '',
          phase_name: phaseName,
          phase_order: phaseOrder,
          sort_order: 999,
          color_tag: 'gray',
        }),
      });
      if (!res.ok) throw new Error('Failed to create task');
      const newTask = await res.json();
      setPhases((prev) => {
        const idx = prev.findIndex((p) => p.phase_name === phaseName);
        if (idx === -1) {
          return [...prev, { phase_name: phaseName, phase_order: phaseOrder, tasks: [newTask] }];
        }
        const updated = [...prev];
        updated[idx] = { ...updated[idx], tasks: [...updated[idx].tasks, newTask] };
        return updated;
      });
      return newTask;
    } catch (err) {
      console.error('Add task failed:', err);
      return null;
    }
  }, []);

  const deleteTask = useCallback(async (taskId: number) => {
    try {
      await fetch(`/api/blueprint/${taskId}`, { method: 'DELETE' });
      setPhases((prev) =>
        prev.map((phase) => ({
          ...phase,
          tasks: phase.tasks.filter((t) => t.id !== taskId),
        })).filter((phase) => phase.tasks.length > 0)
      );
    } catch (err) {
      console.error('Delete task failed:', err);
    }
  }, []);

  const saveAll = useCallback(async () => {
    const allTasks = phases.flatMap((p) => p.tasks);
    try {
      const res = await fetch('/api/blueprint/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: allTasks }),
      });
      if (!res.ok) throw new Error('Bulk save failed');
      serverDataRef.current = JSON.stringify(phases);
      setHasUnsavedChanges(false);
      return true;
    } catch (err) {
      console.error('Save all failed:', err);
      return false;
    }
  }, [phases]);

  const discardChanges = useCallback(() => {
    fetchBlueprint();
  }, [fetchBlueprint]);

  return {
    phases,
    setPhases,
    loading,
    error,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    fetchBlueprint,
    updateLocalTask,
    addTask,
    deleteTask,
    saveAll,
    discardChanges,
  };
}
