'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { gamesService } from '@/lib/api/services/games.service';
import {
  DifficultyLevel,
  type QuizQuestion,
  type CreateQuizQuestionDto,
} from '@/types/api/games';

interface QuizQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: QuizQuestion | null;
}

export function QuizQuestionDialog({
  open,
  onOpenChange,
  question,
}: QuizQuestionDialogProps) {
  const queryClient = useQueryClient();
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateQuizQuestionDto>();

  // Initialize form when question changes
  useEffect(() => {
    if (question) {
      setValue('question', question.question);
      setValue('explanation', question.explanation || '');
      setValue('category', question.category);
      setValue('difficulty', question.difficulty);
      setValue('bibleReference', question.bibleReference || '');
      setValue('points', question.points);
      setValue('timeLimit', question.timeLimit || undefined);
      setOptions(question.options);
      setCorrectAnswer(question.correctAnswer);
    } else {
      reset();
      setOptions(['', '', '', '']);
      setCorrectAnswer(0);
    }
  }, [question, reset, setValue]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateQuizQuestionDto) =>
      gamesService.createQuizQuestion(data),
    onSuccess: () => {
      toast.success('Question created successfully');
      queryClient.invalidateQueries({ queryKey: ['quiz-questions'] });
      onOpenChange(false);
      reset();
      setOptions(['', '', '', '']);
      setCorrectAnswer(0);
    },
    onError: () => {
      toast.error('Failed to create question');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: CreateQuizQuestionDto) =>
      gamesService.updateQuizQuestion(question!.id, data),
    onSuccess: () => {
      toast.success('Question updated successfully');
      queryClient.invalidateQueries({ queryKey: ['quiz-questions'] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Failed to update question');
    },
  });

  const onSubmit = (data: CreateQuizQuestionDto) => {
    // Validate options
    const validOptions = options.filter((opt) => opt.trim() !== '');
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 options');
      return;
    }

    const payload = {
      ...data,
      options: validOptions,
      correctAnswer,
      points: Number(data.points) || 10,
      timeLimit: data.timeLimit ? Number(data.timeLimit) : undefined,
    };

    if (question) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      if (correctAnswer >= newOptions.length) {
        setCorrectAnswer(newOptions.length - 1);
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {question ? 'Edit Quiz Question' : 'Create Quiz Question'}
          </DialogTitle>
          <DialogDescription>
            {question
              ? 'Update the quiz question details'
              : 'Add a new quiz question for the daily challenge'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">
              Question <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="question"
              {...register('question', { required: 'Question is required' })}
              placeholder="Enter the quiz question..."
              rows={3}
              className={errors.question ? 'border-red-500' : ''}
            />
            {errors.question && (
              <p className="text-sm text-red-500">{errors.question.message}</p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>
                Answer Options <span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={options.length >= 6}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={correctAnswer === index}
                    onChange={() => setCorrectAnswer(index)}
                    className="h-4 w-4"
                  />
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Select the radio button next to the correct answer
            </p>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation (Optional)</Label>
            <Textarea
              id="explanation"
              {...register('explanation')}
              placeholder="Explain why this is the correct answer..."
              rows={2}
            />
          </div>

          {/* Category & Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category"
                {...register('category', { required: 'Category is required' })}
                placeholder="e.g., Old Testament"
                className={errors.category ? 'border-red-500' : ''}
              />
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                defaultValue={question?.difficulty || DifficultyLevel.MEDIUM}
                onValueChange={(value) =>
                  setValue('difficulty', value as DifficultyLevel)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DifficultyLevel.EASY}>Easy</SelectItem>
                  <SelectItem value={DifficultyLevel.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={DifficultyLevel.HARD}>Hard</SelectItem>
                  <SelectItem value={DifficultyLevel.EXPERT}>Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bible Reference */}
          <div className="space-y-2">
            <Label htmlFor="bibleReference">Bible Reference (Optional)</Label>
            <Input
              id="bibleReference"
              {...register('bibleReference')}
              placeholder="e.g., Genesis 1:1"
            />
          </div>

          {/* Points & Time Limit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                {...register('points')}
                defaultValue={10}
                min={1}
                max={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
              <Input
                id="timeLimit"
                type="number"
                {...register('timeLimit')}
                placeholder="Optional"
                min={5}
                max={300}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {question ? 'Update Question' : 'Create Question'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

