import { useMemo, useState } from 'react';
import { Check, Clock, ListTodo, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useTracker } from '@/hooks/useTracker';
import { useToast } from '@/hooks/useToast';
import { SUBJECT_COLORS } from '@/utils/subjectColors';
import type { Subject, Task, TaskInput } from '@/types/tracker.types';

type Filter = 'all' | 'active' | 'completed';

export function Tasks() {
  const { tasks, subjects, addTask, updateTask, toggleTask, deleteTask } =
    useTracker();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState<string>('');
  const [hours, setHours] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const subjectById = useMemo(() => {
    const map = new Map<string, Subject>();
    subjects.forEach((s) => map.set(s.id, s));
    return map;
  }, [subjects]);

  const visible = useMemo(() => {
    if (filter === 'active') return tasks.filter((t) => !t.completed);
    if (filter === 'completed') return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      toast.error('Enter a task title.');
      return;
    }
    const parsedHours = hours === '' ? 0 : Number(hours);
    if (Number.isNaN(parsedHours) || parsedHours < 0) {
      toast.error('Hours must be a positive number.');
      return;
    }
    addTask({
      title: trimmed,
      description,
      subjectId: subjectId || null,
      hours: parsedHours,
    });
    setTitle('');
    setDescription('');
    setSubjectId('');
    setHours('');
    toast.success('Task added.');
  };

  const filters: Filter[] = ['all', 'active', 'completed'];

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Tasks
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Add study tasks, set planned hours and mark them done.
        </p>
      </header>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-end">
          <div className="sm:col-span-6">
            <Input
              label="Task"
              placeholder="e.g. Finish calculus chapter 3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
            />
          </div>
          <div className="sm:col-span-3">
            <Select
              label="Subject"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
            >
              <option value="">No subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Hours"
              type="number"
              min={0}
              step={0.5}
              placeholder="0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>
          <div className="sm:col-span-1">
            <Button type="submit" fullWidth aria-label="Add task">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="sm:col-span-12">
            <Textarea
              label="Description (optional)"
              placeholder="Notes, goals or details for this task…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={2}
            />
          </div>
        </div>
      </form>

      {/* Filters */}
      <div className="flex gap-2">
        {filters.map((f) => {
          const count =
            f === 'all'
              ? tasks.length
              : f === 'active'
                ? tasks.filter((t) => !t.completed).length
                : tasks.filter((t) => t.completed).length;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
                filter === f
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {f} ({count})
            </button>
          );
        })}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <EmptyState hasTasks={tasks.length > 0} />
      ) : (
        <ul className="space-y-2">
          {visible.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              subject={t.subjectId ? (subjectById.get(t.subjectId) ?? null) : null}
              subjects={subjects}
              onToggle={() => toggleTask(t.id)}
              onDelete={() => {
                deleteTask(t.id);
                toast.success('Task deleted.');
              }}
              onSave={(input) => {
                updateTask(t.id, input);
                toast.success('Task updated.');
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  subject: Subject | null;
  subjects: Subject[];
  onToggle: () => void;
  onDelete: () => void;
  onSave: (input: TaskInput) => void;
}

function TaskItem({
  task,
  subject,
  subjects,
  onToggle,
  onDelete,
  onSave,
}: TaskItemProps) {
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [subjectId, setSubjectId] = useState(task.subjectId ?? '');
  const [hours, setHours] = useState(task.hours ? String(task.hours) : '');

  const startEdit = () => {
    setTitle(task.title);
    setDescription(task.description ?? '');
    setSubjectId(task.subjectId ?? '');
    setHours(task.hours ? String(task.hours) : '');
    setEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      toast.error('Enter a task title.');
      return;
    }
    const parsedHours = hours === '' ? 0 : Number(hours);
    if (Number.isNaN(parsedHours) || parsedHours < 0) {
      toast.error('Hours must be a positive number.');
      return;
    }
    onSave({
      title: trimmed,
      description,
      subjectId: subjectId || null,
      hours: parsedHours,
    });
    setEditing(false);
  };

  if (editing) {
    return (
      <li className="rounded-xl border border-brand-300 bg-white p-4 shadow-card dark:border-brand-500/40 dark:bg-slate-900">
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end">
          <div className="sm:col-span-6">
            <Input
              label="Task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              autoFocus
            />
          </div>
          <div className="sm:col-span-3">
            <Select
              label="Subject"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
            >
              <option value="">No subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="sm:col-span-3">
            <Input
              label="Hours"
              type="number"
              min={0}
              step={0.5}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>
          <div className="sm:col-span-12">
            <Textarea
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={2}
            />
          </div>
          <div className="flex gap-2 sm:col-span-12">
            <Button type="submit">
              <Check className="h-4 w-4" />
              Save
            </Button>
            <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={onToggle}
        aria-label={task.completed ? 'Mark as not done' : 'Mark as done'}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
          task.completed
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-300 hover:border-brand-500 dark:border-slate-600'
        }`}
      >
        {task.completed && <Check className="h-4 w-4" />}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate font-medium ${
            task.completed
              ? 'text-slate-400 line-through'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p
            className={`mt-0.5 truncate text-sm ${
              task.completed ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {task.description}
          </p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {subject && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${SUBJECT_COLORS[subject.color].badge}`}
            >
              {subject.name}
            </span>
          )}
          {task.hours > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3 w-3" />
              {task.hours}h
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={startEdit}
        aria-label={`Edit ${task.title}`}
        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${task.title}`}
        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}

function EmptyState({ hasTasks }: { hasTasks: boolean }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
        <ListTodo className="h-6 w-6" />
      </div>
      <p className="mt-4 font-semibold text-slate-900 dark:text-white">
        {hasTasks ? 'Nothing here' : 'No tasks yet'}
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {hasTasks
          ? 'No tasks match this filter.'
          : 'Add your first task above to get started.'}
      </p>
    </div>
  );
}
