import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Pause, Undo2, Bot, User } from 'lucide-react';
import { PlayerConfig, PlayerId } from '../types/game';
import { DotsGameState } from '../game/gameEngine';
import { THEMES } from '../types/theme';

interface HUDProps {
  gameState: DotsGameState;
  players: Record<PlayerId, PlayerConfig>;
  themeId: string;
  isAiThinking: boolean;
  canUndo: boolean;
  onUndo: () => void;
  onRestart: () => void;
  onPause: () => void;
  isVsAI: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  gameState,
  players,
  themeId,
  isAiThinking,
  canUndo,
  onUndo,
  onRestart,
  onPause,
}) => {
  const theme = THEMES[themeId as keyof typeof THEMES] || THEMES.classic;
  const { scores, currentPlayer, dimensions, completedBoxes, extraTurnGranted } = gameState;
  const remainingBoxes = dimensions.totalBoxes - completedBoxes.size;

  const p1 = players[1];
  const p2 = players[2];

  const isP1Turn = currentPlayer === 1;
  const isP2Turn = currentPlayer === 2;

  const textColor = theme.isDark ? 'text-white' : 'text-black';
  const textMuted = theme.isDark ? 'text-neutral-400' : 'text-black';

  // State to trigger the score pop and floating point gain
  const [poppingP1, setPoppingP1] = useState(false);
  const [poppingP2, setPoppingP2] = useState(false);
  const [gainP1, setGainP1] = useState<number | null>(null);
  const [gainP2, setGainP2] = useState<number | null>(null);

  const prevScoreP1Ref = useRef(scores[1]);
  const prevScoreP2Ref = useRef(scores[2]);

  useEffect(() => {
    if (scores[1] > prevScoreP1Ref.current) {
      const diff = scores[1] - prevScoreP1Ref.current;
      setGainP1(diff);
      setPoppingP1(true);
      const timerPop = window.setTimeout(() => setPoppingP1(false), 380);
      const timerGain = window.setTimeout(() => setGainP1(null), 750);
      prevScoreP1Ref.current = scores[1];
      return () => {
        clearTimeout(timerPop);
        clearTimeout(timerGain);
      };
    } else {
      prevScoreP1Ref.current = scores[1];
    }
  }, [scores[1]]);

  useEffect(() => {
    if (scores[2] > prevScoreP2Ref.current) {
      const diff = scores[2] - prevScoreP2Ref.current;
      setGainP2(diff);
      setPoppingP2(true);
      const timerPop = window.setTimeout(() => setPoppingP2(false), 380);
      const timerGain = window.setTimeout(() => setGainP2(null), 750);
      prevScoreP2Ref.current = scores[2];
      return () => {
        clearTimeout(timerPop);
        clearTimeout(timerGain);
      };
    } else {
      prevScoreP2Ref.current = scores[2];
    }
  }, [scores[2]]);

  const brutalBtnClass = theme.isDark
    ? 'border-2 border-white bg-[#181B22] text-white shadow-[2px_2px_0px_#FFF] hover:bg-neutral-800 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
    : 'border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-neutral-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none';

  return (
    <div className={`w-full max-w-2xl mx-auto px-3 sm:px-4 py-2 flex flex-col gap-3 ${textColor}`}>
      {/* Top action row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-black uppercase tracking-wider ${textColor}`}>
            REMAINING BOXES
          </span>
          <span
            className={`font-mono text-xs font-black px-2 py-0.5 border-2 ${
              theme.isDark
                ? 'border-white bg-[#181B22] text-white shadow-[2px_2px_0px_#FFF]'
                : 'border-black bg-white text-black shadow-[2px_2px_0px_#000]'
            } tabular-nums`}
          >
            {remainingBoxes} / {dimensions.totalBoxes}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {canUndo && (
            <button
              onClick={onUndo}
              disabled={isAiThinking}
              title="Undo last move (U)"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${brutalBtnClass}`}
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">UNDO</span>
            </button>
          )}

          <button
            onClick={onRestart}
            title="Restart board (R)"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase transition-all cursor-pointer ${brutalBtnClass}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESET</span>
          </button>

          <button
            onClick={onPause}
            title="Pause game (ESC)"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase transition-all cursor-pointer ${brutalBtnClass}`}
          >
            <Pause className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PAUSE</span>
          </button>
        </div>
      </div>

      {/* Players comparison scoreboard - Clean Brutalist Metric Blocks */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Player 1 Card */}
        <div
          className={`relative p-3.5 sm:p-4 border-2 transition-all ${
            theme.isDark ? 'bg-[#181B22]' : 'bg-white'
          } ${
            isP1Turn
              ? theme.isDark
                ? 'border-cyan-400 shadow-[4px_4px_0px_#06b6d4]'
                : 'border-black shadow-[4px_4px_0px_#1d4ed8]'
              : theme.isDark
              ? 'border-neutral-700 shadow-[2px_2px_0px_#333] opacity-80'
              : 'border-neutral-400 shadow-[2px_2px_0px_#888] opacity-85'
          } ${poppingP1 ? 'scale-[1.02]' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 border-2 border-black flex items-center justify-center font-black text-sm text-white ${theme.player1.shadow}`}
                style={{ backgroundColor: theme.player1.accentHex }}
              >
                {p1.isAI ? <Bot className="w-4 h-4" /> : p1.initial || <User className="w-4 h-4" />}
              </div>
              <div className="overflow-hidden">
                <div className={`text-xs sm:text-sm font-black uppercase truncate ${textColor}`}>
                  {p1.name}
                </div>
                <div className="text-[10px] font-mono font-black tracking-tight uppercase mt-0.5">
                  {isP1Turn ? (
                    <span className="text-blue-600 font-black">
                      ▶ ACTIVE TURN
                    </span>
                  ) : (
                    <span className={textMuted}>WAITING</span>
                  )}
                </div>
              </div>
            </div>

            <div className="relative text-right flex flex-col items-end">
              {/* Floating +1 point animation */}
              {gainP1 !== null && (
                <span
                  key={`gain_p1_${scores[1]}`}
                  className={`absolute -top-3.5 right-0 font-mono font-black text-xs px-1 border border-black shadow-[1px_1px_0px_#000] ${
                    theme.isDark ? 'bg-cyan-400 text-black' : 'bg-blue-600 text-white'
                  } animate-score-gain pointer-events-none select-none z-10`}
                >
                  +{gainP1}
                </span>
              )}
              {/* Score Number with Pop Animation */}
              <div
                key={`score_p1_${scores[1]}`}
                className={`text-3xl sm:text-4xl font-black font-mono tabular-nums leading-none ${textColor} ${
                  poppingP1 ? 'animate-score-pop text-blue-600' : ''
                }`}
              >
                {scores[1]}
              </div>
              <div className={`text-[10px] font-black uppercase tracking-wider mt-1 ${textMuted}`}>
                BOXES
              </div>
            </div>
          </div>
        </div>

        {/* Player 2 Card */}
        <div
          className={`relative p-3.5 sm:p-4 border-2 transition-all ${
            theme.isDark ? 'bg-[#181B22]' : 'bg-white'
          } ${
            isP2Turn
              ? theme.isDark
                ? 'border-rose-400 shadow-[4px_4px_0px_#f43f5e]'
                : 'border-black shadow-[4px_4px_0px_#dc2626]'
              : theme.isDark
              ? 'border-neutral-700 shadow-[2px_2px_0px_#333] opacity-80'
              : 'border-neutral-400 shadow-[2px_2px_0px_#888] opacity-85'
          } ${poppingP2 ? 'scale-[1.02]' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 border-2 border-black flex items-center justify-center font-black text-sm text-white ${theme.player2.shadow}`}
                style={{ backgroundColor: theme.player2.accentHex }}
              >
                {p2.isAI ? <Bot className="w-4 h-4" /> : p2.initial || <User className="w-4 h-4" />}
              </div>
              <div className="overflow-hidden">
                <div className={`text-xs sm:text-sm font-black uppercase truncate ${textColor}`}>
                  {p2.name}
                </div>
                <div className="text-[10px] font-mono font-black tracking-tight uppercase mt-0.5">
                  {isP2Turn ? (
                    isAiThinking ? (
                      <span className="text-amber-600 font-black animate-pulse">
                        ▶ AI COMPUTING...
                      </span>
                    ) : (
                      <span className="text-red-600 font-black">
                        ▶ ACTIVE TURN
                      </span>
                    )
                  ) : (
                    <span className={textMuted}>WAITING</span>
                  )}
                </div>
              </div>
            </div>

            <div className="relative text-right flex flex-col items-end">
              {/* Floating +1 point animation */}
              {gainP2 !== null && (
                <span
                  key={`gain_p2_${scores[2]}`}
                  className={`absolute -top-3.5 right-0 font-mono font-black text-xs px-1 border border-black shadow-[1px_1px_0px_#000] ${
                    theme.isDark ? 'bg-rose-400 text-black' : 'bg-red-600 text-white'
                  } animate-score-gain pointer-events-none select-none z-10`}
                >
                  +{gainP2}
                </span>
              )}
              {/* Score Number with Pop Animation */}
              <div
                key={`score_p2_${scores[2]}`}
                className={`text-3xl sm:text-4xl font-black font-mono tabular-nums leading-none ${textColor} ${
                  poppingP2 ? 'animate-score-pop text-red-600' : ''
                }`}
              >
                {scores[2]}
              </div>
              <div className={`text-[10px] font-black uppercase tracking-wider mt-1 ${textMuted}`}>
                BOXES
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Turn Banner */}
      {extraTurnGranted && !gameState.isGameOver && (
        <div
          className={`w-full py-2 px-3 border-2 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 ${
            theme.isDark
              ? 'border-amber-400 bg-amber-950/70 text-amber-300 shadow-[3px_3px_0px_#f59e0b]'
              : 'border-black bg-amber-300 text-black shadow-[3px_3px_0px_#000]'
          }`}
        >
          <span>■ BOX CAPTURED // BONUS TURN GRANTED</span>
        </div>
      )}
    </div>
  );
};
