import { BoardInstance } from "@/lib/games/chess/game-logic/main/board/board";
import { Color, GameStatus } from "@/types/games/chess";

export const initialBoardState = {
    board: BoardInstance,
    gameId: null,
    gameStatus: "waiting" as GameStatus,
    playerColor: "White" as Color,
    playerId: null,
    opponentId: null,
    selected: null,
    chatMessages: [],
};
