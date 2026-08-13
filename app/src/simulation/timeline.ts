import type { TimelinePoint } from '../contracts/simulation'

export function compactTimeline(points: TimelinePoint[]): TimelinePoint[] {
  if (points.length <= 2) return points
  return points.filter((point, index) => index === points.length - 1 || index === 0 || point.date.slice(0, 7) !== points[index - 1]!.date.slice(0, 7))
}
