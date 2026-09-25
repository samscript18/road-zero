import { describe, expect, it } from 'vitest';
import { interpolatePose, type TimedPose } from './interpolation';

const pose = (serverNow: number, x: number, rotationY = 0): TimedPose => ({
  playerId: 'other', x, y: 7, z: 0, rotationY, speed: 10, steering: 0,
  sequence: serverNow, connected: true, lap: 1, checkpoint: 0, progress: 0,
  finished: false, dnf: false, serverNow,
});

describe('remote interpolation', () => {
  it('interpolates position between server snapshots', () => {
    expect(interpolatePose([pose(1000, 0), pose(1100, 10)], 1050)?.x).toBe(5);
  });
  it('takes the shortest turn across the yaw wrap', () => {
    const halfway = interpolatePose([pose(1000, 0, 3.1), pose(1100, 10, -3.1)], 1050)!;
    expect(Math.abs(halfway.rotationY)).toBeCloseTo(Math.PI, 1);
  });
  it('caps extrapolation at 80 ms', () => {
    const last = pose(1000, 0);
    expect(interpolatePose([last], 2000)?.x).toBe(0);
    expect(interpolatePose([pose(900, 0), last], 2000)?.z).toBeCloseTo(.8, 2);
  });
  it('stays bounded with 50–150 ms jitter and a dropped update', () => {
    const arrivals = [0, 50, 150, 300, 350].map(time => pose(time, time * .02));
    const sampled = [100, 180, 240, 320, 400, 550].map(time => interpolatePose(arrivals.filter(item => item.serverNow <= time + 120), time)!);
    expect(sampled.every(item => Number.isFinite(item.x))).toBe(true);
    for (let i = 1; i < sampled.length; i++) expect(sampled[i].x - sampled[i - 1].x).toBeLessThan(2.5);
    expect(sampled.at(-1)!.x).toBeLessThan(8);
  });
});
