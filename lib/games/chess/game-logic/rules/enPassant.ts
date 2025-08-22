import { Move } from "@/types/games/chess";
import type { Piece } from "../../game-logic/main/piece";
import { Position } from "../../game-logic/main/position";
import { Pawn } from "../../game-logic/pieces/pawn";

export function isEnPassant(
    // opponent's piece at the target position
    targetPiece: Piece | undefined,
    // one of the valid positions for the piece
    move: Position,
    // last move made in the game
    lastMove: Move | null,
    // the piece that is being moved
    piece: Piece
): boolean | void {
    if (Array.isArray(lastMove)) {
        // type guard against castling move
        return;
    }
    if (
        // the target position is empty
        !targetPiece &&
        // and we have a last move
        lastMove &&
        // and the last move was a pawn move
        lastMove.piece instanceof Pawn &&
        // and the last move was made by the opponent
        lastMove.piece.color !== piece.color
    ) {
        const { from, to } = lastMove;
        const movedTwoRanks = Math.abs(to.rank - from.rank) === 2;
        const sameFile = to.file === move.file;
        const correctRank =
            piece.color === "White"
                ? piece.position.rank === 5 && move.rank === 6
                : piece.position.rank === 4 && move.rank === 3;

        if (
            movedTwoRanks &&
            sameFile &&
            correctRank &&
            to.rank === piece.position.rank
        ) {
            return true;
        }
    }
}
