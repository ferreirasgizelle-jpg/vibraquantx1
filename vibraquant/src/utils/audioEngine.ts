class VibraAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: any = null;
  private activeOscillators: OscillatorNode[] = [];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public async startSession(rootFreq: number = 528, binauralDiff: number = 6) {
    const ctx = this.getContext();
    if (!ctx) return;
    this.stopSession();

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    this.isPlaying = true;
    this.playBinauralDrone(ctx, 100, binauralDiff);

    const harmonicScale = [
      rootFreq,
      rootFreq * (9 / 8),
      rootFreq * (5 / 4),
      rootFreq * (3 / 2),
      rootFreq * (5 / 3),
    ];

    this.intervalId = setInterval(() => {
      if (!this.isPlaying) return;
      const note =
        harmonicScale[Math.floor(Math.random() * harmonicScale.length)];
      this.playMelodicNote(ctx, note);
    }, 2200);
  }

  private playBinauralDrone(ctx: AudioContext, baseFreq: number, diff: number) {
    // Canal Esquerdo
    const oscL = ctx.createOscillator();
    const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const gainL = ctx.createGain();

    oscL.frequency.value = baseFreq;
    gainL.gain.value = 0.05;
    if (pannerL) pannerL.pan.value = -1;

    if (pannerL) oscL.connect(gainL).connect(pannerL).connect(ctx.destination);
    else oscL.connect(gainL).connect(ctx.destination);

    oscL.start();
    this.activeOscillators.push(oscL);

    // Canal Direito
    const oscR = ctx.createOscillator();
    const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const gainR = ctx.createGain();

    oscR.frequency.value = baseFreq + diff;
    gainR.gain.value = 0.05;
    if (pannerR) pannerR.pan.value = 1;

    if (pannerR) oscR.connect(gainR).connect(pannerR).connect(ctx.destination);
    else oscR.connect(gainR).connect(ctx.destination);

    oscR.start();
    this.activeOscillators.push(oscR);
  }

  private playMelodicNote(ctx: AudioContext, freq: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 2.9);
  }

  public stopSession() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {}
    });
    this.activeOscillators = [];
  }
}

export const audioEngine = new VibraAudioEngine();
