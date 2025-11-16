"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { OfferRow } from "@/types/games/chess";
import { toast } from "react-toastify";
import { useUser } from "@/hooks/auth/useUser";

export function useOffersChannel(
    gameId: string,
    onOffer?: (offer: OfferRow) => void
) {
    const supabase = createClient();
    const { data: user } = useUser();
    const lastOfferIdRef = useRef<string | null>(null);
    const channelRef = useRef<ReturnType<
        ReturnType<typeof createClient>["channel"]
    > | null>(null);

    useEffect(() => {
        if (!user?.id || !gameId) return;

        const channel = supabase.channel(`offers-${gameId}`);
        channelRef.current = channel;

        channel
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "offers",
                    filter: `game_id=eq.${gameId}`,
                },
                (payload) => {
                    const offer = (payload.new ?? payload.old) as OfferRow;
                    if (!offer) return;
                    const eventKey = offer.id + "_" + offer.status;

                    // Prevent duplicate event spam
                    if (eventKey === lastOfferIdRef.current) return;
                    lastOfferIdRef.current = eventKey;

                    const isMe = offer.from_player === user.id;

                    // 🔥 BASIC LOGIC MAP
                    switch (payload.eventType) {
                        case "INSERT":
                            if (!isMe) {
                                toast.info(
                                    `Opponent sent a ${offer.type} offer`
                                );
                            }
                            break;

                        case "UPDATE":
                            if (offer.status === "accepted") {
                                toast.success(
                                    isMe
                                        ? `Your ${offer.type} offer was accepted`
                                        : `Opponent accepted your ${offer.type} offer`
                                );
                            } else if (offer.status === "declined") {
                                toast.info(
                                    isMe
                                        ? `Opponent declined your ${offer.type} offer`
                                        : `You declined the ${offer.type} offer`
                                );
                            }
                            break;

                        case "DELETE":
                            toast.info(`Offer removed`);
                            break;
                    }

                    onOffer?.(offer);
                }
            )
            .subscribe((status) => {
                if (status === "SUBSCRIBED") {
                    console.log("Offers realtime subscribed");
                }
            });

        return () => {
            channelRef.current?.unsubscribe();
        };
    }, [gameId, user?.id, supabase, onOffer]);
}
