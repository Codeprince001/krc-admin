'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/PageHeader';
import { LoadingState } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { toast } from 'sonner';
import { gamesService } from '@/lib/api/services/games.service';
import { DifficultyLevel, type CharacterGuess } from '@/types/api/games';
import { CharacterGuessDialog } from './components/CharacterGuessDialog';
import { CharacterGuessPreview } from './components/CharacterGuessPreview';

export default function CharacterGuessPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterGuess | null>(null);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['character-guess', page, difficulty],
    queryFn: () => gamesService.getCharacterGuesses({ 
      page, 
      limit, 
      difficulty: difficulty === 'all' ? undefined : difficulty 
    }),
    placeholderData: { characters: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => gamesService.deleteCharacterGuess(id),
    onSuccess: () => {
      toast.success('Character deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['character-guess'] });
    },
    onError: () => toast.error('Failed to delete character'),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      gamesService.updateCharacterGuess(id, { isActive: !isActive }),
    onSuccess: () => {
      toast.success('Character updated successfully');
      queryClient.invalidateQueries({ queryKey: ['character-guess'] });
    },
    onError: () => toast.error('Failed to update character'),
  });

  const getDifficultyColor = (diff: DifficultyLevel) => {
    switch (diff) {
      case DifficultyLevel.EASY: return 'bg-green-100 text-green-800';
      case DifficultyLevel.MEDIUM: return 'bg-yellow-100 text-yellow-800';
      case DifficultyLevel.HARD: return 'bg-orange-100 text-orange-800';
      case DifficultyLevel.EXPERT: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCharacters = data?.characters?.filter((c: CharacterGuess) =>
    search ? c.characterName.toLowerCase().includes(search.toLowerCase()) : true
  );

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('[Character Guess Page] Data:', { data, characters: data?.characters, filteredCharacters });
  }

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader 
        title="Character Guess Games" 
        description="Manage biblical character guessing challenges"
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto"><Download className="mr-2 h-4 w-4" />Export</Button>
            <Button onClick={() => { setSelectedCharacter(null); setDialogOpen(true); }} className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" />Add Character</Button>
          </div>
        }
      />

      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search characters..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
          </div>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger><SelectValue placeholder="All Difficulties" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
              <SelectItem value="EXPERT">Expert</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full"><Filter className="mr-2 h-4 w-4" />Advanced Filters</Button>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Character</TableHead>
              <TableHead>Testament</TableHead>
              <TableHead>Clues</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCharacters && filteredCharacters.length > 0 ? (
              filteredCharacters.map((character: CharacterGuess, index: number) => (
                <TableRow key={character.id}>
                  <TableCell className="font-medium">{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell className="font-semibold">{character.characterName}</TableCell>
                  <TableCell><Badge variant="outline">{character.testament}</Badge></TableCell>
                  <TableCell>{character.clues.length} clues</TableCell>
                  <TableCell><Badge className={getDifficultyColor(character.difficulty)}>{character.difficulty}</Badge></TableCell>
                  <TableCell>{character.maxPoints} pts</TableCell>
                  <TableCell>{character.usageCount}</TableCell>
                  <TableCell>{character.isActive ? <Badge className="bg-green-100 text-green-800">Active</Badge> : <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedCharacter(character); setPreviewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleActiveMutation.mutate({ id: character.id, isActive: character.isActive })}>{character.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedCharacter(character); setDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete this character?')) deleteMutation.mutate(character.id); }} disabled={deleteMutation.isPending}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={9} className="h-24"><EmptyState title="No characters found" description="Create your first character guess game" action={{ label: "Add Character", onClick: () => { setSelectedCharacter(null); setDialogOpen(true); } }} /></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {data?.pagination && <Pagination currentPage={page} totalPages={data.pagination.totalPages} total={data.pagination.total} onPageChange={setPage} />}
      <CharacterGuessDialog open={dialogOpen} onOpenChange={setDialogOpen} character={selectedCharacter} />
      <CharacterGuessPreview open={previewOpen} onOpenChange={setPreviewOpen} character={selectedCharacter} />
    </div>
  );
}

