import React, { useState, useEffect, useRef } from 'react';

// Real-time Lyrics Timeline matching the high-quality "Level Up, Mannu" song
const LYRIC_TIMELINE = [
  { time: 0.0, text: "🎶 Woo! Let's party! 🎉" },
  { time: 3.8, text: "🎮 A brand new quest begins for you..." },
  { time: 7.5, text: "⭐ Level up, turn a sparkly eight! ⭐" },
  { time: 11.3, text: "🌍 The whole wide world is yours to create! 🎈" },
  { time: 15.0, text: "🌟 Shine so bright for all to see! 🌟" },
  { time: 18.8, text: "💖 Happy Birthday, Mannu, from me! 💖" },
  { time: 22.5, text: "👑 (Mannu!) 👑" },
  { time: 25.0, text: "🎂 Level 8 Unlocked! 🥳" }
];

const BALLOON_COLORS = [
  { bg: 'from-pink-400 to-pink-600', border: 'border-pink-300', hex: '#ec4899' },
  { bg: 'from-purple-400 to-purple-600', border: 'border-purple-300', hex: '#a855f7' },
  { bg: 'from-rose-400 to-rose-600', border: 'border-rose-300', hex: '#f43f5e' },
  { bg: 'from-blue-400 to-blue-600', border: 'border-blue-300', hex: '#3b82f6' },
  { bg: 'from-teal-400 to-teal-600', border: 'border-teal-300', hex: '#14b8a6' },
  { bg: 'from-amber-400 to-amber-600', border: 'border-amber-300', hex: '#f59e0b' },
  { bg: 'from-emerald-400 to-emerald-600', border: 'border-emerald-300', hex: '#10b981' }
];

// Dynamically generate a short synthesized pop sound in WAV format
const generatePopSoundUri = () => {
  const sampleRate = 8000;
  const duration = 0.12; // 120ms
  const numSamples = sampleRate * duration;
  const buffer = new Uint8Array(44 + numSamples);
  
  // RIFF header
  buffer[0] = 0x52; buffer[1] = 0x49; buffer[2] = 0x46; buffer[3] = 0x46; // "RIFF"
  const fileLength = 36 + numSamples;
  buffer[4] = fileLength & 0xFF;
  buffer[5] = (fileLength >> 8) & 0xFF;
  buffer[6] = (fileLength >> 16) & 0xFF;
  buffer[7] = (fileLength >> 24) & 0xFF;
  buffer[8] = 0x57; buffer[9] = 0x41; buffer[10] = 0x56; buffer[11] = 0x45; // "WAVE"
  
  // Format chunk
  buffer[12] = 0x66; buffer[13] = 0x6D; buffer[14] = 0x74; buffer[15] = 0x20; // "fmt "
  buffer[16] = 16; buffer[17] = 0; buffer[18] = 0; buffer[19] = 0; // chunk size
  buffer[20] = 1; buffer[21] = 0; // PCM format
  buffer[22] = 1; buffer[23] = 0; // Mono channel
  buffer[24] = sampleRate & 0xFF;
  buffer[25] = (sampleRate >> 8) & 0xFF;
  buffer[26] = (sampleRate >> 16) & 0xFF;
  buffer[27] = (sampleRate >> 24) & 0xFF;
  const byteRate = sampleRate;
  buffer[28] = byteRate & 0xFF;
  buffer[29] = (byteRate >> 8) & 0xFF;
  buffer[30] = (byteRate >> 16) & 0xFF;
  buffer[31] = (byteRate >> 24) & 0xFF;
  buffer[32] = 1; buffer[33] = 0; // block align
  buffer[34] = 8; buffer[35] = 0; // bits per sample (8-bit)
  
  // Data chunk
  buffer[36] = 0x64; buffer[37] = 0x61; buffer[38] = 0x74; buffer[39] = 0x61; // "data"
  buffer[40] = numSamples & 0xFF;
  buffer[41] = (numSamples >> 8) & 0xFF;
  buffer[42] = (numSamples >> 16) & 0xFF;
  buffer[43] = (numSamples >> 24) & 0xFF;
  
  // Generate cute frequency sweep for pop chime
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Sweep frequency downwards quickly
    const freq = 700 - 550 * (i / numSamples);
    const angle = 2 * Math.PI * freq * t;
    const sample = Math.sin(angle);
    // Unsigned 8-bit output, exponential volume decay envelope
    const envelope = Math.exp(-6 * (i / numSamples));
    buffer[44 + i] = Math.floor((sample * envelope * 0.5 + 0.5) * 255);
  }
  
  // Convert buffer to base64 Data URI
  let binary = '';
  const len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return 'data:audio/wav;base64,' + btoa(binary);
};

const POP_SOUND_URI = generatePopSoundUri();

// Dynamically generate a short white-noise "poof" sound for candle blowing
const generatePoofSoundUri = () => {
  const sampleRate = 8000;
  const duration = 0.15; // 150ms
  const numSamples = sampleRate * duration;
  const buffer = new Uint8Array(44 + numSamples);
  
  // RIFF header
  buffer[0] = 0x52; buffer[1] = 0x49; buffer[2] = 0x46; buffer[3] = 0x46; // "RIFF"
  const fileLength = 36 + numSamples;
  buffer[4] = fileLength & 0xFF;
  buffer[5] = (fileLength >> 8) & 0xFF;
  buffer[6] = (fileLength >> 16) & 0xFF;
  buffer[7] = (fileLength >> 24) & 0xFF;
  buffer[8] = 0x57; buffer[9] = 0x41; buffer[10] = 0x56; buffer[11] = 0x45; // "WAVE"
  
  // Format chunk
  buffer[12] = 0x66; buffer[13] = 0x6D; buffer[14] = 0x74; buffer[15] = 0x20; // "fmt "
  buffer[16] = 16; buffer[17] = 0; buffer[18] = 0; buffer[19] = 0; // chunk size
  buffer[20] = 1; buffer[21] = 0; // PCM format
  buffer[22] = 1; buffer[23] = 0; // Mono channel
  buffer[24] = sampleRate & 0xFF;
  buffer[25] = (sampleRate >> 8) & 0xFF;
  buffer[26] = (sampleRate >> 16) & 0xFF;
  buffer[27] = (sampleRate >> 24) & 0xFF;
  const byteRate = sampleRate;
  buffer[28] = byteRate & 0xFF;
  buffer[29] = (byteRate >> 8) & 0xFF;
  buffer[30] = (byteRate >> 16) & 0xFF;
  buffer[31] = (byteRate >> 24) & 0xFF;
  buffer[32] = 1; buffer[33] = 0; // block align
  buffer[34] = 8; buffer[35] = 0; // bits per sample (8-bit)
  
  // Data chunk
  buffer[36] = 0x64; buffer[37] = 0x61; buffer[38] = 0x74; buffer[39] = 0x61; // "data"
  buffer[40] = numSamples & 0xFF;
  buffer[41] = (numSamples >> 8) & 0xFF;
  buffer[42] = (numSamples >> 16) & 0xFF;
  buffer[43] = (numSamples >> 24) & 0xFF;
  
  // Generate white noise with exponential decay (blow sound)
  for (let i = 0; i < numSamples; i++) {
    const noise = Math.random() * 2 - 1;
    const envelope = Math.exp(-8 * (i / numSamples));
    buffer[44 + i] = Math.floor((noise * envelope * 0.35 + 0.5) * 255);
  }
  
  // Convert buffer to base64 Data URI
  let binary = '';
  const len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return 'data:audio/wav;base64,' + btoa(binary);
};

const POOF_SOUND_URI = generatePoofSoundUri();



// Fallback Synthesizer for "Level Up, Mannu" retro 8-bit chip-tune track
class SynthSequencer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.notes = [
      // Format: { time: seconds, note: frequency, duration: seconds }
      { time: 0.0, note: 261.63, duration: 0.4 }, // C4
      { time: 0.5, note: 261.63, duration: 0.4 },
      { time: 1.0, note: 293.66, duration: 0.8 }, // D4
      { time: 1.8, note: 261.63, duration: 0.8 }, // C4
      { time: 2.6, note: 349.23, duration: 0.8 }, // F4
      { time: 3.4, note: 329.63, duration: 1.2 }, // E4

      { time: 4.8, note: 261.63, duration: 0.4 }, // C4
      { time: 5.3, note: 261.63, duration: 0.4 },
      { time: 5.8, note: 293.66, duration: 0.8 }, // D4
      { time: 6.6, note: 261.63, duration: 0.8 }, // C4
      { time: 7.4, note: 392.00, duration: 0.8 }, // G4
      { time: 8.2, note: 349.23, duration: 1.2 }, // F4

      { time: 9.6, note: 261.63, duration: 0.4 }, // C4
      { time: 10.1, note: 261.63, duration: 0.4 },
      { time: 10.6, note: 523.25, duration: 0.8 }, // C5
      { time: 11.4, note: 440.00, duration: 0.8 }, // A4
      { time: 12.2, note: 349.23, duration: 0.8 }, // F4
      { time: 13.0, note: 329.63, duration: 0.8 }, // E4
      { time: 13.8, note: 293.66, duration: 1.2 }, // D4

      { time: 15.0, note: 466.16, duration: 0.4 }, // Bb4
      { time: 15.5, note: 466.16, duration: 0.4 },
      { time: 16.0, note: 440.00, duration: 0.8 }, // A4
      { time: 16.8, note: 349.23, duration: 0.8 }, // F4
      { time: 17.6, note: 392.00, duration: 0.8 }, // G4
      { time: 18.4, note: 349.23, duration: 1.6 }, // F4

      { time: 20.0, note: 523.25, duration: 0.3 }, // C5
      { time: 20.4, note: 587.33, duration: 0.3 }, // D5
      { time: 20.8, note: 659.25, duration: 0.3 }, // E5
      { time: 21.2, note: 698.46, duration: 0.3 }, // F5
      { time: 21.6, note: 783.99, duration: 0.3 }, // G5
      { time: 22.0, note: 880.00, duration: 0.6 }, // A5

      { time: 22.8, note: 349.23, duration: 0.4 }, // F4
      { time: 23.3, note: 349.23, duration: 0.4 },
      { time: 23.8, note: 392.00, duration: 0.4 }, // G4
      { time: 24.3, note: 440.00, duration: 0.4 }, // A4
      { time: 24.8, note: 349.23, duration: 0.4 }, // F4
      { time: 25.3, note: 523.25, duration: 0.8 }, // C5
      { time: 26.2, note: 349.23, duration: 1.6 }, // F4
    ];
    this.timeouts = [];
  }

  start(currentTimeCallback, onEndedCallback) {
    if (this.isPlaying) return;
    this.isPlaying = true;
    
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const loopDuration = 28.0;
    const loopStart = this.ctx.currentTime;
    
    this.notes.forEach(noteData => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(noteData.note, loopStart + noteData.time);
      
      gain.gain.setValueAtTime(0, loopStart + noteData.time);
      gain.gain.linearRampToValueAtTime(0.08, loopStart + noteData.time + 0.05);
      gain.gain.setValueAtTime(0.08, loopStart + noteData.time + noteData.duration - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, loopStart + noteData.time + noteData.duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(loopStart + noteData.time);
      osc.stop(loopStart + noteData.time + noteData.duration);
    });

    const checkInterval = 100;
    const ticks = loopDuration * 10;
    for (let i = 0; i < ticks; i++) {
      const t = (i * checkInterval) / 1000;
      const timeoutId = setTimeout(() => {
        if (this.isPlaying) {
          currentTimeCallback(t);
        }
      }, i * checkInterval);
      this.timeouts.push(timeoutId);
    }

    const endTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.stop();
        if (onEndedCallback) onEndedCallback();
      }
    }, loopDuration * 1000);
    this.timeouts.push(endTimeout);
  }

  stop() {
    this.isPlaying = false;
    this.timeouts.forEach(id => clearTimeout(id));
    this.timeouts = [];
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend();
    }
  }
}

export default function App() {
  const [gameState, setGameState] = useState('welcome'); // welcome, landing, playing, won
  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLyric, setCurrentLyric] = useState("Tap 'Start' to begin the adventure!");
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicLoaded, setMusicLoaded] = useState(false);
  const [useSynthFallback, setUseSynthFallback] = useState(false);

  const audioRef = useRef(null);
  const synthRef = useRef(new SynthSequencer());
  const bgmAudioRef = useRef(null);
  const balloonContainerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const poppedCountRef = useRef(0);
  const gameStateRef = useRef(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const [candles, setCandles] = useState([true, true, true, true, true, true, true, true]);

  const playPoofSound = () => {
    try {
      const poofAudio = new Audio(POOF_SOUND_URI);
      poofAudio.volume = 0.8;
      poofAudio.play().catch(e => console.warn("Failed to play poof sound:", e));
    } catch(e) {}
  };

  const blowCandle = (index) => {
    if (!candles[index]) return;
    playPoofSound();
    setCandles(prev => {
      const next = [...prev];
      next[index] = false;
      const allOut = next.every(c => c === false);
      if (allOut) {
        triggerGrandConfettiShower();
      }
      return next;
    });
  };

  const triggerGrandConfettiShower = () => {
    if (window.confetti) {
      window.confetti({
        particleCount: 150,
        spread: 85,
        origin: { y: 0.6 }
      });
      const end = Date.now() + 3000;
      const frame = () => {
        window.confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff007f', '#ff7f00', '#eab308']
        });
        window.confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#10b981', '#06b6d4', '#a855f7']
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  };

  // Dynamically load canvas-confetti script and initialize audio
  useEffect(() => {
    // 1. Inject canvas-confetti CDN script
    if (!window.confetti) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // 2. Initialize Audio elements
    const audio = new Audio('Mannu Ka Janmadin.mp3');
    audio.loop = false;
    audioRef.current = audio;

    const bgmAudio = new Audio('Sugar Confetti.mp3');
    bgmAudio.loop = true;
    bgmAudio.volume = 0.55; // Moderate volume on landing page
    bgmAudioRef.current = bgmAudio;

    // Autoplay attempt
    bgmAudio.play().catch(() => {});

    // Unlocking BGM for mobile browsers
    const handleUnlockBgm = () => {
      if (bgmAudioRef.current && bgmAudioRef.current.paused && gameStateRef.current !== 'won' && poppedCountRef.current < 8) {
        bgmAudioRef.current.play().catch(() => {});
      }
    };
    document.addEventListener('click', handleUnlockBgm);
    document.addEventListener('touchstart', handleUnlockBgm);

    const handleCanPlayThrough = () => setMusicLoaded(true);
    const handleAudioError = () => {
      console.warn("MP3 source not found or failed to load. Activating retro synthesizer fallback.");
      setUseSynthFallback(true);
      setMusicLoaded(true);
    };
    const handleAudioEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleAudioError);
    audio.addEventListener('ended', handleAudioEnded);

    // Synchronize lyrics on time update
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleAudioError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleAudioEnded);
      audio.pause();
      synthRef.current.stop();
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
      }
      document.removeEventListener('click', handleUnlockBgm);
      document.removeEventListener('touchstart', handleUnlockBgm);
    };
  }, []);

  // Synchronize lyrics when currentTime ticks
  useEffect(() => {
    const activeLyric = LYRIC_TIMELINE.reduce((prev, curr) => {
      if (currentTime >= curr.time) return curr;
      return prev;
    }, LYRIC_TIMELINE[0]);
    setCurrentLyric(activeLyric.text);
  }, [currentTime]);

  const enterWorld = () => {
    setGameState('landing');
    if (bgmAudioRef.current) {
      bgmAudioRef.current.volume = 0.55;
      bgmAudioRef.current.play().catch(err => {
        console.warn("Failed to play background music on welcome click:", err);
      });
    }
    // Unlock Victory Audio on user gesture synchronously
    if (audioRef.current) {
      audioRef.current.volume = 0;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
      audioRef.current.pause();
      audioRef.current.volume = 1;
      audioRef.current.currentTime = 0;
    }
  };

  // Handle game/music state toggling
  const startQuest = () => {
    setGameState('playing');
    setCandles([true, true, true, true, true, true, true, true]); // Reset candles for the next round
    
    // Play BGM and lower the volume to 0.2 during balloon pops
    if (bgmAudioRef.current) {
      bgmAudioRef.current.volume = 0.2; // Low volume during balloon pops
      bgmAudioRef.current.play().catch(() => {});
    }

    // Unlock Victory Audio on user gesture again for safety synchronously
    if (audioRef.current) {
      audioRef.current.volume = 0;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
      audioRef.current.pause();
      audioRef.current.volume = 1;
      audioRef.current.currentTime = 0;
    }

    // Spawn initial balloons
    for (let i = 0; i < 4; i++) {
      setTimeout(() => spawnBalloon(), i * 800);
    }
  };

  const spawnBalloon = () => {
    if (poppedCountRef.current >= 8) return;

    const id = Math.random().toString(36).substring(2, 11);
    const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    const x = Math.random() * (window.innerWidth - 120) + 10;
    const speed = Math.random() * 1.5 + 2.5; // Smooth speed range

    const newBalloon = {
      id,
      color,
      x,
      bottom: -160,
      speed,
      angle: Math.random() * 360,
      wiggleSpeed: Math.random() * 1.5 + 1.0
    };

    setBalloons(prev => [...prev, newBalloon]);
  };

  // Continuous animation frame loop to animate balloons smoothly
  useEffect(() => {
    if (gameState !== 'playing') return;

    const updateFrame = () => {
      setBalloons(prev => {
        const updated = prev.map(b => {
          const newBottom = b.bottom + b.speed;
          // Wave pattern wiggle
          const newX = b.x + Math.sin((newBottom / 40) * b.wiggleSpeed) * 0.8;
          return { ...b, bottom: newBottom, x: newX };
        });

        // Filter out escaped balloons and spawn replacements
        const onScreen = updated.filter(b => b.bottom < window.innerHeight + 160);
        if (onScreen.length < updated.length) {
          spawnBalloon();
        }
        return onScreen;
      });

      animationFrameRef.current = requestAnimationFrame(updateFrame);
    };

    animationFrameRef.current = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [gameState]);

  // Balloon popping mechanics
  const handlePop = (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    // Ignore further pops if we have already reached the target of 8 popped balloons
    if (poppedCountRef.current >= 8) return;

    const targetBalloon = balloons.find(b => b.id === id);
    if (!targetBalloon) return;

    // Pop Sound synthesis fallback
    playPopChime();

    // Spawn popping particle effects at coordinate
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;
    
    triggerConfettiBurst(clickX, clickY, targetBalloon.color.hex);

    setBalloons(prev => prev.filter(b => b.id !== id));
    poppedCountRef.current += 1;
    setScore(poppedCountRef.current);

    if (poppedCountRef.current >= 8) {
      triggerVictory();
    } else {
      setTimeout(spawnBalloon, 400);
    }
  };

  const playPopChime = () => {
    try {
      const popAudio = new Audio(POP_SOUND_URI);
      popAudio.volume = 0.6;
      popAudio.play().catch(e => console.warn("Audio element play blocked:", e));
    } catch(e) {
      console.warn("Failed to play pop sound:", e);
    }
  };

  const triggerConfettiBurst = (x, y, color) => {
    if (window.confetti) {
      window.confetti({
        particleCount: 20,
        angle: 90,
        spread: 60,
        origin: { x: x / window.innerWidth, y: y / window.innerHeight },
        colors: [color, '#ffffff']
      });
    }
  };

  const triggerVictory = () => {
    // Stop BGM completely and immediately
    if (bgmAudioRef.current) {
      bgmAudioRef.current.pause();
    }
    
    // Give 1 second gap before switching state and starting celebration BGM
    setTimeout(() => {
      setGameState('won');
      setIsPlaying(true);
      
      if (useSynthFallback) {
        synthRef.current.start((t) => setCurrentTime(t), () => setIsPlaying(false));
      } else if (audioRef.current) {
        audioRef.current.play()
          .catch(err => {
            console.warn("Audio play blocked. Switching to synth fallback.", err);
            setUseSynthFallback(true);
            synthRef.current.start((t) => setCurrentTime(t), () => setIsPlaying(false));
          });
      }

      // Launch continuous party confetti show
      const end = Date.now() + 6000;
      const frame = () => {
        if (window.confetti) {
          window.confetti({
            particleCount: 5,
            angle: 60,
            spread: 60,
            origin: { x: 0, y: 0.8 }
          });
          window.confetti({
            particleCount: 5,
            angle: 120,
            spread: 60,
            origin: { x: 1, y: 0.8 }
          });
        }
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }, 1000);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      if (useSynthFallback) {
        synthRef.current.stop();
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (useSynthFallback) {
        synthRef.current.start((t) => setCurrentTime(t), () => setIsPlaying(false));
      } else if (audioRef.current) {
        audioRef.current.play().catch(() => {
          setUseSynthFallback(true);
          synthRef.current.start((t) => setCurrentTime(t), () => setIsPlaying(false));
        });
      }
      setIsPlaying(true);
    }
  };

  const handleLaunchInteraction = () => {
    if (bgmAudioRef.current && bgmAudioRef.current.paused && (gameState === 'landing' || gameState === 'welcome')) {
      bgmAudioRef.current.play().catch(() => {});
    }
  };

  return (
    <div 
      onClick={handleLaunchInteraction}
      onTouchStart={handleLaunchInteraction}
      className="w-full h-dvh relative overflow-hidden select-none bg-gradient-to-tr from-rose-50 via-purple-50 to-cyan-50 flex items-center justify-center font-sans text-slate-800"
    >
      
      {/* 1. Music Toggle Indicator (Top right corner HUD) */}
      {gameState === 'won' && (
        <button 
          onClick={toggleMusic}
          className="absolute top-4 right-4 z-50 p-3 bg-white/60 backdrop-blur-md border border-white/40 shadow-lg rounded-full text-purple-600 hover:bg-white/80 active:scale-95 transition-all focus:outline-none cursor-pointer"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>
      )}

      {/* 2. WELCOME DISPLAY STATE */}
      {gameState === 'welcome' && (
        <div className="z-40 w-11/12 max-w-md p-8 rounded-[32px] bg-indigo-50/50 backdrop-blur-md border border-indigo-200/60 shadow-[0_8px_32px_rgba(99,102,241,0.15)] text-center flex flex-col items-center transform scale-100 transition-all duration-500">
          <div className="bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 shadow-md animate-bounce">
            Secret Invitation 💌
          </div>
          
          <h1 className="font-display font-black text-5xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 leading-tight mb-4">
            Hi Mannu! ✨
          </h1>
          
          <p className="text-indigo-950/70 font-semibold leading-relaxed mb-8 text-sm md:text-base">
            You've received an invite to a secret birthday world. Enter below to start your quest! Make sure your sound is turned up! 🔊🎶
          </p>

          <button 
            onClick={enterWorld}
            className="w-full text-white font-black py-4 px-8 rounded-2xl text-lg shadow-lg flex items-center justify-center gap-3 transform hover:scale-102 hover:-translate-y-0.5 active:scale-98 transition-all bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-shimmer cursor-pointer"
          >
            <span>Enter Mannu's World</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
      )}

      {/* 3. LANDING DISPLAY STATE */}
      {gameState === 'landing' && (
        <div className="z-40 w-11/12 max-w-md p-8 rounded-[32px] bg-white/40 backdrop-blur-md border border-white/60 shadow-2xl text-center flex flex-col items-center transform scale-100 transition-all duration-500">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 shadow-md animate-bounce">
            Special Quest Unlocked 👑
          </div>
          
          <h1 className="font-display font-black text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 leading-tight mb-4">
            Ready, Mannu? 🎮
          </h1>
          
          <p className="text-slate-600 font-semibold leading-relaxed mb-8 text-sm md:text-base">
            You've received an invite to a secret birthday world. Pop exactly <span className="font-extrabold text-pink-500 text-lg">8 balloons</span> to unlock your surprise!
          </p>

          <button 
            onClick={startQuest}
            className="w-full text-white font-black py-4 px-8 rounded-2xl text-lg shadow-lg flex items-center justify-center gap-3 transform hover:scale-102 hover:-translate-y-0.5 active:scale-98 transition-all bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 animate-shimmer cursor-pointer"
          >
            <span>Start Balloon Hunt</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      )}

      {/* 3. QUEST / GAMEPLAY PANEL STATE */}
      {gameState === 'playing' && (
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-between p-6 z-20">
          {/* Progress Indicator */}
          <div className="w-full max-w-xl flex justify-between items-center bg-white/40 backdrop-blur-md py-3 px-6 rounded-2xl shadow-sm mt-4 border border-white/60 z-30">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎈</span>
              <span className="font-extrabold tracking-wide text-slate-700 text-xs md:text-sm">MANNU'S POP COUNT:</span>
            </div>
            <div className="bg-purple-600 text-white font-black text-lg md:text-xl px-4 py-1 rounded-xl min-w-[75px] text-center shadow whitespace-nowrap flex-shrink-0">
              {score} / 8
            </div>
          </div>

          {/* Balloon Spawning Canvas Area */}
          <div ref={balloonContainerRef} className="absolute inset-0 w-full h-full overflow-hidden z-10">
            {balloons.map(b => (
              <div
                key={b.id}
                onMouseDown={(e) => handlePop(b.id, e)}
                onTouchStart={(e) => handlePop(b.id, e)}
                style={{ 
                  left: `${b.x}px`, 
                  bottom: `${b.bottom}px`,
                  transform: `rotate(${Math.sin(b.bottom / 30) * 8}deg)`
                }}
                className={`absolute cursor-pointer w-16 h-20 md:w-20 md:h-24 rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] shadow-lg border-2 ${b.color.border} bg-gradient-to-b ${b.color.bg} transition-transform duration-75 active:scale-90`}
              >
                {/* Balloon string asset */}
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-0.5 h-5 bg-slate-400 opacity-40"></div>
                {/* Balloon tie knot */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px]" style={{ borderBottomColor: b.color.hex }}></div>
              </div>
            ))}
          </div>

          <div className="bg-white/40 backdrop-blur-md text-xs md:text-sm text-slate-500 font-bold py-2 px-6 rounded-full shadow border border-white/60 z-30 mb-8 pointer-events-none">
            Tap balloons to chase them! 👇
          </div>
        </div>
      )}

      {/* 4. GRAND REVEAL VICTORY SCREEN STATE */}
      {gameState === 'won' && (
        <div className="z-30 w-11/12 max-w-lg rounded-[36px] bg-white/45 backdrop-blur-md border border-white/80 shadow-2xl p-6 md:p-8 text-center flex flex-col items-center max-h-[90vh] overflow-y-auto transform scale-100 transition-all duration-700">
          
          <div className="w-full flex justify-between items-center mb-6 border-b border-purple-100 pb-4">
            <span className="font-display font-extrabold text-xs text-purple-600 tracking-wider uppercase">Level 8 Accomplished 🏆</span>
            <span className="text-xs text-rose-500 font-bold bg-rose-50/80 px-3 py-1 rounded-full flex items-center gap-1">
              🎂 8 Years Old Today!
            </span>
          </div>

          <div className="inline-block bg-gradient-to-r from-amber-400 to-pink-500 text-white font-extrabold text-xs tracking-wider px-4 py-1.5 rounded-full mb-6 shadow-md animate-bounce">
            🎉 LEVEL 8 UNLOCKED!
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-500 to-rose-500 mb-6 leading-tight">
            Happy 8th Birthday,<br />Mannu! 👑✨
          </h2>

          {/* Fully Responsive & Custom Animated Girl Vector SVG Illustration */}
          <div className="w-full flex justify-center mb-6">
            <div className="relative w-44 h-44 md:w-48 md:h-48 rounded-full border-4 border-white shadow-xl bg-gradient-to-tr from-pink-100 via-purple-50 to-cyan-100 flex items-center justify-center p-2">
              
              {/* Spinning background sparkles */}
              <svg className="absolute top-4 left-6 w-6 h-6 text-yellow-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.4L22 12l-7.6 2.6L12 22l-2.4-7.4L2 12l7.6-2.6z"/>
              </svg>
              <svg className="absolute bottom-6 right-8 w-8 h-8 text-pink-400 animate-pulse delay-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.4L22 12l-7.6 2.6L12 22l-2.4-7.4L2 12l7.6-2.6z"/>
              </svg>

              <svg viewBox="0 0 200 200" className="w-full h-full animate-bounce" style={{ animationDuration: '3s' }}>
                <rect x="92" y="125" width="16" height="20" rx="8" fill="#fcd34d" opacity="0.8"/>
                <circle cx="100" cy="90" r="48" fill="#475569"/>
                
                {/* Hair loops */}
                <circle cx="45" cy="85" r="22" fill="#475569" className="origin-[45px_50px] animate-pulse" />
                <circle cx="155" cy="85" r="22" fill="#475569" className="origin-[155px_50px] animate-pulse" />
                
                <circle cx="54" cy="95" r="9" fill="#fde047"/>
                <circle cx="146" cy="95" r="9" fill="#fde047"/>
                <circle cx="100" cy="92" r="42" fill="#fde047"/>
                <path d="M 58 85 Q 100 55 142 85 Q 120 75 100 85 Q 80 75 58 85 Z" fill="#475569" />

                {/* Tiara */}
                <g>
                  <path d="M 75 58 L 125 58 L 118 64 L 82 64 Z" fill="#fbbf24"/>
                  <path d="M 75 58 L 82 40 L 92 50 L 100 32 L 108 50 L 118 40 L 125 58 Z" fill="#f59e0b"/>
                  <circle cx="100" cy="32" r="2.5" fill="#ec4899"/>
                </g>

                {/* Blush cheeks */}
                <circle cx="74" cy="106" r="6" fill="#f43f5e" opacity="0.4" />
                <circle cx="126" cy="106" r="6" fill="#f43f5e" opacity="0.4" />

                {/* Blinking eyes */}
                <g className="origin-center animate-pulse">
                  <circle cx="80" cy="98" r="4.5" fill="#1e293b"/>
                  <circle cx="78.5" cy="96.5" r="1.5" fill="#ffffff"/>
                  <circle cx="120" cy="98" r="4.5" fill="#1e293b"/>
                  <circle cx="118.5" cy="96.5" r="1.5" fill="#ffffff"/>
                </g>

                <path d="M 91 110 Q 100 122 109 110" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round"/>
                <path d="M 72 135 L 128 135 L 138 180 L 62 180 Z" fill="#ec4899"/>
                
                {/* Star design shirt */}
                <path d="M 100 144 L 102 150 L 108 150 L 103 154 L 105 160 L 100 156 Z" fill="#fef08a"/>
              </svg>
            </div>
          </div>

          {/* Interactive Birthday Cake (Blow Out the Candles) */}
          <div className="w-full flex flex-col items-center mb-6 bg-purple-50/50 border border-purple-100 rounded-3xl p-4 md:p-6 shadow-inner">
            <span className="text-[11px] text-purple-500 font-bold uppercase tracking-wider mb-2">
              🎂 Tap each candle to blow it out! 🎂
            </span>
            <div className="relative w-64 h-48 select-none">
              <svg viewBox="0 0 200 150" className="w-full h-full">
                {/* Cake Stand */}
                <path d="M 30 140 L 170 140 L 150 146 L 50 146 Z" fill="#e2e8f0" />
                <rect x="92" y="130" width="16" height="10" fill="#cbd5e1" />
                <ellipse cx="100" cy="130" rx="75" ry="8" fill="#e2e8f0" />

                {/* Cake Tier 1 (Bottom) */}
                <rect x="35" y="95" width="130" height="35" rx="6" fill="#78350f" /> {/* Chocolate */}
                {/* Frosting drips Bottom */}
                <path d="M 35 95 Q 45 105 55 95 Q 65 105 75 95 Q 85 105 95 95 Q 105 105 115 95 Q 125 105 135 95 Q 145 105 155 95 Q 165 105 165 95" fill="none" stroke="#f472b6" strokeWidth="5" strokeLinecap="round" />

                {/* Cake Tier 2 (Top) */}
                <rect x="50" y="65" width="100" height="30" rx="4" fill="#fbcfe8" /> {/* Strawberry */}
                {/* Frosting drips Top */}
                <path d="M 50 65 Q 60 72 70 65 Q 80 72 90 65 Q 100 72 110 65 Q 120 72 130 65 Q 140 72 150 65" fill="none" stroke="#db2777" strokeWidth="4" strokeLinecap="round" />

                {/* Cake toppings (Berries) */}
                <circle cx="60" cy="63" r="3.5" fill="#be123c" />
                <circle cx="80" cy="63" r="3.5" fill="#be123c" />
                <circle cx="100" cy="63" r="3.5" fill="#be123c" />
                <circle cx="120" cy="63" r="3.5" fill="#be123c" />
                <circle cx="140" cy="63" r="3.5" fill="#be123c" />

                {/* 8 Candles */}
                {[...Array(8)].map((_, i) => {
                  const x = 56 + i * 12; // Spaces 8 candles on the top tier (x from 56 to 140)
                  const candleColor = ['#38bdf8', '#fb7185', '#34d399', '#fbbf24', '#c084fc', '#f472b6', '#2dd4bf', '#fb923c'][i];
                  return (
                    <g key={i} className="cursor-pointer" onClick={() => blowCandle(i)}>
                      {/* Candle body */}
                      <rect x={x} y="42" width="5" height="23" rx="1" fill={candleColor} />
                      {/* Candle wick */}
                      <line x1={x + 2.5} y1="42" x2={x + 2.5} y2="38" stroke="#475569" strokeWidth="1.2" />

                      {/* Flame or smoke */}
                      {candles[i] ? (
                        /* Flame */
                        <path
                          d={`M ${x + 2.5} 24 C ${x + 6} 32, ${x + 6} 38, ${x + 2.5} 38 C ${x - 1} 38, ${x - 1} 32, ${x + 2.5} 24 Z`}
                          fill="url(#flameGradient)"
                          className="origin-bottom animate-wobble-flame"
                          style={{ transformOrigin: `${x + 2.5}px 38px`, animationDelay: `${i * 0.1}s` }}
                        />
                      ) : (
                        /* Smoke Puff */
                        <g className="animate-smoke-drift">
                          <circle cx={x + 2.5} cy="32" r="3" fill="#cbd5e1" opacity="0.6" />
                          <circle cx={x + 4.5} cy="26" r="4" fill="#94a3b8" opacity="0.4" />
                          <circle cx={x + 1.5} cy="20" r="5" fill="#64748b" opacity="0.2" />
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* SVG Definitions for Gradients */}
                <defs>
                  <radialGradient id="flameGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="30%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="40%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            {/* Display message once all are blown out */}
            {candles.every(c => c === false) && (
              <div className="mt-3 text-emerald-600 font-extrabold text-xs md:text-sm animate-pulse flex items-center gap-1">
                🎉 Yay! You blew out all the candles! 🥳🎂
              </div>
            )}
          </div>

          {/* Real-time Dynamic Lyrics Display Bar */}
          <div className="w-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-200 rounded-2xl py-4 px-5 mb-6 min-h-[68px] flex flex-col justify-center items-center shadow-inner">
            <p className="text-sm md:text-base lg:text-lg font-black text-center tracking-wider rainbow-glow-text leading-relaxed">
              {currentLyric}
            </p>
          </div>

          <div className="bg-white/60 rounded-2xl p-4 md:p-6 mb-6 shadow-sm border border-white/40 text-slate-600 leading-relaxed text-sm md:text-base text-left">
            <p className="mb-3 font-semibold text-slate-800">Hi Mannu,</p>
            <p className="mb-3">
              Congratulations on completing the quest! You are officially <strong>8 years awesome</strong> today! 🎮🎈
            </p>
            <p>
              May your birthday be filled with endless laughter, magical surprises, your favorite games, and the biggest slice of cake ever! Keep shining bright, dreaming big, and spreading joy everywhere you go. 🌟💖
            </p>
          </div>

          {/* Action Panel Panel */}
          <div className="grid grid-cols-2 gap-3 mb-4 w-full">
            <button 
              onClick={toggleMusic}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-xl text-xs md:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{isPlaying ? '⏸️ Pause Song' : '▶️ Play Song'}</span>
            </button>
            <button 
              onClick={() => {
                if (window.confetti) {
                  window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                }
              }}
              className="bg-white border-2 border-pink-400 hover:bg-pink-50 text-pink-500 font-bold py-3 px-4 rounded-xl text-xs md:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span>💥 Shower Confetti</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-400 font-medium">Made with love by your family ❤️</p>
        </div>
      )}
    </div>
  );
}
