import { NowPaymentsPayment, Payment } from "@/types/nowpayments/interfaces";
import { z } from "zod";

export function mapNowPayment(p: NowPaymentsPayment): Payment {
    return {
        id: p.payment_id,
        status: p.payment_status,
        amountUsd: p.price_amount,
        amountCrypto: p.pay_amount,
        crypto: p.pay_currency,
        address: p.pay_address,
        expiresAt: p.expiration_estimate_date
            ? new Date(p.expiration_estimate_date)
            : undefined,
    };
}
