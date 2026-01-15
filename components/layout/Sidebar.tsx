"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Image,
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
  Send,
  FileText,
  Clock,
  TrendingUp,
  Target,
  Activity,
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
      { title: "Groups", href: "/community/groups", icon: Users },
      { title: "Post Moderation", href: "/community/groups/moderation", icon: ShieldCheck },
    ],
  },
  {
    title: "Financial",
    items: [
      { title: "Giving", href: "/financial/giving", icon: DollarSign },
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
      { title: "Media Library", href: "/media", icon: Image },
      { title: "Analytics", href: "/analytics", icon: BarChart3 },
      { title: "Settings", href: "/settings", icon: Settings },
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
        "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 shadow-sm",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="relative flex h-20 items-center justify-between border-b border-border bg-card px-4">
          {sidebarOpen && (
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-foreground">Church Admin</h2>
              <p className="text-xs text-muted-foreground">Management Portal</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="relative z-10 ml-auto"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
          {navGroups.map((group, groupIndex) => (
            <div key={group.title} className="mb-6">
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
                        "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                      title={!sidebarOpen ? item.title : undefined}
                    >
                      <Icon className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        isActive ? "text-primary-foreground" : "group-hover:text-foreground"
                      )} />
                      
                      {sidebarOpen && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <span className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-semibold",
                              isActive 
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-muted text-muted-foreground"
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

