"use client";

import { ModalProvider } from "@/components/ui/animated-modal";

export default function GlobalModalProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ModalProvider>{children}</ModalProvider>;
}
