import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, LayoutGrid, Home, Trophy } from 'lucide-react';
import { Achievement, PlayerConfig, PlayerId } from '../types/game';
import { DotsGameState } from '../game/gameEngine';
import { audio } from '../audio/audioEngine';
import { THEMES } from '../types/theme';

interface GameOverModalProps {
  isOpen: boolean;
  gameState: DotsGameState;
  players: Record<PlayerId, PlayerConfig>;
  onPlayAgain: () => void;
  onChangeBoard: () => void;
  onMainMenu: () => void;
  unlockedAchievements?: Achievement[];
  themeId?: string;
}

// Geometric floating square particles for the in-modal victory backdrop
const VICTORY_PARTICLES = [
  { left: 10, bottom: 6, size: 10, delay: 0.1, duration: 2.8, color: '#f59e0b' },
  { left: 22, bottom: 12, size: 8, delay: 0.8, duration: 3.2, color: '#06b6d4' },
  { left: 35, bottom: 5, size: 12, delay: 0.4, duration: 2.9, color: '#FFE600' },
  { left: 48, bottom: 10, size: 9, delay: 1.1, duration: 3.1, color: '#f43f5e' },
  { left: 62, bottom: 14, size: 11, delay: 0.3, duration: 2.7, color: '#10b981' },
  { left: 75, bottom: 7, size: 8, delay: 0.9, duration: 3.4, color: '#f59e0b' },
  { left: 88, bottom: 15, size: 10, delay: 0.5, duration: 3.0, color: '#3b82f6' },
  { left: 16, bottom: 25, size: 7, delay: 1.3, duration: 2.6, color: '#FFE600' },
  { left: 82, bottom: 28, size: 9, delay: 1.5, duration: 2.8, color: '#f43f5e' },
  { left: 28, bottom: 35, size: 10, delay: 0.7, duration: 3.3, color: '#10b981' },
  { left: 70, bottom: 38, size: 8, delay: 1.2, duration: 3.0, color: '#06b6d4' },
];

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  gameState,
  players,
  onPlayAgain,
  onChangeBoard,
  onMainMenu,
  unlockedAchievements = [],
  themeId = 'classic',
}) => {
  const { winner, scores } = gameState;
  const theme = THEMES[themeId as keyof typeof THEMES] || THEMES.classic;

  useEffect(() => {
    if (isOpen) {
      if (winner === 'draw') {
        audio.playDraw();
      } else {
        audio.playVictory();
        try {
          const colors = [
            theme.player1.accentHex,
            theme.player2.accentHex,
            '#FFE600',
            '#f59e0b',
            '#10b981',
            '#06b6d4',
          ];

          // 1. Dual side cannons with brutalist square confetti
          confetti({
            particleCount: 55,
            angle: 60,
            spread: 60,
            origin: { x: 0.08, y: 0.75 },
            colors,
            shapes: ['square'],
            scalar: 1.15,
          });
          confetti({
            particleCount: 55,
            angle: 120,
            spread: 60,
            origin: { x: 0.92, y: 0.75 },
            colors,
            shapes: ['square'],
            scalar: 1.15,
          });

          // 2. High-elevation victory star shower from center top
          const timer = window.setTimeout(() => {
            confetti({
              particleCount: 75,
              spread: 95,
              origin: { y: 0.45 },
              colors: ['#FFE600', '#f59e0b', '#ffffff', theme.player1.accentHex, theme.player2.accentHex],
              shapes: ['square'],
              scalar: 1.25,
            });
          }, 280);

          return () => clearTimeout(timer);
        } catch {
          // ignore
        }
      }
    }
  }, [isOpen, winner, theme]);

  if (!isOpen) return null;

  const isDraw = winner === 'draw';
  const winningPlayer = winner && winner !== 'draw' ? players[winner] : null;

  const modalBorder = theme.isDark ? 'border-2 border-white' : 'border-2 border-black';
  const modalBg = theme.isDark ? 'bg-[#181B22]' : 'bg-white';
  const brutalShadow = theme.isDark ? 'shadow-[6px_6px_0px_#FFF]' : 'shadow-[6px_6px_0px_#000]';
  const brutalShadowSm = theme.isDark ? 'shadow-[2px_2px_0px_#FFF]' : 'shadow-[2px_2px_0px_#000]';
  const textColor = theme.isDark ? 'text-white' : 'text-black';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={`w-full max-w-md ${modalBorder} ${modalBg} ${brutalShadow} ${textColor} p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden`}
      >
        {/* Victory In-Modal Particle Overlay & Aura */}
        {!isDraw && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
            {/* Spinning victory halo behind trophy */}
            <div className="absolute -top-10 left-1/2 w-48 h-48 border-2 border-dashed border-amber-400/40 rounded-full animate-aura-spin" />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-36 h-36 border border-amber-500/25 rotate-45 animate-pulse" />

            {/* Ambient subtle color aura matching the victor */}
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full blur-2xl opacity-20 pointer-events-none"
              style={{
                backgroundColor: winningPlayer?.id === 1 ? theme.player1.accentHex : theme.player2.accentHex,
              }}
            />

            {/* Floating geometric confetti particles */}
            {VICTORY_PARTICLES.map((p, idx) => (
              <div
                key={idx}
                className="absolute border border-black shadow-[1px_1px_0px_#000]"
                style={{
                  left: `${p.left}%`,
                  bottom: `${p.bottom}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  animation: `victoryFloatUp ${p.duration}s cubic-bezier(0.25, 1, 0.5, 1) ${p.delay}s infinite`,
                }}
              />
            ))}
          </div>
        )}

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col items-center w-full">
          {/* Victory Icon / Banner with dynamic bounce */}
          <div
            className={`w-16 h-16 border-2 border-black ${
              isDraw
                ? 'bg-neutral-300 text-black shadow-[2px_2px_0px_#000]'
                : 'bg-amber-400 text-black shadow-[4px_4px_0px_#000] animate-trophy-pop'
            } flex items-center justify-center mb-3`}
          >
            <Trophy className="w-8 h-8" />
          </div>

          <span className="font-mono text-[10px] font-black uppercase tracking-widest opacity-60">
            // MATCH CONCLUDED //
          </span>

          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-['Outfit'] mt-1">
            {isDraw ? "It's a Draw!" : `${winningPlayer?.name} Wins!`}
          </h2>

          <p className="text-xs opacity-75 mt-1 max-w-xs font-mono">
            {isDraw
              ? 'Both tacticians captured equal boxes. Grid in equilibrium.'
              : `${winningPlayer?.name} conquered the grid with superior tactical geometry.`}
          </p>

          {/* Score comparison card */}
          <div
            className={`w-full grid grid-cols-2 gap-3 my-5 p-4 border-2 ${
              theme.isDark ? 'border-white bg-[#0F1117]' : 'border-black bg-neutral-50'
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-xs font-black uppercase truncate max-w-[120px] text-blue-600">
                {players[1].name}
              </span>
              <span className="text-4xl font-black font-mono mt-1 tabular-nums">
                {scores[1]}
              </span>
              <span className="text-[10px] opacity-60 uppercase font-mono mt-0.5">Boxes</span>
            </div>

            <div className={`flex flex-col items-center border-l-2 ${theme.isDark ? 'border-white' : 'border-black'}`}>
              <span className="text-xs font-black uppercase truncate max-w-[120px] text-rose-600">
                {players[2].name}
              </span>
              <span className="text-4xl font-black font-mono mt-1 tabular-nums">
                {scores[2]}
              </span>
              <span className="text-[10px] opacity-60 uppercase font-mono mt-0.5">Boxes</span>
            </div>
          </div>

          {/* Unlocked Achievements Alert if any */}
          {unlockedAchievements.length > 0 && (
            <div className="w-full flex flex-col gap-2 mb-4">
              {unlockedAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className="w-full p-2.5 border-2 border-black bg-amber-200 text-black flex items-center gap-3 text-left shadow-[2px_2px_0px_#000]"
                >
                  <div className="w-8 h-8 border-2 border-black bg-amber-400 text-black flex items-center justify-center shrink-0 text-base">
                    {ach.icon}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[9px] font-black uppercase font-mono text-black">
                      BADGE UNLOCKED!
                    </div>
                    <div className="text-xs font-black uppercase truncate text-black">
                      {ach.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-2.5">
            <button
              onClick={onPlayAgain}
              className={`w-full py-3.5 px-4 border-2 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                theme.isDark
                  ? 'border-white bg-white text-black shadow-[4px_4px_0px_#06b6d4] hover:bg-neutral-200'
                  : 'border-black bg-[#FFE600] text-black shadow-[4px_4px_0px_#000] hover:bg-yellow-300'
              } active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>

            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                onClick={onChangeBoard}
                className={`w-full py-2.5 px-3 ${modalBorder} ${modalBg} ${brutalShadowSm} font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Change Board</span>
              </button>

              <button
                onClick={onMainMenu}
                className={`w-full py-2.5 px-3 ${modalBorder} ${modalBg} ${brutalShadowSm} font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Main Menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
