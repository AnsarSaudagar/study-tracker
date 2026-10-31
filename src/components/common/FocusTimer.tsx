import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Timer } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

type Mode = 'focus' | 'short' | 'long';

const MODES: Record<Mode, { label: string; minutes: number }> = {
  focus: { label: 'Focus', minutes: 25 },
  short: { label: 'Short break', minutes: 5 },
  long: { label: 'Long break', minutes: 15 },
};

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function format(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/** Pomodoro-style focus timer with focus/break modes. */
export function FocusTimer() {
  const toast = useToast();
  const [mode, setMode] = useState<Mode>('focus');
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.minutes * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const total = MODES[mode].minutes * 60;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const switchMode = useCallback(
    (next: Mode) => {
      clearTimer();
      setRunning(false);
      setMode(next);
      setSecondsLeft(MODES[next].minutes * 60);
    },
    [clearTimer],
  );

  const reset = useCallback(() => {
    clearTimer();
    setRunning(false);
    setSecondsLeft(MODES[mode].minutes * 60);
  }, [clearTimer, mode]);

  // Tick while running.
  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [running, clearTimer]);

  // Handle completion as a side effect of hitting zero.
  useEffect(() => {
    if (secondsLeft === 0 && !running) {
      if (mode === 'focus') {
        setCompleted((c) => c + 1);
        toast.success('Focus session complete! Take a break.');
      } else {
        toast.success('Break over — back to focus.');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const progress = total === 0 ? 0 : (total - secondsLeft) / total;
  const dashoffset = CIRCUMFERENCE * (1 - progress);

  const ringColor = useMemo(
    () => (mode === 'focus' ? 'text-brand-500' : 'text-emerald-500'),
    [mode],
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <Timer className="h-4 w-4 text-brand-500" />
          Focus timer
        </div>
        <span className="text-xs text-slate-400">
          {completed} {completed === 1 ? 'session' : 'sessions'} today
        </span>
      </div>

      {/* Mode tabs */}
      <div className="mt-4 flex gap-1.5">
        {(Object.keys(MODES) as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              mode === m
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      {/* Ring */}
      <div className="mt-6 flex justify-center">
        <div className="relative h-40 w-40">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              strokeWidth="8"
              className="stroke-slate-100 dark:stroke-slate-800"
            />
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashoffset}
              className={`${ringColor} transition-[stroke-dashoffset] duration-500`}
              stroke="currentColor"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold tabular-nums text-slate-900 dark:text-white">
              {format(secondsLeft)}
            </span>
            <span className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
              {MODES[mode].label}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          disabled={secondsLeft === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Reset timer"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
