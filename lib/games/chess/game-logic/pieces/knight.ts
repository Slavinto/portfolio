import { Color, File, PieceType, Rank } from "@/types/games/chess";
import { Board } from "../main/board/board";
import { SteppingPiece } from "../main/steppingPiece";
import { knightSteps } from "@/data/games/chess/constants/board";

export class Knight extends SteppingPiece {
    protected readonly _type: PieceType = "Knight";
    public get type(): PieceType {
        return this._type;
    }

    constructor(color: Color, file: File, rank: Rank, board: Board) {
        super(color, file, rank, board, knightSteps);
    }
}
