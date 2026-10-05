export type PlayerId = 1 | 2;

export type GameMode = 'ai' | 'pvp' | 'daily';

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type ThemeId = 'midnight' | 'classic' | 'emerald' | 'neon' | 'woodcraft';

export interface BoardDimensions {
  dotsX: number; // cols of dots (e.g. 3, 4, 5, 6)
  dotsY: number; // rows of dots (e.g. 3, 4, 5, 6)
  boxesX: number; // dotsX - 1
  boxesY: number; // dotsY - 1
  totalBoxes: number;
}

export type BoardPreset = 'small' | 'medium' | 'large' | 'huge';

export const BOARD_PRESETS: Record<BoardPreset, { label: string; dots: number; description: string }> = {
  small: { label: 'Small', dots: 3, description: '3×3 Dots · 4 Boxes (Fast)' },
  medium: { label: 'Medium', dots: 4, description: '4×4 Dots · 9 Boxes (Standard)' },
  large: { label: 'Large', dots: 5, description: '5×5 Dots · 16 Boxes (Tactical)' },
  huge: { label: 'Huge', dots: 6, description: '6×6 Dots · 25 Boxes (Grandmaster)' },
};

// Edge definition
// Horizontal edge: type='H', r: 0..dotsY-1, c: 0..dotsX-2
// Vertical edge: type='V', r: 0..dotsY-2, c: 0..dotsX-1
export interface Edge {
  type: 'H' | 'V';
  r: number;
  c: number;
}

export type EdgeKey = `H_${number}_${number}` | `V_${number}_${number}`;

export function getEdgeKey(edge: Edge): EdgeKey {
  return `${edge.type}_${edge.r}_${edge.c}`;
}

export function parseEdgeKey(key: EdgeKey): Edge {
  const [type, rStr, cStr] = key.split('_');
  return {
    type: type as 'H' | 'V',
    r: parseInt(rStr, 10),
    c: parseInt(cStr, 10),
  };
}

export interface BoxCoord {
  r: number; // 0..boxesY-1
  c: number; // 0..boxesX-1
}

export interface CompletedBox extends BoxCoord {
  owner: PlayerId;
  completedAtMove: number;
}

export interface MoveRecord {
  edge: Edge;
  player: PlayerId;
  completedBoxes: BoxCoord[];
  moveNumber: number;
}

export interface PlayerConfig {
  id: PlayerId;
  name: string;
  isAI: boolean;
  avatar: string;
  colorName: string;
  initial: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  masterVolume: number;
  theme: ThemeId;
  undoEnabled: boolean;
  animationSpeed: 'normal' | 'fast';
  highContrast: boolean;
  reducedMotion: boolean;
  defaultBoard: BoardPreset;
  defaultDifficulty: AIDifficulty;
}

export interface GameStatistics {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  draws: number;
  totalBoxesCaptured: number;
  bestScore: number;
  currentStreak: number;
  longestStreak: number;
  byDifficulty: Record<AIDifficulty, { played: number; won: number; lost: number }>;
  pvpGamesPlayed: number;
  dailyChallengesCompleted: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface DailyChallenge {
  dateString: string; // YYYY-MM-DD
  boardPreset: BoardPreset;
  difficulty: AIDifficulty;
  targetBoxes: number;
  description: string;
  completed: boolean;
  score?: number;
}

export type ScreenState = 'menu' | 'setup' | 'playing' | 'stats' | 'achievements' | 'how-to-play' | 'daily';
