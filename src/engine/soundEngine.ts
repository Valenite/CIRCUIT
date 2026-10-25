// Web Audio API Sound Synthesizer for CircuitCraft

class SoundEngine {
  private ctx: AudioContext | null = null;
  private buzzerOsc: OscillatorNode | null = null;
  private buzzerGain: GainNode | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopBuzzer();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playBuzzer(freq: number = 2400) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    if (!this.buzzerOsc) {
      this.buzzerOsc = this.ctx.createOscillator();
      this.buzzerGain = this.ctx.createGain();

      this.buzzerOsc.type = 'square'; // Realistic piezo buzzer tone
      this.buzzerOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      this.buzzerGain.gain.setValueAtTime(0.08, this.ctx.currentTime); // Soft pleasant volume
      this.buzzerOsc.connect(this.buzzerGain);
      this.buzzerGain.connect(this.ctx.destination);

      this.buzzerOsc.start();
    } else {
      this.buzzerOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (this.buzzerGain) {
        this.buzzerGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      }
    }
  }

  public stopBuzzer() {
    if (this.buzzerOsc && this.ctx) {
      try {
        if (this.buzzerGain) {
          this.buzzerGain.gain.setValueAtTime(0, this.ctx.currentTime);
        }
        this.buzzerOsc.stop();
        this.buzzerOsc.disconnect();
      } catch (e) {
        // ignore already stopped
      }
      this.buzzerOsc = null;
      this.buzzerGain = null;
    }
  }

  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      // ignore
    }
  }
}

export const soundEngine = new SoundEngine();
