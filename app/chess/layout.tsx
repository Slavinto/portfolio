import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { ChessPageContextProvider } from "../context/ChessGamePageContext";

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

    return <>{children}</>;
}

// "use client";
// import React from "react";
// import { ChessPageContextProvider } from "../context/ChessGamePageContext";
// import { useRouter } from "next/navigation";
// import { useUser } from "@/hooks/auth/useUser";
// import ChessGameSkeleton from "@/components/ui/patterns/ChessGameSkeleton";

// const ChessLayout = ({ children }: { children: React.ReactNode }) => {
//     const router = useRouter();
//     const { data: user, isLoading: isLoadingUser } = useUser();

//     if (isLoadingUser) {
//         return <ChessGameSkeleton repeatPattern={3} />;
//     }

//     if (!user) {
//         router.push("/auth/login");
//     }
//     return <ChessPageContextProvider>{children}</ChessPageContextProvider>;
// };

// export default ChessLayout;

// export async function getServerSideProps({ req }: { req: any }) {
//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         req.cookies
//     );
//     const {
//         data: { session },
//     } = await supabase.auth.getSession();

//     if (!session) {
//         return { redirect: { destination: "/auth/login", permanent: false } };
//     }

//     return { props: { user: session.user } };
// }
