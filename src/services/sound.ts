import { SoundPackType } from '../types';

/**
 * Web Audio API synthesized sound & haptic effects
 * Supports sound packs from the APK: Apple Subtle, Stadium Whistle & Organ, Arcade Retro, or Silent Haptics
 */

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private soundPack: SoundPackType = 'apple';

  constructor() {
    const saved = localStorage.getItem('foss_sound_enabled');
    if (saved !== null) {
      this.enabled = saved === 'true';
    }
    const savedPack = localStorage.getItem('foss_sound_pack') as SoundPackType;
    if (savedPack) {
      this.soundPack = savedPack;
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    localStorage.setItem('foss_sound_enabled', String(val));
  }

  public getSoundPack(): SoundPackType {
    return this.soundPack;
  }

  public setSoundPack(pack: SoundPackType) {
    this.soundPack = pack;
    localStorage.setItem('foss_sound_pack', pack);
    this.playScore(); // sample preview
  }

  /** Tap click sound */
  public playTap() {
    if (!this.enabled) return;

    // Haptics vibration always runs on supporting mobile devices
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(8);
    }

    if (this.soundPack === 'silent') return;

    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (this.soundPack === 'arcade') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.setValueAtTime(900, this.ctx.currentTime + 0.015);
        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      } else if (this.soundPack === 'stadium') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      } else {
        // Apple default
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.025);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.025);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /** Tab selection / filter switch */
  public playTabSwitch() {
    if (!this.enabled) return;

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(12);
    }

    if (this.soundPack === 'silent') return;

    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = this.soundPack === 'arcade' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Ignore
    }
  }

  /** Score alert chime */
  public playScore() {
    if (!this.enabled) return;

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([30, 40, 30]);
    }

    if (this.soundPack === 'silent') return;

    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      if (this.soundPack === 'stadium') {
        // Stadium organ / whistle chord: 3 notes
        [587.33, 739.99, 880].forEach((freq, i) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0.09, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.3);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.3);
        });
      } else if (this.soundPack === 'arcade') {
        // 8-bit coin / level up
        [659.25, 987.77].forEach((freq, i) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.08, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.2);
        });
      } else {
        // Apple signature double bell
        [659.25, 880].forEach((freq, i) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.09);
          gain.gain.setValueAtTime(0.14, now + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.22);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + i * 0.09);
          osc.stop(now + i * 0.09 + 0.22);
        });
      }
    } catch {
      // Ignore
    }
  }

  /** Live game buzzer / clutch alert */
  public playLiveAlert() {
    if (!this.enabled) return;

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(40);
    }

    if (this.soundPack === 'silent') return;

    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = this.soundPack === 'stadium' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(783.99, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Ignore
    }
  }

  /** Synthesized audio chord progression / fanfare depending on league */
  public playLeagueJingle(leagueId: string) {
    if (!this.enabled || this.soundPack === 'silent') return;

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(15);
    }

    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (leagueId === 'nba') {
        // Upbeat bouncy synth chord progression (Cmaj9 arpeggio staccato)
        const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          gain.gain.setValueAtTime(0.08, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.18);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.18);
        });
      } else if (leagueId === 'nfl') {
        // Heavy brass fanfare triad
        const brassNotes = [146.83, 220.0, 293.66, 440.0];
        brassNotes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.09, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.32);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.32);
        });
      } else if (leagueId === 'mlb') {
        // Classic ballpark organ arpeggio
        const organNotes = [392.0, 523.25, 659.25, 783.99];
        organNotes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.1, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.25);
        });
      } else if (leagueId === 'nhl') {
        // Ice arena horn chord with slight detune
        const hornNotes = [440.0, 554.37, 659.25];
        hornNotes.forEach((freq) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now);
          osc.stop(now + 0.28);
        });
      } else if (leagueId === 'f1') {
        // High-revving V6 hybrid engine whoosh / racing acoustic surge
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.18);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.35);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (leagueId === 'epl' || leagueId === 'mls') {
        // European stadium whistle / chant chime harmonic
        [880, 1320].forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.03);
          gain.gain.setValueAtTime(0.08, now + idx * 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.22);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + idx * 0.03);
          osc.stop(now + idx * 0.03 + 0.22);
        });
      } else {
        // All Leagues: Crisp spatial chime chord
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.09, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.2);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.2);
        });
      }
    } catch {
      // Audio fallback
    }
  }
}

export const sounds = new SoundEffectsManager();
