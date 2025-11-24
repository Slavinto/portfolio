import { File, GameStatus } from "@/types/games/chess";

export const fileOffsets: Record<File, File | null> = {
    A: "B",
    B: "A",
    C: "B",
    D: "C",
    E: "D",
    F: "E",
    G: "F",
    H: "G",
} as const;

export const pieceDirection = {
    left: "Left",
    top: "Top",
    right: "Right",
    bottom: "Bottom",
    topLeft: "TopLeft",
    topRight: "TopRight",
    bottomLeft: "BottomLeft",
    bottomRight: "BottomRight",
} as const;

export const STATUS_COLORS: Record<GameStatus, string> = {
    finished: "bg-red-100 text-red-800",
    ongoing: "bg-neutral-100 text-neutral-800",
    waiting: "bg-yellow-100 text-yellow-800",
    draw: "bg-gray-100 text-gray-800",
    resigned: "bg-orange-100 text-orange-800",
    "layed-off": "bg-stone-100 text-stone-800",
};
