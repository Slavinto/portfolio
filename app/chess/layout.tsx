import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import ChessGameContextClientWrapper from "../context/ChessGameContextClientWrapper";

export default async function ChessLayout({
    children,
}: {
    children: ReactNode;
}) {
    const supabase = await createSupabaseServerClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect("/auth/login");
    }

    return (
        <ChessGameContextClientWrapper>
            {children}
        </ChessGameContextClientWrapper>
    );
}
