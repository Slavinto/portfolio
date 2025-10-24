import { Color, PieceClass } from "@/types/games/chess";
import { Pawn } from "./pawn";
import { King } from "./king";
import { Rook } from "./rook";
import { Knight } from "./knight";
import { Bishop } from "./bishop";
import { Queen } from "./queen";
import { PieceTypeName } from "@/data/games/chess/constants/pieceInit";
import { Position } from "../main/position";

// export const pieceClasses: Record<
//     PieceTypeName,
//     new (color: Color, position: Position) => any
// > = {
//     Pawn,
//     King,
//     Rook,
//     Knight,
//     Bishop,
//     Queen,
// };
export const pieceClasses: PieceClass = {
    Pawn,
    King,
    Rook,
    Knight,
    Bishop,
    Queen,
};
