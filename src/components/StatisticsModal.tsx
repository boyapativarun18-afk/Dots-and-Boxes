import React, { useState } from 'react';
import { ArrowLeft, Flame, Percent, Boxes, RotateCcw } from 'lucide-react';
import { GameStatistics } from '../types/game';
import { DEFAULT_STATS, StorageManager } from '../storage/storageManager';
import { THEMES } from '../types/theme';

interface StatisticsModalProps {
  onBack: () => void;
  stats: GameStatistics;
  onStatsUpdated: (stats: GameStatistics) => void;
  themeId?: string;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({
  onBack,
  stats,
  onStatsUpdated,
  themeId = 'classic',
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const theme = THEMES[themeId as keyof typeof THEMES] || THEMES.classic;
  const cardBorder = theme.isDark ? 'border-2 border-white' : 'border-2 border-black';
  const cardBg = theme.isDark ? 'bg-[#181B22]' : 'bg-white';
  const brutalShadow = theme.isDark ? 'shadow-[5px_5px_0px_#FFF]' : 'shadow-[5px_5px_0px_#000]';
  const brutalShadowSm = theme.isDark ? 'shadow-[2px_2px_0px_#FFF]' : 'shadow-[2px_2px_0px_#000]';
  const textColor = theme.isDark ? 'text-white' : 'text-black';

  const totalDecided = stats.gamesWon + stats.gamesLost;
  const winRate = totalDecided > 0 ? Math.round((stats.gamesWon / totalDecided) * 100) : 0;

  const handleReset = () => {
    StorageManager.saveStats(DEFAULT_STATS);
    onStatsUpdated(DEFAULT_STATS);
    setConfirmReset(false);
  };

  return (
    <div className={`w-full max-w-xl mx-auto px-4 py-6 sm:py-8 flex flex-col gap-6 ${textColor}`}>
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 px-3 py-1.5 ${cardBorder} ${cardBg} ${brutalShadowSm} ${textColor} text-xs font-black uppercase transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px]`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className={`text-xs font-mono font-black uppercase tracking-wider ${textColor}`}>
          TACTICAL RECORDS
        </span>
      </div>

      <div className={`p-6 sm:p-8 ${cardBorder} ${cardBg} ${brutalShadow} flex flex-col gap-6`}>
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight font-['Outfit']">
            Statistics &amp; Records
          </h2>
          <p className="text-xs opacity-75 mt-1 font-mono">
            Historical win-rates, streaks, and grid domination telemetry.
          </p>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className={`p-3.5 border-2 ${theme.isDark ? 'border-neutral-700 bg-[#111318]' : 'border-black bg-neutral-50'} flex flex-col`}>
            <span className="text-[10px] font-mono font-black uppercase opacity-60">Played</span>
            <span className="text-2xl sm:text-3xl font-black font-mono mt-1 tabular-nums">
              {stats.gamesPlayed}
            </span>
            <span className="text-[10px] opacity-60 font-mono mt-0.5">Total matches</span>
          </div>

          <div className={`p-3.5 border-2 ${theme.isDark ? 'border-neutral-700 bg-[#111318]' : 'border-black bg-neutral-50'} flex flex-col`}>
            <span className="text-[10px] font-mono font-black uppercase text-emerald-600 flex items-center gap-1">
              <Percent className="w-3 h-3" /> Win Rate
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 mt-1 tabular-nums">
              {winRate}%
            </span>
            <span className="text-[10px] opacity-60 font-mono mt-0.5">{stats.gamesWon} wins</span>
          </div>

          <div className={`p-3.5 border-2 ${theme.isDark ? 'border-neutral-700 bg-[#111318]' : 'border-black bg-neutral-50'} flex flex-col`}>
            <span className="text-[10px] font-mono font-black uppercase text-amber-600 flex items-center gap-1">
              <Flame className="w-3 h-3" /> Streak
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-600 mt-1 tabular-nums">
              {stats.currentStreak}
            </span>
            <span className="text-[10px] opacity-60 font-mono mt-0.5">Best: {stats.longestStreak}</span>
          </div>

          <div className={`p-3.5 border-2 ${theme.isDark ? 'border-neutral-700 bg-[#111318]' : 'border-black bg-neutral-50'} flex flex-col`}>
            <span className="text-[10px] font-mono font-black uppercase text-blue-600 flex items-center gap-1">
              <Boxes className="w-3 h-3" /> Boxes
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-blue-600 mt-1 tabular-nums">
              {stats.totalBoxesCaptured}
            </span>
            <span className="text-[10px] opacity-60 font-mono mt-0.5">High: {stats.bestScore}</span>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className={`border-2 ${theme.isDark ? 'border-neutral-700 bg-[#111318]' : 'border-black bg-white'} overflow-hidden`}>
          <div className={`px-4 py-2.5 border-b-2 ${theme.isDark ? 'border-neutral-700 bg-[#181B22]' : 'border-black bg-neutral-100'} flex items-center justify-between text-xs font-mono font-black uppercase tracking-wider`}>
            <span>AI DIFFICULTY</span>
            <div className="flex gap-6 text-right tabular-nums">
              <span>W</span>
              <span>L</span>
              <span>RATE</span>
            </div>
          </div>

          {(['easy', 'medium', 'hard', 'expert'] as const).map((diff) => {
            const data = stats.byDifficulty[diff];
            const rate = data.played > 0 ? Math.round((data.won / data.played) * 100) : 0;
            return (
              <div
                key={diff}
                className={`px-4 py-2.5 border-b last:border-b-0 ${theme.isDark ? 'border-neutral-800' : 'border-neutral-200'} flex items-center justify-between text-xs`}
              >
                <span className="font-mono font-bold uppercase">{diff}</span>
                <div className="flex gap-6 text-right font-mono tabular-nums font-bold">
                  <span className="text-emerald-600 w-4">{data.won}</span>
                  <span className="text-rose-600 w-4">{data.lost}</span>
                  <span className="w-10 opacity-70">{data.played > 0 ? `${rate}%` : '—'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className={`p-3 border-2 ${theme.isDark ? 'border-neutral-700' : 'border-black'} flex items-center justify-between`}>
            <span className="opacity-75 uppercase">2P Matches</span>
            <span className="font-bold tabular-nums">{stats.pvpGamesPlayed}</span>
          </div>
          <div className={`p-3 border-2 ${theme.isDark ? 'border-neutral-700' : 'border-black'} flex items-center justify-between`}>
            <span className="opacity-75 uppercase">Daily Done</span>
            <span className="font-bold text-amber-500 tabular-nums">{stats.dailyChallengesCompleted}</span>
          </div>
        </div>

        {/* Reset Stats */}
        <div className="pt-2 border-t-2 border-current">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="text-xs font-mono font-bold uppercase opacity-60 hover:opacity-100 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset all statistics</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-rose-600">CONFIRM RESET?</span>
              <button
                onClick={handleReset}
                className="px-3 py-1 border-2 border-black bg-rose-600 text-white text-xs font-black uppercase cursor-pointer shadow-[2px_2px_0px_#000]"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1 border-2 border-black bg-neutral-200 text-black text-xs font-bold uppercase cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
