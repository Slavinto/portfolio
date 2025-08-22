import { Color, File, Rank } from "@/types/games/chess";
import type { Board } from "../main/board/board";
import { Piece } from "../main/piece";
import { Position } from "../main/position";
import { files } from "@/data/games/chess";

export class Pawn extends Piece {
    constructor(color: Color, file: File, rank: Rank, board: Board) {
        super(color, file, rank, "Pawn", board);
    }

    public getPossibleMoves(): Position[] {
        const isPieceWhite = this.color === "White";
        const curPos = this.position;
        const curFile = curPos.file;
        const initRank = isPieceWhite ? 2 : 7;
        const curRank = curPos.rank;

        const direction = isPieceWhite ? 1 : -1;

        const moves: Position[] = [];

        // Move 1 step forward
        const oneStepRank = (curRank + direction) as Rank;
        if (this.isRankInBounds(oneStepRank)) {
            moves.push(new Position(curFile, oneStepRank));
        }

        // Move 2 step forward
        if (curRank === initRank) {
            const twoStepRank = (curRank + 2 * direction) as Rank;
            if (this.isRankInBounds(twoStepRank)) {
                moves.push(new Position(curFile, twoStepRank));
            }
        }

        // Capture diagonally left and right
        const diagLeft = this.getLeftFile(curFile);
        const diagRight = this.getRightFile(curFile);
        const diagRank = (curRank + direction) as Rank;

        if (diagLeft && this.isRankInBounds(diagRank)) {
            moves.push(new Position(diagLeft, diagRank));
        }
        if (diagRight && this.isRankInBounds(diagRank)) {
            moves.push(new Position(diagRight, diagRank));
        }

        return moves;
    }

    private getLeftFile(file: File): File | null {
        const index = files.indexOf(file);
        return index > 0 ? files[index - 1] : null;
    }

    private getRightFile(file: File): File | null {
        const index = files.indexOf(file);
        return index < files.length - 1 ? files[index + 1] : null;
    }
}
