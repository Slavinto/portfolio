"use client";
import { Heading } from "@/components/ui";
import CustomButton from "@/components/ui/CustomButton";
import { NowPaymentsPayment } from "@/lib/nowpayments/schemas";
import { Headings } from "@/types/enums";
import React, { useEffect, useState } from "react";

const PaymentsPage = () => {
    const [responsePayment, setResponsePayment] =
        useState<NowPaymentsPayment>();
    const [minPaymentUsdt, setMinPaymentUsdt] = useState(0);

    const handleCreatePayment = async () => {
        try {
            const order = await fetch("/api/orders", {
                method: "POST",
                body: JSON.stringify({ amount_usd: minPaymentUsdt }),
            }).then((r) => r.json());

            const payment = (await fetch(
                `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/create`,
                {
                    method: "POST",
                    body: JSON.stringify({ order_id: order.id }),
                }
            ).then((r) => r.json())) as NowPaymentsPayment;

            if (!payment) {
                throw new Error("Failed to make payment request");
            }

            setResponsePayment(payment);
        } catch (error) {
            console.error({ error });
        }
    };

    // fetching minimum payment amount
    useEffect(() => {
        const getMinPaymentAmt = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/minpayamt?currency_from=usd&currency_to=usdttrc20`
                );
                if (!res.ok) {
                    throw new Error("Failed to fetch min payment amount");
                }
                const data = await res.json();
                console.log({ minPaymentAmount: data });
                if (data) {
                    setMinPaymentUsdt(Math.ceil(data.min_amount));
                }
            } catch (error) {
                setResponsePayment(undefined);
                setMinPaymentUsdt(0);
                console.log({ error });
            }
        };
        getMinPaymentAmt();
    }, []);

    // manually polling payment status
    useEffect(() => {
        if (!responsePayment?.payment_id) {
            return;
        }

        const interval = setInterval(async () => {
            const status = await fetch(
                `/api/payments/status/${responsePayment?.payment_id}`
            );
        }, 5000);
    }, [responsePayment]);

    return (
        <section className='self-center w-full h-screen flex flex-col items-center max-w-lg'>
            <div className='w-full p-4 flex flex-col items-center gap-2 mt-6 text-wrap'>
                <div className='flex w-full gap-2 items-center'>
                    <span className='text-middle'>
                        Minimum amount: {minPaymentUsdt}USDT
                    </span>
                    <CustomButton
                        handler={handleCreatePayment}
                        classNames='mt-2'
                    >
                        Create Payment in USDT
                    </CustomButton>
                </div>
                {responsePayment && (
                    <Heading as={Headings.H4} classNames='break-all'>
                        {JSON.stringify(responsePayment)}
                    </Heading>
                )}
            </div>
        </section>
    );
};

export default PaymentsPage;
