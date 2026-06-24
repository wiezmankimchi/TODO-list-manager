import { Task } from '@/types/task';

export function getActiveTasks(tasks: Task[]): number {
  return tasks.filter((t) => !t.completed).length;
}

export function getCompletedTasks(tasks: Task[]): number {
  return tasks.filter((t) => t.completed).length;
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diff);
  return d;
}

export function getWeekOverWeekGrowth(tasks: Task[], now: Date = new Date()): string {
  const startOfThisWeek = getStartOfWeek(now);
  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  const thisWeekStart = startOfThisWeek.getTime();
  const lastWeekStart = startOfLastWeek.getTime();

  let thisWeekCount = 0;
  let lastWeekCount = 0;

  for (const task of tasks) {
    if (task.createdAt >= thisWeekStart) {
      thisWeekCount++;
    } else if (task.createdAt >= lastWeekStart) {
      lastWeekCount++;
    }
  }

  if (lastWeekCount === 0 && thisWeekCount === 0) return '0%';
  if (lastWeekCount === 0) return '+100%';

  const growth = Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
  if (growth > 0) return `+${growth}%`;
  return `${growth}%`;
}
