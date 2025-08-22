import { Color, File, Rank } from "@/types/games/chess";
import { SlidingPiece } from "../main/slidingPiece";
import { bishopDirections } from "@/data/games/chess";
import { BoardLike } from "../main/piece";

export class Bishop extends SlidingPiece {
    constructor(color: Color, file: File, rank: Rank, board: BoardLike) {
        super(color, file, rank, "Bishop", board, bishopDirections);
    }
}
