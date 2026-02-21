"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { useUIStore } from "@/lib/store/uiStore";
import {
  Home,
  Users,
  Book,
  Video,
  BookOpen,
  Megaphone,
  Calendar,
  Heart,
  MessageSquare,
  DollarSign,
  CreditCard,
  ShoppingCart,
  Image as ImageIcon,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Gamepad2,
  Trophy,
  Lightbulb,
  Brain,
  Bell,
  LayoutGrid,
  Send,
  FileText,
  Clock,
  TrendingUp,
  Target,
  Activity,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Main",
    items: [
      { title: "Dashboard", href: "/", icon: Home },
      { title: "Users", href: "/users", icon: Users },
    ],
  },
  {
    title: "Content",
    items: [
      { title: "Books", href: "/content/books", icon: Book },
      { title: "Book Categories", href: "/content/books/categories", icon: Book },
      { title: "Sermons", href: "/content/sermons", icon: Video },
      { title: "Devotionals", href: "/content/devotionals", icon: BookOpen },
      { title: "Announcements", href: "/content/announcements", icon: Megaphone },
      { title: "Events", href: "/content/events", icon: Calendar },
      { title: "Words of Wisdom", href: "/content/words-of-wisdom", icon: Lightbulb },
      { title: "Words of Knowledge", href: "/content/words-of-knowledge", icon: Brain },
    ],
  },
  {
    title: "Community",
    items: [
      { title: "Prayer Requests", href: "/community/prayer-requests", icon: Heart },
      { title: "Testimonies", href: "/community/testimonies", icon: MessageSquare },
      { title: "Counseling Sessions", href: "/community/counseling", icon: Calendar },
      { title: "Groups", href: "/community/groups", icon: Users },
      { title: "Post Moderation", href: "/community/groups/moderation", icon: ShieldCheck },
    ],
  },
  {
    title: "Financial",
    items: [
      { title: "Giving", href: "/financial/giving", icon: DollarSign },
      { title: "Giving Categories", href: "/financial/giving-categories", icon: LayoutGrid },
      { title: "Giving Campaigns", href: "/financial/giving-campaigns", icon: Target },
      { title: "Transactions", href: "/financial/giving-transactions", icon: CreditCard },
      { title: "Payments", href: "/financial/payments", icon: CreditCard },
      { title: "Orders", href: "/financial/orders", icon: ShoppingCart },
    ],
  },
  {
    title: "Engagement",
    items: [
      { title: "Bible Games", href: "/games", icon: Gamepad2 },
      { title: "Leaderboard", href: "/games/leaderboard", icon: Trophy },
    ],
  },
  {
    title: "Notifications",
    items: [
      { title: "Send Notification", href: "/notifications/send", icon: Send },
      { title: "Templates", href: "/notifications/templates", icon: FileText },
      { title: "Scheduled", href: "/notifications/scheduled", icon: Clock },
      { title: "Analytics", href: "/notifications/analytics", icon: TrendingUp },
      { title: "Campaigns", href: "/notifications/campaigns", icon: Target },
      { title: "Queue Monitor", href: "/notifications/queue", icon: Activity },
    ],
  },
  {
    title: "Other",
    items: [
      { title: "Media Library", href: "/media", icon: ImageIcon },
      { title: "Analytics", href: "/analytics", icon: BarChart3 },
      { title: "Settings", href: "/settings", icon: Settings },
      { title: "Email Templates", href: "/settings/email-templates", icon: Mail },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  // Helper function to check if a nav item should be active
  // Only highlight the most specific match (longest matching href)
  const isNavItemActive = (href: string, allHrefs: string[]) => {
    // Exact match always wins
    if (pathname === href) return true;
    
    // Check if pathname starts with this href + "/"
    if (!pathname.startsWith(href + "/")) return false;
    
    // Check if there's a more specific (longer) href that also matches
    // If so, don't highlight this one
    const moreSpecificMatch = allHrefs.find(
      (otherHref) => 
        otherHref !== href && 
        otherHref.startsWith(href + "/") && 
        pathname.startsWith(otherHref)
    );
    
    return !moreSpecificMatch;
  };

  // Collect all hrefs for comparison
  const allHrefs = navGroups.flatMap(group => group.items.map(item => item.href));

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border/50 bg-white/80 backdrop-blur-lg transition-all duration-300 shadow-2xl",
        "hidden lg:block", // Hide on mobile, show on desktop
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="relative flex h-20 items-center border-b border-border/50 px-3 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50">
          {sidebarOpen ? (
            <>
              <div className="relative z-10 flex items-center gap-3 flex-1">
                <Image
                  src="/church-home-icon.png"
                  alt="Church Logo"
                  width={48}
                  height={48}
                  className="drop-shadow-lg"
                />
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Church Admin
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium">Management Portal</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="relative z-10 hover:bg-blue-100 rounded-xl transition-all duration-300 shrink-0"
              >
                <ChevronLeft className="h-5 w-5 text-blue-600" />
              </Button>
            </>
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center w-full gap-2">
              <Image
                src="/church-home-icon.png"
                alt="Church Logo"
                width={32}
                height={32}
                className="drop-shadow-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="hover:bg-blue-100 rounded-xl transition-all duration-300 h-8 w-8"
              >
                <ChevronRight className="h-4 w-4 text-blue-600" />
              </Button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2 scrollbar-thin">
          {navGroups.map((group, groupIndex) => (
            <div key={group.title} className={cn("mb-4", !sidebarOpen && "mb-2")}>
              {sidebarOpen && (
                <h3 className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isNavItemActive(item.href, allHrefs);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group relative flex items-center rounded-xl text-sm font-semibold transition-all duration-300",
                        sidebarOpen ? "gap-3 px-3 py-2.5" : "justify-center p-3",
                        isActive
                          ? "gradient-primary text-white shadow-lg shadow-blue-500/30"
                          : "text-muted-foreground hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-foreground hover:shadow-md"
                      )}
                      title={!sidebarOpen ? item.title : undefined}
                    >
                      <Icon className={cn(
                        "h-5 w-5 shrink-0 transition-all duration-300",
                        isActive ? "text-white" : "group-hover:text-blue-600 group-hover:scale-110"
                      )} />
                      
                      {sidebarOpen && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <span className={cn(
                              "rounded-full px-2.5 py-1 text-xs font-bold shadow-sm",
                              isActive 
                                ? "bg-white/20 text-white"
                                : "bg-blue-100 text-blue-700"
                            )}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
              {groupIndex < navGroups.length - 1 && sidebarOpen && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </nav>
        
      </div>
    </aside>
  );
}

