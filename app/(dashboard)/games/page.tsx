'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { 
  Gamepad2, 
  HelpCircle, 
  BookOpen, 
  Trophy, 
  Users, 
  TrendingUp,
  Plus,
  BarChart3,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/shared/StatsCard';
import { LoadingState } from '@/components/shared/LoadingState';
import { gamesService } from '@/lib/api/services/games.service';

export default function GamesPage() {
  // Fetch games statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['games-stats'],
    queryFn: () => gamesService.getStats(),
    // Mock data for now until backend endpoint is ready
    placeholderData: {
      totalQuestions: 25,
      totalVerses: 10,
      totalCharacters: 8,
      totalBadges: 12,
      totalSessions: 150,
      activeUsers: 45,
      averageScore: 78,
      popularCategories: [
        { category: 'Old Testament', count: 45 },
        { category: 'New Testament', count: 38 },
        { category: 'Life of Jesus', count: 32 },
      ],
    },
  });

  if (isLoading) {
    return <LoadingState />;
  }

  const gameCards = [
    {
      title: 'Quiz Questions',
      description: 'Manage daily challenge questions',
      icon: HelpCircle,
      count: stats?.totalQuestions || 0,
      href: '/games/quiz-questions',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Verse Scrambles',
      description: 'Manage scrambled Bible verses',
      icon: BookOpen,
      count: stats?.totalVerses || 0,
      href: '/games/verse-scrambles',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Character Guess',
      description: 'Manage Bible character games',
      icon: Users,
      count: stats?.totalCharacters || 0,
      href: '/games/character-guess',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Badges',
      description: 'Manage achievements and rewards',
      icon: Trophy,
      count: stats?.totalBadges || 0,
      href: '/games/badges',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bible Games Management"
        description="Manage quiz questions, verse scrambles, character games, and achievements"
        actions={
          <Button asChild>
            <Link href="/games/analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Link>
          </Button>
        }
      />

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Sessions"
          value={stats?.totalSessions || 0}
          icon={Gamepad2}
          trend={{ value: "+12%", isPositive: true }}
        />
        <StatsCard
          title="Active Players"
          value={stats?.activeUsers || 0}
          icon={Users}
          trend={{ value: "+8%", isPositive: true }}
        />
        <StatsCard
          title="Avg. Score"
          value={`${stats?.averageScore || 0}%`}
          icon={TrendingUp}
          trend={{ value: "+5%", isPositive: true }}
        />
        <StatsCard
          title="Content Items"
          value={(stats?.totalQuestions || 0) + (stats?.totalVerses || 0) + (stats?.totalCharacters || 0)}
          icon={BookOpen}
        />
      </div>

      {/* Game Management Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {gameCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${card.bgColor} group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <span className="text-2xl font-bold">{card.count}</span>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {card.description}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                >
                  Manage
                </Button>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Popular Categories */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Popular Categories</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {stats?.popularCategories.map((category: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <span className="font-medium">{category.category}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${(category.count / stats.totalQuestions) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {category.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/games/quiz-questions?action=create">
              <Plus className="mr-2 h-4 w-4" />
              New Quiz Question
            </Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/games/verse-scrambles?action=create">
              <Plus className="mr-2 h-4 w-4" />
              New Verse Scramble
            </Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/games/character-guess?action=create">
              <Plus className="mr-2 h-4 w-4" />
              New Character Game
            </Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/games/badges?action=create">
              <Plus className="mr-2 h-4 w-4" />
              New Badge
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

