"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsService } from "@/lib/api/services/groups.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Eye,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  FileText,
} from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import { toast } from "sonner";
import type {
  GroupPost,
  GroupPostReport,
  Group,
  ReportStatus,
} from "@/types";
import NextImage from "next/image";

type TabType = "queue" | "reported";

export default function GroupModerationPage() {
  const [activeTab, setActiveTab] = useState<TabType>("queue");
  const [page, setPage] = useState(1);
  const [reportedPage, setReportedPage] = useState(1);
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>();
  const [reportStatus, setReportStatus] = useState<ReportStatus | undefined>();
  const [selectedPost, setSelectedPost] = useState<GroupPost | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [approveNotes, setApproveNotes] = useState("");
  const limit = 10;
  const queryClient = useQueryClient();

  // Fetch groups for filter
  const { data: groupsData } = useQuery({
    queryKey: ["groups", 1, 100],
    queryFn: () => groupsService.getGroups(1, 100),
  });

  // Fetch moderation queue
  const { data: queueData, isLoading: loadingQueue } = useQuery({
    queryKey: ["moderation-queue", page, limit, selectedGroupId],
    queryFn: () =>
      groupsService.getModerationQueue(page, limit, selectedGroupId),
    enabled: activeTab === "queue",
  });

  // Fetch reported posts
  const { data: reportedData, isLoading: loadingReported } = useQuery({
    queryKey: ["reported-posts", reportedPage, limit, reportStatus],
    queryFn: () =>
      groupsService.getReportedPosts(reportedPage, limit, reportStatus),
    enabled: activeTab === "reported",
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: ({ postId, notes }: { postId: string; notes?: string }) =>
      groupsService.approvePost(postId, { notes }),
    onSuccess: () => {
      toast.success("Post approved successfully");
      queryClient.invalidateQueries({ queryKey: ["moderation-queue"] });
      queryClient.invalidateQueries({ queryKey: ["reported-posts"] });
      setShowApproveDialog(false);
      setApproveNotes("");
      setSelectedPost(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve post");
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ postId, reason }: { postId: string; reason: string }) =>
      groupsService.rejectPost(postId, { reason }),
    onSuccess: () => {
      toast.success("Post rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["moderation-queue"] });
      queryClient.invalidateQueries({ queryKey: ["reported-posts"] });
      setShowRejectDialog(false);
      setRejectReason("");
      setSelectedPost(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject post");
    },
  });

  const handleApprove = (post: GroupPost) => {
    setSelectedPost(post);
    setShowApproveDialog(true);
  };

  const handleReject = (post: GroupPost) => {
    setSelectedPost(post);
    setShowRejectDialog(true);
  };

  const confirmApprove = () => {
    if (selectedPost) {
      approveMutation.mutate({
        postId: selectedPost.id,
        notes: approveNotes || undefined,
      });
    }
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    if (selectedPost) {
      rejectMutation.mutate({
        postId: selectedPost.id,
        reason: rejectReason,
      });
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "IMAGE":
        return <ImageIcon className="h-4 w-4" />;
      case "VIDEO":
        return <Video className="h-4 w-4" />;
      case "LINK":
        return <LinkIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const PostPreview = ({ post }: { post: GroupPost }) => (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {post.user.avatar ? (
            <NextImage
              src={post.user.avatar}
              alt={`${post.user.firstName} ${post.user.lastName}`}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium">
                {post.user.firstName[0]}
                {post.user.lastName[0]}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium">
              {post.user.firstName} {post.user.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(post.createdAt, "PPp")}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          {getPostTypeIcon(post.type)}
          {post.type}
        </Badge>
      </div>

      {post.group && (
        <div className="text-sm text-muted-foreground">
          Group: <span className="font-medium">{post.group.name}</span>
        </div>
      )}

      <div className="prose prose-sm max-w-none">
        <p className="whitespace-pre-wrap">{post.content}</p>
      </div>

      {post.mediaUrl && post.type === "IMAGE" && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
          <NextImage
            src={post.mediaUrl}
            alt="Post image"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {post.imageUrls.map((url, idx) => (
            <div
              key={idx}
              className="relative w-full h-32 rounded-lg overflow-hidden border"
            >
              <NextImage
                src={url}
                alt={`Post image ${idx + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}

      {post.mediaUrl && post.type === "VIDEO" && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            <a
              href={post.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline break-all"
            >
              {post.mediaUrl}
            </a>
          </div>
        </div>
      )}

      {post.mediaUrl && post.type === "LINK" && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            <a
              href={post.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline break-all"
            >
              {post.mediaUrl}
            </a>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>👍 {post.likeCount} likes</span>
        <span>💬 {post.commentCount} comments</span>
        {post.reportCount > 0 && (
          <span className="text-destructive">
            ⚠️ {post.reportCount} reports
          </span>
        )}
      </div>

      {post.rejectionReason && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm font-medium text-destructive mb-1">
            Previous Rejection Reason:
          </p>
          <p className="text-sm">{post.rejectionReason}</p>
        </div>
      )}
    </div>
  );

  const posts = activeTab === "queue" ? queueData?.posts : reportedData?.posts;
  const pagination =
    activeTab === "queue"
      ? queueData?.pagination
      : reportedData?.pagination;
  const isLoading = activeTab === "queue" ? loadingQueue : loadingReported;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Post Moderation
          </h1>
          <p className="text-muted-foreground">
            Review and approve or reject group posts
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => {
            setActiveTab("queue");
            setPage(1);
          }}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "queue"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Moderation Queue ({queueData?.pagination.total || 0})
        </button>
        <button
          onClick={() => {
            setActiveTab("reported");
            setReportedPage(1);
          }}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "reported"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Reported Posts ({reportedData?.pagination.total || 0})
        </button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {activeTab === "queue" && (
              <div className="flex-1">
                <Label htmlFor="group-filter">Filter by Group</Label>
                <Select
                  value={selectedGroupId || "all"}
                  onValueChange={(value) =>
                    setSelectedGroupId(value === "all" ? undefined : value)
                  }
                >
                  <SelectTrigger id="group-filter">
                    <SelectValue placeholder="All Groups" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    {groupsData?.data.map((group: Group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {activeTab === "reported" && (
              <div className="flex-1">
                <Label htmlFor="status-filter">Filter by Status</Label>
                <Select
                  value={reportStatus || "all"}
                  onValueChange={(value) =>
                    setReportStatus(
                      value === "all" ? undefined : (value as ReportStatus)
                    )
                  }
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REVIEWED">Reviewed</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="DISMISSED">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === "queue"
              ? "Pending Approval"
              : "Reported Posts"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No {activeTab === "queue" ? "pending" : "reported"} posts found
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post: GroupPost) => (
                <Card key={post.id} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <PostPreview post={post} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(post)}
                        className="flex-1"
                        variant="default"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(post)}
                        className="flex-1"
                        variant="destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages} (
                    {pagination.total} total)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        activeTab === "queue"
                          ? setPage((p) => Math.max(1, p - 1))
                          : setReportedPage((p) => Math.max(1, p - 1))
                      }
                      disabled={
                        activeTab === "queue"
                          ? page === 1
                          : reportedPage === 1
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        activeTab === "queue"
                          ? setPage((p) =>
                              Math.min(pagination.totalPages, p + 1)
                            )
                          : setReportedPage((p) =>
                              Math.min(pagination.totalPages, p + 1)
                            )
                      }
                      disabled={
                        activeTab === "queue"
                          ? page === pagination.totalPages
                          : reportedPage === pagination.totalPages
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Post</DialogTitle>
            <DialogDescription>
              This post will be visible to all group members.
            </DialogDescription>
          </DialogHeader>
          {selectedPost && <PostPreview post={selectedPost} />}
          <div className="space-y-2">
            <Label htmlFor="approve-notes">Notes (Optional)</Label>
            <Textarea
              id="approve-notes"
              placeholder="Add any notes about this approval..."
              value={approveNotes}
              onChange={(e) => setApproveNotes(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowApproveDialog(false);
                setApproveNotes("");
                setSelectedPost(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApprove}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Approve Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Post</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this post. The author will be
              notified.
            </DialogDescription>
          </DialogHeader>
          {selectedPost && <PostPreview post={selectedPost} />}
          <div className="space-y-2">
            <Label htmlFor="reject-reason">
              Rejection Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reject-reason"
              placeholder="Explain why this post is being rejected..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              Minimum 5 characters required
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectReason("");
                setSelectedPost(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmReject}
              variant="destructive"
              disabled={rejectMutation.isPending || !rejectReason.trim()}
            >
              {rejectMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Reject Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

