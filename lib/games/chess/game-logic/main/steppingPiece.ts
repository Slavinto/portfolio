import { Color, Directions, File, Rank } from "@/types/games/chess";
import type { Board } from "./board/board";
import { Piece } from "./piece";
import { Position } from "./position";
import { isValidPosition } from "@/utils/games/chess/helpers";

export abstract class SteppingPiece extends Piece {
    protected steps: Directions = [];

    constructor(
        color: Color,
        file: File,
        rank: Rank,
        board: Board,
        steps: Directions
    ) {
        super(color, file, rank, board);
        this.steps = steps;
    }

    getPossibleMoves(): Position[] {
        const moves: Position[] = [];

        for (const [df, dr] of this.steps) {
            const f = this.position.file.charCodeAt(0) + df;
            const r = this.position.rank + dr;

            if (!isValidPosition(f, r)) continue;

            const pos = new Position(String.fromCharCode(f) as File, r as Rank);

            const target = this.board.getPieceAtPosition(pos);

            if (!target || target.color !== this.color) {
                moves.push(pos);
            }
        }

        return moves;
    }
}
