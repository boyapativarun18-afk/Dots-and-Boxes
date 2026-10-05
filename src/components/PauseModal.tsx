import React, { useState } from 'react';
import { Play, RotateCcw, Settings, BookOpen, LogOut, AlertTriangle } from 'lucide-react';
import { THEMES } from '../types/theme';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
  onQuitToMenu: () => void;
  themeId?: string;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onOpenSettings,
  onOpenHowToPlay,
  onQuitToMenu,
  themeId = 'classic',
}) => {
  const [confirmQuit, setConfirmQuit] = useState(false);

  if (!isOpen) return null;

  const theme = THEMES[themeId as keyof typeof THEMES] || THEMES.classic;
  const modalBorder = theme.isDark ? 'border-2 border-white' : 'border-2 border-black';
  const modalBg = theme.isDark ? 'bg-[#181B22]' : 'bg-white';
  const brutalShadow = theme.isDark ? 'shadow-[6px_6px_0px_#FFF]' : 'shadow-[6px_6px_0px_#000]';
  const brutalShadowSm = theme.isDark ? 'shadow-[2px_2px_0px_#FFF]' : 'shadow-[2px_2px_0px_#000]';
  const textColor = theme.isDark ? 'text-white' : 'text-black';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={`w-full max-w-sm ${modalBorder} ${modalBg} ${brutalShadow} ${textColor} p-6 flex flex-col gap-4 text-center`}
      >
        {!confirmQuit ? (
          <>
            <div>
              <div className="font-mono text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
                // SYSTEM STATE //
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight font-['Outfit']">
                PAUSED
              </h2>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={onResume}
                className={`w-full py-3 px-4 border-2 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  theme.isDark
                    ? 'border-white bg-white text-black shadow-[3px_3px_0px_#06b6d4] hover:bg-neutral-200'
                    : 'border-black bg-black text-white shadow-[3px_3px_0px_#1d4ed8] hover:bg-neutral-800'
                } active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Game</span>
              </button>

              <button
                onClick={onRestart}
                className={`w-full py-2.5 px-4 ${modalBorder} ${modalBg} ${brutalShadowSm} font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart Board</span>
              </button>

              <button
                onClick={onOpenSettings}
                className={`w-full py-2.5 px-4 ${modalBorder} ${modalBg} ${brutalShadowSm} font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>

              <button
                onClick={onOpenHowToPlay}
                className={`w-full py-2.5 px-4 ${modalBorder} ${modalBg} ${brutalShadowSm} font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
              >
                <BookOpen className="w-4 h-4" />
                <span>How to Play</span>
              </button>

              <button
                onClick={() => setConfirmQuit(true)}
                className="w-full py-2 px-4 text-rose-600 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1 hover:underline"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Quit to Main Menu</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4 py-2">
            <div className="w-12 h-12 border-2 border-black bg-amber-400 text-black shadow-[3px_3px_0px_#000] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-black uppercase">Abandon Match?</h3>
              <p className="text-xs opacity-70 mt-1 max-w-xs mx-auto font-mono">
                Current grid progress will not be saved. Return to menu?
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={onQuitToMenu}
                className="w-full py-3 px-4 border-2 border-black bg-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
              >
                Yes, Quit to Menu
              </button>

              <button
                onClick={() => setConfirmQuit(false)}
                className={`w-full py-2.5 px-4 ${modalBorder} ${modalBg} font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000] cursor-pointer`}
              >
                Keep Playing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
