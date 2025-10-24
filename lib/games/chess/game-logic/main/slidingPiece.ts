import { Color, Directions, File, Rank } from "@/types/games/chess";
import type { Board } from "./board/board";
import { Piece } from "./piece";
import { Position } from "./position";
import { isValidPosition } from "@/utils/games/chess/helpers";

export abstract class SlidingPiece extends Piece {
    protected directions: Directions = [];

    constructor(
        color: Color,
        file: File,
        rank: Rank,
        board: Board,
        directions: Directions
    ) {
        super(color, file, rank, board);
        this.directions = directions;
    }

    getPossibleMoves(): Position[] {
        const moves: Position[] = [];
        const { file, rank } = this.position;

        for (const [df, dr] of this.directions) {
            let f = file.charCodeAt(0);
            let r = rank;

            while (true) {
                f += df;
                r += dr;

                if (!isValidPosition(f, r)) break;

                const pos = new Position(
                    String.fromCharCode(f) as File,
                    r as Rank
                );
                const target = this.board.getPieceAtPosition(pos);

                if (!target) {
                    moves.push(pos);
                } else {
                    if (target.color !== this.color) {
                        moves.push(pos); // capture
                    }
                    break; // stop in any case after hitting a piece
                }
            }
        }
        return moves;
    }
}
