import { OfferRow, OfferType } from "@/types/games/chess";

export type OfferServiceResponse = {
    data: OfferRow | null;
    error: string | null;
};

// services/offers.ts
export async function sendOffer(
    gameId: string,
    type: OfferType,
    fromPlayer: string,
    toPlayer: string
): Promise<OfferServiceResponse> {
    const res = await fetch("/api/chess/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            gameId,
            fromPlayer,
            toPlayer,
            type,
        }),
    });

    const json = await res.json();

    if (!res.ok) {
        return { data: null, error: json.error };
    }

    return { data: json.data, error: null };
}

export async function acceptOffer(offerId: string) {
    const res = await fetch(`/api/chess/offers/${offerId}/accept`, {
        method: "POST",
    });

    const json = await res.json();

    if (!res.ok) throw new Error(json.error || "Failed to accept offer");

    return json.data;
}

export async function declineOffer(offerId: string) {
    const res = await fetch(`/api/chess/offers/${offerId}/decline`, {
        method: "POST",
    });

    const json = await res.json();

    if (!res.ok) throw new Error(json.error || "Failed to decline offer");

    return json.data;
}
