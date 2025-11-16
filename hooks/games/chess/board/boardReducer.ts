import { Board } from "@/lib/games/chess/game-logic/main/board/board";
import { BoardState, BoardAction } from "@/types/games/chess";

export function boardReducer(
    state: BoardState,
    action: BoardAction
): BoardState {
    const { board } = state;
    const newBoard = board.clone();

    switch (action.type) {
        case "START_NEW_GAME": {
            const newBoard = new Board();
            newBoard.reset();
            return {
                ...state,
                board: newBoard,
                selected: null,
            };
        }
        case "MOVE_PIECE": {
            const { from, to } = action.payload;
            // making new class instance to update the reference for React to figure out the change of state
            const moved = newBoard.movePiece(from, to);
            if (moved) {
                return {
                    ...state,
                    board: newBoard,
                    selected: null,
                };
            }
            return state;
        }
        case "SELECT_PIECE": {
            return { ...state, selected: action.payload.position };
        }
        case "UNSELECT_PIECE": {
            return { ...state, selected: null };
        }
        case "UNDO_MOVE": {
            newBoard.undoLastMove();

            return {
                ...state,
                board: state.board.getThisBoard(),
                selected: null,
            };
        }
        case "HYDRATE_FROM_SERVER": {
            const server = action.payload; // PersistedState
            // rebuild your board from server.state_json.board if needed,
            // or simply replace your local state if it matches shape:
            return {
                ...state,
                // merge in server's authoritative data
                board: Board.fromPersistedState(server), // if you need: rebuild from server.board JSON
                selected: null,
                playerColor: state.playerColor, // keep local perspective
            };
        }
        case "SET_PLAYER_IDS": {
            return {
                ...state,
                playerId: action.payload.playerId ?? state.playerId,
                opponentId: action.payload.opponentId ?? state.opponentId,
            };
        }
        default:
            return state;
    }
}
