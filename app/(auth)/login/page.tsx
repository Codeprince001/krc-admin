"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/utils/validations";
import { useAuth } from "@/lib/hooks/useAuth";
import { apiClient } from "@/lib/api/client";
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

  // If user already has tokens (e.g. cookie was cleared), sync cookie and redirect so middleware allows dashboard
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
      {/* Left Column - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/church-home-icon.png"
              alt="Church Logo"
              width={120}
              height={120}
              className="drop-shadow-2xl"
            />
          </div>
          
          {/* Title */}
          <h1 className="text-4xl font-bold mb-4 text-center">
            Church Admin Portal
          </h1>
          
          {/* Description */}
          <p className="text-xl text-center text-white/90 mb-12 max-w-md leading-relaxed">
            Empowering ministry through technology. Manage your church community, content, and engagement all in one place.
          </p>
          
          {/* Features */}
          <div className="grid gap-6 w-full max-w-md">
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Member Management</h3>
                <p className="text-sm text-white/80">Connect and nurture your community with powerful tools</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Analytics & Insights</h3>
                <p className="text-sm text-white/80">Track engagement and growth with detailed analytics</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Secure & Reliable</h3>
                <p className="text-sm text-white/80">Enterprise-grade security for your church data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src="/church-home-icon.png"
              alt="Church Logo"
              width={80}
              height={80}
            />
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
                  className="h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                  className="h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200" 
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
            © 2026 Church Admin Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

