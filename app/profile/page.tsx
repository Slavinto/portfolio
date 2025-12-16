import ProfileForm from "@/app/profile/ProfileForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export default async function ProfilePage() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    return (
        <section className='flex justify-center py-16 px-4 w-full max-w-5xl mx-auto'>
            <ProfileForm user={user} />
        </section>
    );
}
