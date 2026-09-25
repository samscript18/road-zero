export type RivalId = 'CHARGER' | 'TECHNICIAN' | 'DEFENDER';
export type RaceId = 'ORCHARD' | 'QUARRY' | 'SUMMIT';

export type RivalTuning = {
  topSpeed: number;
  cornerGrip: number;
  brakeLookahead: number;
  overtakeThreshold: number;
  passOffset: number;
  defensiveBias: number;
  mistakeChance: number;
  mistakeLoss: number;
  lineSmoothing: number;
  launch: number;
};

export const RIVAL_TUNING: Record<RivalId, RivalTuning> = {
  CHARGER: {
    topSpeed: 44.5, cornerGrip: .86, brakeLookahead: 20, overtakeThreshold: 8.5,
    passOffset: 2.25, defensiveBias: 0, mistakeChance: .028, mistakeLoss: .25,
    lineSmoothing: 4.2, launch: 1.04,
  },
  TECHNICIAN: {
    topSpeed: 42.8, cornerGrip: 1.04, brakeLookahead: 28, overtakeThreshold: 5.5,
    passOffset: 1.4, defensiveBias: 0, mistakeChance: .004, mistakeLoss: .08,
    lineSmoothing: 6.8, launch: 1,
  },
  DEFENDER: {
    topSpeed: 40.8, cornerGrip: .94, brakeLookahead: 24, overtakeThreshold: 4.5,
    passOffset: 1.25, defensiveBias: 1.8, mistakeChance: .009, mistakeLoss: .1,
    lineSmoothing: 5.4, launch: .98,
  },
};

export const RACES: Array<{ id: RaceId; name: string; laps: number; personalityEdge: RivalId }> = [
  { id: 'ORCHARD', name: 'ORCHARD SPRINT', laps: 2, personalityEdge: 'CHARGER' },
  { id: 'QUARRY', name: 'QUARRY LOOP', laps: 2, personalityEdge: 'TECHNICIAN' },
  { id: 'SUMMIT', name: 'SUMMIT RUN', laps: 2, personalityEdge: 'DEFENDER' },
];

export const POINTS = [10, 7, 4, 2] as const;

export type ProgressState = {
  checkpoint: number;
  lap: number;
  finished: boolean;
  finishTime: number | null;
};

export function createProgress(): ProgressState {
  return { checkpoint: 0, lap: 1, finished: false, finishTime: null };
}

export function crossCheckpoint(state: ProgressState, index: number, checkpointCount: number, totalLaps: number, time: number): boolean {
  if (state.finished || index !== state.checkpoint || checkpointCount < 2) return false;
  state.checkpoint++;
  if (state.checkpoint === checkpointCount) {
    state.checkpoint = 0;
    if (state.lap >= totalLaps) {
      state.finished = true;
      state.finishTime = time;
    } else state.lap++;
  }
  return true;
}

export type Standing = { id: string; points: number; wins: number; bestFinish: number; lastFinish: number };

export function awardRace(standings: Standing[], order: string[]): Standing[] {
  const rank = new Map(order.map((id, i) => [id, i + 1]));
  return standings.map(s => {
    const finish = rank.get(s.id) ?? 4;
    return {
      ...s,
      points: s.points + POINTS[Math.min(3, finish - 1)],
      wins: s.wins + (finish === 1 ? 1 : 0),
      bestFinish: Math.min(s.bestFinish, finish),
      lastFinish: finish,
    };
  });
}

export function rankedStandings(standings: Standing[]): Standing[] {
  return [...standings].sort((a, b) =>
    b.points - a.points || b.wins - a.wins || a.bestFinish - b.bestFinish || a.lastFinish - b.lastFinish || a.id.localeCompare(b.id));
}

export type CarInput = { throttle: number; brake: number; steer: number; handbrake: boolean };
export type CarState = { speed: number; heading: number; slip: number; steerAngle: number; x: number; z: number; offroad: boolean };

export function mapAnalogControl(offsetX: number, offsetY: number, travel: number) {
  const radius = Math.max(1, travel);
  const steer = Math.max(-1, Math.min(1, offsetX / radius));
  const vertical = Math.max(-1, Math.min(1, -offsetY / radius));
  const drive = Math.abs(vertical) < 0.18 ? 0 : Math.sign(vertical) * Math.min(1, (Math.abs(vertical) - 0.18) / 0.82);
  return { steer, drive };
}

export function nearestTrackXZ(pos: { x: number; z: number }, samples: ReadonlyArray<{ x: number; z: number }>) {
  let best = Infinity;
  let idx = 0;
  for (let i = 0; i < samples.length; i++) {
    const dx = pos.x - samples[i].x;
    const dz = pos.z - samples[i].z;
    const distanceSq = dx * dx + dz * dz;
    if (distanceSq < best) {
      best = distanceSq;
      idx = i;
    }
  }
  return { idx, distance: Math.sqrt(best) };
}

export const CAR_TUNE = {
  accel: 15.5, brake: 28, reverseAccel: 8, maxForward: 43, maxReverse: 8,
  drag: .34, rolling: 1.1, lowSteer: 2.25, highSteer: .82,
  grip: 7.4, handbrakeGrip: 2.1, slipBuild: 3.8, offroadDrag: 9.5,
};

export function stepCar(s: CarState, input: CarInput, dt: number): CarState {
  const d = Math.max(0, Math.min(.05, dt));
  const throttle = Math.max(0, Math.min(1, input.throttle));
  const brake = Math.max(0, Math.min(1, input.brake));
  let speed = s.speed;
  if (throttle > 0) speed += (speed >= 0 ? CAR_TUNE.accel * (1 - Math.min(speed / CAR_TUNE.maxForward, 1) * .64) : CAR_TUNE.brake) * throttle * d;
  if (brake > 0) speed -= (speed > .5 ? CAR_TUNE.brake : CAR_TUNE.reverseAccel) * brake * d;
  speed -= Math.sign(speed) * Math.min(Math.abs(speed), (CAR_TUNE.rolling + Math.abs(speed) * CAR_TUNE.drag * .08 + (s.offroad ? CAR_TUNE.offroadDrag : 0)) * d);
  speed = Math.max(-CAR_TUNE.maxReverse, Math.min(CAR_TUNE.maxForward, speed));
  const speed01 = Math.min(Math.abs(speed) / CAR_TUNE.maxForward, 1);
  const steerLimit = CAR_TUNE.lowSteer + (CAR_TUNE.highSteer - CAR_TUNE.lowSteer) * speed01;
  const steerAngle = damp(s.steerAngle, Math.max(-1, Math.min(1, input.steer)) * steerLimit, 10, d);
  const grip = input.handbrake ? CAR_TUNE.handbrakeGrip : CAR_TUNE.grip;
  const wantedSlip = input.handbrake && speed01 > .2 ? steerAngle * speed01 * .72 : steerAngle * speed01 * .14;
  const slip = damp(s.slip, wantedSlip, grip, d);
  const heading = s.heading + (steerAngle - slip * .58) * (speed / CAR_TUNE.maxForward) * d;
  const travel = heading + slip;
  return { ...s, speed, heading, slip, steerAngle, x: s.x + Math.sin(travel) * speed * d, z: s.z + Math.cos(travel) * speed * d };
}

export function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
