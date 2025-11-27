import { createClient } from "@/lib/supabase/client";

export async function sendMessage(
    gameId: string,
    sender: string,
    message: string
) {
    const supabase = createClient();
    const { error } = await supabase.from("chess_messages").insert({
        game_id: gameId,
        message,
        sender,
    });
    if (error) throw error;
}
