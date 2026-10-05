import { ThemeId } from './game';

export interface ThemeColors {
  id: ThemeId;
  name: string;
  subtitle: string;
  bgGradient: string;
  boardBg: string;
  boardBorder: string;
  dotFill: string;
  dotBorder: string;
  lineIdle: string;
  lineHover: string;
  player1: {
    name: string;
    lineColor: string;
    boxFill: string;
    textColor: string;
    badgeBg: string;
    border: string;
    shadow: string;
    accentHex: string;
  };
  player2: {
    name: string;
    lineColor: string;
    boxFill: string;
    textColor: string;
    badgeBg: string;
    border: string;
    shadow: string;
    accentHex: string;
  };
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  surfaceBorder: string;
  brutalShadow: string;
  isDark: boolean;
}

export const THEMES: Record<ThemeId, ThemeColors> = {
  classic: {
    id: 'classic',
    name: 'Bauhaus Studio',
    subtitle: 'Warm architectural cream & cobalt/vermilion',
    bgGradient: 'bg-[#F4F0EA] bg-architectural-grid text-black',
    boardBg: 'bg-white',
    boardBorder: 'border-2 border-black',
    dotFill: '#000000',
    dotBorder: '#000000',
    lineIdle: 'rgba(0, 0, 0, 0.18)',
    lineHover: 'rgba(29, 78, 216, 0.7)',
    player1: {
      name: 'Cobalt',
      lineColor: '#1d4ed8',
      boxFill: 'rgba(29, 78, 216, 0.22)',
      textColor: 'text-blue-700',
      badgeBg: 'bg-blue-100',
      border: 'border-2 border-black',
      shadow: 'shadow-[3px_3px_0px_#000]',
      accentHex: '#1d4ed8',
    },
    player2: {
      name: 'Vermilion',
      lineColor: '#dc2626',
      boxFill: 'rgba(220, 38, 38, 0.22)',
      textColor: 'text-red-700',
      badgeBg: 'bg-red-100',
      border: 'border-2 border-black',
      shadow: 'shadow-[3px_3px_0px_#000]',
      accentHex: '#dc2626',
    },
    cardBg: 'bg-white border-2 border-black shadow-[4px_4px_0px_#000]',
    textPrimary: 'text-black',
    textSecondary: 'text-black',
    textMuted: 'text-black',
    surfaceBorder: 'border-2 border-black',
    brutalShadow: 'shadow-[4px_4px_0px_#000]',
    isDark: false,
  },
  midnight: {
    id: 'midnight',
    name: 'Dark Monolith',
    subtitle: 'Raw obsidian, stark white borders & cyan/coral',
    bgGradient: 'bg-[#0F1117] bg-architectural-grid-dark text-white',
    boardBg: 'bg-[#181B22]',
    boardBorder: 'border-2 border-white',
    dotFill: '#ffffff',
    dotBorder: '#ffffff',
    lineIdle: 'rgba(255, 255, 255, 0.22)',
    lineHover: 'rgba(6, 182, 212, 0.8)',
    player1: {
      name: 'Cyan',
      lineColor: '#06b6d4',
      boxFill: 'rgba(6, 182, 212, 0.28)',
      textColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-950',
      border: 'border-2 border-white',
      shadow: 'shadow-[3px_3px_0px_#FFF]',
      accentHex: '#06b6d4',
    },
    player2: {
      name: 'Coral',
      lineColor: '#f43f5e',
      boxFill: 'rgba(244, 63, 94, 0.28)',
      textColor: 'text-rose-400',
      badgeBg: 'bg-rose-950',
      border: 'border-2 border-white',
      shadow: 'shadow-[3px_3px_0px_#FFF]',
      accentHex: '#f43f5e',
    },
    cardBg: 'bg-[#181B22] border-2 border-white shadow-[4px_4px_0px_#FFF]',
    textPrimary: 'text-white',
    textSecondary: 'text-neutral-200',
    textMuted: 'text-neutral-400',
    surfaceBorder: 'border-2 border-white',
    brutalShadow: 'shadow-[4px_4px_0px_#FFF]',
    isDark: true,
  },
  neon: {
    id: 'neon',
    name: 'Cadmium Acid',
    subtitle: 'Pitch obsidian & electric cadmium yellow',
    bgGradient: 'bg-[#0A0A0A] bg-architectural-grid-dark text-white',
    boardBg: 'bg-[#141414]',
    boardBorder: 'border-2 border-[#FFE600]',
    dotFill: '#FFE600',
    dotBorder: '#FFE600',
    lineIdle: 'rgba(255, 230, 0, 0.25)',
    lineHover: 'rgba(255, 230, 0, 0.85)',
    player1: {
      name: 'Cadmium',
      lineColor: '#FFE600',
      boxFill: 'rgba(255, 230, 0, 0.25)',
      textColor: 'text-yellow-300',
      badgeBg: 'bg-yellow-950',
      border: 'border-2 border-[#FFE600]',
      shadow: 'shadow-[3px_3px_0px_#FFE600]',
      accentHex: '#FFE600',
    },
    player2: {
      name: 'Magenta',
      lineColor: '#FF0055',
      boxFill: 'rgba(255, 0, 85, 0.25)',
      textColor: 'text-pink-400',
      badgeBg: 'bg-pink-950',
      border: 'border-2 border-[#FF0055]',
      shadow: 'shadow-[3px_3px_0px_#FF0055]',
      accentHex: '#FF0055',
    },
    cardBg: 'bg-[#141414] border-2 border-[#FFE600] shadow-[4px_4px_0px_#FFE600]',
    textPrimary: 'text-white',
    textSecondary: 'text-neutral-200',
    textMuted: 'text-neutral-400',
    surfaceBorder: 'border-2 border-[#FFE600]',
    brutalShadow: 'shadow-[4px_4px_0px_#FFE600]',
    isDark: true,
  },
  emerald: {
    id: 'emerald',
    name: 'Raw Concrete & Pine',
    subtitle: 'Brutalist concrete grey & deep forest green',
    bgGradient: 'bg-[#E3E6E2] bg-architectural-grid text-[#14261B]',
    boardBg: 'bg-[#F2F5F0]',
    boardBorder: 'border-2 border-[#14261B]',
    dotFill: '#14261B',
    dotBorder: '#14261B',
    lineIdle: 'rgba(20, 38, 27, 0.2)',
    lineHover: 'rgba(5, 150, 105, 0.7)',
    player1: {
      name: 'Forest',
      lineColor: '#059669',
      boxFill: 'rgba(5, 150, 105, 0.25)',
      textColor: 'text-emerald-800',
      badgeBg: 'bg-emerald-100',
      border: 'border-2 border-[#14261B]',
      shadow: 'shadow-[3px_3px_0px_#14261B]',
      accentHex: '#059669',
    },
    player2: {
      name: 'Amber',
      lineColor: '#d97706',
      boxFill: 'rgba(217, 119, 6, 0.25)',
      textColor: 'text-amber-800',
      badgeBg: 'bg-amber-100',
      border: 'border-2 border-[#14261B]',
      shadow: 'shadow-[3px_3px_0px_#14261B]',
      accentHex: '#d97706',
    },
    cardBg: 'bg-[#F2F5F0] border-2 border-[#14261B] shadow-[4px_4px_0px_#14261B]',
    textPrimary: 'text-[#14261B]',
    textSecondary: 'text-[#203D2B]',
    textMuted: 'text-[#3E5C49]',
    surfaceBorder: 'border-2 border-[#14261B]',
    brutalShadow: 'shadow-[4px_4px_0px_#14261B]',
    isDark: false,
  },
  woodcraft: {
    id: 'woodcraft',
    name: 'Drafting Blueprint',
    subtitle: 'Deep technical indigo & drafting white/orange',
    bgGradient: 'bg-[#0B1526] bg-architectural-grid-dark text-[#F1F5F9]',
    boardBg: 'bg-[#111E33]',
    boardBorder: 'border-2 border-[#38BDF8]',
    dotFill: '#38BDF8',
    dotBorder: '#38BDF8',
    lineIdle: 'rgba(56, 189, 248, 0.25)',
    lineHover: 'rgba(249, 115, 22, 0.8)',
    player1: {
      name: 'Orange',
      lineColor: '#f97316',
      boxFill: 'rgba(249, 115, 22, 0.26)',
      textColor: 'text-orange-400',
      badgeBg: 'bg-orange-950',
      border: 'border-2 border-[#38BDF8]',
      shadow: 'shadow-[3px_3px_0px_#38BDF8]',
      accentHex: '#f97316',
    },
    player2: {
      name: 'Cyan',
      lineColor: '#38bdf8',
      boxFill: 'rgba(56, 189, 248, 0.26)',
      textColor: 'text-cyan-300',
      badgeBg: 'bg-cyan-950',
      border: 'border-2 border-[#38BDF8]',
      shadow: 'shadow-[3px_3px_0px_#38BDF8]',
      accentHex: '#38bdf8',
    },
    cardBg: 'bg-[#111E33] border-2 border-[#38BDF8] shadow-[4px_4px_0px_#38BDF8]',
    textPrimary: 'text-[#F1F5F9]',
    textSecondary: 'text-[#CBD5E1]',
    textMuted: 'text-[#94A3B8]',
    surfaceBorder: 'border-2 border-[#38BDF8]',
    brutalShadow: 'shadow-[4px_4px_0px_#38BDF8]',
    isDark: true,
  },
};
