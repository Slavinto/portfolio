import type { Board } from "../main/board/board";
import { SteppingPiece } from "../main/steppingPiece";
import { Position } from "../main/position";
import type { Rook } from "./rook";
import { Color, File, Rank } from "@/types/games/chess";
import { kingSteps } from "@/data/games/chess";

export class King extends SteppingPiece {
    public hasMoved: boolean = false;

    constructor(color: Color, file: File, rank: Rank, board: Board) {
        super(color, file, rank, "King", board, kingSteps);
    }

    getPossibleMoves(): Position[] {
        const moves = super.getPossibleMoves();
        return [...moves, ...this.getCastlingMoves()];
    }

    getCastlingMoves() {
        const moves: Position[] = [];

        if (this.hasMoved) {
            return moves;
        }

        // castling rank depends on color
        const rank = this.color === "White" ? 1 : 8;

        const kingsideRook = this.board.getPieceAtPosition(
            new Position("H", rank)
        );
        const queensideRook = this.board.getPieceAtPosition(
            new Position("A", rank)
        );
        // checking kingside rook
        if (
            kingsideRook &&
            this.canCastleWithRook(kingsideRook as Rook, ["F", "G"], rank)
        ) {
            moves.push(new Position("G", rank));
        }

        // checking queenside rook
        if (
            queensideRook &&
            this.canCastleWithRook(queensideRook as Rook, ["B", "C", "D"], rank)
        ) {
            moves.push(new Position("C", rank));
        }

        return moves;
    }

    private canCastleWithRook(
        rook: Rook,
        betweenFiles: File[],
        rank: Rank
    ): boolean {
        if (!rook || rook.type !== "Rook" || rook.hasMoved) {
            return false;
        }

        for (const file of betweenFiles) {
            const obstacle = this.board.getPieceAtPosition(
                new Position(file, rank)
            );

            if (obstacle) {
                return false;
            }
        }

        return true;
    }
}
