import { describe, expect, it } from 'vitest';
import { awardRace, createProgress, crossCheckpoint, mapAnalogControl, nearestTrackXZ, rankedStandings, RIVAL_TUNING, stepCar, type Standing } from './race';

describe('ordered checkpoint and lap state', () => {
  it('rejects skipped and repeated checkpoints', () => {
    const p=createProgress();
    expect(crossCheckpoint(p,2,4,2,1)).toBe(false);
    expect(crossCheckpoint(p,0,4,2,2)).toBe(true);
    expect(crossCheckpoint(p,0,4,2,3)).toBe(false);
    expect(p.checkpoint).toBe(1);
  });
  it('finishes only after all checkpoints on all laps', () => {
    const p=createProgress();
    for(let lap=0;lap<2;lap++)for(let cp=0;cp<3;cp++)expect(crossCheckpoint(p,cp,3,2,lap*3+cp)).toBe(true);
    expect(p.finished).toBe(true);expect(p.lap).toBe(2);expect(p.finishTime).toBe(5);
  });
});

describe('championship', () => {
  const base=():Standing[]=>['PLAYER','CHARGER','TECHNICIAN','DEFENDER'].map(id=>({id,points:0,wins:0,bestFinish:99,lastFinish:99}));
  it('awards 10/7/4/2 and resolves ties deterministically', () => {
    let s=awardRace(base(),['CHARGER','PLAYER','TECHNICIAN','DEFENDER']);
    expect(s.map(x=>x.points)).toEqual([7,10,4,2]);
    s=awardRace(s,['PLAYER','TECHNICIAN','DEFENDER','CHARGER']);
    expect(rankedStandings(s)[0].id).toBe('PLAYER');
  });
});

describe('handling and personalities', () => {
  it('maps analog down to reverse, up to acceleration, and center to neutral', () => {
    expect(mapAnalogControl(0, 40, 40).drive).toBe(-1);
    expect(mapAnalogControl(0, -40, 40).drive).toBe(1);
    expect(mapAnalogControl(0, 3, 40).drive).toBe(0);
    let reversed={speed:0,heading:0,slip:0,steerAngle:0,x:0,z:0,offroad:false};
    for(let i=0;i<60;i++)reversed=stepCar(reversed,{throttle:0,brake:1,steer:0,handbrake:false},1/60);
    expect(reversed.speed).toBeLessThan(-3);
    expect(reversed.z).toBeLessThan(0);
  });
  it('keeps an elevated car on the racing surface instead of penalizing vertical height', () => {
    const samples = [{ x: 10, y: 7, z: 20 }, { x: 20, y: 9, z: 20 }];
    expect(nearestTrackXZ({ x: 10.5, z: 20 }, samples)).toEqual({ idx: 0, distance: 0.5 });
  });
  it('maps positive steering to the leftward yaw used by the camera and car model', () => {
    const s={speed:24,heading:0,slip:0,steerAngle:0,x:0,z:0,offroad:false};
    const left=stepCar(s,{throttle:0,brake:0,steer:1,handbrake:false},1/30);
    const right=stepCar(s,{throttle:0,brake:0,steer:-1,handbrake:false},1/30);
    expect(left.heading).toBeGreaterThan(0);
    expect(right.heading).toBeLessThan(0);
  });
  it('accelerates, brakes, reverses and limits high-speed steering', () => {
    let s={speed:0,heading:0,slip:0,steerAngle:0,x:0,z:0,offroad:false};
    for(let i=0;i<120;i++)s=stepCar(s,{throttle:1,brake:0,steer:0,handbrake:false},1/60);
    expect(s.speed).toBeGreaterThan(20);const fast=s;
    for(let i=0;i<45;i++)s=stepCar(s,{throttle:0,brake:1,steer:1,handbrake:true},1/60);
    expect(s.speed).toBeLessThan(fast.speed);expect(Math.abs(s.slip)).toBeGreaterThan(.01);
  });
  it('has materially different rival parameters', () => {
    expect(RIVAL_TUNING.CHARGER.overtakeThreshold).toBeGreaterThan(RIVAL_TUNING.TECHNICIAN.overtakeThreshold);
    expect(RIVAL_TUNING.TECHNICIAN.cornerGrip).toBeGreaterThan(RIVAL_TUNING.CHARGER.cornerGrip);
    expect(RIVAL_TUNING.DEFENDER.defensiveBias).toBeGreaterThan(0);
    expect(RIVAL_TUNING.CHARGER.mistakeChance).toBeGreaterThan(RIVAL_TUNING.TECHNICIAN.mistakeChance);
  });
});
