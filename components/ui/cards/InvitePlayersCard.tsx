"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import { FaCopy, FaQrcode, FaShare } from "react-icons/fa";
import { ButtonsCard } from "../buttons/tailwindcss-buttons";
import Heading from "../text/Heading";
import { Headings } from "@/types/enums";

export function InvitePlayersCard({ inviteUrl }: { inviteUrl: string }) {
    const [showQR, setShowQR] = useState(false);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(inviteUrl);
        toast.success("Link copied!");
    };

    function canUseShare() {
        // Safari mobile & Chrome Android → OK
        // Desktop → navigator.share exists but unusable

        return (
            typeof navigator !== "undefined" &&
            !!navigator.share &&
            /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
        );
    }

    const shareNative = async () => {
        if (!canUseShare()) {
            toast.info("Native sharing is not supported — use copy instead");
            return;
        }

        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Share timed out")), 2500)
        );

        try {
            await Promise.race([
                navigator.share({
                    title: "Join my chess game",
                    text: "Come play with me!",
                    url: inviteUrl,
                }),
                timeout,
            ]);
        } catch (err) {
            // Prevent stuck modals: always close any loader here
            console.warn("Share failed or timed out", err);
            toast.info("Could not open native share — use copy instead");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='
                w-full max-w-md mx-auto mt-6
                rounded-xl p-6 shadow-xl
                bg-white/10 dark:bg-black/20
                backdrop-blur-xl border border-white/20
            '
        >
            <Heading
                as={Headings.H4}
                classNames='uppercase text-center font-semibold mb-4'
            >
                Invite Opponent
            </Heading>

            {/* Input + copy */}
            <div className='flex items-center gap-2 mb-3'>
                <input
                    readOnly
                    value={inviteUrl}
                    className='
                        w-full rounded-lg px-3 py-2 bg-white/20 dark:bg-black/30 border-common text-middle focus:outline-none
                    '
                />
                <ButtonsCard
                    onClick={copyToClipboard}
                    className='text-middle p-2 rounded-lg bg-white/20 hover:bg-white/30 dark:bg-black/40 dark:hover:bg-black/50 transition'
                    icon={<FaCopy className='w-4 h-4' />}
                    iconPosition='left'
                ></ButtonsCard>
            </div>

            {/* Native share button */}
            <ButtonsCard
                onClick={shareNative}
                className='
                    w-full mb-3 py-2 rounded-lg flex items-center justify-center gap-2 text-middle hover:opacity-90 transition
                '
                icon={<FaShare className='w-4 h-4' />}
                iconPosition='left'
            >
                Share
            </ButtonsCard>

            {/* Toggle QR */}
            <ButtonsCard
                onClick={() => setShowQR((s) => !s)}
                className='text-middle w-full py-2 rounded-lg border-common
                    bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 transition flex items-center justify-center gap-2
                '
                icon={<FaQrcode className='w-4 h-4' />}
                iconPosition='left'
            >
                {showQR ? "Hide QR Code" : "Show QR Code"}
            </ButtonsCard>

            {/* QR code animation */}
            <AnimatePresence>
                {showQR && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className='flex justify-center pt-6'
                    >
                        <div className='p-4 rounded-xl bg-white shadow-md'>
                            <QRCode value={inviteUrl} size={150} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
