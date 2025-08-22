import { Color, File, PieceType, Rank } from "@/types/games/chess";
import { Position } from "./position";

// Notice: no direct `import { Board }` here!
// We only type against a generic `BoardLike` if needed.
export interface BoardLike {
    // Minimal API that pieces need from Board
    getPieceAt(position: Position): Piece | null;
    isSquareOccupied(position: Position): boolean;
}

export abstract class Piece {
    private readonly _id: string = Math.random().toString();

    public get id(): string {
        return this._id;
    }

    protected readonly _type: PieceType;
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

    private _board: BoardLike | null = null;
    public get board(): BoardLike | null {
        return this._board;
    }
    public attachBoard(board: BoardLike) {
        this._board = board;
    }

    protected _color: Color;
    public get color(): Color {
        return this._color;
    }
    public set color(color: Color) {
        this._color = color;
    }

    constructor(color: Color, file: File, rank: Rank, type: PieceType) {
        this._color = color;
        this._position = new Position(file, rank);
        this._type = type;
    }

    public clone(): Piece {
        const cloned = Object.create(this.constructor.prototype);
        Object.assign(cloned, this);
        cloned.position = new Position(this.position.file, this.position.rank);

        // Do not carry over board reference
        cloned._board = null;

        if (this.type === "Rook" || this.type === "King") {
            cloned.hasMoved = (this as any).hasMoved;
        }

        cloned.color = this.color;
        return cloned;
    }

    abstract getPossibleMoves(board: BoardLike): Position[];

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

// import { Color, File, PieceType, Rank } from "@/types/games/chess";
// import type { Board } from "./board/board";
// import { Position } from "./position";

// export abstract class Piece {
//     // private readonly _id: string = crypto.randomUUID();
//     private readonly _id: string = Math.random().toString();

//     public get id(): string {
//         return this._id;
//     }

//     protected readonly _type: PieceType;
//     public get type(): PieceType {
//         return this._type;
//     }

//     protected _position: Position;
//     public get position(): Position {
//         return this._position;
//     }

//     public set position(newPosition: Position) {
//         this._position = newPosition;
//     }

//     private _board: Board;
//     public get board() {
//         return this._board;
//     }
//     public set board(board: Board) {
//         this._board = board;
//     }

//     protected _color: Color;
//     public get color(): Color {
//         return this._color;
//     }
//     public set color(color: Color) {
//         this._color = color;
//     }

//     constructor(
//         color: Color,
//         file: File,
//         rank: Rank,
//         type: PieceType,
//         board: Board
//     ) {
//         this._color = color;
//         this._position = new Position(file, rank);
//         this._type = type;
//         this._board = board;
//     }

//     public clone(): Piece {
//         const cloned = Object.create(this.constructor.prototype);
//         Object.assign(cloned, this);
//         cloned.position = new Position(this.position.file, this.position.rank);

//         cloned.board = null;

//         if (this.type === "Rook" || this.type === "King") {
//             cloned.hasMoved = (this as any).hasMoved;
//         }

//         cloned.color = this.color;
//         return cloned;
//     }

//     abstract getPossibleMoves(): Position[];

//     protected isRankInBounds(rank: number): rank is Rank {
//         return rank >= 1 && rank <= 8;
//     }

//     public moveTo(position: Position) {
//         this._position = position;
//     }

//     public getUnicodeSymbol(): string {
//         const map: Record<string, string> = {
//             WhitePawn: "♙",
//             BlackPawn: "♟︎",
//             WhiteRook: "♖",
//             BlackRook: "♜",
//             WhiteKnight: "♘",
//             BlackKnight: "♞",
//             WhiteBishop: "♗",
//             BlackBishop: "♝",
//             WhiteQueen: "♕",
//             BlackQueen: "♛",
//             WhiteKing: "♔",
//             BlackKing: "♚",
//         };
//         return map[this.color + this.constructor.name] || "?";
//     }
// }
