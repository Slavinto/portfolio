"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { extractGameIdFromText } from "@/lib/helpers";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Props = {
    onClose: () => void;
};

const QR_REGION_ID = "join-game-qr-region";

export function JoinGameQR({ onClose }: Props) {
    const router = useRouter();
    const qrRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        let isActive = true;
        const noopQrError = () => {};

        async function startScanner() {
            try {
                const qr = new Html5Qrcode(QR_REGION_ID);
                qrRef.current = qr;

                await qr.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    (gameId) => {
                        if (!isActive) return;

                        // const gameId = extractGameIdFromText(decodedText);

                        if (!gameId) {
                            toast.error("Invalid game QR");
                            return;
                        }

                        isActive = false;

                        qr.stop().finally(() => {
                            onClose();
                            router.push(`/chess/game/${gameId}`);
                        });
                    },
                    noopQrError
                );
            } catch (err) {
                console.error(err);
                toast.error("Failed to access camera");
                onClose();
            }
        }

        startScanner();

        return () => {
            isActive = false;
            if (qrRef.current?.isScanning) {
                qrRef.current.stop().catch(() => {});
            }
        };
    }, [onClose, router]);

    return (
        <div className='flex flex-col gap-4 w-full'>
            <div
                id={QR_REGION_ID}
                className='w-full aspect-square rounded-xl overflow-hidden bg-black'
            />
            <p className='text-sm text-muted-foreground text-center'>
                Point your camera at the game QR code
            </p>
        </div>
    );
}
