import { OrderStatus } from "@/lib/nowpayments/schemas";

export type NowPaymentsStatus =
    | "waiting"
    | "confirming"
    | "confirmed"
    | "finished"
    | "failed"
    | "expired"
    | "refunded";

export const paymentAllowedTransitions: Record<
    NowPaymentsStatus,
    NowPaymentsStatus[]
> = {
    waiting: ["confirming", "expired", "failed"],
    confirming: ["confirmed", "failed"],
    confirmed: ["finished"],
    finished: [],
    failed: [],
    expired: [],
    refunded: [],
};

export const PAYMENT_TERMINAL_STATES: ReadonlySet<NowPaymentsStatus> = new Set([
    "expired",
    "failed",
    "finished",
    "refunded",
]);

export const ORDER_TERMINAL_STATES: ReadonlySet<OrderStatus> = new Set([
    "paid",
    "cancelled",
    "expired",
    "refunded",
]);

export const orderAllowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ["paid", "cancelled", "expired"],
    paid: ["refunded"],
    expired: [],
    cancelled: [],
    refunded: [],
};
