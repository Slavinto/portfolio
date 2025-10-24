import {
    Color,
    File,
    PersistedPiece,
    PieceClass as PC,
    PieceType,
    Rank,
} from "@/types/games/chess";
import type { Board } from "./board/board";
import { Position } from "./position";

export abstract class Piece {
    private readonly _id: string = crypto.randomUUID();
    // private readonly _id: string = Math.random().toString();

    public get id(): string {
        return this._id;
    }

    protected abstract readonly _type: PieceType;
    public get type(): PieceType {
        return this._type;
    }

    protected _position: Position;
    public get position(): Position {
        return this._position;
    }

    public set position(newPosition: Position) {
        this._position = newPosition;
    }

    private _board: Board;
    public get board() {
        return this._board;
    }
    public set board(board: Board) {
        this._board = board;
    }

    protected _color: Color;
    public get color(): Color {
        return this._color;
    }
    public set color(color: Color) {
        this._color = color;
    }

    constructor(color: Color, file: File, rank: Rank, board: Board) {
        this._color = color;
        this._position = new Position(file, rank);
        this._board = board;
    }

    public clone(): Piece {
        const cloned = Object.create(this.constructor.prototype);
        Object.assign(cloned, this);
        cloned.position = new Position(this.position.file, this.position.rank);

        cloned.board = null;

        if (this.type === "Rook" || this.type === "King") {
            cloned.hasMoved = (this as any).hasMoved;
        }

        cloned.color = this.color;
        return cloned;
    }

    abstract getPossibleMoves(): Position[];

    public toPersisted(): PersistedPiece {
        const { file, rank } = this.position;
        const base: PersistedPiece = {
            id: this.id,
            type: this.type,
            color: this.color,
            position: { file, rank },
        };

        if ((this as any).hasMoved !== undefined) {
            base.hasMoved = (this as any).hasMoved;
        }

        return base;
    }

    // 🔑 Rehydrate a Piece from plain data
    public static fromPersisted(
        data: PersistedPiece,
        board: Board,
        pieceClasses: PC
    ): Piece {
        const PieceClass = pieceClasses[data.type];
        const piece = new PieceClass(
            data.color,
            data.position.file,
            data.position.rank,
            board
        ) as Piece;

        try {
            Object.defineProperty(piece as any, "_id", {
                value: data.id,
                writable: false,
                configurable: false,
            });
        } catch (error) {
            (piece as any)._id = data.id;
        }

        if (data.hasMoved !== undefined) {
            (piece as any).hasMoved = data.hasMoved;
        }

        return piece;
    }

    protected isRankInBounds(rank: number): rank is Rank {
        return rank >= 1 && rank <= 8;
    }

    public moveTo(position: Position) {
        this._position = position;
    }

    public getUnicodeSymbol(): string {
        const map: Record<string, string> = {
            WhitePawn: "♙",
            BlackPawn: "♟︎",
            WhiteRook: "♖",
            BlackRook: "♜",
            WhiteKnight: "♘",
            BlackKnight: "♞",
            WhiteBishop: "♗",
            BlackBishop: "♝",
            WhiteQueen: "♕",
            BlackQueen: "♛",
            WhiteKing: "♔",
            BlackKing: "♚",
        };
        return map[this.color + this.constructor.name] || "?";
    }
}
