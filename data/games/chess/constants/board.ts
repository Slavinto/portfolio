import { Directions, File, Rank } from "@/types/games/chess/types";

export const files: File[] = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

export const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8] as const;

// Directions: fileDelta, rankDelta
export const bishopDirections: Directions = [
    [+1, +1], // top-right
    [-1, +1], // top-left
    [+1, -1], // bottom-right
    [-1, -1], // bottom-left
];

// Possible king move deltas: [fileDelta, rankDelta]
export const kingSteps: Directions = [
    [0, +1], // up (same file, next rank)
    [+1, +1], // up-right (next file, next rank)
    [+1, 0], // right (next file, same rank)
    [+1, -1], // down-right (next file, previous rank)
    [0, -1], // down (same file, previous rank)
    [-1, -1], // down-left (previous file, previous rank)
    [-1, 0], // left (previous file, same rank)
    [-1, +1], // up-left (previous file, next rank)
];

export const knightSteps: Directions = [
    [+1, +2],
    [+2, +1],
    [+2, -1],
    [+1, -2],
    [-1, -2],
    [-2, -1],
    [-2, +1],
    [-1, +2],
];

export const rookDirections: Directions = [
    [0, +1], // up
    [0, -1], // down
    [-1, 0], // left
    [+1, 0], // right
];
