import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as trackerService from '@/services/trackerService';
import { useAuth } from '@/hooks/useAuth';
import type {
  Subject,
  SubjectInput,
  Task,
  TaskInput,
} from '@/types/tracker.types';

interface TrackerContextValue {
  subjects: Subject[];
  tasks: Task[];
  addSubject: (input: SubjectInput) => void;
  deleteSubject: (id: string) => void;
  addTask: (input: TaskInput) => void;
  updateTask: (id: string, input: TaskInput) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

export const TrackerContext = createContext<TrackerContextValue | null>(null);

export function TrackerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const refresh = useCallback(() => {
    if (!userId) {
      setSubjects([]);
      setTasks([]);
      return;
    }
    setSubjects(trackerService.getSubjects(userId));
    setTasks(trackerService.getTasks(userId));
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo<TrackerContextValue>(
    () => ({
      subjects,
      tasks,
      addSubject: (input) => {
        if (!userId) return;
        trackerService.addSubject(userId, input);
        refresh();
      },
      deleteSubject: (id) => {
        if (!userId) return;
        trackerService.deleteSubject(userId, id);
        refresh();
      },
      addTask: (input) => {
        if (!userId) return;
        trackerService.addTask(userId, input);
        refresh();
      },
      updateTask: (id, input) => {
        if (!userId) return;
        trackerService.updateTask(userId, id, input);
        refresh();
      },
      toggleTask: (id) => {
        if (!userId) return;
        trackerService.toggleTask(userId, id);
        refresh();
      },
      deleteTask: (id) => {
        if (!userId) return;
        trackerService.deleteTask(userId, id);
        refresh();
      },
    }),
    [subjects, tasks, userId, refresh],
  );

  return (
    <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
  );
}
