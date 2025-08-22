import { Board, Piece, Position } from "@/lib/games/chess/game-logic/main";
import { Color, MatchStatus } from "./types";
import { Rook } from "@/lib/games/chess/game-logic/pieces/rook";

export interface IBoardInitializer {
    initializeBoard(board: Board): void;
}

export interface BoardState {
    board: Board;
    playerColor: Color;
    selected: Position | null;
}

export interface Move {
    from: Position;
    to: Position;
    piece: Piece; // actual piece that moved
    capturedPiece?: Piece;

    // special cases:
    isEnPassant?: boolean;
    capturedPawnPosition?: Position; // actual square of an opponent's captured pawn

    isCastling?: boolean;
    // from and to props belong to the King piece and rook from and to are optional
    rook?: Rook;
    rookFrom?: Position;
    rookTo?: Position;

    isPromotion?: boolean;
    promotedTo?: Piece; // new Piece instance after promotion

    moveNumber: number;
    playerColor?: Color;
}

export interface Match {
    id: string;
    board: Board;
    status: MatchStatus;
    host: { id: string; color: Color };
    guest: { id: string; color: Color };
    createdAt: number;
}
