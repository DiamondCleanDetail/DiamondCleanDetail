export const timeSlots = ["9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM"];
export const CLOSING_MINUTES = 18 * 60; // 6:00 PM — matches serviceArea.ts business hours.

export function parseTimeToMinutes(time: string): number {
  const m = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  let hour = parseInt(m[1], 10);
  const minute = parseInt(m[2], 10);
  const meridiem = m[3].toUpperCase();
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
}

export function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

export function todayIso(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
}

export function isWeekend(dateStr: string): boolean {
  if (!dateStr) return false;
  const day = new Date(`${dateStr}T00:00:00`).getDay();
  return day === 0 || day === 6;
}

export type BookedRange = { time: string; durationMinutes: number };

/** Time slots that fit a service of `duration` minutes without running past
 * closing or overlapping an existing booking. */
export function availableSlotsFor(
  duration: number,
  bookedRanges: BookedRange[],
  weekend: boolean
): string[] {
  if (weekend) return [];
  return timeSlots.filter((slot) => {
    const start = parseTimeToMinutes(slot);
    const end = start + duration;
    if (end > CLOSING_MINUTES) return false;
    return !bookedRanges.some((b) => {
      const bStart = parseTimeToMinutes(b.time);
      const bEnd = bStart + b.durationMinutes;
      return rangesOverlap(start, end, bStart, bEnd);
    });
  });
}
