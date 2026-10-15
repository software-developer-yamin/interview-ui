"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesCombined,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User as UserIcon,
  Zap,
  Loader2,
  LogOut,
} from "lucide-react";
import {
  apiLogin,
  apiSignup,
  apiGetMe,
  saveAuthToken,
  getAuthToken,
  removeAuthToken,
  type AuthUser,
} from "./auth";
import { useRouter } from "next/navigation";

const features = [
  {
    title: "Real-time Data",
    description: "Get live data from multiple sources.",
    Icon: Zap,
  },
  {
    title: "Secure & Reliable",
    description: "Your data is always protected.",
    Icon: ShieldCheck,
  },
  {
    title: "Easy to Use",
    description: "Powerful features with a simple interface.",
    Icon: ChartNoAxesCombined,
  },
];

export default function Home() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  // Restore session if token exists
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      apiGetMe(token)
        .then((user) => setCurrentUser(user))
        .catch(() => {
          removeAuthToken();
          setCurrentUser(null);
        });
    }
  }, []);



async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setMessage("");
  setError("");
  setLoading(true);

  try {
    if (isSignup) {
      const res = await apiSignup({ email, password, name });
      saveAuthToken(res.token);
      setCurrentUser(res.user);
      setMessage("Account created successfully!");
    } else {
      const res = await apiLogin({ email, password });
      saveAuthToken(res.token);
      setCurrentUser(res.user);
      setMessage("Signed in successfully!");
      router.push("/dashboard");
    }
  } catch (err: unknown) {
    setError(
      err instanceof Error ? err.message : "Authentication failed"
    );
  } finally {
    setLoading(false);
  }
}


  function handleLogout() {
    removeAuthToken();
    setCurrentUser(null);
    setEmail("");
    setPassword("");
    setName("");
    setMessage("");
    setError("");
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white lg:grid lg:grid-cols-[60.3%_39.7%]">
      {/* LEFT PANEL */}
      <section className="relative isolate flex min-h-[850px] flex-col overflow-hidden border-r border-blue-950/50 px-8 py-10 sm:px-12 lg:min-h-screen lg:px-[8.9%]">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/images/hero-analytics-mountain.png')",
            backgroundPosition: "center center",
          }}
        />

        <div className="absolute inset-0 -z-10 bg-[#020817]/35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#020817]/90 via-[#020817]/45 to-transparent" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#020817]/60 via-transparent to-[#020817]/65" />

        {/* HEADER */}
        <header className="flex items-center justify-between gap-6">
          <Link href="/" className="shrink-0">
            <img
              src="/assets/logo/datapulse-wordmark-login-reference.png"
              alt="DataPulse"
              className="h-[39px] w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-3 whitespace-nowrap text-[12px] text-[#c4d9f4] xl:flex">
            <span>Secure Data</span>
            <span className="text-blue-400">·</span>
            <span>Smart Insights</span>
            <span className="text-blue-400">·</span>
            <span>Better Decisions</span>
          </nav>
        </header>

        {/* HERO CONTENT */}
        <div className="my-auto max-w-[510px] pb-10 pt-14">
          <div className="inline-flex h-[35px] items-center gap-2 rounded-full border border-blue-400/40 bg-[#07162b]/75 px-3 text-[13px] text-[#c4dcff]">
            <ShieldCheck size={16} className="fill-blue-500 text-blue-200" />
            Your Data, Our Priority
          </div>

          <h1 className="mt-[18px] text-[42px] font-bold leading-[1.4] tracking-[-1.5px] sm:text-[50px]">
            Turn Your Data
            <br />
            into{" "}
            <span className="bg-gradient-to-r from-[#299fff] via-[#4387ff] to-[#a23aff] bg-clip-text text-transparent">
              Real Insights
            </span>
          </h1>

          <p className="mt-[13px] max-w-[400px] text-[16px] leading-[27px] text-[#c4dcf6]">
            Track, analyze, and make better decisions
            <br className="hidden sm:block" /> with our powerful data
            collection platform.
          </p>

          {/* FEATURE LIST */}
          <div className="mt-[36px] space-y-[22px]">
            {features.map(({ title, description, Icon }) => (
              <div key={title} className="flex items-center gap-[21px]">
                <div className="flex h-[51px] w-[49px] shrink-0 items-center justify-center rounded-[12px] border border-blue-400/70 bg-gradient-to-br from-[#15315b]/95 to-[#11182c]/95 shadow-[0_0_18px_rgba(25,105,255,0.12)]">
                  <Icon size={25} strokeWidth={2.3} />
                </div>

                <div>
                  <h2 className="text-[13px] font-semibold leading-5 text-white">
                    {title}
                  </h2>
                  <p className="mt-[2px] text-[12px] leading-[19px] text-[#b7d0f1]">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM QUOTE */}
        <blockquote className="mb-[65px] flex items-start gap-[10px]">
          <span className="text-[48px] leading-[38px] text-[#3188ff]">
            “
          </span>
          <p className="pt-[12px] text-[13px] leading-[23px] text-[#c5dcf6]">
            Data is not just information,
            <br />
            it&apos;s the key to a smarter tomorrow.
          </p>
        </blockquote>
      </section>

      {/* RIGHT PANEL */}
      <section className="flex min-h-screen flex-col bg-gradient-to-br from-[#030b19] via-[#020817] to-[#05091a] px-5 py-7 sm:px-9 lg:px-[7.9%] lg:py-[40px]">
        {/* TOP ACTION */}
        <div className="mb-[38px] flex items-center justify-end gap-[13px] whitespace-nowrap text-[12px] text-[#c4d5ee]">
          <span>{isSignup ? "Already have an account?" : "Not a member yet?"}</span>

          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setMessage("");
              setError("");
            }}
            className="flex h-[41px] items-center gap-2 rounded-[12px] border border-blue-500/60 px-[12px] text-[#55aaff] transition hover:bg-blue-500/10 cursor-pointer"
          >
            {isSignup ? "Sign In" : "Create Account"}
            <ArrowRight size={15} />
          </button>
        </div>

        {/* LOGIN / SIGNUP CARD */}
        <div className="relative mx-auto my-auto w-full max-w-[497px] overflow-hidden rounded-[20px] border border-[#16315a] bg-gradient-to-br from-[#09152a] via-[#030b18] to-[#07091b] shadow-[0_15px_60px_rgba(0,0,0,0.2)]">
          <div className="pointer-events-none absolute left-0 top-0 h-24 w-24 rounded-full bg-blue-500/5 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-violet-600/10 blur-[80px]" />

          <div className="relative px-[30px] pb-[48px] pt-[65px] sm:px-[46px]">
            {/* CARD LOGO */}
            <div className="flex justify-center">
              <img
                src="/assets/logo/datapulse-wordmark-login-reference.png"
                alt="DataPulse"
                className="h-[45px] w-auto"
              />
            </div>
              <>
                <div className="mb-[34px] mt-[38px]">
                  <h2 className="text-[29px] font-bold leading-[35px] tracking-[-0.6px]">
                    {isSignup ? "Create Account" : "Welcome Back!"}
                  </h2>

                  <p className="mt-[4px] text-[14px] leading-[26px] text-[#c4d9f2]">
                    {isSignup ? (
                      <>
                        Join DataPulse and start your
                        <br />
                        data journey today.
                      </>
                    ) : (
                      <>
                        Login to your account and continue your
                        <br />
                        data journey.
                      </>
                    )}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-[25px]">
                  {/* FULL NAME (SIGNUP ONLY) */}
                  {isSignup && (
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-[9px] flex items-center gap-[12px] text-[14px] text-[#d8e6fa]"
                      >
                        <UserIcon size={17} />
                        Full Name
                      </label>

                      <div className="flex h-[47px] items-center gap-[13px] rounded-[12px] border border-[#294b78] bg-[#0b192d]/80 px-[12px] transition focus-within:border-[#428bff]">
                        <UserIcon size={16} className="shrink-0 text-[#8ba9cf]" />

                        <input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-[#91acd0]"
                        />
                      </div>
                    </div>
                  )}

                  {/* EMAIL FIELD */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-[9px] flex items-center gap-[12px] text-[14px] text-[#d8e6fa]"
                    >
                      <Mail size={17} />
                      Email Address
                    </label>

                    <div className="flex h-[47px] items-center gap-[13px] rounded-[12px] border border-[#294b78] bg-[#0b192d]/80 px-[12px] transition focus-within:border-[#428bff]">
                      <Mail size={16} className="shrink-0 text-[#8ba9cf]" />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-[#91acd0]"
                      />
                    </div>
                  </div>

                  {/* PASSWORD FIELD */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-[9px] flex items-center gap-[12px] text-[14px] text-[#d8e6fa]"
                    >
                      <LockKeyhole size={17} />
                      Password
                    </label>

                    <div className="flex h-[47px] items-center gap-[13px] rounded-[12px] border border-[#294b78] bg-[#0b192d]/80 px-[12px] transition focus-within:border-[#428bff]">
                      <LockKeyhole
                        size={16}
                        className="shrink-0 text-[#8ba9cf]"
                      />

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete={isSignup ? "new-password" : "current-password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-[#91acd0]"
                      />

                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((value) => !value)}
                        className="shrink-0 text-[#c7d9f2] hover:text-white"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  {/* REMEMBER / FORGOT */}
                  {!isSignup && (
                    <div className="flex items-center justify-between gap-3">
                      <label className="flex cursor-pointer items-center gap-[11px] text-[12px] text-[#d0e1f8]">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={(event) => setRemember(event.target.checked)}
                          className="h-[18px] w-[18px] cursor-pointer accent-blue-500"
                        />
                        Remember me
                      </label>

                      <Link
                        href="/forgot-password"
                        className="text-[12px] text-[#18b8ff] hover:text-[#80d9ff]"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-[51px] w-full items-center justify-center gap-[14px] rounded-[11px] bg-gradient-to-r from-[#3596ff] via-[#486bff] to-[#863aff] text-[14px] font-semibold text-white transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        Please wait...
                      </span>
                    ) : (
                      <>
                        <ArrowRight size={19} />
                        {isSignup ? "Create Account" : "Log In"}
                      </>
                    )}
                  </button>

                  {/* OR DIVIDER */}
                  <div className="flex items-center gap-[14px]">
                    <span className="h-px flex-1 bg-[#203653]" />
                    <span className="text-[12px] text-[#c1d4ee]">OR</span>
                    <span className="h-px flex-1 bg-[#203653]" />
                  </div>

                  {/* GOOGLE BUTTON */}
                  <button
                    type="button"
                    onClick={() =>
                      setMessage("Configure Google OAuth to enable sign-in.")
                    }
                    className="flex h-[50px] w-full items-center justify-center gap-[14px] rounded-[11px] border border-[#4486f6] bg-[#030b18]/60 text-[13px] font-semibold text-white transition hover:bg-blue-950/50"
                  >
                    <span className="bg-gradient-to-br from-[#4285f4] via-[#34a853] to-[#ea4335] bg-clip-text text-[25px] font-extrabold text-transparent">
                      G
                    </span>
                    Continue with Google
                  </button>

                  {error && (
                    <p
                      role="alert"
                      className="rounded-lg border border-red-500/40 bg-red-950/50 p-3 text-xs leading-5 text-red-200"
                    >
                      {error}
                    </p>
                  )}

                  {message && (
                    <p
                      role="status"
                      className="rounded-lg border border-blue-500/30 bg-blue-950/40 p-3 text-xs leading-5 text-blue-100"
                    >
                      {message}
                    </p>
                  )}

                  {/* LEGAL TEXT */}
                  <p className="pt-[8px] text-center text-[12px] leading-[21px] text-[#a9c4e8]">
                    By continuing, you agree to our
                    <br />
                    <Link
                      href="/terms"
                      className="text-[#19baff] hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-[#19baff] hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              </>

          </div>
        </div>
      </section>
    </main>
  );
}
