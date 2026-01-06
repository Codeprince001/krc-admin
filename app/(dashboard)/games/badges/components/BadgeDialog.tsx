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
import { BadgeCategory, type Badge, type CreateBadgeDto } from '@/types/api/games';

interface BadgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badge: Badge | null;
}

export function BadgeDialog({ open, onOpenChange, badge }: BadgeDialogProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<CreateBadgeDto>();
  const category = watch('category');

  useEffect(() => {
    if (badge) {
      setValue('name', badge.name);
      setValue('description', badge.description);
      setValue('category', badge.category);
      setValue('icon', badge.icon);
      setValue('color', badge.color || '');
      setValue('requirement', badge.requirement);
      setValue('streakDays', badge.streakDays || undefined);
      setValue('pointsRequired', badge.pointsRequired || undefined);
      setValue('gamesRequired', badge.gamesRequired || undefined);
      setValue('isSpecial', badge.isSpecial);
    } else {
      reset();
    }
  }, [badge, reset, setValue]);

  const createMutation = useMutation({
    mutationFn: (data: CreateBadgeDto) => gamesService.createBadge(data),
    onSuccess: () => {
      toast.success('Badge created successfully');
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      onOpenChange(false);
      reset();
    },
    onError: () => toast.error('Failed to create badge'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateBadgeDto) => gamesService.updateBadge(badge!.id, data),
    onSuccess: () => {
      toast.success('Badge updated successfully');
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      onOpenChange(false);
    },
    onError: () => toast.error('Failed to update badge'),
  });

  const onSubmit = (data: CreateBadgeDto) => {
    const payload = {
      ...data,
      streakDays: data.streakDays ? Number(data.streakDays) : undefined,
      pointsRequired: data.pointsRequired ? Number(data.pointsRequired) : undefined,
      gamesRequired: data.gamesRequired ? Number(data.gamesRequired) : undefined,
    };
    badge ? updateMutation.mutate(payload) : createMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{badge ? 'Edit Badge' : 'Create Badge'}</DialogTitle>
          <DialogDescription>{badge ? 'Update badge details' : 'Create a new badge for users to earn'}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Badge Name <span className="text-red-500">*</span></Label>
              <Input id="name" {...register('name', { required: 'Name is required' })} placeholder="e.g., Bible Scholar" className={errors.name ? 'border-red-500' : ''} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
              <Select defaultValue={badge?.category || BadgeCategory.COMPLETION} onValueChange={(value) => setValue('category', value as BadgeCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={BadgeCategory.STREAK}>Streak</SelectItem>
                  <SelectItem value={BadgeCategory.SCORE}>Score</SelectItem>
                  <SelectItem value={BadgeCategory.COMPLETION}>Completion</SelectItem>
                  <SelectItem value={BadgeCategory.SPECIAL}>Special</SelectItem>
                  <SelectItem value={BadgeCategory.LEADERBOARD}>Leaderboard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
            <Textarea id="description" {...register('description', { required: 'Description is required' })} placeholder="Describe what this badge represents..." rows={2} className={errors.description ? 'border-red-500' : ''} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="requirement">Requirement <span className="text-red-500">*</span></Label>
            <Textarea id="requirement" {...register('requirement', { required: 'Requirement is required' })} placeholder="Explain how to earn this badge..." rows={2} className={errors.requirement ? 'border-red-500' : ''} />
            {errors.requirement && <p className="text-sm text-red-500">{errors.requirement.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon <span className="text-red-500">*</span></Label>
              <Input id="icon" {...register('icon', { required: 'Icon is required' })} placeholder="trophy, star, crown, medal, fire" className={errors.icon ? 'border-red-500' : ''} />
              {errors.icon && <p className="text-sm text-red-500">{errors.icon.message}</p>}
              <p className="text-xs text-muted-foreground">Use: trophy, star, crown, medal, or fire</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color (Hex)</Label>
              <div className="flex space-x-2">
                <Input id="color" {...register('color')} placeholder="#FFD700" />
                <input type="color" {...register('color')} className="w-12 h-10 rounded border cursor-pointer" />
              </div>
            </div>
          </div>
          {category === BadgeCategory.STREAK && (
            <div className="space-y-2">
              <Label htmlFor="streakDays">Streak Days Required</Label>
              <Input id="streakDays" type="number" {...register('streakDays')} placeholder="e.g., 7" min={1} />
            </div>
          )}
          {category === BadgeCategory.SCORE && (
            <div className="space-y-2">
              <Label htmlFor="pointsRequired">Points Required</Label>
              <Input id="pointsRequired" type="number" {...register('pointsRequired')} placeholder="e.g., 1000" min={1} />
            </div>
          )}
          {category === BadgeCategory.COMPLETION && (
            <div className="space-y-2">
              <Label htmlFor="gamesRequired">Games Required</Label>
              <Input id="gamesRequired" type="number" {...register('gamesRequired')} placeholder="e.g., 50" min={1} />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="isSpecial" {...register('isSpecial')} className="h-4 w-4" />
            <Label htmlFor="isSpecial" className="cursor-pointer">Mark as Special Badge (limited edition)</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{badge ? 'Update Badge' : 'Create Badge'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

