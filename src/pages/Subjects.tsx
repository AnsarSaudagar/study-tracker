import { useState } from 'react';
import { Library, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTracker } from '@/hooks/useTracker';
import { useToast } from '@/hooks/useToast';
import { SUBJECT_COLORS, SUBJECT_COLOR_OPTIONS } from '@/utils/subjectColors';
import type { SubjectColor } from '@/types/tracker.types';

export function Subjects() {
  const { subjects, tasks, addSubject, deleteSubject } = useTracker();
  const toast = useToast();

  const [name, setName] = useState('');
  const [color, setColor] = useState<SubjectColor>('blue');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('Enter a subject name.');
      return;
    }
    if (
      subjects.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      toast.error('That subject already exists.');
      return;
    }
    addSubject({ name: trimmed, color });
    setName('');
    setColor('blue');
    toast.success('Subject added.');
  };

  const taskCount = (subjectId: string) =>
    tasks.filter((t) => t.subjectId === subjectId).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Subjects
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Organize your study areas. Tasks can be grouped under a subject.
        </p>
      </header>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Subject name"
              placeholder="e.g. Mathematics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
            />
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Color
            </span>
            <div className="flex gap-2">
              {SUBJECT_COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={c}
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full ${SUBJECT_COLORS[c].swatch} transition ${
                    color === c
                      ? 'ring-2 ring-slate-900 ring-offset-2 dark:ring-white dark:ring-offset-slate-900'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>
          <Button type="submit">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </form>

      {/* List */}
      {subjects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${SUBJECT_COLORS[s.color].dot}`} />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{s.name}</p>
                  <p className="text-xs text-slate-400">
                    {taskCount(s.id)} {taskCount(s.id) === 1 ? 'task' : 'tasks'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  deleteSubject(s.id);
                  toast.success('Subject deleted.');
                }}
                aria-label={`Delete ${s.name}`}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
        <Library className="h-6 w-6" />
      </div>
      <p className="mt-4 font-semibold text-slate-900 dark:text-white">No subjects yet</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Add your first subject above to start organizing your study.
      </p>
    </div>
  );
}
