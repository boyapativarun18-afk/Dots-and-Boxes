import React, { useState } from 'react';
import { ArrowLeft, Check, RotateCcw } from 'lucide-react';
import { Achievement } from '../types/game';
import { THEMES } from '../types/theme';

interface AchievementsModalProps {
  achievements: Achievement[];
  onBack: () => void;
  onAchievementsReset?: () => void;
  themeId?: string;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  onBack,
  onAchievementsReset,
  themeId = 'classic',
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  const theme = THEMES[themeId as keyof typeof THEMES] || THEMES.classic;
  const cardBorder = theme.isDark ? 'border-2 border-white' : 'border-2 border-black';
  const cardBg = theme.isDark ? 'bg-[#181B22]' : 'bg-white';
  const brutalShadow = theme.isDark ? 'shadow-[5px_5px_0px_#FFF]' : 'shadow-[5px_5px_0px_#000]';
  const brutalShadowSm = theme.isDark ? 'shadow-[2px_2px_0px_#FFF]' : 'shadow-[2px_2px_0px_#000]';
  const textColor = theme.isDark ? 'text-white' : 'text-black';

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
          BADGES &amp; HONORS
        </span>
      </div>

      <div className={`p-6 sm:p-8 ${cardBorder} ${cardBg} ${brutalShadow} flex flex-col gap-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight font-['Outfit']">
              Achievements
            </h2>
            <p className="text-xs opacity-75 mt-1 font-mono">
              Tactical milestones across bot matches and grid sweeps.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-mono tabular-nums">
              {unlockedCount} / {achievements.length}
            </span>
            <span className="text-[10px] font-mono font-black uppercase block opacity-60">
              UNLOCKED
            </span>
          </div>
        </div>

        {/* Achievement List */}
        <div className="flex flex-col gap-2.5">
          {achievements.map((ach) => {
            const isUnlocked = !!ach.unlockedAt;
            return (
              <div
                key={ach.id}
                className={`p-3.5 border-2 transition-all flex items-center gap-3.5 ${
                  isUnlocked
                    ? theme.isDark
                      ? 'border-white bg-[#111318] shadow-[2px_2px_0px_#FFF]'
                      : 'border-black bg-neutral-50 shadow-[2px_2px_0px_#000]'
                    : 'border-neutral-400 bg-transparent opacity-60'
                }`}
              >
                <div
                  className={`w-11 h-11 border-2 border-black flex items-center justify-center text-xl shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-300 text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-neutral-300 text-neutral-600'
                  }`}
                >
                  {ach.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-black uppercase truncate">
                      {ach.title}
                    </h4>
                    {isUnlocked && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-black uppercase px-1.5 py-0.5 border border-black bg-emerald-400 text-black">
                        <Check className="w-2.5 h-2.5" /> EARNED
                      </span>
                    )}
                  </div>
                  <p className="text-xs opacity-80 mt-0.5 leading-tight font-mono">{ach.description}</p>

                  {/* Date unlocked */}
                  {isUnlocked && ach.unlockedAt && (
                    <span className="text-[9px] font-mono opacity-60 mt-1 block">
                      Unlocked on {new Date(ach.unlockedAt).toLocaleDateString()}
                    </span>
                  )}

                  {/* Progress bar if present and locked */}
                  {ach.maxProgress && !isUnlocked && (
                    <div className="mt-2 w-full max-w-[220px]">
                      <div className="flex items-center justify-between text-[9px] font-mono font-black uppercase mb-0.5">
                        <span>Streak Target</span>
                        <span>{ach.progress || 0} / {ach.maxProgress}</span>
                      </div>
                      <div className="w-full h-2 border border-black bg-neutral-200 overflow-hidden">
                        <div
                          className="h-full bg-black transition-all"
                          style={{
                            width: `${Math.round(((ach.progress || 0) / ach.maxProgress) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset Badges Option if supported */}
        {onAchievementsReset && (
          <div className="pt-2 border-t-2 border-current">
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="text-xs font-mono font-bold uppercase opacity-60 hover:opacity-100 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all achievement badges</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-rose-600">RESET ALL BADGES?</span>
                <button
                  onClick={() => {
                    onAchievementsReset();
                    setConfirmReset(false);
                  }}
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
        )}
      </div>
    </div>
  );
};
