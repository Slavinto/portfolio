import { Board } from "@/lib/games/chess/game-logic/main/board/board";
import { Piece } from "@/lib/games/chess/game-logic/main/piece";
import { Position } from "@/lib/games/chess/game-logic/main/position";

export type Color = "White" | "Black";
export type File = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type PieceType =
    | "Pawn"
    | "Rook"
    | "Knight"
    | "Bishop"
    | "Queen"
    | "King";

export type PieceConstructor = new (
    color: Color,
    file: File,
    rank: Rank,
    board: Board
) => Piece;

export type OfferType = "draw" | "rematch" | "layoff";
export type OfferStatus = "pending" | "accepted" | "declined" | "expired";
export type OfferRow = {
    id: string;
    game_id: string;
    from_player: string;
    to_player: string;
    type: OfferType;
    status: OfferStatus;
    created_at: string;
    expires_at: string;
};

export type GameStatus =
    | "check"
    | "checkmate"
    | "draw"
    | "layed-off"
    | "layoff-pending"
    | "ongoing"
    | "resigned"
    | "stalemate"
    | "waiting";

export type MatchStatus = "waiting_for_opponent" | "ongoing" | "finished";

export type BoardAction =
    | {
          type: "START_NEW_GAME";
      }
    | { type: "MOVE_PIECE"; payload: { from: Position; to: Position } }
    | { type: "UNDO_MOVE" }
    | { type: "SELECT_PIECE"; payload: { position: Position } }
    | { type: "UNSELECT_PIECE" }
    | { type: "HYDRATE_FROM_SERVER"; payload: PersistedState }
    | {
          type: "SET_PLAYER_IDS";
          payload: { playerId: string | null; opponentId: string | null };
      };

export type Directions = [number, number][];

export type PieceClass = Record<
    PieceType,
    new (color: Color, file: File, rank: Rank, board: Board) => any
    // typeof Piece
>;

export type GameRow = {
    id: string;
    status: GameStatus;
    turn: Color;
    player_white: string | null;
    player_black: string | null;
    creator_id: string | null;
    state_json: PersistedState;
};

export type PersistedState = {
    board: PersistedBoard; // JSON-serializable form of your board
    playerColor: Color;
    selected: PersistedPosition | null;
};

export type PersistedBoard = {
    status: GameStatus;
    pieces: PersistedPiece[];
    moveHistoryList: PersistedMove[];
    currentTurn: Color;
    capturedPieces: PersistedPiece[];
    promotedPawns: PersistedPiece[];
};

export type PersistedPiece = {
    id: string;
    type: PieceType;
    color: Color;
    position: PersistedPosition;
    hasMoved?: boolean;
};

export type PersistedMove = {
    from: PersistedPosition;
    to: PersistedPosition;
    piece: PersistedPiece;
    capturedPiece?: PersistedPiece;

    isEnPassant?: boolean;
    capturedPawnPosition?: PersistedPosition;
    isCastling?: boolean;

    rook?: PersistedPiece;
    rookFrom?: PersistedPosition;
    rookTo?: PersistedPosition;

    isPromotion?: boolean;
    promotedTo?: PersistedPiece;

    moveNumber: number;
    playerColor?: Color;
};

export type PersistedPosition = {
    file: File;
    rank: Rank;
};
