import {
  BoardDimensions,
  BoardPreset,
  BoxCoord,
  CompletedBox,
  Edge,
  EdgeKey,
  getEdgeKey,
  MoveRecord,
  PlayerId,
} from '../types/game';
import {
  getAdjacentBoxes,
  getAllPossibleEdges,
  getBoardDimensions,
  getBoxEdges,
  isValidEdge,
} from './boardGeometry';

export interface PlacedEdgeInfo {
  edge: Edge;
  player: PlayerId;
  moveNumber: number;
}

export interface DotsGameState {
  preset: BoardPreset;
  dimensions: BoardDimensions;
  occupiedEdges: Map<EdgeKey, PlacedEdgeInfo>;
  completedBoxes: Map<string, CompletedBox>;
  scores: Record<PlayerId, number>;
  currentPlayer: PlayerId;
  moveHistory: MoveRecord[];
  isGameOver: boolean;
  winner: PlayerId | 'draw' | null;
  extraTurnGranted: boolean;
  lastMoveNumber: number;
  lastCompletedBoxes: BoxCoord[];
  lastPlacedEdge: Edge | null;
}

export function boxCoordToKey(box: BoxCoord): string {
  return `${box.r}_${box.c}`;
}

export function createInitialGameState(
  preset: BoardPreset,
  startingPlayer: PlayerId = 1
): DotsGameState {
  const dimensions = getBoardDimensions(preset);
  return {
    preset,
    dimensions,
    occupiedEdges: new Map<EdgeKey, PlacedEdgeInfo>(),
    completedBoxes: new Map<string, CompletedBox>(),
    scores: { 1: 0, 2: 0 },
    currentPlayer: startingPlayer,
    moveHistory: [],
    isGameOver: false,
    winner: null,
    extraTurnGranted: false,
    lastMoveNumber: 0,
    lastCompletedBoxes: [],
    lastPlacedEdge: null,
  };
}

export interface MoveResult {
  nextState: DotsGameState;
  success: boolean;
  completedBoxes: BoxCoord[];
  extraTurn: boolean;
  isGameOver: boolean;
  reason?: string;
}

export function applyMove(state: DotsGameState, edge: Edge): MoveResult {
  if (state.isGameOver) {
    return {
      nextState: state,
      success: false,
      completedBoxes: [],
      extraTurn: false,
      isGameOver: true,
      reason: 'Game is already over',
    };
  }

  if (!isValidEdge(edge, state.dimensions)) {
    return {
      nextState: state,
      success: false,
      completedBoxes: [],
      extraTurn: false,
      isGameOver: false,
      reason: 'Invalid edge boundary',
    };
  }

  const key = getEdgeKey(edge);
  if (state.occupiedEdges.has(key)) {
    return {
      nextState: state,
      success: false,
      completedBoxes: [],
      extraTurn: false,
      isGameOver: false,
      reason: 'Edge is already occupied',
    };
  }

  const moveNumber = state.lastMoveNumber + 1;
  const newOccupied = new Map(state.occupiedEdges);
  newOccupied.set(key, { edge, player: state.currentPlayer, moveNumber });

  // Check adjacent boxes for completion
  const adjacent = getAdjacentBoxes(edge, state.dimensions);
  const newlyCompleted: BoxCoord[] = [];
  const newCompletedBoxes = new Map(state.completedBoxes);

  const occupiedEdgeKeys = new Set(newOccupied.keys());

  for (const box of adjacent) {
    const boxKey = boxCoordToKey(box);
    if (!newCompletedBoxes.has(boxKey)) {
      const edges = getBoxEdges(box);
      const isComplete = edges.every((e) => occupiedEdgeKeys.has(getEdgeKey(e)));
      if (isComplete) {
        newlyCompleted.push(box);
        newCompletedBoxes.set(boxKey, {
          ...box,
          owner: state.currentPlayer,
          completedAtMove: moveNumber,
        });
      }
    }
  }

  const newScores = {
    ...state.scores,
    [state.currentPlayer]: state.scores[state.currentPlayer] + newlyCompleted.length,
  };

  const moveRecord: MoveRecord = {
    edge,
    player: state.currentPlayer,
    completedBoxes: newlyCompleted,
    moveNumber,
  };

  const allCompleted = newCompletedBoxes.size === state.dimensions.totalBoxes;
  let winner: PlayerId | 'draw' | null = null;
  if (allCompleted) {
    if (newScores[1] > newScores[2]) {
      winner = 1;
    } else if (newScores[2] > newScores[1]) {
      winner = 2;
    } else {
      winner = 'draw';
    }
  }

  // If a player completed at least one box, they KEEP the turn!
  // If no box was completed, turn passes to the other player.
  const extraTurn = newlyCompleted.length > 0 && !allCompleted;
  const nextPlayer: PlayerId = allCompleted
    ? state.currentPlayer
    : extraTurn
    ? state.currentPlayer
    : state.currentPlayer === 1
    ? 2
    : 1;

  const nextState: DotsGameState = {
    preset: state.preset,
    dimensions: state.dimensions,
    occupiedEdges: newOccupied,
    completedBoxes: newCompletedBoxes,
    scores: newScores,
    currentPlayer: nextPlayer,
    moveHistory: [...state.moveHistory, moveRecord],
    isGameOver: allCompleted,
    winner,
    extraTurnGranted: extraTurn,
    lastMoveNumber: moveNumber,
    lastCompletedBoxes: newlyCompleted,
    lastPlacedEdge: edge,
  };

  return {
    nextState,
    success: true,
    completedBoxes: newlyCompleted,
    extraTurn,
    isGameOver: allCompleted,
  };
}

/**
 * Undoes moves.
 * In VS AI: reverts back until before the human player's prior turn.
 * In PVP: reverts exactly one move.
 */
export function undoGameMove(state: DotsGameState, isVsAI: boolean): DotsGameState | null {
  if (state.moveHistory.length === 0) return null;

  if (!isVsAI) {
    // Single move undo
    const newHistory = [...state.moveHistory];
    const lastMove = newHistory.pop()!;

    const newOccupied = new Map(state.occupiedEdges);
    newOccupied.delete(getEdgeKey(lastMove.edge));

    const newCompleted = new Map(state.completedBoxes);
    for (const b of lastMove.completedBoxes) {
      newCompleted.delete(boxCoordToKey(b));
    }

    const newScores = {
      ...state.scores,
      [lastMove.player]: state.scores[lastMove.player] - lastMove.completedBoxes.length,
    };

    const prevMove = newHistory[newHistory.length - 1] ?? null;

    return {
      ...state,
      occupiedEdges: newOccupied,
      completedBoxes: newCompleted,
      scores: newScores,
      currentPlayer: lastMove.player,
      moveHistory: newHistory,
      isGameOver: false,
      winner: null,
      extraTurnGranted: false,
      lastMoveNumber: state.lastMoveNumber - 1,
      lastCompletedBoxes: [],
      lastPlacedEdge: prevMove ? prevMove.edge : null,
    };
  }

  // VS AI: Revert back to before the human (Player 1) made their move
  // Find the last index where player === 1
  let targetIndex = -1;
  for (let i = state.moveHistory.length - 1; i >= 0; i--) {
    if (state.moveHistory[i].player === 1) {
      targetIndex = i;
      break;
    }
  }

  if (targetIndex === -1) return null;

  // Rebuild state up to targetIndex (excluding targetIndex move)
  let rebuilt = createInitialGameState(state.preset, 1);
  for (let i = 0; i < targetIndex; i++) {
    const res = applyMove(rebuilt, state.moveHistory[i].edge);
    rebuilt = res.nextState;
  }

  return rebuilt;
}

export function getRemainingLegalEdges(state: DotsGameState): Edge[] {
  const all = getAllPossibleEdges(state.dimensions);
  return all.filter((e) => !state.occupiedEdges.has(getEdgeKey(e)));
}
