import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll: (cookies) => {
                    cookies.forEach(({ name, value }) => {
                        response.cookies.set(name, value);
                        request.cookies.set(name, value); // important
                    });
                },
            },
        }
    );

    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

    if (!user && !request.nextUrl.pathname.startsWith("/auth/login")) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
    }

    return response;
}
