import { Board } from "@/lib/games/chess/game-logic/main/board/board";
import { Piece } from "@/lib/games/chess/game-logic/main/piece";
import { Position } from "@/lib/games/chess/game-logic/main/position";
import { Player } from "./interfaces";
import { GAME_STATUSES } from "@/data/games/chess/constants/board";

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

export type OfferType = "draw" | "rematch" | "layoff" | "resume";
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

// lives in gameRow
export type GameStatus = (typeof GAME_STATUSES)[number];

// lives in board
export type BoardStatus = "check" | "checkmate" | "in-progress" | "stalemate";

export type MatchStatus = "waiting_for_opponent" | "ongoing" | "finished";

export type BoardAction =
    | { type: "INIT_GAME"; payload: { gameRow: GameRow } }
    | { type: "INIT_PLAYER"; payload: { player: Player } }
    | { type: "INIT_CHAT_MESSAGES"; payload: { chatMessages: ChessMessage[] } }
    | { type: "MOVE_PIECE"; payload: { from: Position; to: Position } }
    | { type: "UNDO_MOVE" }
    | { type: "RESET_GAME_STATE" }
    | { type: "SELECT_PIECE"; payload: { position: Position } }
    | { type: "SET_IS_LOADING"; payload: { isLoading: boolean } }
    | { type: "UNSELECT_PIECE" }
    | { type: "HYDRATE_FROM_SERVER"; payload: { gameRow: GameRow } }
    | { type: "ADD_CHAT_MESSAGE"; payload: { chatMessage: ChessMessage } };

export type ChessMessage = {
    id: string;
    game_id: string;
    sender: string;
    message: string;
    created_at: string;
};

export type Directions = [number, number][];

export type PieceClass = Record<
    PieceType,
    new (color: Color, file: File, rank: Rank, board: Board) => any
>;

export type GameRow = {
    id: string;
    status: GameStatus;
    turn: Color;
    player_white: string | null;
    player_black: string | null;
    creator_id: string | null;
    state_json: PersistedState;
    winner: string | null;
    created_at: string;
    updated_at: string;
};

export type PersistedState = {
    board: PersistedBoard;
};

export type PersistedBoard = {
    status: BoardStatus;
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
