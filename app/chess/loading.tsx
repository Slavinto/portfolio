import ChessGameSkeleton from "@/components/ui/patterns/ChessGameSkeleton";
import React from "react";

const GenericLoadingSkeleton = () => {
    return <ChessGameSkeleton repeatPattern={3} />;
};

export default GenericLoadingSkeleton;
