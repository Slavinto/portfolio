import { File } from "@/types/games/chess";

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
