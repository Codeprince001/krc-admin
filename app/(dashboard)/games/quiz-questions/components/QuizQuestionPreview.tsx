'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Check, X, BookOpen, Clock, Target } from 'lucide-react';
import { type QuizQuestion } from '@/types/api/games';

interface QuizQuestionPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: QuizQuestion | null;
}

export function QuizQuestionPreview({
  open,
  onOpenChange,
  question,
}: QuizQuestionPreviewProps) {
  if (!question) return null;

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HARD':
        return 'bg-orange-100 text-orange-800';
      case 'EXPERT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Question Preview</DialogTitle>
          <DialogDescription>
            This is how the question will appear to users
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Metadata */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{question.category}</Badge>
            <Badge className={getDifficultyColor(question.difficulty)}>
              {question.difficulty}
            </Badge>
            {question.bibleReference && (
              <Badge variant="outline" className="flex items-center">
                <BookOpen className="h-3 w-3 mr-1" />
                {question.bibleReference}
              </Badge>
            )}
            <Badge variant="outline" className="flex items-center">
              <Target className="h-3 w-3 mr-1" />
              {question.points} points
            </Badge>
            {question.timeLimit && (
              <Badge variant="outline" className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {question.timeLimit}s
              </Badge>
            )}
          </div>

          {/* Question */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">{question.question}</h3>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isCorrect = index === question.correctAnswer;
                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 ${
                      isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1 font-medium">{option}</span>
                    {isCorrect && (
                      <Check className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Explanation */}
          {question.explanation && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Explanation</h4>
                  <p className="text-sm text-blue-800">{question.explanation}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold">{question.usageCount}</p>
              <p className="text-sm text-muted-foreground">Times Used</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {question.isActive ? '✓' : '✗'}
              </p>
              <p className="text-sm text-muted-foreground">Status</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{question.points}</p>
              <p className="text-sm text-muted-foreground">Points Value</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

