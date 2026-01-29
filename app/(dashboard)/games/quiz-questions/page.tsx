'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  BarChart,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/PageHeader';
import { LoadingState } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { toast } from 'sonner';
import { gamesService } from '@/lib/api/services/games.service';
import { DifficultyLevel, type QuizQuestion } from '@/types/api/games';
import { QuizQuestionDialog } from './components/QuizQuestionDialog';
import { QuizQuestionPreview } from './components/QuizQuestionPreview';

export default function QuizQuestionsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuizQuestion | null>(null);
  const limit = 20;

  // Fetch questions
  const { data, isLoading } = useQuery({
    queryKey: ['quiz-questions', page, category, difficulty],
    queryFn: () =>
      gamesService.getQuizQuestions({
        page,
        limit,
        category: category === 'all' ? undefined : category,
        difficulty: difficulty === 'all' ? undefined : difficulty,
      }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => gamesService.deleteQuizQuestion(id),
    onSuccess: () => {
      toast.success('Question deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['quiz-questions'] });
    },
    onError: () => {
      toast.error('Failed to delete question');
    },
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      gamesService.updateQuizQuestion(id, { isActive: !isActive }),
    onSuccess: () => {
      toast.success('Question updated successfully');
      queryClient.invalidateQueries({ queryKey: ['quiz-questions'] });
    },
    onError: () => {
      toast.error('Failed to update question');
    },
  });

  const handleEdit = (question: QuizQuestion) => {
    setSelectedQuestion(question);
    setDialogOpen(true);
  };

  const handlePreview = (question: QuizQuestion) => {
    setSelectedQuestion(question);
    setPreviewOpen(true);
  };

  const handleCreate = () => {
    setSelectedQuestion(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      deleteMutation.mutate(id);
    }
  };

  const getDifficultyColor = (diff: DifficultyLevel) => {
    switch (diff) {
      case DifficultyLevel.EASY:
        return 'bg-green-100 text-green-800';
      case DifficultyLevel.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case DifficultyLevel.HARD:
        return 'bg-orange-100 text-orange-800';
      case DifficultyLevel.EXPERT:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredQuestions = data?.questions?.filter((q: QuizQuestion) =>
    search ? q.question.toLowerCase().includes(search.toLowerCase()) : true
  );

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Quiz Questions"
        description="Manage daily challenge quiz questions"
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Old Testament">Old Testament</SelectItem>
              <SelectItem value="New Testament">New Testament</SelectItem>
              <SelectItem value="Creation">Creation</SelectItem>
              <SelectItem value="Prophets">Prophets</SelectItem>
              <SelectItem value="Life of Jesus">Life of Jesus</SelectItem>
              <SelectItem value="Miracles">Miracles</SelectItem>
            </SelectContent>
          </Select>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="All Difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
              <SelectItem value="EXPERT">Expert</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
        </div>
      </Card>

      {/* Questions Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions && filteredQuestions.length > 0 ? (
              filteredQuestions.map((question: QuizQuestion, index: number) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium">
                    {(page - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="space-y-1">
                      <p className="font-medium line-clamp-2">{question.question}</p>
                      {question.bibleReference && (
                        <p className="text-xs text-muted-foreground">
                          {question.bibleReference}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{question.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>{question.points} pts</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                      <span>{question.usageCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {question.isActive ? (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(question)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toggleActiveMutation.mutate({
                            id: question.id,
                            isActive: question.isActive,
                          })
                        }
                      >
                        {question.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(question.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24">
                  <EmptyState
                    title="No questions found"
                    description="Create your first quiz question to get started"
                    action={{ label: "Add Question", onClick: handleCreate }}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {data?.pagination && (
        <Pagination
          currentPage={page}
          totalPages={data.pagination.totalPages}
          total={data.pagination.total}
          onPageChange={setPage}
        />
      )}

      {/* Dialogs */}
      <QuizQuestionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        question={selectedQuestion}
      />
      <QuizQuestionPreview
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        question={selectedQuestion}
      />
    </div>
  );
}

