import {
  BoardDimensions,
  BoardPreset,
  BoxCoord,
  Edge,
  EdgeKey,
  getEdgeKey,
} from '../types/game';

export function getBoardDimensions(preset: BoardPreset): BoardDimensions {
  let dots = 4;
  switch (preset) {
    case 'small':
      dots = 3;
      break;
    case 'medium':
      dots = 4;
      break;
    case 'large':
      dots = 5;
      break;
    case 'huge':
      dots = 6;
      break;
  }
  const boxesX = dots - 1;
  const boxesY = dots - 1;
  return {
    dotsX: dots,
    dotsY: dots,
    boxesX,
    boxesY,
    totalBoxes: boxesX * boxesY,
  };
}

/**
 * Returns all possible legal edges for the given dimensions
 */
export function getAllPossibleEdges(dim: BoardDimensions): Edge[] {
  const edges: Edge[] = [];

  // Horizontal edges: r in [0..dotsY-1], c in [0..dotsX-2]
  for (let r = 0; r < dim.dotsY; r++) {
    for (let c = 0; c < dim.dotsX - 1; c++) {
      edges.push({ type: 'H', r, c });
    }
  }

  // Vertical edges: r in [0..dotsY-2], c in [0..dotsX-1]
  for (let r = 0; r < dim.dotsY - 1; r++) {
    for (let c = 0; c < dim.dotsX; c++) {
      edges.push({ type: 'V', r, c });
    }
  }

  return edges;
}

/**
 * Returns the 4 edges bounding box (r, c)
 */
export function getBoxEdges(box: BoxCoord): Edge[] {
  const { r, c } = box;
  return [
    { type: 'H', r, c },       // top
    { type: 'H', r: r + 1, c }, // bottom
    { type: 'V', r, c },       // left
    { type: 'V', r, c: c + 1 }, // right
  ];
}

/**
 * Returns the box coordinates adjacent to an edge
 */
export function getAdjacentBoxes(edge: Edge, dim: BoardDimensions): BoxCoord[] {
  const boxes: BoxCoord[] = [];
  const { type, r, c } = edge;

  if (type === 'H') {
    // Horizontal edge: separates box above (r-1, c) and box below (r, c)
    if (r > 0) {
      boxes.push({ r: r - 1, c });
    }
    if (r < dim.boxesY) {
      boxes.push({ r, c });
    }
  } else {
    // Vertical edge: separates box left (r, c-1) and box right (r, c)
    if (c > 0) {
      boxes.push({ r, c: c - 1 });
    }
    if (c < dim.boxesX) {
      boxes.push({ r, c });
    }
  }

  return boxes;
}

/**
 * Checks how many edges of a box are currently occupied
 */
export function getBoxDrawnEdgeCount(
  box: BoxCoord,
  occupiedEdges: Set<EdgeKey>
): number {
  const edges = getBoxEdges(box);
  let count = 0;
  for (const edge of edges) {
    if (occupiedEdges.has(getEdgeKey(edge))) {
      count++;
    }
  }
  return count;
}

/**
 * Returns the unplaced edges of a box
 */
export function getBoxMissingEdges(
  box: BoxCoord,
  occupiedEdges: Set<EdgeKey>
): Edge[] {
  const edges = getBoxEdges(box);
  return edges.filter((e) => !occupiedEdges.has(getEdgeKey(e)));
}

/**
 * Returns whether an edge is valid given dimensions
 */
export function isValidEdge(edge: Edge, dim: BoardDimensions): boolean {
  if (edge.type === 'H') {
    return edge.r >= 0 && edge.r < dim.dotsY && edge.c >= 0 && edge.c < dim.dotsX - 1;
  }
  if (edge.type === 'V') {
    return edge.r >= 0 && edge.r < dim.dotsY - 1 && edge.c >= 0 && edge.c < dim.dotsX;
  }
  return false;
}
