import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ListTodo,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTracker } from '@/hooks/useTracker';
import { Button } from '@/components/ui/Button';
import { FocusTimer } from '@/components/common/FocusTimer';
import { SUBJECT_COLORS } from '@/utils/subjectColors';

/** Overview dashboard: live stats computed from the user's tasks + subjects. */
export function Dashboard() {
  const { user } = useAuth();
  const { tasks, subjects } = useTracker();
  const firstName = user?.fullName.split(' ')[0] ?? 'there';

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.completed);
    const hoursDone = completed.reduce((sum, t) => sum + t.hours, 0);
    const completionRate =
      tasks.length === 0 ? 0 : Math.round((completed.length / tasks.length) * 100);
    return {
      subjects: subjects.length,
      total: tasks.length,
      completed: completed.length,
      active: tasks.length - completed.length,
      hoursDone,
      completionRate,
    };
  }, [tasks, subjects]);

  const recent = tasks.slice(0, 5);

  const cards = [
    { icon: BookOpen, label: 'Subjects', value: String(stats.subjects) },
    { icon: ListTodo, label: 'Active tasks', value: String(stats.active) },
    { icon: CheckCircle2, label: 'Completed', value: String(stats.completed) },
    { icon: Clock, label: 'Hours done', value: `${stats.hoursDone}h` },
  ];

  const isEmpty = tasks.length === 0 && subjects.length === 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Welcome, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Signed in as <span className="font-medium">{user?.email}</span>
          </p>
        </div>
        <Link to="/tasks">
          <Button>
            <Plus className="h-4 w-4" />
            Add task
          </Button>
        </Link>
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {label}
              </span>
              <Icon className="h-5 w-5 text-brand-500" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Focus timer — always available */}
        <FocusTimer />

        {/* Right column */}
        {isEmpty ? (
          <div className="lg:col-span-2">
            <EmptyState />
          </div>
        ) : (
          <div className="space-y-6 lg:col-span-2">
            {/* Progress */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <TrendingUp className="h-4 w-4 text-brand-500" />
                Overall progress
              </div>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                  {stats.completionRate}%
                </span>
                <span className="pb-1 text-sm text-slate-400">
                  {stats.completed}/{stats.total} tasks
                </span>
              </div>
              <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </section>

            {/* Recent tasks */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Recent tasks
                </h2>
                <Link
                  to="/tasks"
                  className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  View all
                </Link>
              </div>
              {recent.length === 0 ? (
                <p className="mt-6 text-sm text-slate-400">No tasks yet.</p>
              ) : (
                <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                  {recent.map((t) => (
                    <li key={t.id} className="flex items-center gap-3 py-3">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          t.completed ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      />
                      <span
                        className={`flex-1 truncate text-sm ${
                          t.completed
                            ? 'text-slate-400 line-through'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {t.title}
                      </span>
                      {t.hours > 0 && (
                        <span className="text-xs text-slate-400">{t.hours}h</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>

      {/* Subjects overview */}
      {subjects.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Your subjects
          </h2>
          <div className="flex flex-wrap gap-2">
            {subjects.map((s) => (
              <span
                key={s.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${SUBJECT_COLORS[s.color].badge}`}
              >
                <span className={`h-2 w-2 rounded-full ${SUBJECT_COLORS[s.color].dot}`} />
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
        <ListTodo className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">
        Your study journey starts here
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        Create a subject to organize your work, then add tasks and track the hours you put in.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/subjects">
          <Button variant="secondary">Add a subject</Button>
        </Link>
        <Link to="/tasks">
          <Button>
            <Plus className="h-4 w-4" />
            Add a task
          </Button>
        </Link>
      </div>
    </section>
  );
}
