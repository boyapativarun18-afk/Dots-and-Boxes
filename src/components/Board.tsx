import React, { useState, useEffect } from 'react';
import {
  BoxCoord,
  Edge,
  EdgeKey,
  getEdgeKey,
  PlayerConfig,
  PlayerId,
} from '../types/game';
import { boxCoordToKey, DotsGameState } from '../game/gameEngine';
import { THEMES } from '../types/theme';

interface BoardProps {
  gameState: DotsGameState;
  players: Record<PlayerId, PlayerConfig>;
  themeId: string;
  isAiThinking: boolean;
  onSelectEdge: (edge: Edge) => void;
  disabled?: boolean;
  reducedMotion?: boolean;
}

export const Board: React.FC<BoardProps> = ({
  gameState,
  players,
  themeId,
  isAiThinking,
  onSelectEdge,
  disabled = false,
  reducedMotion = false,
}) => {
  const [hoveredEdgeKey, setHoveredEdgeKey] = useState<EdgeKey | null>(null);
  const [isEntranceFinished, setIsEntranceFinished] = useState(reducedMotion);

  const theme = THEMES[themeId as keyof typeof THEMES] || THEMES.classic;
  const { dimensions, occupiedEdges, completedBoxes, currentPlayer } = gameState;
  const { dotsX, dotsY, boxesX, boxesY } = dimensions;

  // Track entrance lifecycle: trigger on mount/restart, disable after 600ms so gameplay is free of overhead
  useEffect(() => {
    if (reducedMotion) {
      setIsEntranceFinished(true);
      return;
    }
    setIsEntranceFinished(false);
    const timer = window.setTimeout(() => {
      setIsEntranceFinished(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  // Staggered entrance timing calculations (radial ripple outward from center)
  const centerR = (dotsY - 1) / 2;
  const centerC = (dotsX - 1) / 2;
  const maxDist = Math.hypot(centerR, centerC) || 1;

  // Dots pop first with a spring entrance (0ms to 180ms)
  const getDotDelay = (r: number, c: number) => {
    if (reducedMotion || isEntranceFinished) return 0;
    const dist = Math.hypot(r - centerR, c - centerC);
    return Math.round((dist / maxDist) * 180);
  };

  // Horizontal lines connect between dots (60ms to 240ms)
  const getHLineDelay = (r: number, c: number) => {
    if (reducedMotion || isEntranceFinished) return 0;
    const dist = Math.hypot(r - centerR, c + 0.5 - centerC);
    return Math.round((dist / maxDist) * 180) + 60;
  };

  // Vertical lines connect between dots (60ms to 240ms)
  const getVLineDelay = (r: number, c: number) => {
    if (reducedMotion || isEntranceFinished) return 0;
    const dist = Math.hypot(r + 0.5 - centerR, c - centerC);
    return Math.round((dist / maxDist) * 180) + 60;
  };

  // Board spacing parameters
  const PADDING = 38;
  const SPACING = 68; // distance between adjacent dots
  const SVG_WIDTH = PADDING * 2 + (dotsX - 1) * SPACING;
  const SVG_HEIGHT = PADDING * 2 + (dotsY - 1) * SPACING;

  const DOT_RADIUS = 6.5;
  const LINE_STROKE = 6;
  const HIT_AREA_THICKNESS = 34; // Generous tap target for mobile & touch

  // Helper for dot positions
  const getDotX = (c: number) => PADDING + c * SPACING;
  const getDotY = (r: number) => PADDING + r * SPACING;

  // Render Horizontal Edges
  const horizontalEdges: React.ReactNode[] = [];
  for (let r = 0; r < dotsY; r++) {
    for (let c = 0; c < dotsX - 1; c++) {
      const edge: Edge = { type: 'H', r, c };
      const key = getEdgeKey(edge);
      const isOccupied = occupiedEdges.has(key);
      const occupancy = occupiedEdges.get(key);
      const isHovered = hoveredEdgeKey === key && !isOccupied && !isAiThinking && !disabled;

      const x1 = getDotX(c);
      const y1 = getDotY(r);
      const x2 = getDotX(c + 1);
      const y2 = y1;

      const ownerPlayer = occupancy?.player;
      const lineColor = isOccupied
        ? ownerPlayer === 1
          ? theme.player1.lineColor
          : theme.player2.lineColor
        : isHovered
        ? currentPlayer === 1
          ? theme.player1.lineColor
          : theme.player2.lineColor
        : theme.lineIdle;

      const isLastPlaced =
        gameState.lastPlacedEdge &&
        gameState.lastPlacedEdge.type === 'H' &&
        gameState.lastPlacedEdge.r === r &&
        gameState.lastPlacedEdge.c === c;

      const midX = (x1 + x2) / 2;
      const midY = y1;
      const hLineDelay = getHLineDelay(r, c);

      horizontalEdges.push(
        <g
          key={key}
          style={{
            transformOrigin: `${midX}px ${midY}px`,
            animation:
              !isEntranceFinished && !reducedMotion && !isOccupied
                ? `hLineEntrance 0.32s cubic-bezier(0.16, 1, 0.3, 1) ${hLineDelay}ms both`
                : undefined,
          }}
          className="transition-colors duration-100"
        >
          {/* Visible line */}
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={lineColor}
            strokeWidth={isOccupied ? LINE_STROKE : isHovered ? LINE_STROKE + 2 : 2.5}
            strokeLinecap="square"
            strokeDasharray={!isOccupied ? '5 5' : undefined}
            className={`transition-all duration-150 ${
              isLastPlaced ? 'stroke-current' : ''
            }`}
          />
          {/* Invisible wide hit area for mouse and mobile tap */}
          {!isOccupied && !disabled && !isAiThinking && (
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="transparent"
              strokeWidth={HIT_AREA_THICKNESS}
              strokeLinecap="square"
              className="cursor-pointer select-none"
              onMouseEnter={() => setHoveredEdgeKey(key)}
              onMouseLeave={() => setHoveredEdgeKey(null)}
              onClick={() => onSelectEdge(edge)}
              role="button"
              aria-label={`Horizontal line row ${r + 1} column ${c + 1}`}
            />
          )}
        </g>
      );
    }
  }

  // Render Vertical Edges
  const verticalEdges: React.ReactNode[] = [];
  for (let r = 0; r < dotsY - 1; r++) {
    for (let c = 0; c < dotsX; c++) {
      const edge: Edge = { type: 'V', r, c };
      const key = getEdgeKey(edge);
      const isOccupied = occupiedEdges.has(key);
      const occupancy = occupiedEdges.get(key);
      const isHovered = hoveredEdgeKey === key && !isOccupied && !isAiThinking && !disabled;

      const x1 = getDotX(c);
      const y1 = getDotY(r);
      const x2 = x1;
      const y2 = getDotY(r + 1);

      const ownerPlayer = occupancy?.player;
      const lineColor = isOccupied
        ? ownerPlayer === 1
          ? theme.player1.lineColor
          : theme.player2.lineColor
        : isHovered
        ? currentPlayer === 1
          ? theme.player1.lineColor
          : theme.player2.lineColor
        : theme.lineIdle;

      const isLastPlaced =
        gameState.lastPlacedEdge &&
        gameState.lastPlacedEdge.type === 'V' &&
        gameState.lastPlacedEdge.r === r &&
        gameState.lastPlacedEdge.c === c;

      const midX = x1;
      const midY = (y1 + y2) / 2;
      const vLineDelay = getVLineDelay(r, c);

      verticalEdges.push(
        <g
          key={key}
          style={{
            transformOrigin: `${midX}px ${midY}px`,
            animation:
              !isEntranceFinished && !reducedMotion && !isOccupied
                ? `vLineEntrance 0.32s cubic-bezier(0.16, 1, 0.3, 1) ${vLineDelay}ms both`
                : undefined,
          }}
          className="transition-colors duration-100"
        >
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={lineColor}
            strokeWidth={isOccupied ? LINE_STROKE : isHovered ? LINE_STROKE + 2 : 2.5}
            strokeLinecap="square"
            strokeDasharray={!isOccupied ? '5 5' : undefined}
            className={`transition-all duration-150 ${
              isLastPlaced ? 'stroke-current' : ''
            }`}
          />
          {!isOccupied && !disabled && !isAiThinking && (
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="transparent"
              strokeWidth={HIT_AREA_THICKNESS}
              strokeLinecap="square"
              className="cursor-pointer select-none"
              onMouseEnter={() => setHoveredEdgeKey(key)}
              onMouseLeave={() => setHoveredEdgeKey(null)}
              onClick={() => onSelectEdge(edge)}
              role="button"
              aria-label={`Vertical line row ${r + 1} column ${c + 1}`}
            />
          )}
        </g>
      );
    }
  }

  // Render Boxes (Completed or empty)
  const boxes: React.ReactNode[] = [];
  for (let r = 0; r < boxesY; r++) {
    for (let c = 0; c < boxesX; c++) {
      const boxCoord: BoxCoord = { r, c };
      const key = boxCoordToKey(boxCoord);
      const completed = completedBoxes.get(key);

      const x = getDotX(c);
      const y = getDotY(r);
      const width = SPACING;
      const height = SPACING;

      if (completed) {
        const isPlayer1 = completed.owner === 1;
        const boxFill = isPlayer1 ? theme.player1.boxFill : theme.player2.boxFill;
        const strokeColor = isPlayer1 ? theme.player1.lineColor : theme.player2.lineColor;
        const textColor = isPlayer1 ? theme.player1.accentHex : theme.player2.accentHex;
        const playerConfig = players[completed.owner];
        const displayInitial = playerConfig?.initial || (completed.owner === 1 ? '1' : '2');

        const isJustCompleted = gameState.lastCompletedBoxes.some(
          (b) => b.r === r && b.c === c
        );

        boxes.push(
          <g key={`box_${key}`}>
            {/* Box background tile - Clean brutalist sharp geometry */}
            <rect
              x={x + 3}
              y={y + 3}
              width={width - 6}
              height={height - 6}
              fill={boxFill}
              stroke={strokeColor}
              strokeWidth={2}
              className={`transition-all duration-200 ${
                isJustCompleted ? 'animate-scale-in' : ''
              }`}
            />
            {/* Box owner initial - High contrast technical marker */}
            <text
              x={x + width / 2}
              y={y + height / 2 + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fill={textColor}
              fontSize={SPACING > 60 ? 18 : 15}
              fontWeight="900"
              fontFamily="Outfit, monospace"
              className="select-none tracking-tight pointer-events-none"
            >
              {displayInitial}
            </text>
          </g>
        );
      }
    }
  }

  // Render Dots
  const dots: React.ReactNode[] = [];
  for (let r = 0; r < dotsY; r++) {
    for (let c = 0; c < dotsX; c++) {
      const cx = getDotX(c);
      const cy = getDotY(r);
      const dotDelay = getDotDelay(r, c);

      dots.push(
        <circle
          key={`dot_${r}_${c}`}
          cx={cx}
          cy={cy}
          r={DOT_RADIUS}
          fill={theme.dotFill}
          stroke={theme.dotBorder}
          strokeWidth={2.5}
          style={{
            transformBox: 'fill-box',
            transformOrigin: 'center',
            animation:
              !isEntranceFinished && !reducedMotion
                ? `dotPopEntrance 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${dotDelay}ms both`
                : undefined,
          }}
          className="pointer-events-none"
        />
      );
    }
  }

  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4 select-none">
      <div
        className={`relative p-4 sm:p-7 transition-all duration-200 border-2 ${theme.boardBg} ${theme.boardBorder} ${theme.brutalShadow} max-w-full overflow-hidden ${
          reducedMotion ? '' : 'animate-board-pop'
        }`}
        style={{ touchAction: 'manipulation' }}
      >
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-auto max-w-[500px] max-h-[70vh] mx-auto filter"
          style={{ overflow: 'visible' }}
        >
          {/* Render layer order: Boxes -> Edges -> Dots */}
          <g id="boxes-layer">{boxes}</g>
          <g id="edges-layer">
            {horizontalEdges}
            {verticalEdges}
          </g>
          <g id="dots-layer">{dots}</g>
        </svg>
      </div>
    </div>
  );
};
