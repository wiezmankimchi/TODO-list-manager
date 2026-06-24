import { Task } from '../../types/task';
import { getActiveTasks, getCompletedTasks, getWeekOverWeekGrowth } from '../task-stats';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Test',
    completed: false,
    priority: 'medium',
    createdAt: Date.now(),
    ...overrides,
  };
}

describe('getActiveTasks', () => {
  it('returns count of incomplete tasks', () => {
    const tasks = [
      makeTask({ completed: false }),
      makeTask({ completed: true }),
      makeTask({ completed: false }),
    ];
    expect(getActiveTasks(tasks)).toBe(2);
  });

  it('returns 0 for empty array', () => {
    expect(getActiveTasks([])).toBe(0);
  });

  it('returns 0 when all tasks are completed', () => {
    const tasks = [makeTask({ completed: true }), makeTask({ completed: true })];
    expect(getActiveTasks(tasks)).toBe(0);
  });
});

describe('getCompletedTasks', () => {
  it('returns count of completed tasks', () => {
    const tasks = [
      makeTask({ completed: true }),
      makeTask({ completed: false }),
      makeTask({ completed: true }),
    ];
    expect(getCompletedTasks(tasks)).toBe(2);
  });

  it('returns 0 for empty array', () => {
    expect(getCompletedTasks([])).toBe(0);
  });

  it('returns 0 when no tasks are completed', () => {
    const tasks = [makeTask({ completed: false }), makeTask({ completed: false })];
    expect(getCompletedTasks(tasks)).toBe(0);
  });
});

describe('getWeekOverWeekGrowth', () => {
  const DAY = 86_400_000;

  function wednesdayNoon(weeksAgo: number = 0): Date {
    const d = new Date('2025-06-18T12:00:00');
    d.setDate(d.getDate() - weeksAgo * 7);
    return d;
  }

  const now = wednesdayNoon(0);
  const thisWeekTs = now.getTime() - 1 * DAY;
  const lastWeekTs = now.getTime() - 8 * DAY;
  const twoWeeksAgoTs = now.getTime() - 15 * DAY;

  it('returns "+100%" when last week is 0 and this week has tasks', () => {
    const tasks = [makeTask({ createdAt: thisWeekTs })];
    expect(getWeekOverWeekGrowth(tasks, now)).toBe('+100%');
  });

  it('returns "0%" when both weeks have 0 tasks', () => {
    expect(getWeekOverWeekGrowth([], now)).toBe('0%');
  });

  it('returns "0%" when only old tasks exist', () => {
    const tasks = [makeTask({ createdAt: twoWeeksAgoTs })];
    expect(getWeekOverWeekGrowth(tasks, now)).toBe('0%');
  });

  it('returns correct positive percentage', () => {
    const tasks = [
      makeTask({ createdAt: lastWeekTs }),
      makeTask({ createdAt: lastWeekTs }),
      makeTask({ createdAt: thisWeekTs }),
      makeTask({ createdAt: thisWeekTs }),
      makeTask({ createdAt: thisWeekTs }),
    ];
    // 3 this week, 2 last week → +50%
    expect(getWeekOverWeekGrowth(tasks, now)).toBe('+50%');
  });

  it('returns correct negative percentage', () => {
    const tasks = [
      makeTask({ createdAt: lastWeekTs }),
      makeTask({ createdAt: lastWeekTs }),
      makeTask({ createdAt: lastWeekTs }),
      makeTask({ createdAt: lastWeekTs }),
      makeTask({ createdAt: thisWeekTs }),
    ];
    // 1 this week, 4 last week → -75%
    expect(getWeekOverWeekGrowth(tasks, now)).toBe('-75%');
  });

  it('returns "0%" when equal tasks in both weeks', () => {
    const tasks = [
      makeTask({ createdAt: lastWeekTs }),
      makeTask({ createdAt: thisWeekTs }),
    ];
    expect(getWeekOverWeekGrowth(tasks, now)).toBe('0%');
  });

  it('returns "-100%" when last week has tasks but this week has none', () => {
    const tasks = [
      makeTask({ createdAt: lastWeekTs }),
      makeTask({ createdAt: lastWeekTs }),
    ];
    expect(getWeekOverWeekGrowth(tasks, now)).toBe('-100%');
  });
});
