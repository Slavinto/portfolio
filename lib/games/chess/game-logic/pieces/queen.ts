import { Color, File, PieceType, Rank } from "@/types/games/chess";
import type { Board } from "../main/board/board";
import { SlidingPiece } from "../main/slidingPiece";
import {
    bishopDirections,
    rookDirections,
} from "@/data/games/chess/constants/board";

export class Queen extends SlidingPiece {
    protected readonly _type: PieceType = "Queen";
    public get type(): PieceType {
        return this._type;
    }

    constructor(color: Color, file: File, rank: Rank, board: Board) {
        super(color, file, rank, board, [
            ...rookDirections,
            ...bishopDirections,
        ]);
    }
}
