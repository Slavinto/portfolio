import { Match, Move } from "@/types/games/chess";

export function playMove(match: Match, userId: string, move: Move) {
    const color =
        match.host.id === userId ? match.host.color : match.guest.color;
    if (!color) {
        throw new Error("Failed to move a piece. Invalid piece color");
    }
    if (match.board.currentTurn !== color) {
        throw new Error("Failed to move a piece. Not your turn");
    }

    match.board.movePiece(move.from, move.to);
}
