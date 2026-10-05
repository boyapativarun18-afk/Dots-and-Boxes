import React from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, Play, Calendar } from 'lucide-react';
import { DailyChallenge } from '../types/game';
import { THEMES } from '../types/theme';

interface DailyChallengeModalProps {
  challenge: DailyChallenge;
  onBack: () => void;
  onPlayChallenge: (challenge: DailyChallenge) => void;
  themeId?: string;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  challenge,
  onBack,
  onPlayChallenge,
  themeId = 'classic',
}) => {
  const formattedDate = new Date(challenge.dateString + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

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
          DAILY ASSIGNMENT
        </span>
      </div>

      <div className={`p-6 sm:p-8 ${cardBorder} ${cardBg} ${brutalShadow} flex flex-col gap-6`}>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 border-2 border-black bg-amber-300 text-black shadow-[3px_3px_0px_#000] flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold opacity-75">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-['Outfit'] mt-0.5">
              Today's Challenge
            </h2>
          </div>
        </div>

        {/* Challenge Goal Card */}
        <div className={`p-5 border-2 ${theme.isDark ? 'border-neutral-700 bg-[#111318]' : 'border-black bg-neutral-50'} flex flex-col gap-3.5`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-black uppercase">
              MISSION OBJECTIVE
            </span>
            {challenge.completed ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black uppercase px-2 py-0.5 border border-black bg-emerald-400 text-black shadow-[1px_1px_0px_#000]">
                <CheckCircle2 className="w-3 h-3" /> COMPLETED!
              </span>
            ) : (
              <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 border border-black bg-neutral-200 text-black">
                PENDING
              </span>
            )}
          </div>

          <p className="text-base font-black uppercase tracking-tight leading-snug">
            {challenge.description}
          </p>

          <div className={`grid grid-cols-3 gap-2 pt-3 border-t-2 ${theme.isDark ? 'border-neutral-800' : 'border-neutral-200'} text-xs font-mono`}>
            <div>
              <span className="opacity-60 block text-[9px] uppercase">Board Size</span>
              <span className="font-black uppercase">{challenge.boardPreset}</span>
            </div>
            <div>
              <span className="opacity-60 block text-[9px] uppercase">Opponent</span>
              <span className="font-black uppercase">{challenge.difficulty} AI</span>
            </div>
            <div>
              <span className="opacity-60 block text-[9px] uppercase">Target Boxes</span>
              <span className="font-black text-amber-500">{challenge.targetBoxes}+</span>
            </div>
          </div>
        </div>

        {/* Start button or Completed state */}
        <div>
          <button
            onClick={() => onPlayChallenge(challenge)}
            className={`w-full py-4 border-2 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              theme.isDark
                ? 'border-white bg-[#FFE600] text-black shadow-[4px_4px_0px_#FFF] hover:bg-yellow-300'
                : 'border-black bg-[#FFE600] text-black shadow-[4px_4px_0px_#000] hover:bg-yellow-300'
            } active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{challenge.completed ? 'Replay Challenge' : 'Accept Assignment'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
