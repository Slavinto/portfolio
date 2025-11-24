import { useParams, useRouter } from "next/navigation";
import { ButtonsCard } from "@/components/ui";
import { toast } from "react-toastify";
import { useUser } from "@/hooks/auth/useUser";
import { sendOffer } from "@/lib/services/chess-offers";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";

function OfferDrawButton() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const {
        state: { player },
    } = useChessGamePageContext();

    if (!player || !player.playerId || !player?.opponentId) {
        toast.error("Invalid player data");
        router.push("/auth/login/");
    }

    async function handleOfferDraw() {
        try {
            await sendOffer(id, "draw", player?.playerId!, player?.opponentId!);
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
