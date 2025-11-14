"use client";
import { ButtonsCard } from "@/components/ui";
import { useUser } from "@/hooks/auth/useUser";
import { OfferType } from "@/types/games/chess";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ToastModal } from "../../toast/ToastModal";
import { createClient } from "@/lib/supabase/client";

type OfferButtonProps = {
    type: OfferType;
    toPlayer: string;
};

export default function OfferButton({ type, toPlayer }: OfferButtonProps) {
    const supabase = createClient();
    const { id: gameId } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: user } = useUser();
    if (!user || !user.id) {
        router.push("/auth/login");
        toast.error("Must be logged in to send offers");
        return null;
    }
    // const {state} = useChessGamePageContext()
    const handleOffer = async () => {
        const session = await supabase.auth.getSession();
        const access_token = session?.data?.session?.access_token;
        if (!access_token) {
            toast.error("Failed to send an offer. Invalid access token");
        }
        console.log({ access_token });
        const res = await fetch("/api/chess/offers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${access_token}`, // pass the token
            },
            credentials: "include",
            body: JSON.stringify({
                gameId,
                fromPlayer: user.id,
                toPlayer,
                type,
            }),
        });
        const json = await res.json();
        console.log({ json });
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
