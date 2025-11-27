import {
    BoardStatus,
    Color,
    Move,
    PersistedBoard,
    PersistedMove,
    PersistedState,
    PieceType,
} from "@/types/games/chess";
import { Piece } from "../piece";
import {
    createPieceOnBoard,
    getDiff,
    isSamePiece,
    toPersistedBoard,
    PieceClassMap,
} from "@/utils/games/chess/helpers";
import { Position } from "../position";
import { isCastlingValid, isEnPassant, promotion } from "../../rules";
import {
    getInitialPieceSetup,
    PieceInit,
} from "@/data/games/chess/constants/pieceInit";
import { pieceClasses } from "../../pieces";

export class Board {
    private _pieces: Piece[] = [];
    public get pieces() {
        return this._pieces;
    }
    public set pieces(pieces: Piece[]) {
        this._pieces = pieces;
    }

    private moveHistory: Move[] = [];
    public get moveHistoryList(): Move[] {
        return this.moveHistory;
    }
    public set moveHistoryList(moves: Move[]) {
        this.moveHistory = moves;
    }

    private _currentTurn: Color = "White";
    public get currentTurn(): Color {
        return this._currentTurn;
    }

    public set currentTurn(turn: Color) {
        if (turn !== this._currentTurn) {
            // Switch turn
            this._currentTurn = turn;
        }
    }

    private _selectedPiecePosition: Position | null = null;
    public get selectedPiecePosition(): Position | null {
        return this._selectedPiecePosition;
    }
    public set selectedPiecePosition(piecePos: Position | null) {
        this._selectedPiecePosition = piecePos;
    }

    private _capturedPieces: Piece[] = [];
    public get capturedPieces(): Piece[] {
        return this._capturedPieces;
    }

    public set capturedPieces(pieces: Piece[]) {
        this._capturedPieces = pieces;
    }

    private _promotedPawns: Piece[] = [];
    // private _promotedPawns: Pawn[] = [];
    public get promotedPawns() {
        return this._promotedPawns;
    }
    public set promotedPawns(p: Piece[]) {
        // public set promotedPawns(p: Pawn[]) {
        this._promotedPawns = p;
    }

    constructor() {
        this.reset();
    }

    clone(): Board {
        const clonedBoard = new Board();
        // reinstantiate all pieces in cloned board
        clonedBoard.pieces = this.pieces.map((piece) => {
            const cp = piece.clone();
            cp.board = clonedBoard;
            return cp;
        });
        clonedBoard.capturedPieces = this.capturedPieces.map((piece) => {
            const cp = piece.clone();
            cp.board = clonedBoard;
            return cp;
        });
        clonedBoard.promotedPawns = this.promotedPawns.map((piece) => {
            const cp = piece.clone();
            cp.board = clonedBoard;
            return cp;
        });
        const byId = new Map(
            [
                ...clonedBoard.pieces,
                ...clonedBoard.capturedPieces,
                ...clonedBoard.promotedPawns,
            ].map((cp) => [cp.id, cp])
        );

        clonedBoard.currentTurn = this.currentTurn;

        clonedBoard.moveHistoryList = this.moveHistoryList.map((m) => {
            const p = byId.get(m.piece?.id);
            if (!p) {
                const msg = "Failed to find a piece with id ";
                console.info(msg, m?.piece?.id);
                throw new Error(`${msg}${m?.piece?.id}`);
            }
            const hMove = { ...m, piece: p };
            // basically we need to pass pieces to cloned board instance with their old ids'
            // special cases:
            // capturing
            if (m?.capturedPiece) {
                const cp = byId.get(m?.capturedPiece?.id)!;
                return { ...hMove, capturedPiece: cp };
            }
            // castling
            if (m?.isCastling && m?.rook?.type === "Rook") {
                const r = byId.get(m.rook?.id);
                return { ...hMove, rook: r };
            }
            // promotion
            if (m?.isPromotion) {
                const pt = byId.get(m?.promotedTo?.id || "")!;
                return { ...hMove, promotedTo: pt };
            }
            return hMove;
        });
        return clonedBoard;
    }

    createPiece(type: PieceType, color: Color, position: Position): Piece {
        const piece = createPieceOnBoard(type, color, position, this);
        this.pieces.push(piece);

        return piece;
    }

    static fromPersistedState(state: PersistedState): Board {
        const board = new Board();
        const persistedBoard = state?.board;
        if (!persistedBoard) {
            console.info("Invalid persisted board state. Resetting board.");
            return board;
        }
        // console.log({ boardInFromPersisted: board });
        // console.log({ boardInFromPersisted: state.board });
        board.pieces =
            persistedBoard.pieces?.map((p) =>
                Piece.fromPersisted(p, board, PieceClassMap)
            ) ?? [];

        board.capturedPieces =
            persistedBoard.capturedPieces?.map((p) =>
                Piece.fromPersisted(p, board, PieceClassMap)
            ) ?? [];

        board.promotedPawns =
            persistedBoard.promotedPawns?.map((p) =>
                Piece.fromPersisted(p, board, PieceClassMap)
            ) ?? [];

        board.currentTurn = persistedBoard.currentTurn;

        // hydrate move history (reference by ID)
        const byId = new Map(board.pieces.map((p) => [p.id, p]));
        board.moveHistoryList = persistedBoard.moveHistoryList.map((m) =>
            board.hydratePersistedMove(m)
        );
        console.log({ hydratedBoard: board });
        return board;
    }

    getBoardStatus(): BoardStatus {
        if (this.isCheckmate(this.currentTurn)) {
            return "checkmate";
        }
        if (this.isStalemate(this.currentTurn)) {
            return "stalemate";
        }
        if (this.isInCheck(this.currentTurn)) {
            return "check";
        }
        return "in-progress";
    }

    getLastMove(): Move | null {
        return this.moveHistory[this.moveHistory.length - 1] || null;
    }

    getPieceAtPosition(position: Position): Piece | undefined {
        return this.pieces.find((piece) => piece.position.equals(position));
    }

    getLegalMoves(piece: Piece): Position[] {
        const possibleMoves = piece.getPossibleMoves();

        return possibleMoves.filter((move) => {
            const targetPiece = this.getPieceAtPosition(move);
            if (piece.type === "Pawn") {
                const fileDiff = Math.abs(
                    piece.position.file.charCodeAt(0) - move.file.charCodeAt(0)
                );
                const rankDiff = move.rank - piece.position.rank;

                const isDiagonal = fileDiff === 1;
                const isForward =
                    piece.color === "White" ? rankDiff > 0 : rankDiff < 0;

                // 🟨 Diagonal capture (normal or en passant)
                if (isDiagonal && isForward) {
                    // Regular capture
                    if (targetPiece && targetPiece.color !== piece.color) {
                        return true;
                    }

                    // 🔶 En passant
                    const lastMove = this.getLastMove();

                    if (!lastMove) {
                        return false; // No last move to check against
                    }
                    if (isEnPassant(targetPiece, move, lastMove, piece)) {
                        return true;
                    }

                    return false; // Diagonal move with no valid capture
                }

                // ⬆️ Forward move (must be into empty square)
                if (!isDiagonal) {
                    return !targetPiece;
                }

                return false; // Block invalid cases
            }

            // ✅ Generic rule for non-pawn pieces:
            return !targetPiece || targetPiece.color !== piece.color;
        });
    }

    getAllPieces(): Piece[] {
        return [...this.pieces];
    }

    getThisBoard(): Board {
        return this;
    }

    getWinnerOnResign(resignedPlayer: Color): string {
        return resignedPlayer === "White" ? "Black" : "White";
    }

    hasLegalMoves(color: Color): boolean {
        const myPieces = this.getAllPieces().filter((p) => p.color === color);
        for (const piece of myPieces) {
            const legalMoves = this.getLegalMoves(piece);

            for (const move of legalMoves) {
                const simulatedBoard = this.simulateMove(piece, move);
                if (!simulatedBoard.isInCheck(color)) {
                    return true; // Found a legal move that doesn't leave the king in check
                }
            }
        }
        return false; // No legal moves found for the given color
    }

    hydratePersistedMove(move: PersistedMove): Move {
        const { to, from, piece, moveNumber } = move;
        return {
            from: new Position(from.file, from.rank),
            to: new Position(to.file, to.rank),
            piece: Piece.fromPersisted(piece, this, pieceClasses),
            capturedPiece: move?.capturedPiece
                ? Piece.fromPersisted(move.capturedPiece, this, pieceClasses)
                : undefined,

            // special cases:
            isEnPassant: move?.isEnPassant ? move.isEnPassant : undefined,
            capturedPawnPosition: move?.capturedPawnPosition
                ? new Position(
                      move.capturedPawnPosition.file,
                      move.capturedPawnPosition.rank
                  )
                : undefined,

            isCastling: move?.isCastling ? move.isCastling : undefined,
            rook: move?.rook
                ? Piece.fromPersisted(move.rook, this, pieceClasses)
                : undefined,
            rookFrom: move?.rookFrom
                ? new Position(move.rookFrom.file, move.rookFrom.rank)
                : undefined,
            rookTo: move?.rookTo
                ? new Position(move.rookTo.file, move.rookTo.rank)
                : undefined,

            isPromotion: move?.isPromotion ? move.isPromotion : undefined,
            promotedTo: move?.promotedTo
                ? Piece.fromPersisted(move.promotedTo, this, pieceClasses)
                : undefined,

            moveNumber: move.moveNumber,
            playerColor: piece.color,
        };
    }

    isCheckmate(color: Color): boolean {
        return this.isInCheck(color) && !this.hasLegalMoves(color);
    }

    isInCheck(color: Color): boolean {
        const kingPosition = this.pieces.find((piece) => {
            return piece.color === color && piece.type === "King";
        })?.position;

        if (!kingPosition) {
            console.info(`No ${color} king found`);
            return false;
        }
        const isAttacked = this.isSquareAttacked(kingPosition, color);
        return isAttacked;
    }

    isStalemate(color: Color): boolean {
        return !this.isInCheck(color) && !this.hasLegalMoves(color);
    }

    isSquareAttacked(pos: Position, color: Color): boolean {
        const allPieces = this.getAllPieces();

        // Check if the square is attacked by any opponent piece
        return allPieces.some((piece) => {
            // Skip pieces of the same color
            if (piece.color === color) {
                return false;
            }
            const legalMoves = this.getLegalMoves(piece);
            return legalMoves.some((move) => move.equals(pos));
        });
    }

    movePiece(
        from: Position,
        to: Position,
        promotionType?: PieceType
    ): Move | null {
        const piece = this.getPieceAtPosition(from);
        if (!piece) {
            console.info("No piece found at the source position");
            return null;
        }
        if (piece.color !== this.currentTurn) {
            console.info("It's not your turn");
            return null;
        }
        if (from.equals(to)) {
            console.info(
                "No move made, source and target positions are the same"
            );
            return null;
        }
        let move: Move = {
            from,
            to,
            piece,
            playerColor: piece.color,
            moveNumber: this.moveHistoryList.length + 1,
        };

        const isMoveLegal = this.getLegalMoves(piece).find((lm) =>
            lm.equals(to)
        );
        const lastMovedPiece = this.getLastMove()?.piece;

        if (isMoveLegal) {
            // Checking for is the king in check
            const tmpBoard = this.simulateMove(piece, to);
            if (tmpBoard.isInCheck(piece.color)) {
                console.info(
                    "Failed to move a piece. This move puts or leaves your king in check"
                );
                return null;
            }

            // finding out if some piece is going to be captured
            const capturedPiece = this.getPieceAtPosition(to);
            const isEnPassantCapture =
                isEnPassant(capturedPiece, to, this.getLastMove(), piece) &&
                lastMovedPiece;
            const isCaptured = capturedPiece || isEnPassantCapture;

            // handling capture moves
            if (isCaptured) {
                // plain capture case
                if (capturedPiece) {
                    move = { ...move, capturedPiece };
                    this.removePiece(capturedPiece);
                }

                // enPassant capture case
                if (isEnPassantCapture) {
                    move = {
                        ...move,
                        isEnPassant: true,
                        capturedPawnPosition: lastMovedPiece.position,
                    };
                    this.removePiece(lastMovedPiece);
                }
            }
            // moves with no capture
            if (!isCaptured) {
                // castling
                if (piece.type === "King") {
                    const fileDiff = getDiff(from.file, to.file);
                    if (
                        Math.abs(fileDiff) === 2 &&
                        isCastlingValid(move, this)
                    ) {
                        const isKingSide = fileDiff > 0;
                        const rank = piece.color === "White" ? 1 : 8;

                        const rookFrom = new Position(
                            isKingSide ? "H" : "A",
                            rank
                        );

                        const rookTo = new Position(
                            isKingSide ? "F" : "D",
                            rank
                        );

                        const rook = this.getPieceAtPosition(rookFrom);

                        if (!rook || rook.type !== "Rook") {
                            return null;
                        }

                        move = {
                            ...move,
                            rook,
                            rookFrom,
                            rookTo,
                            isCastling: true,
                        };

                        // moving rook piece and king is moved at the end
                        rook.position = rookTo;
                    }
                }
                // castling end
            }

            // Move the piece to the target position
            piece.position = to;

            // Handle promotion
            if (
                piece.type === "Pawn" &&
                to.rank === (piece.color === "White" ? 8 : 1)
            ) {
                const promotedTo = promotion(
                    this,
                    move,
                    promotionType ?? "Queen"
                );
                move = {
                    ...move,
                    isPromotion: true,
                    promotedTo,
                };
            }

            // Record the move in history
            this.moveHistory = [...this.moveHistory, move];

            // switch turns after a successful move
            this.currentTurn = this.currentTurn === "White" ? "Black" : "White";

            return move;
        } else {
            // If the move is not valid, return null
            console.info(
                `Invalid move from ${from.file}${from.rank} to ${to.file}${to.rank}`
            );
            return null;
        }
    }

    removePiece(piece: Piece, isPromotion: boolean = false): void {
        this.pieces = this.pieces.filter((p) => !isSamePiece(p, piece));
        if (isPromotion) {
            if (piece.type === "Pawn") {
                this.promotedPawns = [...this.promotedPawns, piece];
                console.info(`Moved piece ${piece.id} to promoted pawns`);
            } else {
                // this is a piece that's left after undoing a
                // promotion move so we can just delete it
                // completely
                console.info(`Piece ${piece} removed.`);
            }
        } else {
            this.capturedPieces = [...this.capturedPieces, piece];
            console.info(`Removed piece ${piece.id} from the board`);
        }
    }

    reset() {
        this.moveHistoryList = [];
        this.capturedPieces = [];
        this.currentTurn = "White";
        this.pieces = getInitialPieceSetup().map((p: PieceInit) =>
            createPieceOnBoard(
                p.type,
                p.color,
                new Position(p.file, p.rank),
                this
            )
        );
        // console.log({ thisPieces: this.pieces });
    }

    restore(piece: Piece) {
        this.pieces.push(piece);
        this.capturedPieces = this.capturedPieces.filter(
            (p) => !isSamePiece(p, piece)
        );
    }

    simulateMove(piece: Piece, to: Position): Board {
        const clonedBoard: Board = this.clone();
        const clonedPiece = clonedBoard.getPieceAtPosition(piece.position);

        if (!clonedPiece) {
            const msg = `No piece found at the source position ${piece.position.file}${piece.position.rank} for simulation`;
            console.info(msg);
            throw new Error(msg);
        }

        const capturedPiece = clonedBoard.getPieceAtPosition(to);
        if (capturedPiece) {
            clonedBoard.pieces = clonedBoard.pieces.filter(
                (p) => p !== capturedPiece
            );
        }

        clonedPiece.position = to;
        clonedBoard.currentTurn =
            clonedBoard.currentTurn === "White" ? "Black" : "White";
        clonedBoard.moveHistory = [
            {
                piece: clonedPiece,
                from: piece.position,
                to,
                moveNumber: this.moveHistoryList.length + 1,
                playerColor: piece.color,
            },
        ];

        return clonedBoard;
    }

    toPersisted(): PersistedBoard {
        return toPersistedBoard(this);
    }

    undoLastMove(): void {
        // so what i want to do here is basically to find out
        // whether there was a piece removed on the last move and
        // if so restore it and then remove last item from move
        // history
        const lastMove = this.moveHistory.pop();
        let pieceToRestore: Piece | undefined;
        const capturedPiece = lastMove?.capturedPiece;

        const isCastling = lastMove?.isCastling;
        const isEnPassant = lastMove?.isEnPassant;
        const isPromotion = lastMove?.isPromotion;
        const isSpecial = isCastling || isEnPassant || isPromotion;

        if (!lastMove) {
            console.info("No moves to undo");
            return;
        }
        console.log({ lastMove });
        const { piece, from } = lastMove;

        // Handle castling
        // We need to check if the last move was a castling move
        if (isCastling && lastMove?.rookFrom && lastMove?.rook) {
            // Handling rook position -> moving it back to its original position
            lastMove.rook.position = lastMove.rookFrom;
        }

        // enPassant
        if (isEnPassant) {
            const capturedPawnPosition = lastMove?.capturedPawnPosition;
            if (capturedPawnPosition) {
                const pawn = this.capturedPieces.find((c) =>
                    c.position.equals(capturedPawnPosition)
                );
                if (pawn) {
                    pieceToRestore = pawn;
                    console.log({ pieceToRestore });
                }
            }
        }

        // promotion
        // in case of promotion a promoted pawn is
        // placed in promotedPawns array of the board object
        if (isPromotion && lastMove?.promotedTo) {
            // If the last move was a promotion, we need to remove the promoted piece
            const promotedPiece = lastMove.promotedTo;

            this.removePiece(promotedPiece, true);
            pieceToRestore = piece;
            // we also need to restore a captured piece if it exists
            if (capturedPiece) {
                this.restore(capturedPiece);
            }
        }

        if (!isSpecial) {
            // plain capture undo
            if (capturedPiece) {
                console.log("assigning captured piece to restore");
                pieceToRestore = capturedPiece;
            }
        }

        if (pieceToRestore) {
            this.restore(pieceToRestore);
            console.log({ pieceToRestore });
        }

        this.currentTurn = piece.color;
        piece.position = from;
    }
}

export const BoardInstance = new Board();
