import type { TimelineStage } from '../../types/dashboard';

export function makeTimeline(stages: Array<{ name: string; value: number }>): TimelineStage[] {
  return stages.map((s, idx) => ({
    id: s.name,
    index: idx,
    title: s.name,
    value: s.value,
    timestamp: `T+${idx + 1}m`,
  }));
}

