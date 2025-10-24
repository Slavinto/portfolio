import { Color, File, PieceType, Rank } from "@/types/games/chess";
import { SlidingPiece } from "../main/slidingPiece";
import { Board } from "../main/board/board";
import { bishopDirections } from "@/data/games/chess/constants/board";

export class Bishop extends SlidingPiece {
    protected readonly _type: PieceType = "Bishop";
    public get type(): PieceType {
        return this._type;
    }

    constructor(color: Color, file: File, rank: Rank, board: Board) {
        super(color, file, rank, board, bishopDirections);
    }
}
