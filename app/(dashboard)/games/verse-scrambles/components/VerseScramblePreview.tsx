'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BookOpen, Clock, Target, Shuffle } from 'lucide-react';
import { type VerseScramble } from '@/types/api/games';

interface VerseScramblePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verse: VerseScramble | null;
}

export function VerseScramblePreview({ open, onOpenChange, verse }: VerseScramblePreviewProps) {
  if (!verse) return null;

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-orange-100 text-orange-800';
      case 'EXPERT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Verse Scramble Preview</DialogTitle>
          <DialogDescription>How this verse will appear to users</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center"><BookOpen className="h-3 w-3 mr-1" />{verse.reference}</Badge>
            <Badge className={getDifficultyColor(verse.difficulty)}>{verse.difficulty}</Badge>
            {verse.category && <Badge variant="outline">{verse.category}</Badge>}
            <Badge variant="outline" className="flex items-center"><Target className="h-3 w-3 mr-1" />{verse.points} points</Badge>
            <Badge variant="outline" className="flex items-center"><Clock className="h-3 w-3 mr-1" />{verse.timeLimit}s</Badge>
          </div>
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shuffle className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Scrambled Words</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {verse.scrambledWords.map((word, index) => (
                <div key={index} className="px-3 py-2 bg-blue-50 border-2 border-blue-200 rounded-lg font-medium text-blue-900 hover:bg-blue-100 cursor-move transition-colors">
                  {word}
                </div>
              ))}
            </div>
            {verse.hint && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800"><strong>Hint:</strong> {verse.hint}</p>
              </div>
            )}
          </Card>
          <Card className="p-4 bg-green-50 border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">Correct Order:</h4>
            <p className="text-green-800">{verse.verse}</p>
          </Card>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold">{verse.usageCount}</p>
              <p className="text-sm text-muted-foreground">Times Played</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{verse.isActive ? '✓' : '✗'}</p>
              <p className="text-sm text-muted-foreground">Status</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{verse.scrambledWords.length}</p>
              <p className="text-sm text-muted-foreground">Words</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

