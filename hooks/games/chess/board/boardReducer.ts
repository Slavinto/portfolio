import { initialBoardState } from "@/data/games/chess/constants/initialBoardState";
import { Board } from "@/lib/games/chess/game-logic/main/board/board";
import { BoardState, BoardAction } from "@/types/games/chess";

export function boardReducer(
    state: BoardState,
    action: BoardAction
): BoardState {
    const { board } = state;

    const boardClone = board.clone();

    switch (action.type) {
        case "INIT_GAME": {
            if (state.gameRow) {
                return state;
            }
            const { gameRow } = action.payload;
            return {
                ...state,
                gameRow,
                board: Board.fromPersistedState(gameRow.state_json),
                isLoading: false,
            };
        }
        case "INIT_PLAYER": {
            const { player } = action.payload;

            return {
                ...state,
                player,
                isLoading: false,
            };
        }
        case "INIT_CHAT_MESSAGES": {
            const { chatMessages } = action.payload;

            return { ...state, chatMessages };
        }
        case "MOVE_PIECE": {
            const { from, to } = action.payload;

            // making new class instance to update the reference for React to figure out the change of state
            let moved = boardClone.movePiece(from, to);
            boardClone.selectedPiecePosition = null;

            if (moved) {
                return {
                    ...state,
                    board: boardClone,
                };
            }

            return state;
        }
        case "RESET_GAME_STATE": {
            return initialBoardState;
        }
        case "SELECT_PIECE": {
            board.selectedPiecePosition = action.payload.position;

            return { ...state, board };
        }
        case "SET_IS_LOADING": {
            return { ...state, isLoading: action.payload.isLoading };
        }
        case "UNSELECT_PIECE": {
            board.selectedPiecePosition = null;
            return { ...state, board };
        }
        case "UNDO_MOVE": {
            boardClone.undoLastMove();
            if (!state.board) {
                console.info("Invalid board object in state");
                return state;
            }
            board.selectedPiecePosition = null;
            return {
                ...state,
                board: boardClone,
            };
        }
        case "HYDRATE_FROM_SERVER": {
            if (!state.player) {
                console.info("Invalid player object in state");
                return state;
            }
            const { gameRow } = action.payload; // PersistedState
            const board = Board.fromPersistedState(gameRow.state_json);
            board.selectedPiecePosition = null;
            const playerColor = state.player.playerColor;

            return {
                ...state,
                gameRow,
                board,
                player: { ...state.player, playerColor },
            };
        }
        case "ADD_CHAT_MESSAGE": {
            const { chatMessage } = action.payload;
            return {
                ...state,
                chatMessages: [...state.chatMessages, chatMessage],
            };
        }

        default:
            return state;
    }
}
