import { Color, File, Rank } from "@/types/games/chess";

export type PieceTypeName =
    | "Pawn"
    | "Rook"
    | "Knight"
    | "Bishop"
    | "Queen"
    | "King";

export type PieceInit = {
    type: PieceTypeName;
    color: Color;
    file: File;
    rank: Rank;
};

export const initialPieceSetup: PieceInit[] = [
    { type: "Rook", color: "White", file: "A", rank: 1 },
    { type: "Knight", color: "White", file: "B", rank: 1 },
    { type: "Bishop", color: "White", file: "C", rank: 1 },
    { type: "Queen", color: "White", file: "D", rank: 1 },
    { type: "King", color: "White", file: "E", rank: 1 },
    { type: "Bishop", color: "White", file: "F", rank: 1 },
    { type: "Knight", color: "White", file: "G", rank: 1 },
    { type: "Rook", color: "White", file: "H", rank: 1 },
    { type: "Pawn", color: "White", file: "A", rank: 2 },
    { type: "Pawn", color: "White", file: "B", rank: 2 },
    { type: "Pawn", color: "White", file: "C", rank: 2 },
    { type: "Pawn", color: "White", file: "D", rank: 2 },
    { type: "Pawn", color: "White", file: "E", rank: 2 },
    { type: "Pawn", color: "White", file: "F", rank: 2 },
    { type: "Pawn", color: "White", file: "G", rank: 2 },
    { type: "Pawn", color: "White", file: "H", rank: 2 },
    // Black...
    { type: "Rook", color: "Black", file: "A", rank: 8 },
    { type: "Knight", color: "Black", file: "B", rank: 8 },
    { type: "Bishop", color: "Black", file: "C", rank: 8 },
    { type: "Queen", color: "Black", file: "D", rank: 8 },
    { type: "King", color: "Black", file: "E", rank: 8 },
    { type: "Bishop", color: "Black", file: "F", rank: 8 },
    { type: "Knight", color: "Black", file: "G", rank: 8 },
    { type: "Rook", color: "Black", file: "H", rank: 8 },
    { type: "Pawn", color: "Black", file: "A", rank: 7 },
    { type: "Pawn", color: "Black", file: "B", rank: 7 },
    { type: "Pawn", color: "Black", file: "C", rank: 7 },
    { type: "Pawn", color: "Black", file: "D", rank: 7 },
    { type: "Pawn", color: "Black", file: "E", rank: 7 },
    { type: "Pawn", color: "Black", file: "F", rank: 7 },
    { type: "Pawn", color: "Black", file: "G", rank: 7 },
    { type: "Pawn", color: "Black", file: "H", rank: 7 },
];
