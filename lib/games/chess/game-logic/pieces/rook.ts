import { Color, File, PieceType, Rank } from "@/types/games/chess";
import type { Board } from "../main/board/board";
import { SlidingPiece } from "../main/slidingPiece";
import { rookDirections } from "@/data/games/chess/constants/board";

export class Rook extends SlidingPiece {
    public hasMoved = false;
    protected readonly _type: PieceType = "Rook";
    public get type(): PieceType {
        return this._type;
    }

    constructor(color: Color, file: File, rank: Rank, board: Board) {
        super(color, file, rank, board, rookDirections);
    }
}
