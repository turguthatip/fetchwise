export type DayStat = {
  date: string;
  requests: number;
  successful: number;
  failed: number;
  avgMs: number;
};

const DAY = 24 * 60 * 60 * 1000;
/** Demo data ends on a fixed day so prerendered and client output always match. */
export const LAST_DAY = "2026-10-28";

function toIso(time: number) {
  return new Date(time).toISOString().slice(0, 10);
}

/** Smooth, repeatable pseudo-random traffic for a calendar day. */
function requestsFor(time: number) {
  const day = Math.floor(time / DAY);
  const wave = Math.sin(day / 3.1) * 180 + Math.sin(day / 1.7) * 90;
  const noise = ((day * 9301 + 49297) % 233280) / 233280;
  const weekend = [0, 6].includes(new Date(time).getUTCDay()) ? -220 : 0;
  const spike = day % 11 === 4 ? 900 : 0;
  return Math.max(40, Math.round(820 + wave + noise * 160 + weekend + spike));
}

export function statsBetween(from: string, to: string): DayStat[] {
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return [];
  const days: DayStat[] = [];
  for (let time = start; time <= end && days.length < 92; time += DAY) {
    const requests = requestsFor(time);
    const failed = Math.round(requests * (0.004 + ((Math.floor(time / DAY) * 7) % 13) / 1000));
    days.push({
      date: toIso(time),
      requests,
      successful: requests - failed,
      failed,
      avgMs: 2400 + ((Math.floor(time / DAY) * 37) % 900),
    });
  }
  return days;
}

export function lastDays(count: number) {
  const end = Date.parse(`${LAST_DAY}T00:00:00Z`);
  return statsBetween(toIso(end - (count - 1) * DAY), LAST_DAY);
}

export function shiftDays(date: string, days: number) {
  return toIso(Date.parse(`${date}T00:00:00Z`) + days * DAY);
}
