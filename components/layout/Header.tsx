"use client";

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
import { LogOut, User, Settings } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      user.email[0].toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white shadow-sm px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">
          {process.env.NEXT_PUBLIC_APP_NAME || "Admin Dashboard"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="relative h-10 w-10 rounded-full p-0">
              <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                <AvatarFallback >{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.email}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

