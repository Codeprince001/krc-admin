'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { gamesService } from '@/lib/api/services/games.service';
import { DifficultyLevel, type CharacterGuess, type CreateCharacterGuessDto } from '@/types/api/games';

interface CharacterGuessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  character: CharacterGuess | null;
}

export function CharacterGuessDialog({ open, onOpenChange, character }: CharacterGuessDialogProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<CreateCharacterGuessDto>();
  const [clues, setClues] = useState<string[]>(['', '', '']);
  const [easyHints, setEasyHints] = useState<string[]>(['']);
  const [mediumHints, setMediumHints] = useState<string[]>(['']);
  const [hardHints, setHardHints] = useState<string[]>(['']);

  useEffect(() => {
    if (character) {
      setValue('characterName', character.characterName);
      setValue('testament', character.testament);
      setValue('category', character.category);
      setValue('difficulty', character.difficulty);
      setValue('maxPoints', character.maxPoints);
      setValue('pointsPerHint', character.pointsPerHint);
      setValue('timeLimit', character.timeLimit);
      setClues(character.clues);
      setEasyHints(character.easyHints.length > 0 ? character.easyHints : ['']);
      setMediumHints(character.mediumHints.length > 0 ? character.mediumHints : ['']);
      setHardHints(character.hardHints.length > 0 ? character.hardHints : ['']);
    } else {
      reset();
      setClues(['', '', '']);
      setEasyHints(['']);
      setMediumHints(['']);
      setHardHints(['']);
    }
  }, [character, reset, setValue]);

  const createMutation = useMutation({
    mutationFn: (data: CreateCharacterGuessDto) => gamesService.createCharacterGuess(data),
    onSuccess: () => {
      toast.success('Character created successfully');
      queryClient.invalidateQueries({ queryKey: ['character-guess'] });
      onOpenChange(false);
      reset();
    },
    onError: () => toast.error('Failed to create character'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateCharacterGuessDto) => gamesService.updateCharacterGuess(character!.id, data),
    onSuccess: () => {
      toast.success('Character updated successfully');
      queryClient.invalidateQueries({ queryKey: ['character-guess'] });
      onOpenChange(false);
    },
    onError: () => toast.error('Failed to update character'),
  });

  const onSubmit = (data: CreateCharacterGuessDto) => {
    const payload = {
      ...data,
      clues: clues.filter(c => c.trim()),
      easyHints: easyHints.filter(h => h.trim()),
      mediumHints: mediumHints.filter(h => h.trim()),
      hardHints: hardHints.filter(h => h.trim()),
      maxPoints: Number(data.maxPoints) || 30,
      pointsPerHint: Number(data.pointsPerHint) || 5,
      timeLimit: Number(data.timeLimit) || 180,
    };
    if (payload.clues.length < 2) {
      toast.error('At least 2 clues are required');
      return;
    }
    character ? updateMutation.mutate(payload) : createMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{character ? 'Edit Character Guess' : 'Create Character Guess'}</DialogTitle>
          <DialogDescription>{character ? 'Update the character details' : 'Add a new biblical character'}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="characterName">Character Name <span className="text-red-500">*</span></Label>
              <Input id="characterName" {...register('characterName', { required: 'Name is required' })} placeholder="e.g., Moses" className={errors.characterName ? 'border-red-500' : ''} />
              {errors.characterName && <p className="text-sm text-red-500">{errors.characterName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
              <Input id="category" {...register('category', { required: 'Category is required' })} placeholder="e.g., Prophets" className={errors.category ? 'border-red-500' : ''} />
              {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testament">Testament</Label>
              <Select defaultValue={character?.testament || 'Old Testament'} onValueChange={(value) => setValue('testament', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Old Testament">Old Testament</SelectItem>
                  <SelectItem value="New Testament">New Testament</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select defaultValue={character?.difficulty || DifficultyLevel.MEDIUM} onValueChange={(value) => setValue('difficulty', value as DifficultyLevel)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={DifficultyLevel.EASY}>Easy</SelectItem>
                  <SelectItem value={DifficultyLevel.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={DifficultyLevel.HARD}>Hard</SelectItem>
                  <SelectItem value={DifficultyLevel.EXPERT}>Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Clues <span className="text-red-500">* (min. 2)</span></Label>
            {clues.map((clue, index) => (
              <div key={index} className="flex space-x-2">
                <Input placeholder={`Clue ${index + 1}`} value={clue} onChange={(e) => { const newClues = [...clues]; newClues[index] = e.target.value; setClues(newClues); }} />
                {clues.length > 2 && <Button type="button" variant="ghost" size="icon" onClick={() => setClues(clues.filter((_, i) => i !== index))}><X className="h-4 w-4" /></Button>}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setClues([...clues, ''])}><Plus className="mr-2 h-4 w-4" />Add Clue</Button>
          </div>
          <div className="space-y-2">
            <Label>Easy Hints</Label>
            {easyHints.map((hint, index) => (
              <div key={index} className="flex space-x-2">
                <Input placeholder={`Easy Hint ${index + 1}`} value={hint} onChange={(e) => { const newHints = [...easyHints]; newHints[index] = e.target.value; setEasyHints(newHints); }} />
                {easyHints.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => setEasyHints(easyHints.filter((_, i) => i !== index))}><X className="h-4 w-4" /></Button>}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setEasyHints([...easyHints, ''])}><Plus className="mr-2 h-4 w-4" />Add Easy Hint</Button>
          </div>
          <div className="space-y-2">
            <Label>Medium Hints</Label>
            {mediumHints.map((hint, index) => (
              <div key={index} className="flex space-x-2">
                <Input placeholder={`Medium Hint ${index + 1}`} value={hint} onChange={(e) => { const newHints = [...mediumHints]; newHints[index] = e.target.value; setMediumHints(newHints); }} />
                {mediumHints.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => setMediumHints(mediumHints.filter((_, i) => i !== index))}><X className="h-4 w-4" /></Button>}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setMediumHints([...mediumHints, ''])}><Plus className="mr-2 h-4 w-4" />Add Medium Hint</Button>
          </div>
          <div className="space-y-2">
            <Label>Hard Hints</Label>
            {hardHints.map((hint, index) => (
              <div key={index} className="flex space-x-2">
                <Input placeholder={`Hard Hint ${index + 1}`} value={hint} onChange={(e) => { const newHints = [...hardHints]; newHints[index] = e.target.value; setHardHints(newHints); }} />
                {hardHints.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => setHardHints(hardHints.filter((_, i) => i !== index))}><X className="h-4 w-4" /></Button>}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setHardHints([...hardHints, ''])}><Plus className="mr-2 h-4 w-4" />Add Hard Hint</Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxPoints">Max Points</Label>
              <Input id="maxPoints" type="number" {...register('maxPoints')} defaultValue={30} min={10} max={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pointsPerHint">Points/Hint</Label>
              <Input id="pointsPerHint" type="number" {...register('pointsPerHint')} defaultValue={5} min={1} max={20} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeLimit">Time (sec)</Label>
              <Input id="timeLimit" type="number" {...register('timeLimit')} defaultValue={180} min={30} max={600} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{character ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
