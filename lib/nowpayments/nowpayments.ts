// lib/nowpayments.ts
import { z } from "zod";

const API_URL = process.env.NOWPAYMENTS_API_URL!;
const API_KEY = process.env.NOWPAYMENTS_API_KEY!;

export async function nowpaymentsRequest<T>(
    path: string,
    schema: z.ZodSchema,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`NOWPayments error ${res.status}: ${text}`);
    }

    const json = await res.json();
    const parsed = schema.safeParse(json);

    if (!parsed.success) {
        console.error("NOWPayments schema error", parsed.error.format());
        throw new Error("Invalid NOWPayments response");
    }

    return parsed.data as T;
}
