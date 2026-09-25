export class RaceAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private engineGain: GainNode | null = null;
  private engineLow: OscillatorNode | null = null;
  private engineHigh: OscillatorNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private tyreGain: GainNode | null = null;
  private dirtGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private crowdGain: GainNode | null = null;
  private lastImpact = -10;

  async unlock() {
    if (!this.ctx) this.build();
    if (this.ctx?.state === 'suspended') await this.ctx.resume();
  }

  private noise(seconds: number) {
    const ctx = this.ctx!;
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let brown = 0;
    for (let i = 0; i < data.length; i++) {
      brown = brown * 0.96 + (Math.random() * 2 - 1) * 0.18;
      data[i] = brown;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  }

  private build() {
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    const ctx = (this.ctx = new AudioCtor());
    const master = (this.master = ctx.createGain());
    master.gain.value = 0.68;
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -12; compressor.knee.value = 14; compressor.ratio.value = 5;
    master.connect(compressor).connect(ctx.destination);

    this.engineGain = ctx.createGain(); this.engineGain.gain.value = 0.0001;
    this.engineFilter = ctx.createBiquadFilter(); this.engineFilter.type = 'lowpass'; this.engineFilter.frequency.value = 900; this.engineFilter.Q.value = 1.2;
    this.engineLow = ctx.createOscillator(); this.engineLow.type = 'sawtooth';
    this.engineHigh = ctx.createOscillator(); this.engineHigh.type = 'triangle';
    const lowGain = ctx.createGain(), highGain = ctx.createGain(); lowGain.gain.value = 0.3; highGain.gain.value = 0.1;
    this.engineLow.connect(lowGain); this.engineHigh.connect(highGain); lowGain.connect(this.engineFilter); highGain.connect(this.engineFilter); this.engineFilter.connect(this.engineGain).connect(master);
    this.engineLow.start(); this.engineHigh.start();

    const tyre = this.noise(2.1), tyreFilter = ctx.createBiquadFilter(); tyreFilter.type = 'bandpass'; tyreFilter.frequency.value = 1500; tyreFilter.Q.value = 0.7;
    this.tyreGain = ctx.createGain(); this.tyreGain.gain.value = 0.0001; tyre.connect(tyreFilter).connect(this.tyreGain).connect(master); tyre.start();
    const dirt = this.noise(2.7), dirtFilter = ctx.createBiquadFilter(); dirtFilter.type = 'lowpass'; dirtFilter.frequency.value = 560;
    this.dirtGain = ctx.createGain(); this.dirtGain.gain.value = 0.0001; dirt.connect(dirtFilter).connect(this.dirtGain).connect(master); dirt.start();
    const wind = this.noise(3.2), windFilter = ctx.createBiquadFilter(); windFilter.type = 'highpass'; windFilter.frequency.value = 620;
    this.windGain = ctx.createGain(); this.windGain.gain.value = 0.008; wind.connect(windFilter).connect(this.windGain).connect(master); wind.start();
    const crowd = this.noise(4.3), crowdFilter = ctx.createBiquadFilter(); crowdFilter.type = 'bandpass'; crowdFilter.frequency.value = 430; crowdFilter.Q.value = 0.5;
    this.crowdGain = ctx.createGain(); this.crowdGain.gain.value = 0.012; crowd.connect(crowdFilter).connect(this.crowdGain).connect(master); crowd.start();
  }

  update(speed: number, throttle: number, slip: number, offroad: boolean, track: number) {
    if (!this.ctx || !this.engineLow || !this.engineHigh || !this.engineGain || !this.engineFilter) return;
    const now = this.ctx.currentTime, v = Math.min(1, Math.abs(speed) / 43), load = Math.max(0, throttle);
    const rpm = 43 + v * 92 + load * 18;
    this.engineLow.frequency.setTargetAtTime(rpm, now, 0.045);
    this.engineHigh.frequency.setTargetAtTime(rpm * 2.015, now, 0.05);
    this.engineFilter.frequency.setTargetAtTime(620 + v * 1350 + load * 520, now, 0.08);
    this.engineGain.gain.setTargetAtTime(0.12 + v * 0.16 + load * 0.08, now, 0.07);
    this.tyreGain?.gain.setTargetAtTime(Math.max(0.0001, (Math.abs(slip) - 0.055) * 0.3), now, 0.06);
    this.dirtGain?.gain.setTargetAtTime(offroad ? 0.07 + v * 0.08 : 0.0001, now, 0.08);
    this.windGain?.gain.setTargetAtTime(0.006 + v * 0.038 + track * 0.004, now, 0.18);
    this.crowdGain?.gain.setTargetAtTime([0.016, 0.01, 0.026][track] ?? 0.012, now, 0.35);
  }

  cue(kind: 'count' | 'go' | 'lap' | 'finish') {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx, now = ctx.currentTime, osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = kind === 'finish' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(kind === 'count' ? 330 : kind === 'go' ? 660 : kind === 'lap' ? 520 : 440, now);
    if (kind === 'finish') osc.frequency.exponentialRampToValueAtTime(880, now + 0.48);
    gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(kind === 'finish' ? 0.16 : 0.11, now + 0.012); gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === 'finish' ? 0.75 : 0.18));
    osc.connect(gain).connect(this.master); osc.start(now); osc.stop(now + (kind === 'finish' ? 0.8 : 0.22));
  }

  impact(severity: number) {
    if (!this.ctx || !this.master || this.ctx.currentTime - this.lastImpact < 0.22) return;
    this.lastImpact = this.ctx.currentTime;
    const src = this.noise(0.22), filter = this.ctx.createBiquadFilter(), gain = this.ctx.createGain(), now = this.ctx.currentTime;
    src.loop = false; filter.type = 'lowpass'; filter.frequency.value = 260; gain.gain.setValueAtTime(Math.min(0.18, 0.035 + severity * 0.12), now); gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    src.connect(filter).connect(gain).connect(this.master); src.start(); src.stop(now + 0.2);
  }
}
