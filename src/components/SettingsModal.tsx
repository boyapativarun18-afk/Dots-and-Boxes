import React from 'react';
import { X, Volume2, VolumeX, Music, Palette, Check } from 'lucide-react';
import { GameSettings, ThemeId } from '../types/game';
import { THEMES } from '../types/theme';

interface SettingsModalProps {
  isOpen: boolean;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onClose,
}) => {
  if (!isOpen) return null;

  const currentTheme = THEMES[settings.theme] || THEMES.classic;
  const cardBorder = currentTheme.isDark ? 'border-2 border-white' : 'border-2 border-black';
  const cardBg = currentTheme.isDark ? 'bg-[#181B22]' : 'bg-white';
  const brutalShadow = currentTheme.isDark ? 'shadow-[6px_6px_0px_#FFF]' : 'shadow-[6px_6px_0px_#000]';
  const textColor = currentTheme.isDark ? 'text-white' : 'text-black';

  const update = <K extends keyof GameSettings>(key: K, val: GameSettings[K]) => {
    onUpdateSettings({ ...settings, [key]: val });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={`w-full max-w-lg ${cardBorder} ${cardBg} ${brutalShadow} ${textColor} p-6 sm:p-7 flex flex-col gap-6 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between border-b-2 border-current pb-3">
          <div>
            <span className="font-mono text-[10px] font-black uppercase tracking-widest opacity-60">
              // PREFERENCES //
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight font-['Outfit']">
              Game Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 border-2 ${currentTheme.isDark ? 'border-white' : 'border-black'} flex items-center justify-center transition-colors cursor-pointer hover:bg-neutral-200 hover:text-black`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section: Themes */}
        <div>
          <label className="text-xs font-mono font-black uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" /> [01] AESTHETIC PALETTE
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
              const theme = THEMES[tId];
              const isSelected = settings.theme === tId;
              return (
                <button
                  key={tId}
                  onClick={() => update('theme', tId)}
                  className={`p-3 border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? currentTheme.isDark
                        ? 'border-white bg-white text-black shadow-[3px_3px_0px_#06b6d4]'
                        : 'border-black bg-black text-white shadow-[3px_3px_0px_#1d4ed8]'
                      : `${cardBorder} ${cardBg} opacity-75 hover:opacity-100`
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Swatches */}
                    <div className="flex -space-x-1">
                      <span
                        className="w-4 h-4 border border-black"
                        style={{ backgroundColor: theme.player1.lineColor }}
                      />
                      <span
                        className="w-4 h-4 border border-black"
                        style={{ backgroundColor: theme.player2.lineColor }}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase">{theme.name}</div>
                      <div className="text-[10px] font-mono opacity-70 line-clamp-1">{theme.subtitle}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Audio */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" /> [02] AUDIO SYNTHESIZER
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => update('soundEnabled', !settings.soundEnabled)}
              className={`p-3 border-2 flex items-center justify-between cursor-pointer transition-all ${
                settings.soundEnabled
                  ? currentTheme.isDark
                    ? 'border-white bg-neutral-800 shadow-[2px_2px_0px_#FFF]'
                    : 'border-black bg-neutral-100 shadow-[2px_2px_0px_#000]'
                  : 'border-neutral-400 opacity-40'
              }`}
            >
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4 opacity-40" />
                )}
                <span className="text-xs font-black uppercase">SFX</span>
              </div>
              <span className="text-[10px] font-mono font-black uppercase">
                {settings.soundEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              onClick={() => update('musicEnabled', !settings.musicEnabled)}
              className={`p-3 border-2 flex items-center justify-between cursor-pointer transition-all ${
                settings.musicEnabled
                  ? currentTheme.isDark
                    ? 'border-white bg-neutral-800 shadow-[2px_2px_0px_#FFF]'
                    : 'border-black bg-neutral-100 shadow-[2px_2px_0px_#000]'
                  : 'border-neutral-400 opacity-40'
              }`}
            >
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                <span className="text-xs font-black uppercase">Synth Ambient</span>
              </div>
              <span className="text-[10px] font-mono font-black uppercase">
                {settings.musicEnabled ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-mono font-bold mb-1 opacity-75">
              <span>MASTER GAIN</span>
              <span className="tabular-nums">
                {Math.round(settings.masterVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.masterVolume}
              onChange={(e) => update('masterVolume', parseFloat(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>
        </div>

        {/* Section: Gameplay & Accessibility */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-mono font-black uppercase tracking-wider">
            [03] GAMEPLAY CONTROLS
          </label>

          <div className={`flex items-center justify-between p-3 border-2 ${currentTheme.isDark ? 'border-neutral-700' : 'border-black'}`}>
            <div>
              <div className="text-xs font-black uppercase">Move Rewind (Undo)</div>
              <div className="text-[11px] font-mono opacity-70">Permit move cancellation during matches</div>
            </div>
            <button
              onClick={() => update('undoEnabled', !settings.undoEnabled)}
              className={`w-12 h-6 border-2 border-black transition-colors relative cursor-pointer ${
                settings.undoEnabled ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white border border-black transition-transform ${
                  settings.undoEnabled ? 'left-6' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className={`flex items-center justify-between p-3 border-2 ${currentTheme.isDark ? 'border-neutral-700' : 'border-black'}`}>
            <div>
              <div className="text-xs font-black uppercase">Reduced Motion</div>
              <div className="text-[11px] font-mono opacity-70">Disable scale springs and board ripple</div>
            </div>
            <button
              onClick={() => update('reducedMotion', !settings.reducedMotion)}
              className={`w-12 h-6 border-2 border-black transition-colors relative cursor-pointer ${
                settings.reducedMotion ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white border border-black transition-transform ${
                  settings.reducedMotion ? 'left-6' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`w-full py-3.5 border-2 font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
            currentTheme.isDark
              ? 'border-white bg-white text-black shadow-[3px_3px_0px_#FFF] hover:bg-neutral-200'
              : 'border-black bg-black text-white shadow-[3px_3px_0px_#000] hover:bg-neutral-800'
          } active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
        >
          CONFIRM &amp; CLOSE
        </button>
      </div>
    </div>
  );
};
