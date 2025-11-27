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
            console.log("Initializing gameRow with: ", { gameRow });
            return {
                ...state,
                gameRow,
                board: Board.fromPersistedState(gameRow.state_json),
                isLoading: false,
            };
        }
        case "INIT_PLAYER": {
            const { player } = action.payload;
            console.log("Initializing player with: ", { player });

            return {
                ...state,
                player,
                isLoading: false,
            };
        }
        case "INIT_CHAT_MESSAGES": {
            const { chatMessages } = action.payload;
            console.log("Initializing chat messages with: ", { chatMessages });

            return { ...state, chatMessages };
        }
        case "MOVE_PIECE": {
            const { from, to } = action.payload;
            console.log("Moving piece to: ", { to });

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
            console.log("Resetting game state");

            return initialBoardState;
        }
        case "SELECT_PIECE": {
            board.selectedPiecePosition = action.payload.position;

            return { ...state, board };
        }
        case "SET_IS_LOADING": {
            console.log("Setting is loading to: ", {
                isLoading: action.payload.isLoading,
            });

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
            console.log("Hydrating server state: ", {
                gameRow: action.payload.gameRow,
            });
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
            console.log("Adding chat message: ", { chatMessage });
            return {
                ...state,
                chatMessages: [...state.chatMessages, chatMessage],
            };
        }

        default:
            return state;
    }
}
