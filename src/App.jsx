import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Rocket,
  TimerReset,
  Play,
  Keyboard,
  Target,
  Languages,
  Volume2,
  VolumeX,
  Star,
  Brain,
} from "lucide-react";

const GAME_DURATION = 90;
const START_Y = 108;
const EXIT_Y = -10;
const LANES = [10, 22, 34, 46, 58, 70, 82];

const LEVELS = [
  { level: 1, spawnEvery: 1850, speedMin: 8.5, speedMax: 10.5, points: 10 },
  { level: 2, spawnEvery: 1550, speedMin: 10.5, speedMax: 12.5, points: 12 },
  { level: 3, spawnEvery: 1250, speedMin: 12.5, speedMax: 14.5, points: 14 },
  { level: 4, spawnEvery: 980, speedMin: 14.5, speedMax: 17, points: 16 },
  { level: 5, spawnEvery: 760, speedMin: 17, speedMax: 20, points: 18 },
];

const ROCKET_COLORS = [
  "from-pink-400 to-fuchsia-500",
  "from-sky-400 to-cyan-500",
  "from-emerald-400 to-teal-500",
  "from-yellow-300 to-orange-400",
  "from-violet-400 to-purple-500",
  "from-rose-400 to-pink-500",
];

const KEYBOARD_ROWS = {
  tr: {
    top: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
    home: ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
    bottom: ["Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç"],
  },
  en: {
    top: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    home: ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    bottom: ["Z", "X", "C", "V", "B", "N", "M"],
  },
  es: {
    top: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    home: ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    bottom: ["Z", "X", "C", "V", "B", "N", "M"],
  },
};

const TEXT = {
  tr: {
    title: "Uzay Harf Roketleri",
    subtitle: "Roketleri yukarı kaçmadan önce patlat!",
    time: "Süre",
    accuracy: "Doğruluk",
    hits: "Doğru seçim",
    wrong: "Yanlış basış",
    escaped: "Kaçan roket",
    level: "Seviye",
    controls: "Nasıl oynanır",
    controlsBody1: "Gelen roketlerde yazan harflere klavyeden basarak roketleri seç ve patlat.",
    controlsBody2: "Mouse kullanılmaz. Doğru harfe basınca roket patlar ve kaybolur.",
    controlsBody3: "Oyun, Q klavye düzenindeki üst, orta ve alt satır dengesini korur.",
    start: "Oyunu Başlat",
    restart: "Baştan Başlat",
    playAgain: "Tekrar Oyna",
    idleTitle: "Renkli harf roketleri hazır!",
    idleBody: "Hazır mısın? Oyunu başlat ve roketlerin üzerindeki harflere klavyeden basarak yıldız kapısını koru.",
    endTitle: "Tur tamamlandı!",
    endBody: "Süper oynadın! Sevimli roket seninle kutlama yapıyor.",
    soundOn: "Ses açık",
    soundOff: "Ses kapalı",
    skyGate: "Yıldız kapısı",
    skyHint: "Roketleri yukarı çıkmadan yakala.",
    learning: "Öğrenme özeti",
    strongLetters: "Bugün güçlü olduğun harfler",
    practiceLetters: "Biraz daha çalışalım",
    keyboardMode: "Q klavye dengesi",
    keyboardModeBody: "Üst, orta ve alt satır harfleri dengeli biçimde gelir. Oyun ayrıca zorlandığın harfleri doğal şekilde tekrar eder.",
  },
  en: {
    title: "Space Letter Rockets",
    subtitle: "Blast the rockets before they fly away!",
    time: "Time",
    accuracy: "Accuracy",
    hits: "Correct picks",
    wrong: "Wrong key",
    escaped: "Escaped rockets",
    level: "Level",
    controls: "How to play",
    controlsBody1: "Press the matching keyboard letters for the rockets that appear on screen.",
    controlsBody2: "No mouse is used. When you press the correct letter, the rocket explodes and disappears.",
    controlsBody3: "The game keeps a balanced flow across the top, home, and bottom rows of a Q keyboard.",
    start: "Start Game",
    restart: "Restart",
    playAgain: "Play Again",
    idleTitle: "Colorful letter rockets are ready!",
    idleBody: "Ready to play? Start the game and press the keyboard letters shown on the rockets.",
    endTitle: "Round complete!",
    endBody: "Awesome job! Your friendly rocket is celebrating with you.",
    soundOn: "Sound on",
    soundOff: "Sound off",
    skyGate: "Star gate",
    skyHint: "Catch rockets before they leave the sky.",
    learning: "Learning summary",
    strongLetters: "Your strongest letters today",
    practiceLetters: "Let’s practice these more",
    keyboardMode: "Q keyboard balance",
    keyboardModeBody: "Top, home, and bottom row letters appear in balance. The game also naturally repeats the letters you struggle with.",
  },
  es: {
    title: "Cohetes de Letras",
    subtitle: "¡Explota los cohetes antes de que escapen!",
    time: "Tiempo",
    accuracy: "Precisión",
    hits: "Aciertos",
    wrong: "Tecla incorrecta",
    escaped: "Cohetes perdidos",
    level: "Nivel",
    controls: "Cómo jugar",
    controlsBody1: "Pulsa en el teclado las letras que aparecen sobre los cohetes.",
    controlsBody2: "No se usa el mouse. Al pulsar la letra correcta, el cohete explota y desaparece.",
    controlsBody3: "El juego mantiene equilibrio entre la fila superior, media e inferior de un teclado Q.",
    start: "Empezar",
    restart: "Reiniciar",
    playAgain: "Jugar otra vez",
    idleTitle: "¡Los cohetes de colores están listos!",
    idleBody: "¿Listo para jugar? Inicia el juego y pulsa en el teclado las letras que ves en los cohetes.",
    endTitle: "¡Ronda terminada!",
    endBody: "¡Muy bien! Tu cohete simpático está celebrando contigo.",
    soundOn: "Sonido activado",
    soundOff: "Sonido apagado",
    skyGate: "Puerta estelar",
    skyHint: "Atrapa los cohetes antes de que salgan del cielo.",
    learning: "Resumen de aprendizaje",
    strongLetters: "Tus letras más fuertes hoy",
    practiceLetters: "Practiquemos más estas",
    keyboardMode: "Equilibrio Q",
    keyboardModeBody: "Las letras de la fila superior, media e inferior aparecen con equilibrio. El juego también repite de forma natural las letras que más cuestan.",
  },
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getAllLetters(language) {
  const rows = KEYBOARD_ROWS[language];
  return [...rows.top, ...rows.home, ...rows.bottom];
}

function createLetterStats(language) {
  return Object.fromEntries(
    getAllLetters(language).map((letter) => [letter, { shown: 0, hits: 0, escapes: 0 }]),
  );
}

function getLevelFromElapsed(elapsed) {
  return clamp(Math.floor(elapsed / 18) + 1, 1, 5);
}

function getDifficultyValue(stats, letter) {
  const item = stats[letter] || { shown: 0, hits: 0, escapes: 0 };
  return item.escapes * 3 + Math.max(0, item.shown - item.hits - item.escapes);
}

function buildAdaptiveBag(language, rowId, letterStats) {
  const baseLetters = KEYBOARD_ROWS[language][rowId];
  const bag = [...baseLetters];

  baseLetters.forEach((letter) => {
    const difficulty = getDifficultyValue(letterStats, letter);
    if (difficulty >= 2) bag.push(letter);
    if (difficulty >= 5) bag.push(letter);
  });

  return shuffleArray(bag);
}

function chooseTargetRow(spawnedByRow) {
  const rows = ["top", "home", "bottom"];
  const minCount = Math.min(...rows.map((row) => spawnedByRow[row]));
  const candidates = rows.filter((row) => spawnedByRow[row] === minCount);
  return randomItem(candidates);
}

function calcStars(wrongPresses, escapedRockets) {
  if (escapedRockets === 0 && wrongPresses <= 2) return 3;
  if (escapedRockets <= 4 && wrongPresses <= 8) return 2;
  return 1;
}

function createInitialGame(language = "tr") {
  const letterStats = createLetterStats(language);
  return {
    phase: "idle",
    timeLeft: GAME_DURATION,
    elapsed: 0,
    typed: 0,
    wrongPresses: 0,
    escapedRockets: 0,
    level: 1,
    enemies: [],
    explosion: null,
    spawnedByRow: { top: 0, home: 0, bottom: 0 },
    rowBags: {
      top: buildAdaptiveBag(language, "top", letterStats),
      home: buildAdaptiveBag(language, "home", letterStats),
      bottom: buildAdaptiveBag(language, "bottom", letterStats),
    },
    letterStats,
  };
}

function createRocket(levelConfig, existingEnemies, letter, rowId) {
  const safeLanes = LANES.filter((lane) => !existingEnemies.some((enemy) => enemy.lane === lane && enemy.y > 82));
  if (!safeLanes.length) return null;

  const lane = randomItem(safeLanes);
  return {
    id: uid(),
    lane,
    x: lane,
    y: START_Y,
    speed: levelConfig.speedMin + Math.random() * (levelConfig.speedMax - levelConfig.speedMin),
    wobbleSeed: Math.random() * Math.PI * 2,
    colorClass: randomItem(ROCKET_COLORS),
    letter,
    rowId,
  };
}

function EngineFlame({ playful = false }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-[calc(100%-2px)] flex justify-center ${playful ? "scale-110" : ""}`}>
      <div className="relative h-11 w-8">
        <div className="flame-core absolute inset-x-0 top-0 mx-auto h-9 w-5 rounded-b-full bg-gradient-to-b from-yellow-100 via-yellow-300 to-orange-500 blur-[0.4px]" />
        <div className="flame-shell absolute inset-x-0 top-0.5 mx-auto h-10 w-6 rounded-b-full bg-gradient-to-b from-white/90 via-yellow-200/75 to-orange-400/70 blur-[1.4px]" />
        <div className="flame-tail absolute inset-x-0 top-4 mx-auto h-7 w-8 rounded-full bg-orange-400/35 blur-md" />
        <div className="flame-spark absolute top-5 h-2 w-2 rounded-full bg-yellow-200" style={{ left: "calc(50% - 11px)" }} />
        <div className="flame-spark absolute top-3 h-2 w-2 rounded-full bg-pink-200" style={{ left: "calc(50% + 3px)" }} />
      </div>
    </div>
  );
}

function Explosion({ x, y, active }) {
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute z-30 h-24 w-24 -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
      <div className="absolute inset-0 rounded-full bg-yellow-300/70 blur-sm animate-ping" />
      <div className="absolute inset-2 rounded-full bg-pink-400/65 blur-sm animate-ping" />
      <div className="absolute inset-4 rounded-full bg-white/90" />
      <div className="absolute left-1/2 top-1/2 h-16 w-1 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-white/80" />
      <div className="absolute left-1/2 top-1/2 h-16 w-1 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-white/80" />
      <div className="absolute left-1/2 top-1/2 h-1 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80" />
      <div className="absolute left-1/2 top-1/2 h-16 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80" />
    </div>
  );
}

function RocketEnemy({ rocket }) {
  const wobbleX = Math.sin(rocket.wobbleSeed + rocket.y * 0.08) * 4;
  return (
    <div
      className="absolute z-20 -translate-x-1/2 transition-transform duration-75"
      style={{ left: `calc(${rocket.x}% + ${wobbleX}px)`, top: `${rocket.y}%` }}
      aria-label={rocket.letter}
    >
      <div className={`relative flex h-20 w-16 items-center justify-center rounded-t-[999px] rounded-b-[18px] border-4 border-white/72 bg-gradient-to-b ${rocket.colorClass} shadow-[0_12px_26px_rgba(0,0,0,0.12)]`}>
        <EngineFlame />
        <div className="absolute top-1 h-3 w-3 rounded-full bg-white/36" />
        <div className="text-[31px] font-black tracking-wide text-white [text-shadow:0_1px_0_rgba(0,0,0,0.08)]">{rocket.letter}</div>
      </div>
    </div>
  );
}

function MascotRocket({ celebrate = false }) {
  return (
    <div className="relative mx-auto mb-5 flex h-52 w-44 items-center justify-center">
      <div className={`mascot-float relative ${celebrate ? "mascot-celebrate" : "mascot-invite"}`}>
        <div className="relative flex h-36 w-28 items-center justify-center rounded-t-[999px] rounded-b-[28px] border-[6px] border-white/85 bg-gradient-to-b from-fuchsia-400 via-pink-500 to-orange-400 shadow-[0_18px_35px_rgba(236,72,153,0.28)]">
          <EngineFlame playful />
          <div className="absolute -left-4 top-[48%] h-10 w-6 rounded-l-full bg-cyan-300/95" />
          <div className="absolute -right-4 top-[48%] h-10 w-6 rounded-r-full bg-cyan-300/95" />
          <div className="absolute top-4 h-8 w-8 rounded-full bg-white/45" />
          <div className="absolute left-1/2 top-[40%] flex -translate-x-1/2 items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-800" />
            <div className="h-2.5 w-2.5 rounded-full bg-slate-800" />
          </div>
          <div className={`absolute left-1/2 top-[52%] h-2.5 -translate-x-1/2 rounded-full bg-slate-800 ${celebrate ? "w-8" : "w-6"}`} />
        </div>
      </div>
      <div className="absolute left-0 top-7 mascot-orbit text-2xl">✨</div>
      <div className="absolute right-2 top-3 mascot-orbit-delayed text-2xl">💖</div>
      <div className="absolute left-3 bottom-14 mascot-orbit-delayed text-2xl">🌟</div>
      {celebrate && (
        <>
          <div className="absolute right-0 bottom-20 mascot-confetti text-2xl">🎉</div>
          <div className="absolute left-6 top-0 mascot-confetti-delayed text-2xl">🎊</div>
          <div className="absolute right-10 top-12 mascot-confetti text-xl">✨</div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, accent, glow }) {
  return (
    <div className={`rounded-3xl border border-white/65 bg-gradient-to-br ${accent} p-4 shadow-lg backdrop-blur transition-transform duration-200 hover:-translate-y-0.5`}>
      <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
        <span className={`rounded-full p-1.5 ${glow}`}>{icon}</span>
        <span>{label}</span>
      </div>
      <div key={`${label}-${value}`} className="value-pop text-3xl font-black text-slate-800">{value}</div>
    </div>
  );
}

function LetterPills({ letters, tone = "good" }) {
  const toneClass = tone === "good"
    ? "from-emerald-100 to-teal-100 text-emerald-700"
    : "from-amber-100 to-rose-100 text-rose-600";

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {letters.map((letter) => (
        <span key={letter} className={`rounded-full bg-gradient-to-r ${toneClass} px-3 py-1.5 text-sm font-black shadow-sm`}>
          {letter}
        </span>
      ))}
    </div>
  );
}

function KeyboardHint({ language, activeLetters }) {
  const rows = KEYBOARD_ROWS[language];
  const rowIds = ["top", "home", "bottom"];
  const offsets = ["ml-4", "ml-7", "ml-12"];

  return (
    <div className="absolute inset-x-3 bottom-3 z-20 rounded-2xl bg-slate-900/70 p-3 backdrop-blur-md">
      <div className="mb-2 text-center text-[10px] font-black uppercase tracking-widest text-white/60">
        ⌨️ klavye yardımı
      </div>
      {rowIds.map((rowId, ri) => (
        <div key={rowId} className={`mb-1 flex justify-center gap-1 ${offsets[ri]}`}>
          {rows[rowId].map((letter) => {
            const active = activeLetters.includes(letter);
            return (
              <div
                key={letter}
                className={`flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-black transition-all duration-150 ${
                  active
                    ? "scale-115 bg-yellow-300 text-slate-800 shadow-[0_0_10px_rgba(253,224,71,0.8)]"
                    : "bg-white/15 text-white/50"
                }`}
              >
                {letter}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function SpaceTypingGame() {
  const storedLanguage = typeof window !== "undefined" ? localStorage.getItem("spaceTypingLanguageV4") || "tr" : "tr";

  const initialLanguage = storedLanguage in TEXT ? storedLanguage : "tr";
  const gameRef = useRef(createInitialGame(initialLanguage));
  const [view, setView] = useState(() => ({ ...gameRef.current }));
  const [language, setLanguage] = useState(initialLanguage);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const languageRef = useRef(initialLanguage);
  const soundEnabledRef = useRef(true);
  const boardRef = useRef(null);
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);
  const spawnCarryRef = useRef(0);
  const explosionTimeoutRef = useRef(0);
  const audioCtxRef = useRef(null);

  const t = TEXT[language];

  const syncView = () => {
    const g = gameRef.current;
    setView({
      ...g,
      enemies: [...g.enemies],
      explosion: g.explosion ? { ...g.explosion } : null,
      letterStats: { ...g.letterStats },
      spawnedByRow: { ...g.spawnedByRow },
      rowBags: {
        top: [...g.rowBags.top],
        home: [...g.rowBags.home],
        bottom: [...g.rowBags.bottom],
      },
    });
  };

  const getAudioContext = () => {
    if (typeof window === "undefined") return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  const playTone = (kind) => {
    if (!soundEnabledRef.current) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const sequences = {
      start: [523, 659, 784],
      hit: [740, 880],
      miss: [260, 210],
      wrong: [180],
      level: [523, 659, 880],
      end: [880, 660, 440],
      toggle: [660, 880],
    };

    const notes = sequences[kind] || [440];
    notes.forEach((freq, index) => {
      const startAt = ctx.currentTime + index * 0.05;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === "miss" || kind === "wrong" ? "square" : "triangle";
      osc.frequency.setValueAtTime(freq, startAt);
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.08, startAt + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startAt);
      osc.stop(startAt + 0.13);
    });
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundEnabledRef.current = next;
      if (next) {
        getAudioContext();
        window.setTimeout(() => playTone("toggle"), 0);
      }
      return next;
    });
  };

  const clearExplosionLater = () => {
    window.clearTimeout(explosionTimeoutRef.current);
    explosionTimeoutRef.current = window.setTimeout(() => {
      gameRef.current.explosion = null;
      syncView();
    }, 240);
  };

  const refillRowBagIfNeeded = (rowId) => {
    const g = gameRef.current;
    if (!g.rowBags[rowId].length) {
      g.rowBags[rowId] = buildAdaptiveBag(languageRef.current, rowId, g.letterStats);
    }
  };

  const takeNextLetterForRow = (rowId) => {
    const g = gameRef.current;
    refillRowBagIfNeeded(rowId);
    const nextLetter = g.rowBags[rowId][0];
    g.rowBags[rowId] = g.rowBags[rowId].slice(1);
    return nextLetter;
  };

  const finishRound = () => {
    const g = gameRef.current;
    g.phase = "ended";
    playTone("end");
    cancelAnimationFrame(rafRef.current);
    syncView();
  };

  const removeRocket = (rocketId) => {
    const g = gameRef.current;
    if (g.phase !== "playing") return;

    const target = g.enemies.find((enemy) => enemy.id === rocketId);
    if (!target) return;

    g.enemies = g.enemies.filter((enemy) => enemy.id !== rocketId);
    g.typed += 1;
    g.letterStats[target.letter] = {
      ...g.letterStats[target.letter],
      hits: g.letterStats[target.letter].hits + 1,
    };
    g.explosion = { x: target.x, y: target.y, id: uid() };

    playTone("hit");
    clearExplosionLater();
    syncView();
  };

  const handleLetterPick = (inputLetter) => {
    const g = gameRef.current;
    if (g.phase !== "playing") return;

    const candidates = g.enemies.filter((enemy) => enemy.letter === inputLetter);
    if (!candidates.length) {
      g.wrongPresses += 1;
      playTone("wrong");
      syncView();
      return;
    }

    const target = [...candidates].sort((a, b) => a.y - b.y)[0];
    removeRocket(target.id);
  };

  const trySpawnRocket = () => {
    const g = gameRef.current;
    const levelConfig = LEVELS[g.level - 1];
    const targetRow = chooseTargetRow(g.spawnedByRow);
    const letter = takeNextLetterForRow(targetRow);
    const rocket = createRocket(levelConfig, g.enemies, letter, targetRow);
    if (!rocket) {
      g.rowBags[targetRow].unshift(letter);
      return;
    }

    g.enemies.push(rocket);
    g.spawnedByRow[targetRow] += 1;
    g.letterStats[letter] = {
      ...g.letterStats[letter],
      shown: g.letterStats[letter].shown + 1,
    };
  };

  const gameLoop = (timestamp) => {
    const g = gameRef.current;
    if (g.phase !== "playing") return;

    if (!lastFrameRef.current) lastFrameRef.current = timestamp;
    const delta = Math.min(0.05, (timestamp - lastFrameRef.current) / 1000);
    lastFrameRef.current = timestamp;

    g.elapsed += delta;
    g.timeLeft = Math.max(0, GAME_DURATION - g.elapsed);

    const nextLevel = getLevelFromElapsed(g.elapsed);
    if (nextLevel !== g.level) {
      g.level = nextLevel;
      playTone("level");
    }

    spawnCarryRef.current += delta * 1000;
    const currentLevel = LEVELS[g.level - 1];
    while (spawnCarryRef.current >= currentLevel.spawnEvery) {
      spawnCarryRef.current -= currentLevel.spawnEvery;
      trySpawnRocket();
    }

    let escapedEnemies = [];
    g.enemies = g.enemies
      .map((enemy) => ({ ...enemy, y: enemy.y - enemy.speed * delta }))
      .filter((enemy) => {
        const stillVisible = enemy.y > EXIT_Y;
        if (!stillVisible) escapedEnemies.push({ letter: enemy.letter, rowId: enemy.rowId });
        return stillVisible;
      });

    if (escapedEnemies.length) {
      g.escapedRockets += escapedEnemies.length;
      g.combo = 0;
      escapedEnemies.forEach(({ letter, rowId }) => {
        g.letterStats[letter] = {
          ...g.letterStats[letter],
          escapes: g.letterStats[letter].escapes + 1,
        };
        const bag = g.rowBags[rowId];
        const pos = bag.length <= 1 ? 0 : 1 + Math.floor(Math.random() * Math.min(3, bag.length - 1));
        g.rowBags[rowId] = [...bag.slice(0, pos), letter, ...bag.slice(pos)];
      });
      playTone("miss");
    }

    if (g.timeLeft <= 0) {
      g.timeLeft = 0;
      finishRound();
      return;
    }

    syncView();
    rafRef.current = requestAnimationFrame(gameLoop);
  };

  const startGame = () => {
    getAudioContext();
    cancelAnimationFrame(rafRef.current);
    gameRef.current = createInitialGame(languageRef.current);
    gameRef.current.phase = "playing";
    trySpawnRocket();
    setView({ ...gameRef.current, enemies: [...gameRef.current.enemies] });
    lastFrameRef.current = 0;
    spawnCarryRef.current = 0;
    playTone("start");
    setTimeout(() => boardRef.current?.focus(), 40);
    rafRef.current = requestAnimationFrame(gameLoop);
  };

  const handleLanguageChange = (nextLanguage) => {
    if (nextLanguage === languageRef.current) return;
    languageRef.current = nextLanguage;
    localStorage.setItem("spaceTypingLanguageV4", nextLanguage);
    cancelAnimationFrame(rafRef.current);
    gameRef.current = createInitialGame(nextLanguage);
    setLanguage(nextLanguage);
    setView({ ...gameRef.current, enemies: [] });
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (gameRef.current.phase !== "playing") return;
      if (event.key.length !== 1) return;

      const activeLanguage = languageRef.current;
      const locale = activeLanguage === "tr" ? "tr-TR" : activeLanguage === "es" ? "es-ES" : "en-US";
      const letter = event.key.toLocaleUpperCase(locale);
      const availableLetters = getAllLetters(activeLanguage);
      if (!availableLetters.includes(letter)) return;
      handleLetterPick(letter);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(explosionTimeoutRef.current);
    };
  }, []);

  const accuracy = useMemo(() => {
    const total = view.typed + view.wrongPresses + view.escapedRockets;
    if (!total) return 100;
    return Math.round((view.typed / total) * 100);
  }, [view.typed, view.wrongPresses, view.escapedRockets]);

  const bestLetters = useMemo(() => {
    const entries = Object.entries(view.letterStats || {});
    return entries
      .filter(([, stat]) => stat.shown > 0)
      .sort((a, b) => {
        if (b[1].hits !== a[1].hits) return b[1].hits - a[1].hits;
        if (a[1].escapes !== b[1].escapes) return a[1].escapes - b[1].escapes;
        return b[1].shown - a[1].shown;
      })
      .slice(0, 3)
      .map(([letter]) => letter);
  }, [view.letterStats]);

  const practiceLetters = useMemo(() => {
    const entries = Object.entries(view.letterStats || {});
    return entries
      .filter(([, stat]) => stat.shown > 0 && stat.escapes > 0)
      .sort((a, b) => {
        if (b[1].escapes !== a[1].escapes) return b[1].escapes - a[1].escapes;
        const aAcc = a[1].shown ? a[1].hits / a[1].shown : 1;
        const bAcc = b[1].shown ? b[1].hits / b[1].shown : 1;
        if (aAcc !== bAcc) return aAcc - bAcc;
        return b[1].shown - a[1].shown;
      })
      .slice(0, 3)
      .map(([letter]) => letter);
  }, [view.letterStats]);

  const showLearningSummary = useMemo(() => {
    return (
      view.phase === "ended" &&
      (view.wrongPresses > 0 || view.escapedRockets > 0 || practiceLetters.length > 0)
    );
  }, [view.phase, view.wrongPresses, view.escapedRockets, practiceLetters]);

  const levelColors = ["bg-rose-200", "bg-pink-300", "bg-fuchsia-400", "bg-violet-500", "bg-indigo-700"];
  const levelDots = Array.from({ length: 5 }, (_, index) => index + 1);

  return (
    <div className="h-screen overflow-y-hidden bg-[radial-gradient(circle_at_top,_#fdf2f8,_#e0f2fe_32%,_#c7d2fe_62%,_#e9d5ff)] p-3 text-slate-800 lg:p-4">
      <style>{`
        @keyframes flameFlicker {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          25% { transform: scaleY(1.18) scaleX(.92); }
          55% { transform: scaleY(.92) scaleX(1.08); }
          80% { transform: scaleY(1.1) scaleX(.96); }
        }
        @keyframes flameGlow {
          0%,100% { opacity:.55; transform: scale(.9); }
          50% { opacity:.9; transform: scale(1.18); }
        }
        @keyframes sparkJump {
          0%,100% { transform: translateY(0) scale(.9); opacity:.35; }
          50% { transform: translateY(8px) scale(1.12); opacity:1; }
        }
        @keyframes bobFloat {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-2deg); }
        }
        @keyframes inviteTilt {
          0%,100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes celebrateTilt {
          0%,100% { transform: rotate(-8deg) scale(1); }
          50% { transform: rotate(8deg) scale(1.05); }
        }
        @keyframes orbit {
          0% { transform: translateY(0px) scale(1) rotate(0deg); opacity:.7; }
          50% { transform: translateY(-10px) scale(1.15) rotate(10deg); opacity:1; }
          100% { transform: translateY(0px) scale(1) rotate(0deg); opacity:.7; }
        }
        @keyframes confetti {
          0% { transform: translateY(0px) rotate(0deg); opacity:0; }
          20% { opacity:1; }
          100% { transform: translateY(26px) rotate(25deg); opacity:0; }
        }
        @keyframes popValue {
          0% { transform: scale(.86); opacity:.75; }
          60% { transform: scale(1.08); opacity:1; }
          100% { transform: scale(1); }
        }
        .flame-core { animation: flameFlicker .18s infinite ease-in-out; }
        .flame-shell { animation: flameFlicker .22s infinite ease-in-out reverse; }
        .flame-tail { animation: flameGlow .3s infinite ease-in-out; }
        .flame-spark { animation: sparkJump .26s infinite ease-in-out; }
        .mascot-float { animation: bobFloat 2.2s infinite ease-in-out; }
        .mascot-invite { animation: inviteTilt 1.6s infinite ease-in-out; }
        .mascot-celebrate { animation: celebrateTilt 1.1s infinite ease-in-out; }
        .mascot-orbit { animation: orbit 1.8s infinite ease-in-out; }
        .mascot-orbit-delayed { animation: orbit 2.2s infinite ease-in-out .35s; }
        .mascot-confetti { animation: confetti 1.1s infinite ease-out; }
        .mascot-confetti-delayed { animation: confetti 1.3s infinite ease-out .25s; }
        .value-pop { animation: popValue .24s ease-out; }
      `}</style>

      <div className="mx-auto grid h-full max-w-7xl gap-3 lg:grid-cols-[391px_1fr]">
        <div className="hidden space-y-2 overflow-y-auto pr-1 lg:flex lg:flex-col" style={{ scrollbarWidth: "none" }}>
          <div className="flex flex-1 flex-col justify-between rounded-[32px] border-4 border-white/72 bg-white/76 p-4 shadow-[0_18px_60px_rgba(125,125,255,0.18)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-3xl bg-gradient-to-br from-fuchsia-400 to-pink-500 p-3 text-white shadow-lg">
                  <Rocket className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight">{t.title}</h1>
                  <p className="text-sm font-medium text-slate-600">{t.subtitle}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { code: "tr", label: "TR" },
                { code: "en", label: "EN" },
                { code: "es", label: "ES" },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleLanguageChange(item.code)}
                  className={`rounded-full border px-3 py-2 text-sm font-bold transition ${language === item.code ? "border-fuchsia-400 bg-fuchsia-500 text-white shadow-md" : "border-white/80 bg-white/70 text-slate-700 hover:bg-white"}`}
                >
                  <span className="mr-1 inline-flex align-middle"><Languages className="h-4 w-4" /></span>
                  {item.label}
                </button>
              ))}

              <button
                type="button"
                onClick={toggleSound}
                className="rounded-full border border-white/80 bg-white/70 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-white"
              >
                <span className="mr-1 inline-flex align-middle">{soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}</span>
                {soundEnabled ? t.soundOn : t.soundOff}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <StatCard icon={<TimerReset className="h-4 w-4" />} label={t.time} value={`${Math.ceil(view.timeLeft)}s`} accent="from-sky-100 via-cyan-100 to-blue-100" glow="bg-cyan-200/70" />
              <StatCard icon={<Keyboard className="h-4 w-4" />} label={t.wrong} value={view.wrongPresses} accent="from-violet-100 via-purple-100 to-indigo-100" glow="bg-violet-200/70" />
              <StatCard icon={<Target className="h-4 w-4" />} label={t.hits} value={view.typed} accent="from-emerald-100 via-teal-100 to-green-100" glow="bg-emerald-200/70" />
              <StatCard icon={<Rocket className="h-4 w-4" />} label={t.escaped} value={view.escapedRockets} accent="from-rose-100 via-pink-100 to-red-100" glow="bg-rose-200/70" />
            </div>

            <div className="rounded-3xl border border-white/72 bg-gradient-to-br from-white/78 to-fuchsia-50/95 p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-600">
                <span>{t.level}</span>
                <span>{view.level}/5</span>
              </div>
              <div className="mb-2 flex gap-2">
                {levelDots.map((dot, index) => (
                  <div key={dot} className={`h-3 flex-1 rounded-full transition-all duration-300 ${dot <= view.level ? levelColors[index] : "bg-slate-200"}`} />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={startGame}
              className="flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-4 py-3 text-lg font-black text-white shadow-lg transition hover:scale-[1.01] active:scale-[0.99]"
            >
              <Play className="h-5 w-5" />
              {view.phase === "playing" ? t.restart : view.phase === "ended" ? t.playAgain : t.start}
            </button>
          </div>

          <div className="rounded-[32px] border-4 border-white/72 bg-white/76 p-4 shadow-[0_14px_35px_rgba(125,125,255,0.14)]">
            <div className="mb-1.5 flex items-center gap-2 text-base font-black">
              <Star className="h-5 w-5 text-yellow-500" />
              {t.controls}
            </div>
            <p className="text-sm leading-6 text-slate-700">{t.controlsBody1}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{t.controlsBody2}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{t.controlsBody3}</p>

            <div className="mt-3 mb-1.5 flex items-center gap-2 text-base font-black">
              <Brain className="h-5 w-5 text-fuchsia-500" />
              {t.keyboardMode}
            </div>
            <p className="text-sm leading-6 text-slate-700">{t.keyboardModeBody}</p>
          </div>
        </div>

        <div
          ref={boardRef}
          tabIndex={0}
          className="relative h-full overflow-hidden rounded-[40px] border-[5px] border-white/72 bg-[linear-gradient(180deg,_#1d4ed8_0%,_#3b82f6_18%,_#60a5fa_40%,_#93c5fd_64%,_#f9a8d4_100%)] bg-clip-padding shadow-[0_18px_48px_rgba(59,130,246,0.18),inset_0_1px_0_rgba(255,255,255,0.6)] outline-none"
        >
          <div className="absolute inset-0 opacity-70">
            {Array.from({ length: 80 }).map((_, index) => (
              <div
                key={index}
                className="absolute rounded-full bg-white/85"
                style={{
                  left: `${(index * 11.3) % 100}%`,
                  top: `${(index * 9.1) % 100}%`,
                  width: `${2 + (index % 2)}px`,
                  height: `${2 + (index % 2)}px`,
                }}
              />
            ))}
          </div>

          <div className="absolute -left-8 top-20 h-28 w-44 rounded-full bg-white/65 blur-sm" />
          <div className="absolute left-24 top-28 h-24 w-40 rounded-full bg-white/55 blur-sm" />
          <div className="absolute right-10 top-16 h-24 w-44 rounded-full bg-white/55 blur-sm" />
          <div className="absolute right-36 top-28 h-20 w-32 rounded-full bg-white/50 blur-sm" />
          <div className="absolute -left-10 bottom-10 h-32 w-48 rounded-full bg-pink-200/45 blur-sm" />
          <div className="absolute right-0 bottom-0 h-56 w-64 rounded-full bg-yellow-200/35 blur-2xl" />

          <div className="absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-violet-950/50 to-transparent">
            <div className="flex h-full items-center justify-center text-center text-white">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.38em]">{t.skyGate}</div>
                <div className="mt-1 text-sm font-semibold text-white/90">{t.skyHint}</div>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-fuchsia-500/18 via-pink-400/8 to-transparent" />

          <Explosion x={view.explosion?.x} y={view.explosion?.y} active={!!view.explosion} />

          {view.phase === "playing" && (view.wrongPresses >= 3 || view.escapedRockets >= 3) && (
            <KeyboardHint
              language={language}
              activeLetters={view.enemies.filter((e) => e.y < 100 && e.y > EXIT_Y).map((e) => e.letter)}
            />
          )}

          {view.enemies.map((rocket) => (
            <RocketEnemy key={rocket.id} rocket={rocket} />
          ))}

          {view.phase !== "playing" && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/16 p-6 backdrop-blur-[3px]">
              <div className="max-w-xl rounded-[34px] border-4 border-white/82 bg-white/84 p-8 text-center shadow-2xl">
                <MascotRocket celebrate={view.phase === "ended"} />
                <h2 className="text-4xl font-black text-slate-800">{view.phase === "ended" ? t.endTitle : t.idleTitle}</h2>
                <p className="mt-4 text-lg font-medium leading-8 text-slate-700">{view.phase === "ended" ? t.endBody : t.idleBody}</p>

                {view.phase === "ended" && (
                  <>
                    <div className="mt-4 flex justify-center gap-1 text-5xl">
                      {Array.from({ length: 3 }, (_, i) => (
                        <span key={i} className={`transition-all ${i < calcStars(view.wrongPresses, view.escapedRockets) ? "opacity-100 scale-110" : "opacity-20 grayscale"}`}>⭐</span>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                      <div className="rounded-2xl bg-emerald-50 p-3 text-center">
                        <div className="text-xs font-bold uppercase tracking-wide text-emerald-600">{t.hits}</div>
                        <div className="mt-1 text-2xl font-black text-emerald-700">{view.typed}</div>
                      </div>
                      <div className="rounded-2xl bg-rose-50 p-3 text-center">
                        <div className="text-xs font-bold uppercase tracking-wide text-rose-500">{t.wrong}</div>
                        <div className="mt-1 text-2xl font-black text-rose-600">{view.wrongPresses}</div>
                      </div>
                      <div className="rounded-2xl bg-violet-50 p-3 text-center">
                        <div className="text-xs font-bold uppercase tracking-wide text-violet-500">{t.escaped}</div>
                        <div className="mt-1 text-2xl font-black text-violet-600">{view.escapedRockets}</div>
                      </div>
                    </div>

                    {showLearningSummary && (
                      <div className="mt-6 rounded-3xl border border-white/70 bg-white/78 p-5 text-left shadow-sm">
                        <div className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">{t.learning}</div>
                        <div className="mt-4">
                          <div className="text-sm font-bold text-slate-700">{t.strongLetters}</div>
                          <LetterPills letters={bestLetters.length ? bestLetters : getAllLetters(language).slice(0, 3)} tone="good" />
                        </div>
                        {practiceLetters.length > 0 && (
                          <div className="mt-4">
                            <div className="text-sm font-bold text-slate-700">{t.practiceLetters}</div>
                            <LetterPills letters={practiceLetters} tone="practice" />
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
