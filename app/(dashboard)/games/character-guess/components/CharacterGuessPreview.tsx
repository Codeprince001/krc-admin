'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Clock, Target, HelpCircle, Lightbulb } from 'lucide-react';
import { type CharacterGuess } from '@/types/api/games';

interface CharacterGuessPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  character: CharacterGuess | null;
}

export function CharacterGuessPreview({ open, onOpenChange, character }: CharacterGuessPreviewProps) {
  if (!character) return null;

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
          <DialogTitle>Character Guess Preview</DialogTitle>
          <DialogDescription>How this game will appear to users</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{character.testament}</Badge>
            <Badge className={getDifficultyColor(character.difficulty)}>{character.difficulty}</Badge>
            <Badge variant="outline">{character.category}</Badge>
            <Badge variant="outline" className="flex items-center"><Target className="h-3 w-3 mr-1" />{character.maxPoints} points</Badge>
            <Badge variant="outline" className="flex items-center"><Clock className="h-3 w-3 mr-1" />{character.timeLimit}s</Badge>
          </div>
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-center space-x-2 mb-4">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Who Am I?</h3>
            </div>
            <div className="space-y-2">
              {character.clues.map((clue, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">{index + 1}</div>
                  <p className="text-gray-800">{clue}</p>
                </div>
              ))}
            </div>
          </Card>
          {(character.easyHints.length > 0 || character.mediumHints.length > 0 || character.hardHints.length > 0) && (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                <h4 className="font-semibold text-yellow-900">Available Hints:</h4>
              </div>
              <div className="space-y-2">
                {character.easyHints.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-yellow-700">Easy:</p>
                    {character.easyHints.map((hint, index) => (
                      <p key={index} className="text-sm text-yellow-800 ml-4">• {hint}</p>
                    ))}
                  </div>
                )}
                {character.mediumHints.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-yellow-700">Medium:</p>
                    {character.mediumHints.map((hint, index) => (
                      <p key={index} className="text-sm text-yellow-800 ml-4">• {hint}</p>
                    ))}
                  </div>
                )}
                {character.hardHints.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-yellow-700">Hard:</p>
                    {character.hardHints.map((hint, index) => (
                      <p key={index} className="text-sm text-yellow-800 ml-4">• {hint}</p>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
          <Card className="p-4 bg-green-50 border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">Answer:</h4>
            <p className="text-xl font-bold text-green-800">{character.characterName}</p>
          </Card>
          <div className="grid grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold">{character.usageCount}</p>
              <p className="text-sm text-muted-foreground">Plays</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{character.clues.length}</p>
              <p className="text-sm text-muted-foreground">Clues</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{character.easyHints.length + character.mediumHints.length + character.hardHints.length}</p>
              <p className="text-sm text-muted-foreground">Hints</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">-{character.pointsPerHint}</p>
              <p className="text-sm text-muted-foreground">Per Hint</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
