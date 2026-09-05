import { sqliteTable, text, integer, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core';

// 1. Users
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  avatarUrl: text('avatar_url'),
  role: text('role', { enum: ['citizen', 'community_member', 'moderator', 'admin'] }).notNull().default('citizen'),
  status: text('status', { enum: ['active', 'suspended', 'deleted'] }).notNull().default('active'),
  district: text('district'),
  ward: text('ward'),
  bio: text('bio'),
  displayIdentity: text('display_identity', { enum: ['name', 'anonymous'] }).default('anonymous'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  lastLoginAt: text('last_login_at'),
}, (table: any) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
  roleIdx: index('users_role_idx').on(table.role),
  statusIdx: index('users_status_idx').on(table.status),
}));

// 2. Cases
export const cases = sqliteTable('cases', {
  id: text('id').primaryKey(),
  caseCode: text('case_code').notNull().unique(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  category: text('category').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  address: text('address').notNull(),
  ward: text('ward'),
  district: text('district').notNull(),
  city: text('city').notNull().default('TP. Hồ Chí Minh'),
  status: text('status', { 
    enum: ['new', 'community_verifying', 'confirmed_signal', 'forwarded', 'in_progress', 'resolved', 'closed', 'archived'] 
  }).notNull().default('new'),
  priority: text('priority', { enum: ['normal', 'attention', 'urgent'] }).notNull().default('normal'),
  signalCount: integer('signal_count').notNull().default(1),
  uniqueReporterCount: integer('unique_reporter_count').notNull().default(1),
  firstReportedAt: text('first_reported_at').notNull(),
  lastActivityAt: text('last_activity_at').notNull(),
  resolvedAt: text('resolved_at'),
  createdBy: text('created_by').notNull().references(() => users.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table: any) => ({
  statusIdx: index('cases_status_idx').on(table.status),
  createdAtIdx: index('cases_created_at_idx').on(table.createdAt),
  geoIdx: index('cases_geo_idx').on(table.latitude, table.longitude),
  districtIdx: index('cases_district_idx').on(table.district),
}));

// 3. Reports
export const reports = sqliteTable('reports', {
  id: text('id').primaryKey(),
  reportCode: text('report_code').notNull().unique(),
  reporterId: text('reporter_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category', { 
    enum: ['dust', 'construction_material', 'road_dust', 'illegal_dumping', 'other'] 
  }).notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  address: text('address').notNull(),
  ward: text('ward'),
  district: text('district').notNull(),
  city: text('city').notNull().default('TP. Hồ Chí Minh'),
  observedAt: text('observed_at').notNull(),
  visibility: text('visibility', { enum: ['public', 'community', 'private'] }).notNull().default('public'),
  status: text('status', { 
    enum: ['draft', 'submitted', 'reviewing', 'verified', 'rejected', 'merged'] 
  }).notNull().default('submitted'),
  severityObservation: text('severity_observation', { 
    enum: ['low', 'medium', 'high', 'unknown'] 
  }).notNull().default('unknown'),
  source: text('source', { enum: ['citizen', 'community', 'moderator'] }).notNull().default('citizen'),
  caseId: text('case_id').references(() => cases.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table: any) => ({
  statusIdx: index('reports_status_idx').on(table.status),
  statusCreatedIdx: index('reports_status_created_idx').on(table.status, table.createdAt),
  createdAtIdx: index('reports_created_at_idx').on(table.createdAt),
  reporterIdx: index('reports_reporter_idx').on(table.reporterId),
  caseIdx: index('reports_case_idx').on(table.caseId),
}));

// 4. Report Media
export const reportMedia = sqliteTable('report_media', {
  id: text('id').primaryKey(),
  reportId: text('report_id').notNull().references(() => reports.id, { onDelete: 'cascade' }),
  uploadedBy: text('uploaded_by').notNull().references(() => users.id),
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  mimeType: text('mime_type').notNull(),
  fileSize: integer('file_size').notNull(),
  mediaType: text('media_type', { enum: ['image', 'video'] }).notNull().default('image'),
  caption: text('caption'),
  sha256Hash: text('sha256_hash').notNull(),
  capturedAt: text('captured_at'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  createdAt: text('created_at').notNull(),
}, (table: any) => ({
  reportIdx: index('report_media_report_idx').on(table.reportId),
}));

// 5. Case Reports (Link N-N)
export const caseReports = sqliteTable('case_reports', {
  id: text('id').primaryKey(),
  caseId: text('case_id').notNull().references(() => cases.id, { onDelete: 'cascade' }),
  reportId: text('report_id').notNull().references(() => reports.id, { onDelete: 'cascade' }),
  linkedBy: text('linked_by').notNull().references(() => users.id),
  createdAt: text('created_at').notNull(),
}, (table: any) => ({
  caseReportUnique: uniqueIndex('case_report_unique').on(table.caseId, table.reportId),
}));

// 6. Observations
export const observations = sqliteTable('observations', {
  id: text('id').primaryKey(),
  caseId: text('case_id').notNull().references(() => cases.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id),
  observationType: text('observation_type', { 
    enum: ['still_present', 'reduced', 'resolved', 'cannot_confirm', 'additional_evidence'] 
  }).notNull(),
  comment: text('comment').notNull(),
  observedAt: text('observed_at').notNull(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  createdAt: text('created_at').notNull(),
}, (table: any) => ({
  caseIdx: index('observations_case_idx').on(table.caseId),
  userIdx: index('observations_user_idx').on(table.userId),
}));

// 7. Observation Media
export const observationMedia = sqliteTable('observation_media', {
  id: text('id').primaryKey(),
  observationId: text('observation_id').notNull().references(() => observations.id, { onDelete: 'cascade' }),
  filePath: text('file_path').notNull(),
  mimeType: text('mime_type').notNull(),
  fileSize: integer('file_size').notNull(),
  sha256Hash: text('sha256_hash').notNull(),
  createdAt: text('created_at').notNull(),
}, (table: any) => ({
  obsIdx: index('obs_media_idx').on(table.observationId),
}));

// 8. Confirmations ("Tôi cũng ghi nhận")
export const confirmations = sqliteTable('confirmations', {
  id: text('id').primaryKey(),
  caseId: text('case_id').notNull().references(() => cases.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id),
  createdAt: text('created_at').notNull(),
}, (table: any) => ({
  userCaseUnique: uniqueIndex('confirmations_unique').on(table.caseId, table.userId),
}));

// 9. Saved Cases
export const savedCases = sqliteTable('saved_cases', {
  id: text('id').primaryKey(),
  caseId: text('case_id').notNull().references(() => cases.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id),
  createdAt: text('created_at').notNull(),
}, (table: any) => ({
  userSaveUnique: uniqueIndex('saved_cases_unique').on(table.caseId, table.userId),
}));

// 10. Case Updates (Timeline)
export const caseUpdates = sqliteTable('case_updates', {
  id: text('id').primaryKey(),
  caseId: text('case_id').notNull().references(() => cases.id, { onDelete: 'cascade' }),
  updateType: text('update_type', { 
    enum: ['status_change', 'community_update', 'moderator_note', 'system', 'forwarded', 'resolution'] 
  }).notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  oldStatus: text('old_status'),
  newStatus: text('new_status'),
  createdBy: text('created_by').references(() => users.id),
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
}, (table: any) => ({
  caseIdx: index('case_updates_case_idx').on(table.caseId),
}));

// 11. Verification Tasks
export const verificationTasks = sqliteTable('verification_tasks', {
  id: text('id').primaryKey(),
  caseId: text('case_id').references(() => cases.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  taskType: text('task_type', { 
    enum: ['field_check', 'photo_update', 'status_check', 'information_check'] 
  }).notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  address: text('address').notNull(),
  assignedTo: text('assigned_to').references(() => users.id),
  status: text('status', { enum: ['open', 'claimed', 'completed', 'cancelled'] }).notNull().default('open'),
  dueAt: text('due_at'),
  createdBy: text('created_by').notNull().references(() => users.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  completedAt: text('completed_at'),
}, (table: any) => ({
  statusIdx: index('tasks_status_idx').on(table.status),
  assignedIdx: index('tasks_assigned_idx').on(table.assignedTo),
}));

// 12. Task Submissions
export const taskSubmissions = sqliteTable('task_submissions', {
  id: text('id').primaryKey(),
  taskId: text('task_id').notNull().references(() => verificationTasks.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id),
  result: text('result', { enum: ['confirmed', 'not_found', 'changed', 'unable'] }).notNull(),
  note: text('note').notNull(),
  submittedAt: text('submitted_at').notNull(),
}, (table: any) => ({
  taskIdx: index('task_submissions_task_idx').on(table.taskId),
}));

// 13. Communities
export const communities = sqliteTable('communities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  coverUrl: text('cover_url'),
  district: text('district').notNull(),
  ward: text('ward'),
  status: text('status', { enum: ['active', 'inactive'] }).notNull().default('active'),
  createdBy: text('created_by').notNull().references(() => users.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table: any) => ({
  slugIdx: uniqueIndex('communities_slug_idx').on(table.slug),
  districtIdx: index('communities_district_idx').on(table.district),
}));

// 14. Community Members
export const communityMembers = sqliteTable('community_members', {
  id: text('id').primaryKey(),
  communityId: text('community_id').notNull().references(() => communities.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id),
  role: text('role', { enum: ['member', 'coordinator'] }).notNull().default('member'),
  joinedAt: text('joined_at').notNull(),
}, (table: any) => ({
  communityUserUnique: uniqueIndex('comm_member_unique').on(table.communityId, table.userId),
  userIdx: index('comm_member_user_idx').on(table.userId),
}));

// 15. Posts
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  communityId: text('community_id').notNull().references(() => communities.id, { onDelete: 'cascade' }),
  authorId: text('author_id').notNull().references(() => users.id),
  postType: text('post_type', { enum: ['update', 'announcement', 'activity'] }).notNull().default('update'),
  title: text('title').notNull(),
  content: text('content').notNull(),
  caseId: text('case_id').references(() => cases.id),
  status: text('status', { enum: ['published', 'hidden'] }).notNull().default('published'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table: any) => ({
  communityIdx: index('posts_community_idx').on(table.communityId),
}));

// 16. Comments
export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  status: text('status', { enum: ['visible', 'hidden', 'reported'] }).notNull().default('visible'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table: any) => ({
  postIdx: index('comments_post_idx').on(table.postId),
}));

// 17. Content Reports
export const contentReports = sqliteTable('content_reports', {
  id: text('id').primaryKey(),
  reporterId: text('reporter_id').notNull().references(() => users.id),
  entityType: text('entity_type', { enum: ['post', 'comment', 'report', 'observation'] }).notNull(),
  entityId: text('entity_id').notNull(),
  reason: text('reason', { enum: ['spam', 'abuse', 'misinformation', 'privacy', 'duplicate', 'other'] }).notNull(),
  description: text('description'),
  status: text('status', { enum: ['pending', 'reviewed', 'dismissed', 'actioned'] }).notNull().default('pending'),
  reviewedBy: text('reviewed_by').references(() => users.id),
  reviewedAt: text('reviewed_at'),
  createdAt: text('created_at').notNull(),
}, (table: any) => ({
  statusIdx: index('content_reports_status_idx').on(table.status),
}));

// 18. Notifications
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type', { enum: ['case_update', 'observation', 'task', 'community', 'system'] }).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  entityType: text('entity_type'),
  entityId: text('entity_id'),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  readAt: text('read_at'),
}, (table: any) => ({
  userIdx: index('notifications_user_idx').on(table.userId),
  readIdx: index('notifications_read_idx').on(table.isRead),
}));

// 19. User Contributions
export const userContributions = sqliteTable('user_contributions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type', { enum: ['report', 'confirmation', 'observation', 'verification', 'community_activity'] }).notNull(),
  entityId: text('entity_id').notNull(),
  status: text('status', { enum: ['submitted', 'accepted', 'rejected'] }).notNull().default('submitted'),
  createdAt: text('created_at').notNull(),
}, (table: any) => ({
  userIdx: index('contributions_user_idx').on(table.userId),
  typeIdx: index('contributions_type_idx').on(table.type),
}));

// 20. Impact Stats
export const impactStats = sqliteTable('impact_stats', {
  id: text('id').primaryKey(),
  date: text('date').notNull().unique(),
  newReports: integer('new_reports').notNull().default(0),
  verifiedReports: integer('verified_reports').notNull().default(0),
  activeCases: integer('active_cases').notNull().default(0),
  resolvedCases: integer('resolved_cases').notNull().default(0),
  communityObservations: integer('community_observations').notNull().default(0),
  activeUsers: integer('active_users').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

// 21. Audit Logs
export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  actorId: text('actor_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  metadataJson: text('metadata_json'),
  ipAddress: text('ip_address'),
  createdAt: text('created_at').notNull(),
}, (table: any) => ({
  createdAtIdx: index('audit_created_at_idx').on(table.createdAt),
  actorIdx: index('audit_actor_idx').on(table.actorId),
}));
