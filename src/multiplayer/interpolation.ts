export type RacePose = {
  playerId: string; x: number; y: number; z: number; rotationY: number;
  speed: number; steering: number; sequence: number; connected: boolean;
  lap: number; checkpoint: number; progress: number; finished: boolean; dnf: boolean;
};
export type TimedPose = RacePose & { serverNow: number };

export function interpolatePose(samples: TimedPose[], target: number): TimedPose | null {
  if (!samples.length) return null;
  if (samples.length === 1 || target <= samples[0].serverNow) return samples[0];
  let right = samples.findIndex(sample => sample.serverNow >= target);
  if (right < 0) {
    const last = samples[samples.length - 1];
    const ahead = Math.min(0.08, Math.max(0, (target - last.serverNow) / 1000));
    return { ...last, x: last.x + Math.sin(last.rotationY) * last.speed * ahead,
      z: last.z + Math.cos(last.rotationY) * last.speed * ahead };
  }
  if (right === 0) return samples[0];
  const a = samples[right - 1], b = samples[right];
  const t = Math.max(0, Math.min(1, (target - a.serverNow) / Math.max(1, b.serverNow - a.serverNow)));
  const angle = Math.atan2(Math.sin(b.rotationY - a.rotationY), Math.cos(b.rotationY - a.rotationY));
  const lerp = (x: number, y: number) => x + (y - x) * t;
  return { ...b, x: lerp(a.x, b.x), y: lerp(a.y, b.y), z: lerp(a.z, b.z),
    rotationY: a.rotationY + angle * t, speed: lerp(a.speed, b.speed), steering: lerp(a.steering, b.steering) };
}
