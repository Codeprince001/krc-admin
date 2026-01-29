'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal, Crown, TrendingUp, TrendingDown, Award, Calendar, Target, Gamepad2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/shared/PageHeader';
import { LoadingState } from '@/components/shared/LoadingState';
import { StatsCard } from '@/components/shared/StatsCard';
import { apiClient } from '@/lib/api/client';

interface LeaderboardEntry {
  rank: number;
  previousRank: number | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string | null;
    avatar: string | null;
    email: string;
  };
  score: number;
  gamesPlayed: number;
}

interface LeaderboardData {
  id: string;
  period: string;
  entries: LeaderboardEntry[];
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<string>('WEEKLY');
  const [gameType, setGameType] = useState<string>('ALL');

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', period, gameType],
    queryFn: async () => {
      const params = new URLSearchParams({ period });
      if (gameType && gameType !== 'ALL') params.append('gameType', gameType);
      
      try {
        return await apiClient.get<LeaderboardData>(`/games/leaderboards?${params.toString()}`);
      } catch (error) {
        // Mock data for development
        return {
          id: '1',
          period,
          entries: Array.from({ length: 20 }, (_, i) => ({
            rank: i + 1,
            previousRank: i === 0 ? 2 : i === 1 ? 1 : i + 1,
            user: {
              id: `user-${i}`,
              firstName: `User${i + 1}`,
              lastName: 'Doe',
              displayName: `User ${i + 1}`,
              avatar: null,
              email: `user${i + 1}@church.com`,
            },
            score: 1000 - i * 50,
            gamesPlayed: 50 - i,
          })),
        };
      }
    },
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-6 w-6 text-orange-600" />;
    return <span className="text-lg font-bold text-muted-foreground">{rank}</span>;
  };

  const getTrendIndicator = (rank: number, previousRank: number | null) => {
    if (!previousRank) return null;
    if (rank < previousRank) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (rank > previousRank) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <span className="text-xs text-muted-foreground">−</span>;
  };

  if (isLoading) return <LoadingState />;

  const topThree = leaderboard?.entries?.slice(0, 3) || [];
  const restOfList = leaderboard?.entries?.slice(3) || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Games Leaderboard"
        description="Top players and their performance rankings"
        actions={
          <Button variant="outline" className="w-full sm:w-auto">
            <Calendar className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        }
      />

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Players"
          value={leaderboard?.entries?.length || 0}
          icon={Gamepad2}
        />
        <StatsCard
          title="Top Score"
          value={topThree[0]?.score || 0}
          icon={Trophy}
        />
        <StatsCard
          title="Avg Games"
          value={Math.round((leaderboard?.entries?.reduce((sum, e) => sum + e.gamesPlayed, 0) || 0) / (leaderboard?.entries?.length || 1))}
          icon={Target}
        />
        <StatsCard
          title="Most Active"
          value={Math.max(...(leaderboard?.entries?.map(e => e.gamesPlayed) || [0]))}
          icon={Award}
        />
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DAILY">Daily</SelectItem>
            <SelectItem value="WEEKLY">Weekly</SelectItem>
            <SelectItem value="MONTHLY">Monthly</SelectItem>
            <SelectItem value="ALL_TIME">All Time</SelectItem>
          </SelectContent>
        </Select>
        <Select value={gameType} onValueChange={setGameType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Games</SelectItem>
            <SelectItem value="DAILY_QUIZ">Daily Quiz</SelectItem>
            <SelectItem value="VERSE_SCRAMBLE">Verse Scramble</SelectItem>
            <SelectItem value="CHARACTER_GUESS">Character Guess</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Top 3 Podium */}
      {topThree.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 0, 2].map((index) => {
            const entry = topThree[index];
            if (!entry) return null;
            const colors = ['bg-yellow-50 border-yellow-200', 'bg-gray-50 border-gray-200', 'bg-orange-50 border-orange-200'];
            return (
              <Card key={entry.rank} className={`p-6 border-2 ${colors[index]} ${index === 1 ? 'transform scale-105' : ''}`}>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                        {entry.user.firstName[0]}{entry.user.lastName[0]}
                      </div>
                    </Avatar>
                    <div className="absolute -top-2 -right-2">{getRankIcon(entry.rank)}</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{entry.user.displayName || `${entry.user.firstName} ${entry.user.lastName}`}</h3>
                    <p className="text-sm text-muted-foreground">{entry.user.email}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{entry.score}</p>
                      <p className="text-xs text-muted-foreground">Points</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{entry.gamesPlayed}</p>
                      <p className="text-xs text-muted-foreground">Games</p>
                    </div>
                  </div>
                  {getTrendIndicator(entry.rank, entry.previousRank) && (
                    <Badge variant="outline" className="flex items-center space-x-1">
                      {getTrendIndicator(entry.rank, entry.previousRank)}
                      <span className="text-xs">vs last period</span>
                    </Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead className="w-[60px]">Trend</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right">Games Played</TableHead>
              <TableHead className="text-right">Avg Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {restOfList.map((entry) => (
              <TableRow key={entry.user.id}>
                <TableCell>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted font-semibold">
                    {entry.rank}
                  </div>
                </TableCell>
                <TableCell>
                  {getTrendIndicator(entry.rank, entry.previousRank)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                        {entry.user.firstName[0]}{entry.user.lastName[0]}
                      </div>
                    </Avatar>
                    <div>
                      <p className="font-medium">{entry.user.displayName || `${entry.user.firstName} ${entry.user.lastName}`}</p>
                      <p className="text-xs text-muted-foreground">ID: {entry.user.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{entry.user.email}</TableCell>
                <TableCell className="text-right font-semibold">{entry.score}</TableCell>
                <TableCell className="text-right">{entry.gamesPlayed}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {Math.round(entry.score / (entry.gamesPlayed || 1))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

