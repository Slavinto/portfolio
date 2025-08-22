import { files, ranks } from "@/data/games/chess";
import {
    Color,
    File,
    PieceConstructor,
    PieceType,
    Rank,
} from "@/types/games/chess";
import { Pawn } from "@/lib/games/chess/game-logic/pieces/pawn";
import { Rook } from "@/lib/games/chess/game-logic/pieces/rook";
import { Knight } from "@/lib/games/chess/game-logic/pieces/knight";
import { Bishop } from "@/lib/games/chess/game-logic/pieces/bishop";
import { Queen } from "@/lib/games/chess/game-logic/pieces/queen";
import { King } from "@/lib/games/chess/game-logic/pieces/king";
import { Board, Piece, Position } from "@/lib/games/chess/game-logic/main";

export function isValidPosition(f: number, r: number): boolean {
    return (
        r >= 1 &&
        r <= ranks.length &&
        f >= files[0].charCodeAt(0) &&
        f <= files[files.length - 1].charCodeAt(0)
    );
}

const PieceClassMap: Record<PieceType, PieceConstructor> = {
    Pawn,
    Rook,
    Knight,
    Bishop,
    Queen,
    King,
};

export function createPieceOnBoard(
    type: PieceType,
    color: Color,
    position: Position,
    board: Board
): Piece {
    const PieceClass = PieceClassMap[type];
    const newPiece = new PieceClass(color, position.file, position.rank, board);
    return newPiece;
}

export function isSamePiece(piece1: Piece, piece2: Piece): boolean {
    return piece1.id === piece2.id;
}

export function isLegalToMoveToPosition(
    board: Board,
    piece: Piece,
    to: Position
): boolean {
    const legalMoves = board.getLegalMoves(piece);
    return !!legalMoves.find((lm) => lm.equals(to));
}

export function getDiff(from: File, to: File): number;
export function getDiff(from: Rank, to: Rank): number;

export function getDiff(from: File | Rank, to: File | Rank): number {
    if (typeof from === "string" && typeof to === "string") {
        return from.charCodeAt(0) - to.charCodeAt(0);
    }
    if (typeof from === "number" && typeof to === "number") {
        return from - to;
    }
    throw new Error("Failed to calculate position diff. Invalid input type");
}
