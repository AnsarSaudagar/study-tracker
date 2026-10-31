import { STORAGE_KEYS, readJSON, writeJSON } from '@/utils/storage';
import type {
  Subject,
  SubjectInput,
  Task,
  TaskInput,
} from '@/types/tracker.types';

/**
 * Tracker data service — all subject/task persistence lives here, scoped by
 * userId. UI never touches storage directly. Swap these bodies for HTTP calls
 * to move to a backend.
 */

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function allSubjects(): Subject[] {
  const data = readJSON<Subject[]>(STORAGE_KEYS.subjects, []);
  return Array.isArray(data) ? data : [];
}

function allTasks(): Task[] {
  const data = readJSON<Task[]>(STORAGE_KEYS.tasks, []);
  return Array.isArray(data) ? data : [];
}

/* ---------------------------- Subjects ---------------------------- */

export function getSubjects(userId: string): Subject[] {
  return allSubjects()
    .filter((s) => s.userId === userId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function addSubject(userId: string, input: SubjectInput): Subject {
  const subject: Subject = {
    id: createId(),
    userId,
    name: input.name.trim(),
    color: input.color,
    createdAt: new Date().toISOString(),
  };
  writeJSON(STORAGE_KEYS.subjects, [...allSubjects(), subject]);
  return subject;
}

/** Delete a subject and unassign its tasks (keeps the tasks). */
export function deleteSubject(userId: string, subjectId: string): void {
  const subjects = allSubjects().filter(
    (s) => !(s.userId === userId && s.id === subjectId),
  );
  writeJSON(STORAGE_KEYS.subjects, subjects);

  const tasks = allTasks().map((t) =>
    t.userId === userId && t.subjectId === subjectId
      ? { ...t, subjectId: null }
      : t,
  );
  writeJSON(STORAGE_KEYS.tasks, tasks);
}

/* ----------------------------- Tasks ------------------------------ */

export function getTasks(userId: string): Task[] {
  return allTasks()
    .filter((t) => t.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addTask(userId: string, input: TaskInput): Task {
  const task: Task = {
    id: createId(),
    userId,
    title: input.title.trim(),
    description: input.description.trim(),
    subjectId: input.subjectId,
    hours: Number.isFinite(input.hours) ? input.hours : 0,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  writeJSON(STORAGE_KEYS.tasks, [...allTasks(), task]);
  return task;
}

export function updateTask(
  userId: string,
  taskId: string,
  input: TaskInput,
): void {
  const tasks = allTasks().map((t) =>
    t.userId === userId && t.id === taskId
      ? {
          ...t,
          title: input.title.trim(),
          description: input.description.trim(),
          subjectId: input.subjectId,
          hours: Number.isFinite(input.hours) ? input.hours : 0,
        }
      : t,
  );
  writeJSON(STORAGE_KEYS.tasks, tasks);
}

export function toggleTask(userId: string, taskId: string): void {
  const tasks = allTasks().map((t) =>
    t.userId === userId && t.id === taskId
      ? { ...t, completed: !t.completed }
      : t,
  );
  writeJSON(STORAGE_KEYS.tasks, tasks);
}

export function deleteTask(userId: string, taskId: string): void {
  const tasks = allTasks().filter(
    (t) => !(t.userId === userId && t.id === taskId),
  );
  writeJSON(STORAGE_KEYS.tasks, tasks);
}
