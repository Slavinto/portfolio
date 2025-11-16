"use client";
import { ButtonsCard } from "@/components/ui";
import { useUser } from "@/hooks/auth/useUser";
import { OfferType } from "@/types/games/chess";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ToastModal } from "../../toast/ToastModal";
import { acceptDraw, offerDraw } from "@/lib/services/chess-offers";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";

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
    if (!playerId || !opponentId) {
        // toast.error("Not enough data. Invalid context");
        return null;
    }
    if (!user || !user.id) {
        router.push("/auth/login");
        toast.error("Must be logged in to send offers");
        return null;
    }

    const handleOffer = async () => {
        if (type === "draw") {
            const res = await offerDraw(gameId, playerId, opponentId);
            if (res.error) toast.error(res.error);
            // } else {
            //     toast.info("Draw offer sent");
            // }
        }
        if (type === "layoff") {
            const res = await acceptDraw("test-string");
        }
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
