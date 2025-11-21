import { resignGame } from "@/lib/services/chess-db";
import { useYourColor } from "@/hooks/games/chess/useYourColor";
import { useParams, useRouter } from "next/navigation";
import { Color } from "@/types/games/chess";
import { ButtonsCard } from "@/components/ui";
import { ToastModal } from "../../toast/ToastModal";
import { toast } from "react-toastify";
import { useChessGamePageContext } from "@/app/context/ChessGamePageContext";

function ResignButton() {
    const { state } = useChessGamePageContext();
    const router = useRouter();
    const { gameRow, player } = state;
    if (!gameRow || !player) {
        console.log("Invalid gameRow or player data");
        return null;
    }
    const { playerColor } = player;
    const { id } = gameRow;
    async function handleResign() {
        try {
            await resignGame(id, playerColor as Color);
            router.push("/games"); // go back to games list
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
