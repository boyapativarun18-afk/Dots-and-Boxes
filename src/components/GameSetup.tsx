import React, { useState } from 'react';
import { ArrowLeft, Bot, Users, Play, ShieldAlert, Sparkles, Zap, Crown } from 'lucide-react';
import {
  AIDifficulty,
  BoardPreset,
  BOARD_PRESETS,
  GameMode,
} from '../types/game';
import { THEMES } from '../types/theme';

interface GameSetupProps {
  initialMode: GameMode;
  onBack: () => void;
  onStartGame: (
    mode: GameMode,
    preset: BoardPreset,
    difficulty: AIDifficulty,
    p1Name: string,
    p2Name: string
  ) => void;
  defaultBoard: BoardPreset;
  defaultDifficulty: AIDifficulty;
  themeId?: string;
}

export const GameSetup: React.FC<GameSetupProps> = ({
  initialMode,
  onBack,
  onStartGame,
  defaultBoard,
  defaultDifficulty,
  themeId = 'classic',
}) => {
  const [mode, setMode] = useState<GameMode>(initialMode === 'daily' ? 'ai' : initialMode);
  const [preset, setPreset] = useState<BoardPreset>(defaultBoard);
  const [difficulty, setDifficulty] = useState<AIDifficulty>(defaultDifficulty);
  const [p1Name, setP1Name] = useState<string>('Player 1');
  const [p2Name, setP2Name] = useState<string>(mode === 'ai' ? 'RoboTactician' : 'Player 2');

  const theme = THEMES[themeId as keyof typeof THEMES] || THEMES.classic;

  const cardBorder = theme.isDark ? 'border-2 border-white' : 'border-2 border-black';
  const cardBg = theme.isDark ? 'bg-[#181B22]' : 'bg-white';
  const brutalShadow = theme.isDark ? 'shadow-[4px_4px_0px_#FFF]' : 'shadow-[4px_4px_0px_#000]';
  const brutalShadowSm = theme.isDark ? 'shadow-[2px_2px_0px_#FFF]' : 'shadow-[2px_2px_0px_#000]';
  const textColor = theme.isDark ? 'text-white' : 'text-black';
  const textSub = theme.isDark ? 'text-neutral-300' : 'text-black';

  const handleModeChange = (newMode: GameMode) => {
    setMode(newMode);
    if (newMode === 'ai') {
      setP2Name('RoboTactician');
    } else {
      if (p2Name === 'RoboTactician') setP2Name('Player 2');
    }
  };

  const handleStart = () => {
    onStartGame(
      mode,
      preset,
      difficulty,
      p1Name.trim() || 'Player 1',
      p2Name.trim() || (mode === 'ai' ? 'RoboTactician' : 'Player 2')
    );
  };

  const difficulties: { id: AIDifficulty; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'easy',
      label: 'Easy',
      desc: 'Casual legal moves with occasional captures.',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'medium',
      label: 'Medium',
      desc: 'Greedy capture solver, avoids opening easy boxes.',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: 'hard',
      label: 'Hard',
      desc: 'Tactical chain analyst, minimizes box sacrifices.',
      icon: <ShieldAlert className="w-4 h-4" />,
    },
    {
      id: 'expert',
      label: 'Expert',
      desc: 'Game theory master with alpha-beta endgame search.',
      icon: <Crown className="w-4 h-4" />,
    },
  ];

  return (
    <div className={`w-full max-w-xl mx-auto px-4 py-6 sm:py-8 flex flex-col gap-6 ${textColor}`}>
      {/* Header with back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 px-3 py-1.5 ${cardBorder} ${cardBg} ${brutalShadowSm} ${textColor} text-xs font-black uppercase transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px]`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className={`text-xs font-mono font-black uppercase tracking-wider ${textColor}`}>
          MATCH CONFIG
        </span>
      </div>

      <div className={`p-5 sm:p-7 ${cardBorder} ${cardBg} ${brutalShadow} flex flex-col gap-6`}>
        {/* Step 1: Mode Switcher */}
        <div>
          <label className={`block text-xs font-mono font-black uppercase tracking-wider mb-2 ${textColor}`}>
            [01] SELECT MODE
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleModeChange('ai')}
              className={`p-3 border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${
                mode === 'ai'
                  ? theme.isDark
                    ? 'bg-white text-black border-white shadow-[3px_3px_0px_#06b6d4]'
                    : 'bg-black text-white border-black shadow-[3px_3px_0px_#1d4ed8]'
                  : `${cardBorder} ${cardBg} ${textColor} hover:translate-x-[-1px]`
              }`}
            >
              <Bot className="w-5 h-5 shrink-0" />
              <div>
                <div className="text-sm font-black uppercase">Play vs AI</div>
                <div className="text-[11px] font-mono font-semibold">Single Player</div>
              </div>
            </button>

            <button
              onClick={() => handleModeChange('pvp')}
              className={`p-3 border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${
                mode === 'pvp'
                  ? theme.isDark
                    ? 'bg-white text-black border-white shadow-[3px_3px_0px_#f43f5e]'
                    : 'bg-black text-white border-black shadow-[3px_3px_0px_#dc2626]'
                  : `${cardBorder} ${cardBg} ${textColor} hover:translate-x-[-1px]`
              }`}
            >
              <Users className="w-5 h-5 shrink-0" />
              <div>
                <div className="text-sm font-black uppercase">Two Player</div>
                <div className="text-[11px] font-mono font-semibold">Pass &amp; Play</div>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Board Size */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`text-xs font-mono font-black uppercase tracking-wider ${textColor}`}>
              [02] BOARD SIZE
            </label>
            <span className={`text-xs font-mono font-black ${textColor}`}>
              {BOARD_PRESETS[preset].description}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(BOARD_PRESETS) as BoardPreset[]).map((p) => {
              const info = BOARD_PRESETS[p];
              const isSelected = preset === p;
              return (
                <button
                  key={p}
                  onClick={() => setPreset(p)}
                  className={`p-3 border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? theme.isDark
                        ? 'bg-white text-black border-white shadow-[3px_3px_0px_#06b6d4]'
                        : 'bg-black text-white border-black shadow-[3px_3px_0px_#1d4ed8]'
                      : `${cardBorder} ${cardBg} ${textColor} hover:translate-x-[-1px]`
                  }`}
                >
                  <div className="text-sm font-black uppercase">{info.label}</div>
                  <div className="text-[10px] font-mono font-bold">
                    {info.dots}×{info.dots} DOTS
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: AI Difficulty (if vs AI) */}
        {mode === 'ai' && (
          <div>
            <label className={`block text-xs font-mono font-black uppercase tracking-wider mb-2 ${textColor}`}>
              [03] AI DIFFICULTY
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {difficulties.map((d) => {
                const isSelected = difficulty === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    className={`p-3 border-2 text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? theme.isDark
                          ? 'bg-white text-black border-white shadow-[3px_3px_0px_#06b6d4]'
                          : 'bg-black text-white border-black shadow-[3px_3px_0px_#1d4ed8]'
                        : `${cardBorder} ${cardBg} ${textColor} hover:translate-x-[-1px]`
                    }`}
                  >
                    <div className="mt-0.5">{d.icon}</div>
                    <div>
                      <div className="text-xs sm:text-sm font-black uppercase">
                        {d.label}
                      </div>
                      <div className={`text-[11px] font-mono font-medium mt-0.5 leading-tight ${textSub}`}>
                        {d.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Player Identities */}
        <div>
          <label className={`block text-xs font-mono font-black uppercase tracking-wider mb-2 ${textColor}`}>
            [04] IDENTITIES
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className={`text-[11px] font-mono font-black uppercase mb-1 block ${textColor}`}>
                Player 1 Name
              </span>
              <input
                type="text"
                value={p1Name}
                maxLength={16}
                onChange={(e) => setP1Name(e.target.value)}
                placeholder="Player 1"
                className={`w-full px-3.5 py-2.5 border-2 ${
                  theme.isDark
                    ? 'border-white bg-[#0F1117] text-white focus:shadow-[3px_3px_0px_#06b6d4]'
                    : 'border-black bg-neutral-50 text-black focus:shadow-[3px_3px_0px_#000]'
                } focus:outline-none text-sm font-black font-mono`}
              />
            </div>

            <div>
              <span className={`text-[11px] font-mono font-black uppercase mb-1 block ${textColor}`}>
                {mode === 'ai' ? 'Opponent (AI)' : 'Player 2 Name'}
              </span>
              <input
                type="text"
                value={p2Name}
                maxLength={16}
                disabled={mode === 'ai'}
                onChange={(e) => setP2Name(e.target.value)}
                placeholder={mode === 'ai' ? 'RoboTactician' : 'Player 2'}
                className={`w-full px-3.5 py-2.5 border-2 ${
                  theme.isDark
                    ? 'border-white bg-[#0F1117] text-white focus:shadow-[3px_3px_0px_#f43f5e]'
                    : 'border-black bg-neutral-50 text-black focus:shadow-[3px_3px_0px_#000]'
                } focus:outline-none text-sm font-black font-mono disabled:opacity-60 disabled:cursor-not-allowed`}
              />
            </div>
          </div>
        </div>

        {/* Start Game Button */}
        <button
          onClick={handleStart}
          className={`w-full py-4 border-2 font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            theme.isDark
              ? 'border-white bg-cyan-400 text-black shadow-[4px_4px_0px_#FFF] hover:bg-cyan-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
              : 'border-black bg-[#FFE600] text-black shadow-[4px_4px_0px_#000] hover:bg-yellow-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>START MATCH</span>
        </button>
      </div>
    </div>
  );
};
