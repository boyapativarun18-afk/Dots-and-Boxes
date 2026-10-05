import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { audio } from '../audio/audioEngine';
import { THEMES } from '../types/theme';

interface HowToPlayModalProps {
  onBack: () => void;
  themeId?: string;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  onBack,
  themeId = 'classic',
}) => {
  const [demoLines, setDemoLines] = useState<Record<string, boolean>>({
    'H_0_0': true,
    'V_0_0': true,
    'H_1_0': true,
    'V_0_1': false,
  });
  const [demoBoxCaptured, setDemoBoxCaptured] = useState(false);

  const theme = THEMES[themeId as keyof typeof THEMES] || THEMES.classic;
  const cardBorder = theme.isDark ? 'border-2 border-white' : 'border-2 border-black';
  const cardBg = theme.isDark ? 'bg-[#181B22]' : 'bg-white';
  const brutalShadow = theme.isDark ? 'shadow-[5px_5px_0px_#FFF]' : 'shadow-[5px_5px_0px_#000]';
  const brutalShadowSm = theme.isDark ? 'shadow-[2px_2px_0px_#FFF]' : 'shadow-[2px_2px_0px_#000]';
  const textColor = theme.isDark ? 'text-white' : 'text-black';
  const textSub = theme.isDark ? 'text-neutral-300' : 'text-black';

  const handleDemoClick = (key: string) => {
    if (demoLines[key]) return;
    const updated = { ...demoLines, [key]: true };
    setDemoLines(updated);
    audio.playLineSnap(1);

    if (updated['H_0_0'] && updated['V_0_0'] && updated['H_1_0'] && updated['V_0_1']) {
      setDemoBoxCaptured(true);
      audio.playBoxCompleted(1);
      audio.playExtraTurn();
    }
  };

  const resetDemo = () => {
    setDemoLines({
      'H_0_0': true,
      'V_0_0': true,
      'H_1_0': true,
      'V_0_1': false,
    });
    setDemoBoxCaptured(false);
  };

  const steps = [
    {
      num: '[01]',
      title: 'CONNECT TWO DOTS',
      desc: 'Take turns drawing a single horizontal or vertical line between adjacent grid points.',
    },
    {
      num: '[02]',
      title: 'COMPLETE FOURTH SIDE',
      desc: 'Drawing the fourth side around any 1×1 square claims the box as your territory.',
    },
    {
      num: '[03]',
      title: 'RECEIVE EXTRA TURN',
      desc: 'Every completed square immediately awards you +1 point and an additional move.',
    },
    {
      num: '[04]',
      title: 'CHAIN REACTIONS',
      desc: 'Connect sequences of 2-sided boxes to sweep entire rows in a single relentless combo.',
    },
    {
      num: '[05]',
      title: 'CONQUER THE GRID',
      desc: 'When the grid is full, the tactician with the highest box count claims victory.',
    },
  ];

  return (
    <div className={`w-full max-w-2xl mx-auto px-4 py-6 sm:py-8 flex flex-col gap-6 ${textColor}`}>
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 px-3 py-1.5 ${cardBorder} ${cardBg} ${brutalShadowSm} ${textColor} text-xs font-black uppercase transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px]`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className={`text-xs font-mono font-black uppercase tracking-wider ${textColor}`}>
          TACTICAL MANUAL
        </span>
      </div>

      <div className={`p-6 sm:p-8 ${cardBorder} ${cardBg} ${brutalShadow} flex flex-col gap-6`}>
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight font-['Outfit']">
            How to Play Dots &amp; Boxes
          </h2>
          <p className="text-xs opacity-75 mt-1 font-mono">
            Zero ambiguity. Pure spatial geometry and timing control.
          </p>
        </div>

        {/* Interactive Try-it Demo */}
        <div className={`p-4 sm:p-5 border-2 ${theme.isDark ? 'border-white bg-[#0F1117]' : 'border-black bg-neutral-50'} flex flex-col items-center`}>
          <div className="flex items-center justify-between w-full mb-3">
            <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Testbed
            </span>
            <button
              onClick={resetDemo}
              className="text-[11px] font-mono font-bold uppercase underline hover:opacity-75 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          <p className="text-xs font-mono text-center mb-4">
            {demoBoxCaptured
              ? '■ BOX CAPTURED! POINT SECURED + BONUS TURN AWARDED'
              : 'CLICK THE DASHED LINE TO COMPLETE THE SQUARE:'}
          </p>

          {/* SVG Mini Box */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-full h-full">
              {/* Box Fill */}
              {demoBoxCaptured && (
                <rect
                  x="30"
                  y="30"
                  width="100"
                  height="100"
                  fill="rgba(29, 78, 216, 0.25)"
                  stroke="#1d4ed8"
                  strokeWidth="2"
                  className="animate-scale-in"
                />
              )}
              {demoBoxCaptured && (
                <text
                  x="80"
                  y="82"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#1d4ed8"
                  fontSize="20"
                  fontWeight="900"
                  fontFamily="Outfit"
                >
                  YOU
                </text>
              )}

              {/* Top line */}
              <line x1="30" y1="30" x2="130" y2="30" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="square" />
              {/* Left line */}
              <line x1="30" y1="30" x2="30" y2="130" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="square" />
              {/* Bottom line */}
              <line x1="30" y1="130" x2="130" y2="130" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="square" />

              {/* Right line - interactive */}
              <line
                x1="130"
                y1="30"
                x2="130"
                y2="130"
                stroke={demoLines['V_0_1'] ? '#1d4ed8' : '#f59e0b'}
                strokeWidth={demoLines['V_0_1'] ? 6 : 4}
                strokeLinecap="square"
                strokeDasharray={demoLines['V_0_1'] ? undefined : '5 5'}
                className={demoLines['V_0_1'] ? '' : 'cursor-pointer'}
                onClick={() => handleDemoClick('V_0_1')}
              />
              {!demoLines['V_0_1'] && (
                <line
                  x1="130"
                  y1="30"
                  x2="130"
                  y2="130"
                  stroke="transparent"
                  strokeWidth="34"
                  className="cursor-pointer"
                  onClick={() => handleDemoClick('V_0_1')}
                />
              )}

              {/* 4 Corner Dots */}
              <circle cx="30" cy="30" r="6" fill="#000" stroke="#000" strokeWidth="2" />
              <circle cx="130" cy="30" r="6" fill="#000" stroke="#000" strokeWidth="2" />
              <circle cx="30" cy="130" r="6" fill="#000" stroke="#000" strokeWidth="2" />
              <circle cx="130" cy="130" r="6" fill="#000" stroke="#000" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Step-by-step rules */}
        <div className="flex flex-col gap-2.5">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`p-3.5 border-2 ${theme.isDark ? 'border-neutral-700 bg-[#111318]' : 'border-black bg-white'} flex items-start gap-3`}
            >
              <span className="font-mono text-xs font-black px-1.5 py-0.5 border border-black bg-neutral-100 text-black shrink-0 mt-0.5">
                {s.num}
              </span>
              <div>
                <h4 className="text-xs font-black uppercase">{s.title}</h4>
                <p className="text-xs opacity-75 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tip */}
        <div className="p-4 border-2 border-black bg-amber-200 text-black flex items-start gap-3 shadow-[2px_2px_0px_#000]">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong className="block font-black uppercase mb-0.5">Grandmaster Axiom:</strong>
            Never place the 3rd line of a box unless forced. Drawing a 3rd line gifts an immediate 4th line capture to your rival. Keep boxes at 0 or 1 edge whenever possible.
          </div>
        </div>
      </div>
    </div>
  );
};
