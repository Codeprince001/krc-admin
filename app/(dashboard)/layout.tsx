"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Header } from "@/components/layout/Header";
import { useUIStore } from "@/lib/store/uiStore";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { sidebarOpen } = useUIStore();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Give a small delay before checking auth to allow state to settle
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasCheckedAuth(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only redirect if we've given auth time to initialize
    if (hasCheckedAuth && !isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, hasCheckedAuth, router]);

  // Show loading while checking auth or if still initializing
  if (isLoading || !hasCheckedAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Sidebar */}
      <MobileSidebar />
      
      <div
        className={`flex-1 transition-all duration-300 
          ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"} 
          ml-0`}
      >
        <Header />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

