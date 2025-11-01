import { GameRow, PersistedMove, PersistedState } from "@/types/games/chess";
import { supabase } from "../supabase/client";
import { MoveTableData } from "@/types/supabase/database.types";

export async function createGame(initialState: PersistedState) {
    try {
        const user = await isUserLoggedIn();

        const { data, error } = await supabase
            .from("games")
            .insert({
                creator_id: user.id,
                player_white: user.id,
                status: "waiting",
                turn: "White",
                state_json: initialState,
            })
            .select()
            .single();

        if (error) throw error;
        return data as GameRow;
    } catch (error) {
        throw error;
    }
}

export async function joinGame(gameId: string) {
    try {
        const user = await isUserLoggedIn();
        const game = await getGameById(gameId);

        if (!game.player_white) {
            const { data, error } = await supabase
                .from("games")
                .update({
                    player_white: user.id,
                    status: game.player_black ? "in-progress" : "waiting",
                })
                .eq("id", gameId)
                .select()
                .single();
            if (error) throw error;
            return data as GameRow;
        }

        if (!game.player_black && game.player_white !== user.id) {
            const { data, error } = await supabase
                .from("games")
                .update({ player_black: user.id, status: "in-progress" })
                .eq("id", gameId)
                .select()
                .single();
            console.log("joining as black", {
                gameId,
                userId: user.id,
                game: data,
            });

            if (error) throw error;
            return data as GameRow;
        }

        return game as GameRow; // already joined or full
    } catch (error) {}
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
        if (game.player_black !== user.id && game.player_white !== user.id) {
            throw new Error(
                "Failed to perform a request. No permission to access this game"
            );
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
    nextState: PersistedState,
    move: PersistedMove
) {
    const { board } = nextState;

    const user = await isUserLoggedIn();

    console.log({ persistedMoveBeforeThePush: move });

    // 1) update game state
    const { error: upErr } = await supabase
        .from("games")
        .update({
            state_json: nextState,
            status: board.status === "ongoing" ? "in-progress" : board.status,
            turn: board.currentTurn,
        })
        .eq("id", gameId);
    if (upErr) throw upErr;

    // 2) insert move
    const { error: mvErr } = await supabase.from("moves").insert({
        game_id: gameId,
        move_number: move.moveNumber,
        player_id: user.id,
        move_json: move,
    });
    if (mvErr) throw mvErr;
}
