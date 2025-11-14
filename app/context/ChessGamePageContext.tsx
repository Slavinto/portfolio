import { initialBoardState } from "@/data/games/chess/constants/initialBoardState";
import { boardReducer } from "@/hooks/games/chess/board/boardReducer";
import { BoardAction, BoardState } from "@/types/games/chess";
import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    useContext,
    useReducer,
} from "react";

interface IChessPageContext {
    state: BoardState;
    dispatch: Dispatch<BoardAction>;
}
export const ChessPageContext = createContext<IChessPageContext>({
    state: initialBoardState,
    dispatch: () => {},
});

export const useChessGamePageContext = () => useContext(ChessPageContext);

export const ChessPageContextProvider: FC<PropsWithChildren> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(boardReducer, initialBoardState);

    return (
        <ChessPageContext.Provider value={{ state, dispatch }}>
            {children}
        </ChessPageContext.Provider>
    );
};
