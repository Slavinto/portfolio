import { Color, File, Rank } from "@/types/games/chess";
import type { Board } from "../main/board/board";
import { SlidingPiece } from "../main/slidingPiece";
import { rookDirections } from "@/data/games/chess";

export class Rook extends SlidingPiece {
    public hasMoved = false;

    constructor(color: Color, file: File, rank: Rank, board: Board) {
        super(color, file, rank, "Rook", board, rookDirections);
    }
}
