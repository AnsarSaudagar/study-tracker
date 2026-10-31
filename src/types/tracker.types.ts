/** Types for the study tracker domain (subjects + tasks). */

/** A preset color token used to tag subjects. */
export type SubjectColor =
  | 'blue'
  | 'violet'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'cyan';

export interface Subject {
  id: string;
  /** Owner — scopes data to the logged-in user. */
  userId: string;
  name: string;
  color: SubjectColor;
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  /** Optional free-text details for the task. */
  description: string;
  /** Subject this task belongs to, or null if unassigned. */
  subjectId: string | null;
  /** Planned/estimated study hours for this task. */
  hours: number;
  completed: boolean;
  createdAt: string;
}

export interface SubjectInput {
  name: string;
  color: SubjectColor;
}

export interface TaskInput {
  title: string;
  description: string;
  subjectId: string | null;
  hours: number;
}
