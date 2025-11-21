import { Board } from "@/lib/games/chess/game-logic/main/board/board";
import {
    ChessMessage,
    Color,
    GameStatus,
    MatchStatus,
    PersistedMove,
} from "./types";
import { Position } from "@/lib/games/chess/game-logic/main/position";
import { Piece } from "@/lib/games/chess/game-logic/main/piece";

export interface IBoardInitializer {
    initializeBoard(board: Board): void;
}

export interface BoardState {
    board: Board;
    gameId: string | null;
    gameStatus: GameStatus;
    playerColor: Color;
    playerId: string | null;
    opponentId: string | null;
    selected: Position | null;
    chatMessages: ChessMessage[];
}

export interface LocalStateToPersist {
    board: Board;
    playerColor: Color;
    selected: Position | null;
}

export interface SupabaseMove {
    created_at: string;
    game_id: string;
    id: number;
    move_json: PersistedMove;
    move_number: number;
    player_id: string;
}

// export interface SupabaseGame {
//     created_at: string;
//     creator_id: string;
//     id: string;
//     player_black: string | null;
//     player_white: string | null;
//     state_json: PersistedState;
//     status: GameStatus;
//     turn: Color;
//     updated_at: string;
// }

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
    rook?: Piece;
    rookFrom?: Position;
    rookTo?: Position;

    isPromotion?: boolean;
    promotedTo?: Piece; // new Piece instance after promotion

    moveNumber: number;
    playerColor: Color;
}

export interface Match {
    id: string;
    board: Board;
    status: MatchStatus;
    host: { id: string; color: Color };
    guest: { id: string; color: Color };
    createdAt: number;
}
