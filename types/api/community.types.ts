// Announcements
export type AnnouncementCategory = "GENERAL" | "YOUTH" | "WOMEN" | "MEN" | "CHOIR" | "WORKERS" | "URGENT";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  isActive: boolean;
  isPinned: boolean;
  image?: string;
  link?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  category: AnnouncementCategory;
  isPinned?: boolean;
  image?: string;
  expiresAt?: string;
}

export interface UpdateAnnouncementRequest extends Partial<CreateAnnouncementRequest> {}

export interface AnnouncementsResponse {
  data: Announcement[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Prayer Requests
export type PrayerRequestStatus = "PENDING" | "IN_PROGRESS" | "ANSWERED" | "CLOSED";

export interface PrayerRequest {
  id: string;
  title: string;
  content: string;
  status: PrayerRequestStatus;
  isAnonymous: boolean;
  userId: string;
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  prayerCount: number;
  /** Response/testimony when the prayer has been answered */
  response?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePrayerRequestRequest {
  title: string;
  content: string;
  isAnonymous?: boolean;
}

export interface UpdatePrayerRequestRequest {
  title?: string;
  content?: string;
  status?: PrayerRequestStatus;
}

export interface PrayerRequestsResponse {
  data: PrayerRequest[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Testimonies
export type TestimonyStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Testimony {
  id: string;
  title: string;
  content: string;
  status: TestimonyStatus;
  userId: string;
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  image?: string;
  videoUrl?: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonyRequest {
  title: string;
  content: string;
  image?: string;
  videoUrl?: string;
  isAnonymous?: boolean;
}

export interface UpdateTestimonyRequest {
  title?: string;
  content?: string;
  status?: TestimonyStatus;
  image?: string;
  videoUrl?: string;
}

export interface TestimoniesResponse {
  data: Testimony[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Groups
export interface Group {
  id: string;
  name: string;
  description?: string;
  category: string;
  image?: string;
  isActive: boolean;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  type: string; // GroupType enum: YOUTH, WOMEN, MEN, CHOIR, WORKERS, USHERS, PROTOCOL, MEDIA, OTHER
  coverImage?: string;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  type?: string;
  coverImage?: string;
}

export interface GroupsResponse {
  data: Group[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Group Posts & Moderation
export type GroupPostType = "TEXT" | "IMAGE" | "VIDEO" | "LINK" | "POLL";
export type ReportStatus = "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";

export interface GroupPost {
  id: string;
  groupId: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  group?: {
    id: string;
    name: string;
    slug: string;
  };
  content: string;
  type: GroupPostType;
  imageUrls: string[];
  videoUrl?: string;
  mediaUrl?: string;
  isPinned: boolean;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  likeCount: number;
  commentCount: number;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GroupPostReport {
  id: string;
  postId: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  post?: GroupPost;
  reason: string;
  status: ReportStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface ModerationQueueResponse {
  posts: GroupPost[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ReportedPostsResponse {
  posts: GroupPost[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApprovePostRequest {
  notes?: string;
}

export interface RejectPostRequest {
  reason: string;
}

export interface UpdateReportStatusRequest {
  status: ReportStatus;
  notes?: string;
}

// Counseling Sessions
export type CounselingStatus = "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
export type CounselingCategory = 
  | "MARRIAGE" 
  | "HEALING" 
  | "DELIVERANCE" 
  | "FINANCIAL" 
  | "CAREER" 
  | "FAMILY" 
  | "SPIRITUAL_GROWTH" 
  | "YOUTH" 
  | "OTHER";export interface CounselingSession {
  id: string;
  userId: string;
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phoneNumber: string | null;
  };
  slotId: string;
  slot: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  category: CounselingCategory;
  description: string;
  phoneNumber: string;
  status: CounselingStatus;
  counselorNotes?: string | null;
  counselorId?: string | null;
  reminder24hSent: boolean;
  reminder2hSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCounselingSessionRequest {
  status?: CounselingStatus;
  counselorNotes?: string;
  followUpNotes?: string;
}

export interface CounselingSessionsResponse {
  sessions: CounselingSession[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CounselingStats {
  totalSessions: number;
  scheduledSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  sessionsByCategory: Array<{
    category: CounselingCategory;
    _count: number;
  }>;
}
