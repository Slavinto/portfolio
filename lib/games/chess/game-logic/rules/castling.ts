import { File, Move } from "@/types/games/chess";
import type { Board } from "../main/board/board";
import { Position } from "../main/position";
import { getDiff } from "@/utils/games/chess/helpers";

export function isCastlingValid(
    // the king-move being attempted
    move: Move,
    board: Board
): boolean {
    const moveHistory = board.moveHistoryList;
    const king = move.piece;
    if (!(king.type === "King")) {
        console.info("Castling failed. No king piece found in move.");
        return false;
    }

    const { from, to } = move;
    const { color, id: kingId } = king;

    const fileDiff = getDiff(from.file, to.file);
    const isKingSide = fileDiff > 0;

    const rookStartFile = isKingSide ? "H" : "A";
    const rook = board.getPieceAtPosition(
        new Position(rookStartFile, move.from.rank)
    );

    if (!rook || rook.type !== "Rook") {
        console.info("Castling failed. No rook piece found in move.");
        return false;
    }

    const { id: rookId } = rook;

    // Check if the pieces are of the correct types
    if (king.type !== "King" || rook.type !== "Rook") {
        console.info("Castling failed. Invaid piece type");
        return false;
    }

    // Check if the king is being moved
    if (move.piece.id !== kingId) {
        console.info("Castling failed. King is not being moved");
        return false;
    }

    // Check if the king and rook have moved before
    const kingMoved = moveHistory.some(
        (move) => !Array.isArray(move) && move.piece.id === kingId
    );
    const rookMoved = moveHistory.some(
        (move) => !Array.isArray(move) && move.piece.id === rookId
    );

    if (kingMoved || rookMoved) {
        console.info("Castling failed. King or rook have moved before.");
        return false;
    }

    // Check if the king has moved two squares to the right or left
    if (Math.abs(fileDiff) !== 2) {
        console.info("Castling failed. King must move two squares.");
        return false;
    }

    // Check if the squares between the king and rook are empty
    const kingFile = from.file.charCodeAt(0);
    const rookFile = rook.position.file.charCodeAt(0);

    const betweenMin = Math.min(kingFile, rookFile);
    const betweenMax = Math.max(kingFile, rookFile);
    const allPieces = board.getAllPieces();

    for (let f = betweenMin + 1; f < betweenMax; f++) {
        const pos = new Position(String.fromCharCode(f) as File, from.rank);
        if (allPieces.some((p) => p.position.equals(pos))) {
            console.info(
                "Castling failed. Square between king and rook is not empty."
            );
            return false;
        }
    }

    // Check if the king is not in check and does not pass through or end up in a square that is attacked
    const step = fileDiff > 0 ? 1 : -1;
    for (let i = 0; i <= 2; i++) {
        const intermediateFile = String.fromCharCode(
            kingFile + i * step
        ) as File;
        const pos = new Position(intermediateFile, from.rank);
        if (board.isSquareAttacked(pos, color)) {
            console.info(
                "Castling failed. King is in check or passes through an attacked square."
            );
            return false;
        }
    }

    return true;
}
