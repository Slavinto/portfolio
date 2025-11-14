import { offerDraw } from "@/lib/services/chess-db";
import { useParams, useRouter } from "next/navigation";
import { ButtonsCard } from "@/components/ui";
import { toast } from "react-toastify";
import { useUser } from "@/hooks/auth/useUser";

function OfferDrawButton() {
    const { id } = useParams<{ id: string }>();
    const { data: user } = useUser();
    const router = useRouter();

    if (!user) {
        toast.error("Must be logged in to perform this action");
        router.push("/auth/login/");
    }

    async function handleOfferDraw() {
        try {
            await offerDraw(id, user?.id!);
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
