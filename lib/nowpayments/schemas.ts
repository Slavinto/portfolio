import { z } from "zod";

export const NowPaymentsStatusSchema = z.enum([
    "waiting",
    "confirming",
    "confirmed",
    "finished",
    "failed",
    "expired",
    "refunded",
]);

export const OrderStatusSchema = z.enum([
    "pending", // created, awaiting payment
    "paid", // payment completed successfully
    "expired", // payment window expired
    "cancelled", // manually cancelled or payment failed
    "refunded", // payment refunded after success
]);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const OrderSchema = z.object({
    id: z.string(),
    user_id: z.string(),
    amount_usd: z.number(),
    currency: z.string(),
    status: NowPaymentsStatusSchema,
    created_at: z.string(),
    updated_at: z.string(),
});

export type Order = z.infer<typeof OrderSchema>;

export type NowPaymentsStatus = z.infer<typeof NowPaymentsStatusSchema>;

export const NowPaymentsCurrenciesResponseSchema = z.array(z.string());

export type NowPaymentsCurrenciesResponse = z.infer<
    typeof NowPaymentsCurrenciesResponseSchema
>;

export const NowPaymentsMinAmountSchema = z.object({
    currency_from: z.string(),
    currency_to: z.string(),
    min_amount: z.number(),
    flat_equivalent: z.number().optional(),
});

export type NowPaymentsMinAmount = z.infer<typeof NowPaymentsMinAmountSchema>;

export const PaymentSchema = z.object({
    payment_id: z.string(),
    payment_status: z.string(),
    price_amount: z.number(),
    pay_amount: z.number(),
    pay_currency: z.string(),
    pay_address: z.string(),
});

export type Payment = z.infer<typeof PaymentSchema>;

export const NowPaymentsPaymentSchema = z.object({
    payment_id: z.string(),
    payment_status: NowPaymentsStatusSchema,

    price_amount: z.number(),
    price_currency: z.string(),

    pay_amount: z.number(),
    pay_currency: z.string(),
    pay_address: z.string(),

    amount_received: z.number(),

    order_id: z.string(),
    order_description: z.string().optional(),

    created_at: z.string(),
    updated_at: z.string(),

    purchase_id: z.string().optional(),
    network: z.string().optional(),

    expiration_estimate_date: z.string().optional(),
    valid_until: z.string().optional(),

    is_fixed_rate: z.boolean(),
    is_fee_paid_by_user: z.boolean(),

    ipn_callback_url: z.string().nullable().optional(),
    customer_email: z.string().nullable().optional(),
});

export type NowPaymentsPayment = z.infer<typeof NowPaymentsPaymentSchema>;
