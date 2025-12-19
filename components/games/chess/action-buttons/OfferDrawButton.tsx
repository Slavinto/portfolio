import { useParams, useRouter } from "next/navigation";
import { ButtonsCard } from "@/components/ui";
import { toast } from "react-toastify";
import { useUser } from "@/hooks/auth/useUser";
import { sendOffer } from "@/lib/services/chess-offers";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { useEffect } from "react";

function OfferDrawButton() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const {
        state: { player, opponent },
    } = useChessGamePageContext();

    useEffect(() => {
        if (!player || !player?.id || !opponent || !opponent?.id) {
            toast.error("Invalid player data");
            router.push("/auth/login/");
        }
    }, [player, player?.id, opponent?.id]);

    async function handleOfferDraw() {
        try {
            await sendOffer(id, "draw", player?.id!, opponent?.id!);
            toast.info("Draw offer sent to opponent.");
        } catch (err) {
            console.error("Error offering draw:", err);
            toast.error("Failed to offer a draw. Please try again later");
        }
    }

    return (
        <ButtonsCard
            onClick={handleOfferDraw}
            className='rounded-xl p-2 cursor-pointer'
        >
            Offer Draw
        </ButtonsCard>
    );
}

export default OfferDrawButton;
