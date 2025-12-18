"use client";

import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Props = {
    onClose: () => void;
};

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function JoinGameQR({ onClose }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();

    useEffect(() => {
        const reader = new BrowserMultiFormatReader();
        let active = true;

        reader.decodeFromVideoDevice(undefined, videoRef.current!, (result) => {
            if (!active || !result) return;

            const gameId = result.getText().trim();
            if (!UUID_REGEX.test(gameId)) return;

            active = false;
            // @ts-expect-error
            reader.reset(); // ✅ correct stop

            onClose();
            router.push(`/chess/game/${gameId}`);
        });

        return () => {
            active = false;
            // @ts-expect-error
            reader.reset(); // ✅ cleanup
        };
    }, [router, onClose]);

    return (
        <div className='w-full aspect-square rounded-xl overflow-hidden bg-black'>
            <video
                ref={videoRef}
                className='w-full h-full object-cover'
                autoPlay
                muted
            />
        </div>
    );
}
