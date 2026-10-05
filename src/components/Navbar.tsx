import React from 'react';
import { Volume2, VolumeX, Settings, Sparkles } from 'lucide-react';
import { ScreenState } from '../types/game';
import { THEMES } from '../types/theme';

interface NavbarProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  hasActiveGame: boolean;
  themeId?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onOpenSettings,
  soundEnabled,
  onToggleSound,
  hasActiveGame,
  themeId = 'classic',
}) => {
  const theme = THEMES[themeId as keyof typeof THEMES] || THEMES.classic;

  return (
    <header
      className={`w-full border-b-2 ${
        theme.isDark ? 'border-white bg-[#111318]' : 'border-black bg-white'
      } sticky top-0 z-40`}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('menu')}
          className="text-left group flex items-center gap-2.5 cursor-pointer focus-visible:outline-none"
        >
          <div
            className={`w-3.5 h-3.5 border-2 ${
              theme.isDark ? 'border-white bg-cyan-400' : 'border-black bg-blue-600'
            }`}
          />
          <span
            className={`text-base sm:text-lg font-black tracking-tight font-['Outfit'] uppercase ${
              theme.isDark ? 'text-white' : 'text-black'
            }`}
          >
            DOTS &amp; BOXES
          </span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => onNavigate(hasActiveGame ? 'playing' : 'setup')}
            className={`px-3 py-1.5 border-2 transition-all cursor-pointer whitespace-nowrap ${
              currentScreen === 'playing' || currentScreen === 'setup'
                ? theme.isDark
                  ? 'bg-white text-black border-white shadow-[2px_2px_0px_#06b6d4]'
                  : 'bg-black text-white border-black shadow-[2px_2px_0px_#1d4ed8]'
                : `border-transparent hover:border-current ${
                    theme.isDark ? 'text-neutral-300' : 'text-black'
                  }`
            }`}
          >
            {hasActiveGame ? 'Active Match' : 'Play'}
          </button>

          <button
            onClick={() => onNavigate('daily')}
            className={`px-3 py-1.5 border-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              currentScreen === 'daily'
                ? theme.isDark
                  ? 'bg-amber-400 text-black border-white shadow-[2px_2px_0px_#FFF]'
                  : 'bg-amber-300 text-black border-black shadow-[2px_2px_0px_#000]'
                : `border-transparent hover:border-current ${
                    theme.isDark ? 'text-neutral-300' : 'text-black'
                  }`
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily</span>
          </button>

          <button
            onClick={() => onNavigate('how-to-play')}
            className={`px-3 py-1.5 border-2 transition-all cursor-pointer whitespace-nowrap ${
              currentScreen === 'how-to-play'
                ? theme.isDark
                  ? 'bg-white text-black border-white shadow-[2px_2px_0px_#06b6d4]'
                  : 'bg-black text-white border-black shadow-[2px_2px_0px_#1d4ed8]'
                : `border-transparent hover:border-current ${
                    theme.isDark ? 'text-neutral-300' : 'text-black'
                  }`
            }`}
          >
            How to Play
          </button>

          <button
            onClick={() => onNavigate('stats')}
            className={`px-3 py-1.5 border-2 transition-all cursor-pointer whitespace-nowrap ${
              currentScreen === 'stats'
                ? theme.isDark
                  ? 'bg-white text-black border-white shadow-[2px_2px_0px_#06b6d4]'
                  : 'bg-black text-white border-black shadow-[2px_2px_0px_#1d4ed8]'
                : `border-transparent hover:border-current ${
                    theme.isDark ? 'text-neutral-300' : 'text-black'
                  }`
            }`}
          >
            Statistics
          </button>

          <button
            onClick={() => onNavigate('achievements')}
            className={`px-3 py-1.5 border-2 transition-all cursor-pointer whitespace-nowrap ${
              currentScreen === 'achievements'
                ? theme.isDark
                  ? 'bg-white text-black border-white shadow-[2px_2px_0px_#06b6d4]'
                  : 'bg-black text-white border-black shadow-[2px_2px_0px_#1d4ed8]'
                : `border-transparent hover:border-current ${
                    theme.isDark ? 'text-neutral-300' : 'text-black'
                  }`
            }`}
          >
            Badges
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute audio' : 'Unmute audio'}
            aria-label={soundEnabled ? 'Mute audio' : 'Unmute audio'}
            className={`w-9 h-9 border-2 flex items-center justify-center transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px] ${
              theme.isDark
                ? 'border-white bg-[#181B22] text-white shadow-[2px_2px_0px_#FFF] hover:bg-neutral-800'
                : 'border-black bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-neutral-100'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-40" />}
          </button>

          <button
            onClick={onOpenSettings}
            title="Game Settings"
            aria-label="Game Settings"
            className={`w-9 h-9 border-2 flex items-center justify-center transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px] ${
              theme.isDark
                ? 'border-white bg-[#181B22] text-white shadow-[2px_2px_0px_#FFF] hover:bg-neutral-800'
                : 'border-black bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-neutral-100'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
