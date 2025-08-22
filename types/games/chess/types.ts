import { Board, Piece, Position } from "@/lib/games/chess/game-logic/main";

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

export type GameStatus =
    | "ongoing"
    | "check"
    | "checkmate"
    | "stalemate"
    | "draw";

export type MatchStatus = "waiting_for_opponent" | "ongoing" | "finished";

export type BoardAction =
    | {
          type: "START_NEW_GAME";
      }
    | { type: "MOVE_PIECE"; payload: { from: Position; to: Position } }
    | { type: "UNDO_MOVE" }
    | { type: "SELECT_PIECE"; payload: { position: Position } }
    | { type: "UNSELECT_PIECE" };

export type Directions = [number, number][];
