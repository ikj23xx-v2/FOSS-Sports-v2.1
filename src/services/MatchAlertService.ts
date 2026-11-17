// Web Audio API Sound Synthesizer & Haptic Feedback Manager
export class MatchAlertService {
  
  // Trigger sport-specific haptic vibration patterns
  public static triggerHaptic(sport: 'nba' | 'nfl' | 'mlb' | 'nhl' | string = 'nba', type: 'score' | 'buzzer' | 'win' = 'score') {
    if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;

    if (type === 'buzzer') {
      // Intense buzzer-beater haptic pattern
      navigator.vibrate([120, 40, 120, 40, 250]);
      return;
    }

    if (type === 'win') {
      // Celebratory victory pulse
      navigator.vibrate([150, 60, 150, 60, 300]);
      return;
    }

    switch (sport.toLowerCase()) {
      case 'nba':
        // Quick double-pulse like a buzzer-beater horn
        navigator.vibrate([100, 50, 100, 50, 200]);
        break;
      case 'nfl':
        // Deep heavy thump like a massive hit or touchdown roar
        navigator.vibrate([300, 100, 300]);
        break;
      case 'mlb':
        // Sharp single snap like a bat crack
        navigator.vibrate([80]);
        break;
      case 'nhl':
        // Rapid staccato like stick handling / goal horn
        navigator.vibrate([50, 50, 50, 50, 150]);
        break;
      default:
        navigator.vibrate(150);
    }
  }

  // Synthesize custom audio cheers per sport using the Web Audio API (no external MP3 files required!)
  public static playSportCheer(sport: 'nba' | 'nfl' | 'mlb' | 'nhl' | string = 'nba') {
    // Trigger vibration feedback simultaneously
    this.triggerHaptic(sport, 'score');

    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // Create white noise buffer to simulate crowd roar / stadium noise
      const bufferSize = Math.floor(ctx.sampleRate * 1.5); // 1.5 seconds roar
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Filter frequency based on sport type for unique acoustic profiles
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';

      const s = sport.toLowerCase();
      if (s === 'nba') {
        // Indoor arena acoustics (higher resonance, squeak frequency)
        filter.frequency.value = 1200;
        filter.Q.value = 3.0;
      } else if (s === 'nfl') {
        // Massive outdoor stadium roar (deep bass rumble)
        filter.frequency.value = 400;
        filter.Q.value = 1.0;
      } else if (s === 'mlb') {
        // Crisp stadium crack / cheer
        filter.frequency.value = 1800;
        filter.Q.value = 4.0;
      } else {
        // Hockey arena echo
        filter.frequency.value = 900;
        filter.Q.value = 2.0;
      }

      // Volume envelope (Fade in and fade out)
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

      // Connect nodes
      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start();
      whiteNoise.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.error("Audio playback error:", e);
    }
  }

  // Synthesizes a buzzer-beater horn with arena crowd eruption
  public static playBuzzerBeater(sport: string = 'nba') {
    this.triggerHaptic(sport, 'buzzer');

    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // Low stadium horn buzz
      const osc = ctx.createOscillator();
      const hornGain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.8);

      hornGain.gain.setValueAtTime(0.35, ctx.currentTime);
      hornGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.6);
      hornGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);

      osc.connect(hornGain);
      hornGain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.9);

      // Followed by crowd roar
      setTimeout(() => {
        this.playSportCheer(sport);
      }, 300);
    } catch (e) {
      console.error("Buzzer audio error:", e);
    }
  }

  // Celebratory prediction win fanfare + stadium cheer
  public static playPredictionWin(sport: string = 'nba') {
    this.triggerHaptic(sport, 'win');

    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // Ascending triumphant arpeggio: C5 -> E5 -> G5 -> C6
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + idx * 0.1;
        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.linearRampToValueAtTime(0.28, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });

      // Crowd cheer explosion
      setTimeout(() => {
        this.playSportCheer(sport);
      }, 450);
    } catch (e) {
      console.error("Prediction win audio error:", e);
    }
  }
}
