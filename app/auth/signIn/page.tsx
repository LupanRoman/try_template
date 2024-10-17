import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import googleIcon from "@/public/google.png";
import signUpBg from "@/public/signUpBg.png";
import { headers } from "next/headers";

export default function SignIn() {
  const signIn = async (formData: FormData) => {
    "use server";
    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // TODO Make the retry button if error occurs
    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    // return redirect("http://localhost:3000/hub");
    return redirect(`${origin}/hub`);
  };

  const signInWithGoogle = async () => {
    "use server";
    const origin = headers().get("origin");
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
    redirect(data.url || "");
  };

  return (
    <>
      <div className="flex h-[100svh] flex-col items-center justify-center bg-2BG/50 md:w-2/5 md:rounded-r-2xl">
        <form action={signInWithGoogle}>
          <button className="flex items-center gap-6 rounded-lg bg-3BG px-[32px] py-[16px] text-xl font-bold text-textColor">
            <Image
              alt="log of google"
              width={30}
              height={30}
              src={googleIcon}
            />
            Continue with Google
          </button>
        </form>
        <p className="pb-[40px] pt-[20px] font-semibold text-textColor">or</p>
        <form
          autoComplete="off"
          action={signIn}
          className="flex flex-col gap-3"
        >
          <input
            className="rounded-lg bg-mainBG py-[12px] indent-2 text-base font-semibold outline-none active:bg-mainBG"
            type="email"
            placeholder="Email address"
            name="email"
            required
          />
          <input
            className="rounded-lg bg-mainBG py-[12px] indent-2 text-base font-semibold outline-none active:bg-mainBG"
            type="password"
            placeholder="Password"
            name="password"
            required
          />
          <div className="controls flex flex-col gap-2 pt-[100px]">
            <button className="rounded-lg bg-gradient-to-r from-gradientLeft to-gradientRight py-[10px] text-xl font-bold text-textColor">
              Sign in
            </button>
            <Link href={"/auth/signUp"}>
              <button className="text-base text-textColor">
                Don't have an account yet?
                <span className="font-bold"> Sign up</span>
              </button>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
