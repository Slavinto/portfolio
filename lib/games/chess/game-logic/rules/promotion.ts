import { Move, PieceType } from "@/types/games/chess";
import type { Board } from "../main/board/board";
import type { Piece } from "../main/piece";

export function promotion(board: Board, move: Move, type: PieceType): Piece {
    if (
        move &&
        move.piece.type === "Pawn" &&
        ((move.piece.color === "White" && move.to.rank === 8) ||
            (move.piece.color === "Black" && move.to.rank === 1))
    ) {
        board.removePiece(move.piece, true);

        const color = move.piece.color;
        const pawnPosition = move.to;

        // Logic for promoting a pawn to a higher piece
        const promotedTo = board.createPiece(type, color, pawnPosition);

        return promotedTo;
    }
    throw new Error("Promotion can only occur on the last rank.");
}
