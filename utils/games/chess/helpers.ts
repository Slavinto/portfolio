import {
    BoardState,
    Color,
    File,
    GameStatus,
    LocalStateToPersist,
    Move,
    PersistedBoard,
    PersistedMove,
    PersistedPiece,
    PersistedPosition,
    PersistedState,
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
import {
    files,
    GAME_STATUSES,
    ranks,
} from "@/data/games/chess/constants/board";
import { Board } from "@/lib/games/chess/game-logic/main/board/board";
import { Piece } from "@/lib/games/chess/game-logic/main/piece";
import { Position } from "@/lib/games/chess/game-logic/main/position";
import { STATUS_COLORS } from "@/data/games/chess/objects";
import { pushMove } from "@/lib/services/chess-db";

export function isValidPosition(f: number, r: number): boolean {
    return (
        r >= 1 &&
        r <= ranks.length &&
        f >= files[0].charCodeAt(0) &&
        f <= files[files.length - 1].charCodeAt(0)
    );
}

export function getPositionForCell(row: number, col: number, yourColor: Color) {
    // For white: files A..H left→right, ranks 8..1 top→bottom
    // For black: files H..A left→right, ranks 1..8 top→bottom (reversed)
    const fileIndex = yourColor === "Black" ? 7 - col : col; // 0..7
    const rank = (yourColor === "Black" ? row + 1 : 8 - row) as Rank;
    const file = String.fromCharCode(97 + fileIndex).toUpperCase() as File;
    return new Position(file, rank);
}

export function getStatusColor(status: GameStatus) {
    return STATUS_COLORS[status] ?? STATUS_COLORS["ongoing"];
}

export const PieceClassMap: Record<PieceType, PieceConstructor> = {
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

export function isGameStatus(value: any): value is GameStatus {
    return GAME_STATUSES.includes(value as GameStatus);
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
        return to.charCodeAt(0) - from.charCodeAt(0);
    }
    if (typeof from === "number" && typeof to === "number") {
        return to - from;
    }
    throw new Error("Failed to calculate position diff. Invalid input type");
}

export async function onCommittedMove(
    id: string,
    gameStatus: GameStatus,
    move: Move,
    board: Board
) {
    // Convert to persistable state
    const nextState = toPersistedState(board);
    const persistedMove = toPersistedMove(move);

    await pushMove(id, gameStatus, nextState, persistedMove);
}

export function checkChessGameState(state: BoardState): boolean {
    if (state.player && state.gameRow && state.board) {
        return true;
    }

    return false;
}

export function parseState<T>(state_json: unknown): T {
    if (typeof state_json === "string") {
        try {
            return JSON.parse(state_json) as T;
        } catch (error) {
            console.error(
                "Failed to parse state. Invalid format",
                error as Error
            );
            return {} as T;
        }
    }
    return state_json as T;
}

export function toPersistedBoard(board: Board): PersistedBoard {
    return {
        pieces: board.pieces.map((p) => p.toPersisted()),
        capturedPieces: board.capturedPieces.map((p) => p.toPersisted()),
        moveHistoryList: board.moveHistoryList.map((m) => toPersistedMove(m)),
        currentTurn: board.currentTurn,
        status: board.getBoardStatus(),
        promotedPawns: board.promotedPawns.map((p) => p.toPersisted()),
    };
}

export function toPersistedState(board: Board): PersistedState {
    return {
        board: toPersistedBoard(board),
    };
}

export function toPersistedMove(move: Move): PersistedMove {
    return {
        from: move.from.toPersisted(),
        to: move.to.toPersisted(),
        piece: move.piece.toPersisted(),
        capturedPiece: move.capturedPiece?.toPersisted(),

        // special cases:
        isEnPassant: move?.isEnPassant,
        capturedPawnPosition: move?.capturedPawnPosition?.toPersisted(),

        isCastling: move?.isCastling,
        rook: move?.rook?.toPersisted(),
        rookFrom: move?.rookFrom?.toPersisted(),
        rookTo: move?.rookTo?.toPersisted(),

        isPromotion: move?.isPromotion,
        promotedTo: move?.promotedTo?.toPersisted(),

        moveNumber: move.moveNumber,
        playerColor: move?.playerColor,
    };
}
