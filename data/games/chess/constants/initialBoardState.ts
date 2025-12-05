import { BoardInstance } from "@/lib/games/chess/game-logic/main/board/board";

export const initialBoardState = {
    gameRow: null,
    board: BoardInstance,
    player: null,
    opponent: null,
    chatMessages: [],
    isLoading: false,
};
