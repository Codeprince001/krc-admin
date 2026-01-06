'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { gamesService } from '@/lib/api/services/games.service';
import { DifficultyLevel, type VerseScramble, type CreateVerseScrambleDto } from '@/types/api/games';

interface VerseScrambleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verse: VerseScramble | null;
}

export function VerseScrambleDialog({ open, onOpenChange, verse }: VerseScrambleDialogProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<CreateVerseScrambleDto>();

  useEffect(() => {
    if (verse) {
      setValue('verse', verse.verse);
      setValue('reference', verse.reference);
      setValue('difficulty', verse.difficulty);
      setValue('hint', verse.hint || '');
      setValue('category', verse.category || '');
      setValue('points', verse.points);
      setValue('timeLimit', verse.timeLimit);
    } else {
      reset();
    }
  }, [verse, reset, setValue]);

  const createMutation = useMutation({
    mutationFn: (data: CreateVerseScrambleDto) => gamesService.createVerseScramble(data),
    onSuccess: () => {
      toast.success('Verse created successfully');
      queryClient.invalidateQueries({ queryKey: ['verse-scrambles'] });
      onOpenChange(false);
      reset();
    },
    onError: () => toast.error('Failed to create verse'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateVerseScrambleDto) => gamesService.updateVerseScramble(verse!.id, data),
    onSuccess: () => {
      toast.success('Verse updated successfully');
      queryClient.invalidateQueries({ queryKey: ['verse-scrambles'] });
      onOpenChange(false);
    },
    onError: () => toast.error('Failed to update verse'),
  });

  const onSubmit = (data: CreateVerseScrambleDto) => {
    const payload = {
      ...data,
      points: Number(data.points) || 20,
      timeLimit: Number(data.timeLimit) || 120,
    };
    verse ? updateMutation.mutate(payload) : createMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{verse ? 'Edit Verse Scramble' : 'Create Verse Scramble'}</DialogTitle>
          <DialogDescription>{verse ? 'Update the verse scramble details' : 'Add a new Bible verse for scrambling'}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verse">Verse Text <span className="text-red-500">*</span></Label>
            <Textarea id="verse" {...register('verse', { required: 'Verse is required' })} placeholder="Enter the complete verse..." rows={3} className={errors.verse ? 'border-red-500' : ''} />
            {errors.verse && <p className="text-sm text-red-500">{errors.verse.message}</p>}
            <p className="text-xs text-muted-foreground">Words will be automatically scrambled by the system</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reference">Bible Reference <span className="text-red-500">*</span></Label>
            <Input id="reference" {...register('reference', { required: 'Reference is required' })} placeholder="e.g., John 3:16" className={errors.reference ? 'border-red-500' : ''} />
            {errors.reference && <p className="text-sm text-red-500">{errors.reference.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select defaultValue={verse?.difficulty || DifficultyLevel.MEDIUM} onValueChange={(value) => setValue('difficulty', value as DifficultyLevel)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={DifficultyLevel.EASY}>Easy</SelectItem>
                  <SelectItem value={DifficultyLevel.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={DifficultyLevel.HARD}>Hard</SelectItem>
                  <SelectItem value={DifficultyLevel.EXPERT}>Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input id="category" {...register('category')} placeholder="e.g., Psalms" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hint">Hint (Optional)</Label>
            <Textarea id="hint" {...register('hint')} placeholder="Provide a helpful hint..." rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input id="points" type="number" {...register('points')} defaultValue={20} min={10} max={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
              <Input id="timeLimit" type="number" {...register('timeLimit')} defaultValue={120} min={30} max={600} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{verse ? 'Update Verse' : 'Create Verse'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

