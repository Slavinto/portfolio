import {
    Color,
    GameRow,
    GameStatus,
    PersistedMove,
    PersistedState,
} from "@/types/games/chess";
import { createClient } from "../supabase/client";
import { GameTableData, MoveTableData } from "@/types/supabase/database.types";

const supabase = createClient();

export async function createGame(initialState: PersistedState, playAs: Color) {
    try {
        const user = await isUserLoggedIn();

        const gameData = {
            creator_id: user.id,
            player_white: playAs === "White" ? user.id : null,
            player_black: playAs === "Black" ? user.id : null,
            status: "waiting",
            turn: "White",
            state_json: initialState,
        };

        const { data, error } = await supabase
            .from("games")
            .insert(gameData)
            .select()
            .single();

        if (error) throw error;
        return data as GameRow;
    } catch (error) {
        throw error;
    }
}

export async function joinGame(
    gameId: string,
    joinAs: { playerColor: Color; playerId: string }
) {
    try {
        const user = await isUserLoggedIn();
        if (!user) {
            return;
        }
        // const game = await getGameById(gameId);
        // const gameNotFull = !game.player_white || !game.player_black;

        let updateData: any = { status: "ongoing" };

        if (joinAs.playerColor === "Black") {
            updateData = { ...updateData, player_black: joinAs.playerId };
        }
        if (joinAs.playerColor === "White") {
            updateData = { ...updateData, player_white: joinAs.playerId };
        }
        console.log(
            "*****************************JOINING AS ",
            joinAs.playerColor
        );
        const { data, error } = await supabase
            .from("games")
            .update(updateData)
            .eq("id", gameId)
            .select()
            .single();
        if (error) throw error;
        return data as GameRow;
    } catch (error) {
        console.error(error);
    }
}

export async function getGameById(gameId: string) {
    try {
        const user = await isUserLoggedIn();

        const { data: game, error: gErr } = await supabase
            .from("games")
            .select("*")
            .eq("id", gameId)
            .single();
        if (gErr || !game) {
            throw gErr ?? new Error("Game not found");
        }

        return game;
    } catch (error) {
        console.error(error);
    }
}

export async function isUserLoggedIn() {
    try {
        const { data, error: uErr } = await supabase.auth.getUser();

        if (!data || uErr) {
            throw new Error(
                `Failed to perform a request. Not logged in.${
                    uErr ? ` ${uErr}` : ``
                }`
            );
        }
        return data.user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getGameMoves(gameId: string) {
    try {
        await isUserLoggedIn();
        const { data, error: mErr } = await supabase
            .from("moves")
            .select("*")
            .eq("game_id", gameId)
            .single();

        if (!data || mErr) {
            throw new Error(`Failed to fetch moves.${mErr ? ` ${mErr}` : ``}`);
        }

        return data as MoveTableData[];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function pushMove(
    gameId: string,
    gameStatus: GameStatus,
    nextState: PersistedState,
    move: PersistedMove
) {
    const { board } = nextState;
    try {
        const user = await isUserLoggedIn();

        console.log({ persistedMoveBeforeThePush: move });

        // 1) update game state
        const { error: upErr } = await supabase
            .from("games")
            .update({
                state_json: nextState,
                status: gameStatus,
                turn: board.currentTurn,
            })
            .eq("id", gameId);
        if (upErr) throw upErr;

        // 2) insert move
        const moveToPush = {
            game_id: gameId,
            move_number: move.moveNumber,
            player_id: user.id,
            move_json: move,
        };
        console.log({ moveToPush });
        const { error: mvErr } = await supabase
            .from("moves")
            .insert(moveToPush);
        if (mvErr) throw mvErr;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function finishGame(
    gameId: string,
    status: GameStatus,
    winnerId: string | null
) {
    try {
        const user = await isUserLoggedIn();

        const { data: game, error: fetchError } = await supabase
            .from("games")
            .select("id, player_white, player_black, status")
            .eq("id", gameId)
            .single();

        if (fetchError || !game) throw fetchError;

        const { error } = await supabase
            .from("games")
            .update({
                status,
                winner: winnerId,
                state_json: null, // optionally freeze game state
            })
            .eq("id", gameId);

        if (error) throw error;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// export async function resignGame(gameId: string, resignedPlayer: Color) {
//     try {
//         const user = await isUserLoggedIn();

//         const { data: game, error: fetchError } = await supabase
//             .from("games")
//             .select("id, player_white, player_black, status")
//             .eq("id", gameId)
//             .single();

//         if (fetchError || !game) throw fetchError;

//         const winnerId =
//             resignedPlayer === "White" ? game.player_black : game.player_white;

//         const { error } = await supabase
//             .from("games")
//             .update({
//                 status: "resigned",
//                 winner: winnerId,
//                 state_json: null, // optionally freeze game state
//             })
//             .eq("id", gameId);

//         if (error) throw error;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }
