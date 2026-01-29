'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Trophy, Award, Star, Crown, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/PageHeader';
import { LoadingState } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { toast } from 'sonner';
import { gamesService } from '@/lib/api/services/games.service';
import { BadgeCategory, type Badge } from '@/types/api/games';
import { BadgeDialog } from './components/BadgeDialog';

export default function BadgesPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [filter, setFilter] = useState<string>('');

  const { data: badges, isLoading } = useQuery({
    queryKey: ['badges'],
    queryFn: () => gamesService.getBadges(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => gamesService.deleteBadge(id),
    onSuccess: () => {
      toast.success('Badge deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['badges'] });
    },
    onError: () => toast.error('Failed to delete badge'),
  });

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = { trophy: Trophy, award: Award, star: Star, crown: Crown, medal: Medal, fire: Trophy };
    return icons[iconName.toLowerCase()] || Trophy;
  };

  const getCategoryColor = (category: BadgeCategory) => {
    switch (category) {
      case BadgeCategory.STREAK: return 'text-red-600 bg-red-50 border-red-200';
      case BadgeCategory.SCORE: return 'text-blue-600 bg-blue-50 border-blue-200';
      case BadgeCategory.COMPLETION: return 'text-green-600 bg-green-50 border-green-200';
      case BadgeCategory.SPECIAL: return 'text-purple-600 bg-purple-50 border-purple-200';
      case BadgeCategory.LEADERBOARD: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredBadges = badges?.filter((b: Badge) => !filter || b.category === filter);

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader 
        title="Badges & Achievements" 
        description="Manage badges that users can earn"
        actions={<Button onClick={() => { setSelectedBadge(null); setDialogOpen(true); }} className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" />Create Badge</Button>}
      />

      <div className="flex flex-wrap gap-2">
        <Button variant={!filter ? 'default' : 'outline'} size="sm" onClick={() => setFilter('')}>All</Button>
        <Button variant={filter === BadgeCategory.STREAK ? 'default' : 'outline'} size="sm" onClick={() => setFilter(BadgeCategory.STREAK)}>Streak</Button>
        <Button variant={filter === BadgeCategory.SCORE ? 'default' : 'outline'} size="sm" onClick={() => setFilter(BadgeCategory.SCORE)}>Score</Button>
        <Button variant={filter === BadgeCategory.COMPLETION ? 'default' : 'outline'} size="sm" onClick={() => setFilter(BadgeCategory.COMPLETION)}>Completion</Button>
        <Button variant={filter === BadgeCategory.SPECIAL ? 'default' : 'outline'} size="sm" onClick={() => setFilter(BadgeCategory.SPECIAL)}>Special</Button>
        <Button variant={filter === BadgeCategory.LEADERBOARD ? 'default' : 'outline'} size="sm" onClick={() => setFilter(BadgeCategory.LEADERBOARD)}>Leaderboard</Button>
      </div>

      {filteredBadges && filteredBadges.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBadges.map((badge: Badge) => {
            const IconComponent = getIconComponent(badge.icon);
            return (
              <Card key={badge.id} className={`p-6 border-2 ${getCategoryColor(badge.category)} hover:shadow-lg transition-all group`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-full ${badge.color ? '' : 'bg-white'}`} style={{ backgroundColor: badge.color || undefined }}>
                    <IconComponent className="h-8 w-8" style={{ color: badge.color ? '#fff' : undefined }} />
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedBadge(badge); setDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete this badge?')) deleteMutation.mutate(badge.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-lg">{badge.name}</h3>
                    {badge.isSpecial && <BadgeUI variant="destructive" className="text-xs">Special</BadgeUI>}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{badge.description}</p>
                  <BadgeUI variant="outline" className="text-xs">{badge.category}</BadgeUI>
                </div>
                <div className="mt-4 pt-4 border-t space-y-1">
                  <p className="text-xs text-muted-foreground"><strong>Requirement:</strong> {badge.requirement}</p>
                  {badge.streakDays && <p className="text-xs"><strong>Streak:</strong> {badge.streakDays} days</p>}
                  {badge.pointsRequired && <p className="text-xs"><strong>Points:</strong> {badge.pointsRequired}</p>}
                  {badge.gamesRequired && <p className="text-xs"><strong>Games:</strong> {badge.gamesRequired}</p>}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No badges found" description="Create your first badge to motivate users" action={{ label: "Create Badge", onClick: () => { setSelectedBadge(null); setDialogOpen(true); } }} />
      )}

      <BadgeDialog open={dialogOpen} onOpenChange={setDialogOpen} badge={selectedBadge} />
    </div>
  );
}

