"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    // Only redirect if auth check is complete and user is not authenticated
    // isLoading will be true while fetching profile
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect is happening)
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

