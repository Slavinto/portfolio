"use client";
import { ButtonsCard } from "@/components/ui";
import { useUser } from "@/hooks/auth/useUser";
import { OfferType } from "@/types/games/chess";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ToastModal } from "../../../ui/toast/ToastModal";
import { sendOffer } from "@/lib/services/chess-offers";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { usePresenceStore } from "@/data/games/chess/store/presence";

type OfferButtonProps = {
    type: OfferType;
};

export default function OfferButton({ type }: OfferButtonProps) {
    const {
        state: { player, gameRow, opponent },
    } = useChessGamePageContext();
    const router = useRouter();
    const { data: user } = useUser();

    const opponentIsOnline = usePresenceStore((s) => {
        if (!player || !gameRow || !opponent) {
            console.info("Invalid player or gameRow data: ", {
                player,
                opponent,
                gameRow,
            });
            return false;
        }
        const { id: opponentId } = opponent;
        return s.onlinePlayers[opponentId ?? ""] === true;
    });

    if (!user || !user.id) {
        router.push("/auth/login");
        toast.error("Must be logged in to send offers");
        return null;
    }

    if (!player || !gameRow || !opponent) {
        console.info("Invalid player or game data: ", { player, gameRow });
        return null;
    }
    const { id: playerId } = player;
    const { id: opponentId } = opponent;

    if (!playerId || !opponentId) {
        console.info("Invalid player or opponent id");
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
        const res = await sendOffer(gameRow.id, type, playerId, opponentId);
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
