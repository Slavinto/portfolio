import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef } from "react";

export function useOffersChannel(
    gameId: string,
    onOfferEvent: (offerRow: any) => void
) {
    const hydratedRef = useRef(false);
    const supabase = createClient();

    useEffect(() => {
        if (!gameId) return;

        // // Hydrate initial game state only once
        // if (initialRow && !hydratedRef.current) {
        //     onGameUpdate(initialRow);
        //     hydratedRef.current = true;
        // }

        const channel = supabase.channel(`offers:${gameId}`);

        console.log("Subscribing to channel:", `offers:${gameId}`);

        supabase
            .channel(`offers:${gameId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "offers",
                    filter: `game_id=eq.${gameId}`,
                },
                (payload) => {
                    onOfferEvent(payload);
                }
            )
            .subscribe();

        // ✅ Handle connection errors and reconnect
        channel.on("system", { event: "channel_error" }, () => {
            console.warn("Realtime channel error, reconnecting...");
            setTimeout(() => {
                supabase.channel(`offer:${gameId}`).subscribe();
            }, 1000);
        });

        // ✅ Clean up on unmount or game change
        return () => {
            console.log("Unsubscribing from channel", `offer:${gameId}`);
            channel.unsubscribe();
        };
    }, [gameId, onOfferEvent]);
}
