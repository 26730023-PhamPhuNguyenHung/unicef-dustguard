export type UserRole = 'citizen' | 'community_member' | 'moderator' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'deleted';

export type ReportCategory = 'dust' | 'construction_material' | 'road_dust' | 'illegal_dumping' | 'other';
export type ReportVisibility = 'public' | 'community' | 'private';
export type ReportStatus = 'draft' | 'submitted' | 'reviewing' | 'verified' | 'rejected' | 'merged';
export type SeverityObservation = 'low' | 'medium' | 'high' | 'unknown';
export type ReportSource = 'citizen' | 'community' | 'moderator';

export type CaseStatus = 
  | 'new' 
  | 'community_verifying' 
  | 'confirmed_signal' 
  | 'forwarded' 
  | 'in_progress' 
  | 'resolved' 
  | 'closed' 
  | 'archived';

export type CasePriority = 'normal' | 'attention' | 'urgent';

export type ObservationType = 
  | 'still_present' 
  | 'reduced' 
  | 'resolved' 
  | 'cannot_confirm' 
  | 'additional_evidence';

export type CaseUpdateType = 
  | 'status_change' 
  | 'community_update' 
  | 'moderator_note' 
  | 'system' 
  | 'forwarded' 
  | 'resolution';

export type TaskType = 'field_check' | 'photo_update' | 'status_check' | 'information_check';
export type TaskStatus = 'open' | 'claimed' | 'completed' | 'cancelled';
export type TaskResult = 'confirmed' | 'not_found' | 'changed' | 'unable';

export type CommunityStatus = 'active' | 'inactive';
export type CommunityMemberRole = 'member' | 'coordinator';

export type PostType = 'update' | 'announcement' | 'activity';
export type PostStatus = 'published' | 'hidden';
export type CommentStatus = 'visible' | 'hidden' | 'reported';

export type ContentReportEntity = 'post' | 'comment' | 'report' | 'observation';
export type ContentReportReason = 'spam' | 'abuse' | 'misinformation' | 'privacy' | 'duplicate' | 'other';
export type ContentReportStatus = 'pending' | 'reviewed' | 'dismissed' | 'actioned';

export type NotificationType = 'case_update' | 'observation' | 'task' | 'community' | 'system';

export type ContributionType = 'report' | 'confirmation' | 'observation' | 'verification' | 'community_activity';
export type ContributionStatus = 'submitted' | 'accepted' | 'rejected';

export type AuditAction = 
  | 'LOGIN'
  | 'CREATE_REPORT'
  | 'VERIFY_REPORT'
  | 'REJECT_REPORT'
  | 'CREATE_CASE'
  | 'MERGE_REPORT'
  | 'CHANGE_CASE_STATUS'
  | 'DELETE_CONTENT'
  | 'CHANGE_USER_ROLE'
  | 'SUSPEND_USER'
  | 'CREATE_COMMUNITY';

export interface UserDto {
  id: string;
  email: string;
  phone?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  role: UserRole;
  status: UserStatus;
  district?: string | null;
  ward?: string | null;
  bio?: string | null;
  displayIdentity?: 'name' | 'anonymous';
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface ReportMediaDto {
  id: string;
  reportId: string;
  uploadedBy: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  mediaType: 'image' | 'video';
  caption?: string | null;
  sha256Hash: string;
  capturedAt?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
}

export interface ReportDto {
  id: string;
  reportCode: string;
  reporterId: string;
  reporterName?: string;
  reporterDisplay?: string;
  title: string;
  description: string;
  category: ReportCategory;
  latitude: number;
  longitude: number;
  address: string;
  ward?: string | null;
  district: string;
  city: string;
  observedAt: string;
  visibility: ReportVisibility;
  status: ReportStatus;
  severityObservation: SeverityObservation;
  source: ReportSource;
  caseId?: string | null;
  media?: ReportMediaDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CaseDto {
  id: string;
  caseCode: string;
  title: string;
  summary: string;
  category: ReportCategory;
  latitude: number;
  longitude: number;
  address: string;
  ward?: string | null;
  district: string;
  city: string;
  status: CaseStatus;
  priority: CasePriority;
  signalCount: number;
  uniqueReporterCount: number;
  confirmationCount?: number;
  observationCount?: number;
  isConfirmedByMe?: boolean;
  isSavedByMe?: boolean;
  firstReportedAt: string;
  lastActivityAt: string;
  resolvedAt?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  reports?: ReportDto[];
  media?: Array<{
    id: string;
    filePath: string;
    sha256Hash: string;
    caption?: string | null;
    createdAt: string;
  }>;
  updates?: CaseUpdateDto[];
}

export interface CaseUpdateDto {
  id: string;
  caseId: string;
  updateType: CaseUpdateType;
  title: string;
  content: string;
  oldStatus?: CaseStatus | null;
  newStatus?: CaseStatus | null;
  createdBy?: string | null;
  creatorName?: string | null;
  isPublic: boolean;
  createdAt: string;
}

export interface ObservationDto {
  id: string;
  caseId: string;
  userId: string;
  userName?: string;
  userDisplay?: string;
  observationType: ObservationType;
  comment: string;
  observedAt: string;
  latitude?: number | null;
  longitude?: number | null;
  media?: Array<{
    id: string;
    filePath: string;
    mimeType: string;
    fileSize: number;
    sha256Hash: string;
  }>;
  createdAt: string;
}

export interface VerificationTaskDto {
  id: string;
  caseId?: string | null;
  caseCode?: string | null;
  title: string;
  description: string;
  taskType: TaskType;
  latitude: number;
  longitude: number;
  address: string;
  assignedTo?: string | null;
  assignedUserName?: string | null;
  status: TaskStatus;
  dueAt?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  distanceMeters?: number;
}

export interface TaskSubmissionDto {
  id: string;
  taskId: string;
  userId: string;
  userName?: string;
  result: TaskResult;
  note: string;
  submittedAt: string;
}

export interface CommunityDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverUrl?: string | null;
  district: string;
  ward?: string | null;
  status: CommunityStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  activeCaseCount?: number;
  isMember?: boolean;
  myRole?: CommunityMemberRole | null;
}

export interface CommunityPostDto {
  id: string;
  communityId: string;
  authorId: string;
  authorName?: string;
  postType: PostType;
  title: string;
  content: string;
  caseId?: string | null;
  status: PostStatus;
  commentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentDto {
  id: string;
  postId: string;
  userId: string;
  userName?: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
}

export interface NotificationDto {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: string | null;
  entityId?: string | null;
  isRead: boolean;
  createdAt: string;
  readAt?: string | null;
}

export interface UserContributionDto {
  id: string;
  userId: string;
  type: ContributionType;
  entityId: string;
  status: ContributionStatus;
  title?: string;
  description?: string;
  createdAt: string;
}

export interface CommunityDashboardData {
  stats: {
    newReports: number;
    verifyingCases: number;
    inProgressCases: number;
    updatedToday: number;
  };
  nearbyCases: CaseDto[];
  recentActivity: Array<{
    id: string;
    type: 'new_report' | 'observation' | 'status_change' | 'resolved';
    title: string;
    description: string;
    time: string;
    entityId: string;
    caseId?: string;
  }>;
  priorityCases: CaseDto[];
}

export interface ModeratorDashboardData {
  stats: {
    reportsToday: number;
    needsReview: number;
    possibleDuplicates: number;
    activeCases: number;
    resolvedThisWeek: number;
  };
  charts: {
    reports7Days: Array<{ date: string; count: number }>;
    statusDistribution: Array<{ status: string; count: number; label: string }>;
    districtActivity: Array<{ district: string; reports: number; cases: number }>;
  };
}

export interface AdminDashboardData {
  stats: {
    totalUsers: number;
    newUsersThisMonth: number;
    totalReports: number;
    activeCases: number;
    resolvedCases: number;
    storageUsageBytes: number;
    moderationBacklogCount: number;
  };
  charts: {
    userGrowth: Array<{ month: string; users: number }>;
    reportActivity: Array<{ month: string; reports: number; cases: number }>;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
