"use client";
import { ButtonsCard } from "@/components/ui";
import { useUser } from "@/hooks/auth/useUser";
import { OfferType } from "@/types/games/chess";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ToastModal } from "../../toast/ToastModal";
import { sendOffer } from "@/lib/services/chess-offers";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { usePresenceStore } from "@/data/games/chess/store/presence";

type OfferButtonProps = {
    type: OfferType;
    toPlayer: string;
};

export default function OfferButton({ type }: OfferButtonProps) {
    const { id: gameId } = useParams<{ id: string }>();
    const {
        state: { playerId, opponentId },
    } = useChessGamePageContext();
    const router = useRouter();
    const { data: user } = useUser();
    const opponentIsOnline = usePresenceStore(
        (s) => s.onlinePlayers[opponentId ?? ""] === true
    );

    if (!playerId || !opponentId) {
        console.error("Invalid player or opponent id");
        // return null;
    }

    if (!user || !user.id) {
        router.push("/auth/login");
        toast.error("Must be logged in to send offers");
        return null;
    }

    const handleOffer = async () => {
        if (!playerId || !opponentId) {
            toast.info("Invalid player or opponent id");
            return;
        }
        if (!opponentIsOnline) {
            toast.info("Failed to send offer. Opponent is not online");
            return;
        }
        const res = await sendOffer(gameId, type, playerId, opponentId);
        if (res.error) toast.error(res.error);
    };

    return (
        <ButtonsCard
            className='rounded-xl p-2 cursor-pointer'
            onClick={() =>
                ToastModal(handleOffer, {
                    message: `Are you sure you want to offer a ${type}?`,
                })
            }
        >
            Offer {type}
        </ButtonsCard>
    );
}
