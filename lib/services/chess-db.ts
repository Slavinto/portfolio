import {
    Color,
    GameRow,
    PersistedMove,
    PersistedState,
} from "@/types/games/chess";
import { createClient } from "../supabase/client";
import { MoveTableData } from "@/types/supabase/database.types";

const supabase = createClient();

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

export async function requestLayoff(gameId: string) {
    try {
        await isUserLoggedIn();

        const { error } = await supabase
            .from("games")
            .update({ status: "layoff-pending" })
            .eq("id", gameId);

        if (error) throw error;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function confirmLayoff(gameId: string) {
    try {
        await isUserLoggedIn();

        const { error } = await supabase
            .from("games")
            .update({ status: "layed-off" })
            .eq("id", gameId);

        if (error) throw error;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function offerDraw(gameId: string, playerId: string) {
    try {
        await isUserLoggedIn();

        // Check current game state
        const { data: game, error: fetchError } = await supabase
            .from("games")
            .select("draw_offered_by, draw_offered_at")
            .eq("id", gameId)
            .single();

        if (fetchError) throw fetchError;

        // If opponent already offered
        if (game.draw_offered_by && game.draw_offered_by !== playerId) {
            throw new Error("Opponent already has a pending draw offer.");
        }

        console.log({
            drawOfferedBy: game.draw_offered_by,
            playerId,
            timeDiffMins: Date.now() - new Date(game.draw_offered_at).getTime(),
        });
        // If you already have a pending offer and it’s less than 2 minutes old
        if (
            // game.draw_offered_by === playerId &&
            game.draw_offered_at &&
            Date.now() - new Date(game.draw_offered_at).getTime() <
                2 * 60 * 1000
        ) {
            throw new Error(
                "You already offered a draw recently. Please wait."
            );
        }

        // Otherwise, send the new offer
        const { data, error: updateError } = await supabase
            .from("games")
            .update({
                draw_offered_by: playerId,
                draw_offered_at: new Date().toISOString(),
            })
            .eq("id", gameId)
            .select()
            .single();

        if (updateError) throw updateError;
        console.log({ dataAfterOfferDraw: data });
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function acceptDraw(gameId: string) {
    try {
        await isUserLoggedIn();
        const { data, error } = await supabase
            .from("games")
            .update({ status: "draw", draw_offered_by: null })
            .eq("id", gameId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function declineDraw(gameId: string) {
    try {
        await isUserLoggedIn();
        const { data, error } = await supabase
            .from("games")
            .update({ draw_offered_by: null })
            .eq("id", gameId)
            .select()
            .single();

        if (error) throw error;
        return data;
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
    try {
        const user = await isUserLoggedIn();

        console.log({ persistedMoveBeforeThePush: move });

        // 1) update game state
        const { error: upErr } = await supabase
            .from("games")
            .update({
                state_json: nextState,
                status:
                    board.status === "ongoing" ? "in-progress" : board.status,
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
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function resignGame(gameId: string, resignedPlayer: Color) {
    try {
        const user = await isUserLoggedIn();

        const { data: game, error: fetchError } = await supabase
            .from("games")
            .select("id, player_white, player_black, status")
            .eq("id", gameId)
            .single();

        if (fetchError || !game) throw fetchError;

        const winnerId =
            resignedPlayer === "White" ? game.player_black : game.player_white;

        const { error } = await supabase
            .from("games")
            .update({
                status: "resigned",
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
