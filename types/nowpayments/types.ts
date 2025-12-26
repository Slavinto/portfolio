export type NowPaymentsStatus =
    | "waiting"
    | "confirming"
    | "confirmed"
    | "finished"
    | "failed"
    | "expired"
    | "refunded";

export const allowedTransitions: Record<string, string[]> = {
    waiting: ["confirming", "failed"],
    confirming: ["finished", "failed"],
    finished: [],
    failed: [],
};
