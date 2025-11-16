import { OfferRow } from "@/types/games/chess";
import { toast } from "react-toastify";

export type OfferServiceResponse = {
    data: OfferRow | null;
    error: string | null;
};

// services/offers.ts
export async function offerDraw(
    gameId: string,
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
            type: "draw",
        }),
    });

    const json = await res.json();

    if (!res.ok) {
        // toast.error("Failed to send draw offer");
        // console.error(json.error || "Failed to send draw offer");
        return { data: null, error: json.error };
    }
    // else {
    //     toast.info("Offer sent to an opponent");
    // }
    // throw new Error(json.error || "Failed to send draw offer");

    return { data: json.data, error: null };
}

export async function acceptDraw(offerId: string) {
    const res = await fetch(`/api/chess/offers/${offerId}/accept`, {
        method: "POST",
    });

    const json = await res.json();

    if (!res.ok) throw new Error(json.error || "Failed to accept draw");

    return json.data;
}

export async function declineDraw(offerId: string) {
    const res = await fetch(`/api/chess/offers/${offerId}/decline`, {
        method: "POST",
    });

    const json = await res.json();

    if (!res.ok) throw new Error(json.error || "Failed to decline draw");

    return json.data;
}
