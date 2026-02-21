'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, Edit, Trash2, Eye, EyeOff, BarChart, Download } from 'lucide-react';
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
import { DifficultyLevel, type VerseScramble } from '@/types/api/games';
import { VerseScrambleDialog } from './components/VerseScrambleDialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { VerseScramblePreview } from './components/VerseScramblePreview';

export default function VerseScramblesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<VerseScramble | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['verse-scrambles', page, category, difficulty],
    queryFn: () => gamesService.getVerseScrambles({ 
      page, 
      limit, 
      category: category === 'all' ? undefined : category, 
      difficulty: difficulty === 'all' ? undefined : difficulty 
    }),
    placeholderData: { verses: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => gamesService.deleteVerseScramble(id),
    onSuccess: () => {
      toast.success('Verse deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['verse-scrambles'] });
    },
    onError: () => toast.error('Failed to delete verse'),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      gamesService.updateVerseScramble(id, { isActive: !isActive }),
    onSuccess: () => {
      toast.success('Verse updated successfully');
      queryClient.invalidateQueries({ queryKey: ['verse-scrambles'] });
    },
    onError: () => toast.error('Failed to update verse'),
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

  const filteredVerses = data?.verses?.filter((v: VerseScramble) =>
    search ? v.reference.toLowerCase().includes(search.toLowerCase()) || v.verse?.toLowerCase().includes(search.toLowerCase()) : true
  );

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('[Verse Scrambles Page] Data:', { data, verses: data?.verses, filteredVerses });
  }

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader 
        title="Verse Scrambles" 
        description="Manage scrambled Bible verses for memorization"
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto"><Download className="mr-2 h-4 w-4" />Export</Button>
            <Button onClick={() => { setSelectedVerse(null); setDialogOpen(true); }} className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" />Add Verse</Button>
          </div>
        }
      />

      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search verses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Psalms">Psalms</SelectItem>
              <SelectItem value="Proverbs">Proverbs</SelectItem>
              <SelectItem value="Gospel">Gospel</SelectItem>
              <SelectItem value="Promises">Promises</SelectItem>
            </SelectContent>
          </Select>
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
              <TableHead>Reference</TableHead>
              <TableHead>Verse Preview</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVerses && filteredVerses.length > 0 ? (
              filteredVerses.map((verse: VerseScramble, index: number) => (
                <TableRow key={verse.id}>
                  <TableCell className="font-medium">{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell><Badge variant="outline">{verse.reference}</Badge></TableCell>
                  <TableCell className="max-w-md"><p className="line-clamp-2 text-sm">{verse.verse}</p></TableCell>
                  <TableCell>{verse.category && <Badge variant="outline">{verse.category}</Badge>}</TableCell>
                  <TableCell><Badge className={getDifficultyColor(verse.difficulty)}>{verse.difficulty}</Badge></TableCell>
                  <TableCell>{verse.points} pts</TableCell>
                  <TableCell><div className="flex items-center space-x-1"><BarChart className="h-4 w-4 text-muted-foreground" /><span>{verse.usageCount}</span></div></TableCell>
                  <TableCell>{verse.isActive ? <Badge className="bg-green-100 text-green-800">Active</Badge> : <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedVerse(verse); setPreviewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleActiveMutation.mutate({ id: verse.id, isActive: verse.isActive })}>{verse.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedVerse(verse); setDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(verse.id)} disabled={deleteMutation.isPending}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={9} className="h-24"><EmptyState title="No verses found" description="Create your first verse scramble" action={{ label: "Add Verse", onClick: () => { setSelectedVerse(null); setDialogOpen(true); } }} /></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {data?.pagination && <Pagination currentPage={page} totalPages={data.pagination.totalPages} total={data.pagination.total} onPageChange={setPage} />}
      <VerseScrambleDialog open={dialogOpen} onOpenChange={setDialogOpen} verse={selectedVerse} />
      <VerseScramblePreview open={previewOpen} onOpenChange={setPreviewOpen} verse={selectedVerse} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete verse"
        description="Are you sure you want to delete this verse?"
        confirmLabel="Delete"
        onConfirm={() => { if (deleteTarget) { deleteMutation.mutate(deleteTarget); setDeleteTarget(null); } }}
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

