"use client";

import Image from "next/image";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, Menu } from "lucide-react";
import { useUIStore } from "@/lib/store/uiStore";
import { useIsMobileOrTablet } from "@/lib/hooks/useMediaQuery";

export function Header() {
  const { user, logout } = useAuth();
  const { toggleMobileSidebar } = useUIStore();
  const isMobileOrTablet = useIsMobileOrTablet();

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      user.email[0].toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-white/80 backdrop-blur-lg shadow-lg px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu */}
        {isMobileOrTablet && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileSidebar}
            className="lg:hidden hover:bg-blue-100 rounded-xl transition-all duration-300"
          >
            <Menu className="h-6 w-6 text-blue-600" />
          </Button>
        )}
        
        <Image
          src="/church-home-icon.png"
          alt="Church Logo"
          width={40}
          height={40}
          className="drop-shadow-lg hidden sm:block"
        />
        <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {process.env.NEXT_PUBLIC_APP_NAME || "Admin Dashboard"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="relative h-11 w-11 rounded-full p-0 hover:shadow-lg transition-shadow duration-300">
              <Avatar className="h-11 w-11 gradient-primary text-white shadow-lg ring-4 ring-blue-100">
                <AvatarFallback className="gradient-primary text-white font-bold">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-white/95 backdrop-blur-lg shadow-2xl border-2 border-blue-100 rounded-2xl p-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-2">
                <p className="text-base font-bold text-gray-900">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 h-0.5" />
            <DropdownMenuItem className="rounded-lg p-3 cursor-pointer hover:bg-blue-50 transition-colors">
              <User className="mr-3 h-5 w-5 text-blue-600" />
              <span className="font-medium">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg p-3 cursor-pointer hover:bg-purple-50 transition-colors">
              <Settings className="mr-3 h-5 w-5 text-purple-600" />
              <span className="font-medium">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 h-0.5" />
            <DropdownMenuItem onClick={() => logout()} className="rounded-lg p-3 cursor-pointer hover:bg-red-50 transition-colors text-red-600">
              <LogOut className="mr-3 h-5 w-5" />
              <span className="font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

