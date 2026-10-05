import React from 'react';
import { Bot, Users, Trophy, BookOpen, Settings, Sparkles, Award } from 'lucide-react';
import { ScreenState } from '../types/game';
import { THEMES } from '../types/theme';

interface MainMenuProps {
  onStartVsAI: () => void;
  onStart2P: () => void;
  onNavigate: (screen: ScreenState) => void;
  onOpenSettings: () => void;
  dailyCompleted: boolean;
  unlockedAchievementsCount: number;
  themeId?: string;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartVsAI,
  onStart2P,
  onNavigate,
  onOpenSettings,
  dailyCompleted,
  unlockedAchievementsCount,
  themeId = 'classic',
}) => {
  const theme = THEMES[themeId as keyof typeof THEMES] || THEMES.classic;

  const cardBorder = theme.isDark ? 'border-2 border-white' : 'border-2 border-black';
  const cardBg = theme.isDark ? 'bg-[#181B22]' : 'bg-white';
  const brutalShadowLg = theme.isDark ? 'shadow-[5px_5px_0px_#FFF]' : 'shadow-[5px_5px_0px_#000]';
  const brutalShadowSm = theme.isDark ? 'shadow-[3px_3px_0px_#FFF]' : 'shadow-[3px_3px_0px_#000]';
  const textColor = theme.isDark ? 'text-white' : 'text-black';
  const textSub = theme.isDark ? 'text-neutral-300' : 'text-black';

  return (
    <div className={`w-full max-w-xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center ${textColor}`}>
      {/* Title & Brand Lockup */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-1.5 mb-3 font-mono text-[11px] font-black tracking-widest uppercase ${textColor}`}>
          <span>CONNECT</span>
          <span>·</span>
          <span>COMPLETE</span>
          <span>·</span>
          <span>CONQUER</span>
        </div>

        <h1 className={`text-4xl sm:text-6xl font-black tracking-tighter uppercase font-['Outfit'] leading-none ${textColor}`}>
          DOTS &amp; BOXES
        </h1>

        <p className={`mt-3 text-xs sm:text-sm font-semibold max-w-md mx-auto leading-relaxed ${textSub}`}>
          Tactical grid game with strategic game-theory AI, local pass &amp; play, and daily challenges.
        </p>
      </div>

      {/* Main Action Cards - Clean Brutalism */}
      <div className="w-full flex flex-col gap-3.5">
        {/* Play vs AI */}
        <button
          onClick={onStartVsAI}
          className={`w-full group p-4 sm:p-5 ${cardBorder} ${cardBg} ${brutalShadowLg} hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100 text-left flex items-center justify-between cursor-pointer`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 border-2 ${theme.isDark ? 'border-white bg-cyan-950 text-cyan-400' : 'border-black bg-blue-100 text-blue-900'} flex items-center justify-center font-black`}>
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className={`text-base sm:text-lg font-black uppercase tracking-tight ${textColor}`}>
                Play vs AI
              </div>
              <div className={`text-xs font-mono font-medium mt-0.5 ${textSub}`}>
                Easy, Medium, Hard, or Expert Bot
              </div>
            </div>
          </div>
          <span className={`text-xl font-black font-mono group-hover:translate-x-1 transition-transform ${textColor}`}>
            →
          </span>
        </button>

        {/* Two Player Hotseat */}
        <button
          onClick={onStart2P}
          className={`w-full group p-4 sm:p-5 ${cardBorder} ${cardBg} ${brutalShadowLg} hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100 text-left flex items-center justify-between cursor-pointer`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 border-2 ${theme.isDark ? 'border-white bg-rose-950 text-rose-400' : 'border-black bg-rose-100 text-rose-900'} flex items-center justify-center font-black`}>
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className={`text-base sm:text-lg font-black uppercase tracking-tight ${textColor}`}>
                Two Player (Local)
              </div>
              <div className={`text-xs font-mono font-medium mt-0.5 ${textSub}`}>
                Pass &amp; play on one device with custom names
              </div>
            </div>
          </div>
          <span className={`text-xl font-black font-mono group-hover:translate-x-1 transition-transform ${textColor}`}>
            →
          </span>
        </button>

        {/* Daily Challenge */}
        <button
          onClick={() => onNavigate('daily')}
          className={`w-full group p-4 sm:p-5 ${cardBorder} ${cardBg} ${brutalShadowLg} hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100 text-left flex items-center justify-between cursor-pointer`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 border-2 ${theme.isDark ? 'border-white bg-amber-950 text-amber-400' : 'border-black bg-amber-100 text-amber-900'} flex items-center justify-center font-black`}>
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-base sm:text-lg font-black uppercase tracking-tight ${textColor}`}>
                  Daily Challenge
                </span>
                {dailyCompleted && (
                  <span className="text-[10px] font-black font-mono uppercase px-1.5 py-0.5 bg-emerald-400 text-black border border-black">
                    COMPLETED ✓
                  </span>
                )}
              </div>
              <div className={`text-xs font-mono font-medium mt-0.5 ${textSub}`}>
                Unique tactical puzzle generated each day
              </div>
            </div>
          </div>
          <span className={`text-xl font-black font-mono group-hover:translate-x-1 transition-transform ${textColor}`}>
            →
          </span>
        </button>
      </div>

      {/* Secondary Menu Links Grid */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
        <button
          onClick={() => onNavigate('how-to-play')}
          className={`p-3.5 ${cardBorder} ${cardBg} ${brutalShadowSm} hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-left flex flex-col gap-1 cursor-pointer`}
        >
          <BookOpen className={`w-4 h-4 ${textColor}`} />
          <div className={`text-xs font-black uppercase tracking-tight mt-1 ${textColor}`}>Rules</div>
          <div className={`text-[10px] font-mono font-medium ${textSub}`}>Sandbox Demo</div>
        </button>

        <button
          onClick={() => onNavigate('stats')}
          className={`p-3.5 ${cardBorder} ${cardBg} ${brutalShadowSm} hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-left flex flex-col gap-1 cursor-pointer`}
        >
          <Trophy className={`w-4 h-4 ${textColor}`} />
          <div className={`text-xs font-black uppercase tracking-tight mt-1 ${textColor}`}>Records</div>
          <div className={`text-[10px] font-mono font-medium ${textSub}`}>Win Rates &amp; Best</div>
        </button>

        <button
          onClick={() => onNavigate('achievements')}
          className={`p-3.5 ${cardBorder} ${cardBg} ${brutalShadowSm} hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-left flex flex-col gap-1 cursor-pointer`}
        >
          <Award className={`w-4 h-4 ${textColor}`} />
          <div className={`text-xs font-black uppercase tracking-tight mt-1 ${textColor}`}>Badges</div>
          <div className={`text-[10px] font-mono font-medium ${textSub}`}>{unlockedAchievementsCount} / 8 Earned</div>
        </button>

        <button
          onClick={onOpenSettings}
          className={`p-3.5 ${cardBorder} ${cardBg} ${brutalShadowSm} hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-left flex flex-col gap-1 cursor-pointer`}
        >
          <Settings className={`w-4 h-4 ${textColor}`} />
          <div className={`text-xs font-black uppercase tracking-tight mt-1 ${textColor}`}>Config</div>
          <div className={`text-[10px] font-mono font-medium ${textSub}`}>Theme &amp; Audio</div>
        </button>
      </div>
    </div>
  );
};
