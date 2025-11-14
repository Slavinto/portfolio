"use client";
import React from "react";
import { ChessPageContextProvider } from "../context/ChessGamePageContext";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/auth/useUser";
import ChessGameSkeleton from "@/components/ui/patterns/ChessGameSkeleton";

const ChessLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { data: user, isLoading: isLoadingUser } = useUser();

    if (isLoadingUser) {
        return <ChessGameSkeleton repeatPattern={3} />;
    }

    if (!user) {
        router.push("/auth/login");
    }
    return <ChessPageContextProvider>{children}</ChessPageContextProvider>;
};

export default ChessLayout;
