// import { files } from "../data/constants/board";
// import type { Board } from "../game-logic/main/board/board";
// import type { Piece } from "../game-logic/main/piece";
// import { Bishop } from "../game-logic/pieces/bishop";
// import { King } from "../game-logic/pieces/king";
// import { Knight } from "../game-logic/pieces/knight";
// import { Pawn } from "../game-logic/pieces/pawn";
// import { Queen } from "../game-logic/pieces/queen";
// import { Rook } from "../game-logic/pieces/rook";

import { Color, Match } from "@/types/games/chess";
import { Board } from "../board/board";

// export function createNewGamePieces(board: Board): Piece[] {
//     return [
//         // White pieces
//         new Rook("White", "A", 1, board),
//         new Knight("White", "B", 1, board),
//         new Bishop("White", "C", 1, board),
//         new Queen("White", "D", 1, board),
//         new King("White", "E", 1, board),
//         new Bishop("White", "F", 1, board),
//         new Knight("White", "G", 1, board),
//         new Rook("White", "H", 1, board),
//         ...files.map((file) => new Pawn("White", file, 2, board)),

//         // Black pieces
//         new Rook("Black", "A", 8, board),
//         new Knight("Black", "B", 8, board),
//         new Bishop("Black", "C", 8, board),
//         new Queen("Black", "D", 8, board),
//         new King("Black", "E", 8, board),
//         new Bishop("Black", "F", 8, board),
//         new Knight("Black", "G", 8, board),
//         new Rook("Black", "H", 8, board),
//         ...files.map((file) => new Pawn("Black", file, 7, board)),
//     ];
// }

export function createMatch(userId: string, color: Color): Match {
    return {
        // id: crypto.randomUUID(),
        id: Math.random().toString(),
        board: new Board(),
        status: "waiting_for_opponent",
        host: { id: userId, color },
        guest: { id: "", color: color === "White" ? "Black" : "White" },
        createdAt: Date.now(),
    };
}

export function joinMatch(match: Match, userId: string) {
    if (match.status !== "waiting_for_opponent") {
        throw new Error("Failed to join. Match already started");
    }

    match.guest.id = userId;
    match.status = "ongoing";
}

export function finishMatch(match: Match) {
    const gameStatus = match.board.getGameStatus();
    if (gameStatus === "checkmate" || gameStatus === "stalemate") {
        match.status = "finished";
    }
}
