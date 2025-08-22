import { Color, File, Rank } from "@/types/games/chess";
import type { Board } from "../main/board/board";
import { SlidingPiece } from "../main/slidingPiece";
import { bishopDirections, rookDirections } from "@/data/games/chess";

export class Queen extends SlidingPiece {
    constructor(color: Color, file: File, rank: Rank, board: Board) {
        super(color, file, rank, "Queen", board, [
            ...rookDirections,
            ...bishopDirections,
        ]);
    }
}
