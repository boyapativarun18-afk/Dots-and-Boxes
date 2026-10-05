import {
  Achievement,
  AIDifficulty,
  DailyChallenge,
  GameSettings,
  GameStatistics,
} from '../types/game';

const SETTINGS_KEY = 'dots_boxes_settings_v1';
const STATS_KEY = 'dots_boxes_stats_v1';
const ACHIEVEMENTS_KEY = 'dots_boxes_achievements_v1';
const DAILY_KEY = 'dots_boxes_daily_v1';

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: false,
  masterVolume: 0.7,
  theme: 'classic',
  undoEnabled: true,
  animationSpeed: 'normal',
  highContrast: false,
  reducedMotion: false,
  defaultBoard: 'medium',
  defaultDifficulty: 'medium',
};

export const DEFAULT_STATS: GameStatistics = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  draws: 0,
  totalBoxesCaptured: 0,
  bestScore: 0,
  currentStreak: 0,
  longestStreak: 0,
  byDifficulty: {
    easy: { played: 0, won: 0, lost: 0 },
    medium: { played: 0, won: 0, lost: 0 },
    hard: { played: 0, won: 0, lost: 0 },
    expert: { played: 0, won: 0, lost: 0 },
  },
  pvpGamesPlayed: 0,
  dailyChallengesCompleted: 0,
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    title: 'First Victory',
    description: 'Win your first game against AI or a friend.',
    icon: '🏆',
  },
  {
    id: 'streak_3',
    title: 'Hot Streak',
    description: 'Win 3 consecutive games.',
    icon: '🔥',
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'streak_5',
    title: 'Unstoppable',
    description: 'Win 5 consecutive games.',
    icon: '⚡',
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'box_collector',
    title: 'Box Master',
    description: 'Capture 15 or more boxes in a single game.',
    icon: '💎',
  },
  {
    id: 'beat_hard',
    title: 'Strategist',
    description: 'Defeat the Hard AI in a match.',
    icon: '🧠',
  },
  {
    id: 'beat_expert',
    title: 'Grandmaster',
    description: 'Outsmart and defeat the Expert AI.',
    icon: '👑',
  },
  {
    id: 'perfect_game',
    title: 'Flawless Victory',
    description: 'Win without allowing the opponent to capture any box.',
    icon: '🎯',
  },
  {
    id: 'daily_hero',
    title: 'Daily Champion',
    description: 'Complete a Daily Challenge.',
    icon: '🌟',
  },
];

export class StorageManager {
  public static getSettings(): GameSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // LocalStorage unavailable
    }
    return DEFAULT_SETTINGS;
  }

  public static saveSettings(settings: GameSettings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }

  public static getStats(): GameStatistics {
    try {
      const data = localStorage.getItem(STATS_KEY);
      if (data) {
        return { ...DEFAULT_STATS, ...JSON.parse(data) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_STATS;
  }

  public static saveStats(stats: GameStatistics) {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }

  public static getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (data) {
        const saved: Achievement[] = JSON.parse(data);
        return INITIAL_ACHIEVEMENTS.map((init) => {
          const match = saved.find((s) => s.id === init.id);
          return match ? { ...init, ...match } : init;
        });
      }
    } catch {
      // ignore
    }
    return INITIAL_ACHIEVEMENTS;
  }

  public static saveAchievements(achievements: Achievement[]) {
    try {
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    } catch {
      // ignore
    }
  }

  public static unlockAchievement(id: string, notifyCallback?: (ach: Achievement) => void): Achievement[] {
    const list = this.getAchievements();
    let newlyUnlockedItem: Achievement | null = null;
    const updated = list.map((a) => {
      if (a.id === id && !a.unlockedAt) {
        newlyUnlockedItem = {
          ...a,
          unlockedAt: new Date().toISOString(),
          progress: a.maxProgress ?? 1,
        };
        return newlyUnlockedItem;
      }
      return a;
    });
    if (newlyUnlockedItem) {
      this.saveAchievements(updated);
      if (notifyCallback) notifyCallback(newlyUnlockedItem);
    }
    return updated;
  }

  public static updateStreakProgress(streak: number, notifyCallback?: (ach: Achievement) => void) {
    const list = this.getAchievements();
    let changed = false;
    const updated = list.map((a) => {
      if (a.id === 'streak_3') {
        const prog = Math.min(3, Math.max(a.progress || 0, streak));
        if (streak >= 3 && !a.unlockedAt) {
          changed = true;
          const u = { ...a, unlockedAt: new Date().toISOString(), progress: 3 };
          if (notifyCallback) notifyCallback(u);
          return u;
        }
        if (prog !== a.progress) {
          changed = true;
          return { ...a, progress: prog };
        }
        return a;
      }
      if (a.id === 'streak_5') {
        const prog = Math.min(5, Math.max(a.progress || 0, streak));
        if (streak >= 5 && !a.unlockedAt) {
          changed = true;
          const u = { ...a, unlockedAt: new Date().toISOString(), progress: 5 };
          if (notifyCallback) notifyCallback(u);
          return u;
        }
        if (prog !== a.progress) {
          changed = true;
          return { ...a, progress: prog };
        }
        return a;
      }
      return a;
    });
    if (changed) {
      this.saveAchievements(updated);
    }
  }

  public static resetAchievements(): Achievement[] {
    try {
      localStorage.removeItem(ACHIEVEMENTS_KEY);
    } catch {
      // ignore
    }
    return INITIAL_ACHIEVEMENTS;
  }

  public static getTodayDateString(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public static getTodayDailyChallenge(): DailyChallenge {
    const dateStr = this.getTodayDateString();
    try {
      const data = localStorage.getItem(DAILY_KEY);
      if (data) {
        const parsed: DailyChallenge = JSON.parse(data);
        if (parsed.dateString === dateStr) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }

    // Deterministic pseudo-random generation based on date
    let seed = 0;
    for (let i = 0; i < dateStr.length; i++) {
      seed = (seed * 31 + dateStr.charCodeAt(i)) >>> 0;
    }

    const difficulties: AIDifficulty[] = ['medium', 'hard', 'expert'];
    const diff = difficulties[seed % difficulties.length];
    const presets: ('medium' | 'large')[] = ['medium', 'large'];
    const preset = presets[(seed >> 2) % presets.length];
    const totalBoxes = preset === 'medium' ? 9 : 16;
    const targetBoxes = Math.floor(totalBoxes / 2) + 1; // standard majority

    const challenge: DailyChallenge = {
      dateString: dateStr,
      boardPreset: preset,
      difficulty: diff,
      targetBoxes,
      description: `Win on a ${preset.toUpperCase()} board against ${diff.toUpperCase()} AI capturing at least ${targetBoxes} boxes!`,
      completed: false,
    };

    try {
      localStorage.setItem(DAILY_KEY, JSON.stringify(challenge));
    } catch {
      // ignore
    }

    return challenge;
  }

  public static completeDailyChallenge(score: number): DailyChallenge {
    const challenge = this.getTodayDailyChallenge();
    challenge.completed = true;
    challenge.score = score;
    try {
      localStorage.setItem(DAILY_KEY, JSON.stringify(challenge));
    } catch {
      // ignore
    }
    return challenge;
  }
}
