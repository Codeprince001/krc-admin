"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { apiClient } from "@/lib/api/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/utils/validations";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shield, Users, BarChart3 } from "lucide-react";
import Image from "next/image";

function hasAuthTokens(): boolean {
  if (typeof window === "undefined") return false;
  return !!(
    localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn } = useAuth();

  // If user already has tokens, sync cookie and redirect to dashboard
  useEffect(() => {
    if (hasAuthTokens()) {
      apiClient.ensureAdminCookie();
      router.replace("/");
    }
  }, [router]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    login(data);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Column - Kingdom Recovery Church Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1a2332]">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332] via-[#243447] to-[#2d3f5a]" />
        {/* Warm accent glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-amber-500/10" />
        {/* Geometric pattern - subtle crosses & diamonds */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5v10M30 45v10M5 30h10M45 30h10M15 15l7 7M38 38l7 7M38 15l-7 7M15 38l-7 7' stroke='%23fff' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Soft radial orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-amber-500/15 blur-[80px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-sky-600/20 blur-[100px]" />
        {/* Fine dot texture */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          {/* Logo + Church name */}
          <div className="mb-10 flex flex-col items-center">
            <div className="mb-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 shadow-2xl backdrop-blur-sm">
              <Image
                src="/church-home-icon.png"
                alt="Kingdom Recovery Church"
                width={120}
                height={120}
                className="drop-shadow-2xl"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-center text-white">
              Kingdom Recovery
            </h1>
            <p className="text-lg font-medium text-amber-300/95 tracking-wide mt-1">
              Church
            </p>
          </div>

          <p className="text-center text-white/80 mb-10 max-w-sm text-lg leading-relaxed">
            Ministry Admin Portal
          </p>

          {/* Feature cards */}
          <div className="grid gap-4 w-full max-w-sm">
            <div className="flex items-start gap-4 rounded-xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Community</h3>
                <p className="text-sm text-white/70">Care for and grow your congregation</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Insights</h3>
                <p className="text-sm text-white/70">Track engagement and ministry impact</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Secure</h3>
                <p className="text-sm text-white/70">Your data and privacy protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo + Church name */}
          <div className="lg:hidden flex flex-col items-center justify-center mb-8">
            <div className="rounded-xl bg-white/80 p-3 shadow-lg ring-1 ring-gray-200/80">
              <Image
                src="/church-home-icon.png"
                alt="Kingdom Recovery Church"
                width={80}
                height={80}
              />
            </div>
            <h1 className="mt-4 text-xl font-bold text-gray-900 tracking-tight text-center">
              Kingdom Recovery
            </h1>
            <p className="text-base font-medium text-amber-600">Church</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-gray-600">
                Sign in to access your admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@church.com"
                  className="h-12 px-4 border-gray-300 focus:border-amber-500/50 focus:ring-amber-500/30"
                  {...register("email")}
                  disabled={isLoggingIn}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 px-4 border-gray-300 focus:border-amber-500/50 focus:ring-amber-500/30"
                  {...register("password")}
                  disabled={isLoggingIn}
                />
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#1a2332] to-[#2d3f5a] hover:from-[#243447] hover:to-[#3d5270] text-white shadow-lg hover:shadow-xl transition-all duration-200 border border-amber-500/20" 
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Need help? Contact your system administrator</p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            © 2026 Kingdom Recovery Church
          </p>
        </div>
      </div>
    </div>
  );
}

