import { Color, File, Rank } from "@/types/games/chess";
import { knightSteps } from "@/data/games/chess";
import { Board } from "../main/board/board";
import { SteppingPiece } from "../main/steppingPiece";

export class Knight extends SteppingPiece {
    constructor(color: Color, file: File, rank: Rank, board: Board) {
        super(color, file, rank, "Knight", board, knightSteps);
    }
}
