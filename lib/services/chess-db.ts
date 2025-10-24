import { GameRow, PersistedMove, PersistedState } from "@/types/games/chess";
import { supabase } from "../supabase/client";

export async function createGame(initialState: PersistedState) {
    const {
        data: { user },
        error: uErr,
    } = await supabase.auth.getUser();
    if (uErr || !user) throw new Error("Must be signed in");

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
}

export async function joinGame(gameId: string) {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Must be signed in");

    const { data: game, error: gErr } = await supabase
        .from("games")
        .select("*")
        .eq("id", gameId)
        .single();
    if (gErr || !game) throw gErr ?? new Error("Game not found");

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
        console.log("joining as black", { gameId, userId: user.id, game });

        const { data, error } = await supabase
            .from("games")
            .update({ player_black: user.id, status: "in-progress" })
            .eq("id", gameId)
            .select()
            .maybeSingle();
        console.log({ data, error });

        if (error) throw error;
        return data as GameRow;
    }

    return game as GameRow; // already joined or full
}

export async function pushMove(
    gameId: string,
    nextState: PersistedState,
    move: PersistedMove
) {
    const { board } = nextState;

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Must be signed in");
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
