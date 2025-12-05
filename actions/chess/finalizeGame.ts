// import { createSupabaseServerClient } from "@/lib/supabase/server";

// export async function finalizeGame(gameId: string, winnerId: string | null) {
//     const supabase = await createSupabaseServerClient();

//     const { data: game } = await supabase
//         .from("games")
//         .update({
//             status: winnerId ? "win" : "draw",
//             winner: winnerId,
//             updated_at: new Date().toISOString(),
//         })
//         .eq("id", gameId)
//         .select()
//         .single();

//     if (!game) return;

//     const white = game.white_id;
//     const black = game.black_id;

//     if (winnerId) {
//         // winner +1 win
//         await supabase
//             .from("players")
//             .update({
//                 wins: supabase.sql`wins + 1`,
//                 updated_at: new Date().toISOString(),
//             })
//             .eq("user_id", winnerId);

//         // loser +1 loss
//         const loser = white === winnerId ? black : white;
//         await supabase
//             .from("players")
//             .update({
//                 losses: supabase.sql`losses + 1`,
//                 updated_at: new Date().toISOString(),
//             })
//             .eq("user_id", loser);
//     } else {
//         // draw for both
//         await supabase
//             .from("players")
//             .update({
//                 draws: supabase.sql`draws + 1`,
//                 updated_at: new Date().toISOString(),
//             })
//             .in("user_id", [white, black]);
//     }
// }
