import { BoardInstance } from "@/lib/games/chess/game-logic/main/board/board";
import { Color } from "@/types/games/chess";

export const initialBoardState = {
    board: BoardInstance,
    playerColor: "White" as Color,
    selected: null,
};
