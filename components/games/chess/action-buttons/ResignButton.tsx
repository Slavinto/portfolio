import { useRouter } from "next/navigation";
import { ButtonsCard } from "@/components/ui";
import { ToastModal } from "../../../ui/toast/ToastModal";
import { toast } from "react-toastify";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";
import { finishGame } from "@/lib/games/chess/actions/finishGame";

function ResignButton() {
    const { state } = useChessGamePageContext();
    const router = useRouter();
    const { gameRow, player, opponent } = state;
    if (!gameRow || !player || !opponent || !opponent?.id) {
        return null;
    }
    const { id } = gameRow;
    const { id: opponentId } = opponent;

    async function handleResign() {
        try {
            await finishGame(id, "resigned", opponentId);
            router.push("/chess"); // go back to games list
        } catch (err) {
            console.error("Failed to resign game:", err);
            toast.error("Error resigning the game.");
        }
    }

    return (
        <ButtonsCard
            onClick={() =>
                ToastModal(handleResign, {
                    message: "Are you sure you want to resign?",
                })
            }
            className='rounded-xl p-2 cursor-pointer'
        >
            Resign
        </ButtonsCard>
    );
}

export default ResignButton;
