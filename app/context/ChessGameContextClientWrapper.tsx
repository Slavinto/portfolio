"use client";

import React, { ReactNode } from "react";
import { ChessPageContextProvider } from "./ChessGamePageContext";
import { useUser } from "@/hooks/auth/useUser";
import { useRouter } from "next/navigation";

const ChessGameContextClientWrapper = ({
    children,
}: {
    children: ReactNode;
}) => {
    const router = useRouter();
    const {
        data: user,
        isLoading: isLoadingUser,
        error: userError,
    } = useUser();

    if (!isLoadingUser && (userError || !user?.id)) {
        console.info("Failed to load page. Not logged in");
        router.push("/auth/login");
    }

    return <ChessPageContextProvider>{children}</ChessPageContextProvider>;
};

export default ChessGameContextClientWrapper;
