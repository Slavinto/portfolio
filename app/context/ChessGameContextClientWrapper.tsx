"use client";

import React, { ReactNode } from "react";
import { ChessPageContextProvider } from "./ChessGamePageContext";

const ChessGameContextClientWrapper = ({
    children,
}: {
    children: ReactNode;
}) => {
    return <ChessPageContextProvider>{children}</ChessPageContextProvider>;
};

export default ChessGameContextClientWrapper;
