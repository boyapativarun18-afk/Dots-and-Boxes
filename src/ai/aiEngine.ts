import {
  AIDifficulty,
  BoxCoord,
  Edge,
  EdgeKey,
  getEdgeKey,
  PlayerId,
} from '../types/game';
import {
  getAdjacentBoxes,
  getBoxDrawnEdgeCount,
  getBoxMissingEdges,
} from '../game/boardGeometry';
import {
  applyMove,
  boxCoordToKey,
  DotsGameState,
  getRemainingLegalEdges,
} from '../game/gameEngine';

export interface AIThinkingConfig {
  delayMs: number;
}

export const AI_DELAYS: Record<AIDifficulty, number> = {
  easy: 400,
  medium: 600,
  hard: 800,
  expert: 1000,
};

/**
 * Returns all edges that immediately complete at least one box (captures)
 */
function findCompletingEdges(state: DotsGameState): Edge[] {
  const occupiedKeys = new Set(state.occupiedEdges.keys());
  const completingMap = new Map<EdgeKey, Edge>();

  for (let r = 0; r < state.dimensions.boxesY; r++) {
    for (let c = 0; c < state.dimensions.boxesX; c++) {
      const box: BoxCoord = { r, c };
      if (!state.completedBoxes.has(boxCoordToKey(box))) {
        const count = getBoxDrawnEdgeCount(box, occupiedKeys);
        if (count === 3) {
          const missing = getBoxMissingEdges(box, occupiedKeys);
          if (missing.length === 1) {
            completingMap.set(getEdgeKey(missing[0]), missing[0]);
          }
        }
      }
    }
  }

  return Array.from(completingMap.values());
}

/**
 * Returns all edges that do NOT give away a box
 * (i.e. neither adjacent box will end up having 3 edges)
 */
function findSafeEdges(state: DotsGameState): Edge[] {
  const legal = getRemainingLegalEdges(state);
  const occupiedKeys = new Set(state.occupiedEdges.keys());

  return legal.filter((edge) => {
    const adj = getAdjacentBoxes(edge, state.dimensions);
    for (const box of adj) {
      if (!state.completedBoxes.has(boxCoordToKey(box))) {
        const count = getBoxDrawnEdgeCount(box, occupiedKeys);
        // If current box already has 2 edges, placing this 3rd edge creates a 3-sided box! (un-safe)
        if (count === 2) {
          return false;
        }
      }
    }
    return true;
  });
}

/**
 * For an unsafe edge, estimate how many boxes it gives away to the opponent
 */
function estimateGiftSize(state: DotsGameState, edge: Edge): number {
  // Simulate placing this edge
  const sim = applyMove(state, edge);
  if (!sim.success) return 999;

  // Now count how many boxes can be chained/taken immediately
  let chainedBoxes = 0;
  let curr = sim.nextState;

  let captures = findCompletingEdges(curr);
  while (captures.length > 0) {
    const moveRes = applyMove(curr, captures[0]);
    if (!moveRes.success) break;
    chainedBoxes += moveRes.completedBoxes.length;
    curr = moveRes.nextState;
    captures = findCompletingEdges(curr);
  }

  return chainedBoxes;
}

/**
 * EASY AI: Mostly random, 40% chance to take an obvious box
 */
function chooseEasyMove(state: DotsGameState): Edge {
  const legal = getRemainingLegalEdges(state);
  const completing = findCompletingEdges(state);

  if (completing.length > 0 && Math.random() < 0.45) {
    return completing[Math.floor(Math.random() * completing.length)];
  }

  return legal[Math.floor(Math.random() * legal.length)];
}

/**
 * MEDIUM AI: Always grabs completed boxes, picks safe edges when possible
 */
function chooseMediumMove(state: DotsGameState): Edge {
  const completing = findCompletingEdges(state);
  if (completing.length > 0) {
    // Pick the edge that completes 2 boxes if available
    const doubleCompleters = completing.filter((e) => {
      const adj = getAdjacentBoxes(e, state.dimensions);
      const occupied = new Set(state.occupiedEdges.keys());
      return adj.filter((b) => getBoxDrawnEdgeCount(b, occupied) === 3).length === 2;
    });
    if (doubleCompleters.length > 0) {
      return doubleCompleters[0];
    }
    return completing[0];
  }

  const safe = findSafeEdges(state);
  if (safe.length > 0) {
    return safe[Math.floor(Math.random() * safe.length)];
  }

  // All moves give away a box; pick one that minimizes immediate damage
  const legal = getRemainingLegalEdges(state);
  let bestEdge = legal[0];
  let minGift = 999;

  for (const edge of legal) {
    const gift = estimateGiftSize(state, edge);
    if (gift < minGift) {
      minGift = gift;
      bestEdge = edge;
    }
  }

  return bestEdge;
}

/**
 * HARD AI:
 * - Always takes immediate boxes
 * - Takes safe moves that don't increase opponent options
 * - Analyzes chains to sacrifice the minimum possible boxes
 * - Avoids opening central long corridors
 */
function chooseHardMove(state: DotsGameState): Edge {
  const completing = findCompletingEdges(state);
  if (completing.length > 0) {
    // Prefer double-completers
    const doubleCompleters = completing.filter((e) => {
      const adj = getAdjacentBoxes(e, state.dimensions);
      const occupied = new Set(state.occupiedEdges.keys());
      return adj.filter((b) => getBoxDrawnEdgeCount(b, occupied) === 3).length === 2;
    });
    if (doubleCompleters.length > 0) {
      return doubleCompleters[0];
    }
    return completing[0];
  }

  const safe = findSafeEdges(state);
  if (safe.length > 0) {
    // Prioritize safe edges that maintain board tension (border edges first, keeping center safe)
    safe.sort((a, b) => {
      const aBorder = a.r === 0 || a.c === 0 || a.r === state.dimensions.dotsY - 1 || a.c === state.dimensions.dotsX - 1;
      const bBorder = b.r === 0 || b.c === 0 || b.r === state.dimensions.dotsY - 1 || b.c === state.dimensions.dotsX - 1;
      return (bBorder ? 1 : 0) - (aBorder ? 1 : 0);
    });
    return safe[0];
  }

  // Forced giveaway: choose the edge that hands over the shortest chain
  const legal = getRemainingLegalEdges(state);
  let bestEdge = legal[0];
  let minDamage = Infinity;

  for (const edge of legal) {
    const gift = estimateGiftSize(state, edge);
    if (gift < minDamage) {
      minDamage = gift;
      bestEdge = edge;
    }
  }

  return bestEdge;
}

/**
 * EXPERT AI:
 * - Uses Alpha-Beta endgame search when remaining legal moves <= 12
 * - Implements the classic "Double-Dealing / Control" strategy in chains
 * - Evaluates chain lengths and safe-move parity
 */
function chooseExpertMove(state: DotsGameState): Edge {
  const legal = getRemainingLegalEdges(state);
  if (legal.length === 0) return legal[0];

  // Endgame exact solver when <= 12 moves remain
  if (legal.length <= 12) {
    const solverBest = solveEndgameAlphaBeta(state, 6);
    if (solverBest) return solverBest;
  }

  const completing = findCompletingEdges(state);

  // If there are completing moves:
  if (completing.length > 0) {
    // Check if we are in a chain where we should double-cross to retain control!
    // A double-cross is applicable when:
    // - Taking the box would leave a 2-box corridor where completing both forces us to give up the next chain.
    // In casual play, always claiming points is great, but let's check if double-completers exist:
    const doubleCompleters = completing.filter((e) => {
      const adj = getAdjacentBoxes(e, state.dimensions);
      const occupied = new Set(state.occupiedEdges.keys());
      return adj.filter((b) => getBoxDrawnEdgeCount(b, occupied) === 3).length === 2;
    });
    if (doubleCompleters.length > 0) {
      return doubleCompleters[0];
    }
    return completing[0];
  }

  const safe = findSafeEdges(state);
  if (safe.length > 0) {
    // Heuristic: Evaluate safe moves that leave safe parity
    // Prefer safe moves that touch fewer un-drawn boxes with 1 edge
    let bestSafe = safe[0];
    let bestScore = -Infinity;
    const occupiedKeys = new Set(state.occupiedEdges.keys());

    for (const edge of safe) {
      const adj = getAdjacentBoxes(edge, state.dimensions);
      let score = 0;
      for (const box of adj) {
        const count = getBoxDrawnEdgeCount(box, occupiedKeys);
        if (count === 0) score += 2; // Very safe
        if (count === 1) score += 1;
      }
      if (score > bestScore) {
        bestScore = score;
        bestSafe = edge;
      }
    }
    return bestSafe;
  }

  // All moves are sacrificial: pick the smallest possible chain sacrifice
  let bestSacrifice = legal[0];
  let minGift = Infinity;

  for (const edge of legal) {
    const gift = estimateGiftSize(state, edge);
    if (gift < minGift) {
      minGift = gift;
      bestSacrifice = edge;
    }
  }

  return bestSacrifice;
}

/**
 * Minimax with Alpha-Beta for endgame
 */
function solveEndgameAlphaBeta(state: DotsGameState, maxDepth: number): Edge | null {
  const legal = getRemainingLegalEdges(state);
  if (legal.length === 0) return null;

  let bestMove = legal[0];
  let bestScore = -Infinity;

  const aiPlayer = state.currentPlayer;

  for (const edge of legal) {
    const result = applyMove(state, edge);
    if (!result.success) continue;

    const score = minimax(result.nextState, maxDepth - 1, -Infinity, Infinity, aiPlayer);
    if (score > bestScore) {
      bestScore = score;
      bestMove = edge;
    }
  }

  return bestMove;
}

function minimax(
  state: DotsGameState,
  depth: number,
  alpha: number,
  beta: number,
  aiPlayer: PlayerId
): number {
  if (state.isGameOver || depth <= 0) {
    // Evaluate payoff: AI score minus opponent score
    const opponent = aiPlayer === 1 ? 2 : 1;
    return state.scores[aiPlayer] - state.scores[opponent];
  }

  const legal = getRemainingLegalEdges(state);
  if (legal.length === 0) {
    const opponent = aiPlayer === 1 ? 2 : 1;
    return state.scores[aiPlayer] - state.scores[opponent];
  }

  const isMaximizing = state.currentPlayer === aiPlayer;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const edge of legal) {
      const res = applyMove(state, edge);
      if (!res.success) continue;
      const evalScore = minimax(res.nextState, depth - 1, alpha, beta, aiPlayer);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const edge of legal) {
      const res = applyMove(state, edge);
      if (!res.success) continue;
      const evalScore = minimax(res.nextState, depth - 1, alpha, beta, aiPlayer);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

/**
 * Main AI move selector based on difficulty
 */
export function selectAIMove(state: DotsGameState, difficulty: AIDifficulty): Edge {
  switch (difficulty) {
    case 'easy':
      return chooseEasyMove(state);
    case 'medium':
      return chooseMediumMove(state);
    case 'hard':
      return chooseHardMove(state);
    case 'expert':
      return chooseExpertMove(state);
  }
}
