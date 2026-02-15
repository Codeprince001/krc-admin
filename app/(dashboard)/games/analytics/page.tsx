"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Gamepad2,
  Users,
  BookOpen,
  Trophy,
  TrendingUp,
  BarChart3,
  ArrowLeft,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { gamesService } from "@/lib/api/services/games.service";
import { Loader2 } from "lucide-react";
import { formatNumber } from "@/lib/utils/format";

const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#06b6d4", "#a855f7"];

export default function GamesAnalyticsPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["games-admin-stats"],
    queryFn: () => gamesService.getStats(),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/games">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Games Analytics</h1>
            <p className="text-muted-foreground text-sm">Bible games engagement</p>
          </div>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground font-medium">Unable to load games stats</p>
            <p className="text-sm text-muted-foreground mt-1">Check your connection or try again later.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/games">Back to Games</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Backend returns popularCategories as { name, count }; support both for compatibility
  const categories = (stats.popularCategories || []).map((c: { name?: string; category?: string; count: number }) => ({
    name: c.name ?? c.category ?? "Other",
    value: c.count,
    count: c.count,
  }));

  const contentItems = [
    { name: "Quiz Questions", value: stats.totalQuestions ?? 0, fill: CHART_COLORS[0] },
    { name: "Verse Scrambles", value: stats.totalVerses ?? 0, fill: CHART_COLORS[1] },
    { name: "Character Guess", value: stats.totalCharacters ?? 0, fill: CHART_COLORS[2] },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 rounded-3xl blur-3xl -z-10" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/games">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Games Analytics
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Engagement and performance for Bible games
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/analytics">
              <TrendingUp className="mr-2 h-4 w-4" />
              Full analytics
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-transparent overflow-hidden transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Total Sessions
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-amber-500/20">
              <Gamepad2 className="h-5 w-5 text-amber-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {formatNumber(stats.totalSessions ?? 0)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Games played</p>
          </CardContent>
        </Card>

        <Card className="border-indigo-200/50 bg-gradient-to-br from-indigo-50/50 via-blue-50/30 to-transparent overflow-hidden transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Active Players
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-indigo-500/20">
              <Users className="h-5 w-5 text-indigo-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {formatNumber(stats.activeUsers ?? 0)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Unique users</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200/50 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-transparent overflow-hidden transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Average Score
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-emerald-500/20">
              <TrendingUp className="h-5 w-5 text-emerald-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats.averageScore ?? 0}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">Across all games</p>
          </CardContent>
        </Card>

        <Card className="border-violet-200/50 bg-gradient-to-br from-violet-50/50 via-purple-50/30 to-transparent overflow-hidden transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Content Items
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-violet-500/20">
              <BookOpen className="h-5 w-5 text-violet-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {formatNumber(
                (stats.totalQuestions ?? 0) +
                  (stats.totalVerses ?? 0) +
                  (stats.totalCharacters ?? 0)
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Questions, verses, characters</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Popular categories bar chart */}
        <Card className="border-blue-200/50 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <HelpCircle className="h-5 w-5 text-white" />
              </div>
              Popular Quiz Categories
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Most played categories (quiz questions)
            </p>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categories} layout="vertical" margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis type="number" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number) => [formatNumber(value), "Plays"]}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 8, 8, 0]} name="Plays" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[280px] items-center justify-center text-muted-foreground text-sm">
                No category data yet. Play some quizzes to see trends.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content distribution pie */}
        <Card className="border-emerald-200/50 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              Content Distribution
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Quiz questions, verse scrambles, character games
            </p>
          </CardHeader>
          <CardContent>
            {contentItems.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={contentItems}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${formatNumber(value)}`}
                  >
                    {contentItems.map((entry, index) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number) => formatNumber(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[280px] items-center justify-center text-muted-foreground text-sm">
                No content yet. Add quiz questions, verses, and characters from Games.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Badges summary */}
      <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/30 to-orange-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            Badges
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Achievements available for players
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-4xl font-bold text-foreground">
              {formatNumber(stats.totalBadges ?? 0)}
            </div>
            <p className="text-muted-foreground">badges configured</p>
            <Button variant="outline" size="sm" asChild className="ml-auto">
              <Link href="/games/badges">Manage badges</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
