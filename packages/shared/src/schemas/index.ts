import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự')
});

export const registerSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  fullName: z.string().min(2, 'Vui lòng nhập họ và tên'),
  phone: z.string().optional(),
  provinceCity: z.string().optional().default('Hà Nội'),
  communeWard: z.string().optional().default('Láng Thượng'),
  ward: z.string().optional().default('Láng Thượng'),
  district: z.string().optional().default('Láng Thượng'), // Legacy compatibility field
  role: z.enum(['citizen', 'community_member', 'moderator']).optional().default('citizen')
});

export const createReportSchema = z.object({
  title: z.string().min(5, 'Tiêu đề cần ít nhất 5 ký tự').max(150, 'Tiêu đề tối đa 150 ký tự'),
  description: z.string().min(10, 'Mô tả cần ít nhất 10 ký tự').max(2000, 'Mô tả tối đa 2000 ký tự'),
  category: z.enum(['dust', 'construction_material', 'road_dust', 'illegal_dumping', 'other']),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().min(3, 'Vui lòng nhập địa chỉ'),
  provinceCity: z.string().optional().default('Hà Nội'),
  communeWard: z.string().optional().default('Láng Thượng'),
  ward: z.string().optional().default('Láng Thượng'),
  district: z.string().optional().default('Láng Thượng'), // Legacy compatibility field
  city: z.string().default('Hà Nội'),
  observedAt: z.string(),
  visibility: z.enum(['public', 'community', 'private']).default('public'),
  severityObservation: z.enum(['low', 'medium', 'high', 'unknown']).default('unknown'),
  mediaFiles: z.array(z.object({
    filePath: z.string(),
    fileName: z.string(),
    mimeType: z.string(),
    fileSize: z.number(),
    mediaType: z.enum(['image', 'video']).default('image'),
    sha256Hash: z.string(),
    caption: z.string().optional()
  })).optional().default([])
});

export const createObservationSchema = z.object({
  observationType: z.enum(['still_present', 'reduced', 'resolved', 'cannot_confirm', 'additional_evidence']),
  comment: z.string().min(5, 'Vui lòng chia sẻ nhận xét ít nhất 5 ký tự'),
  observedAt: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  mediaFiles: z.array(z.object({
    filePath: z.string(),
    mimeType: z.string(),
    fileSize: z.number(),
    sha256Hash: z.string()
  })).optional().default([])
});

export const submitTaskSchema = z.object({
  result: z.enum(['confirmed', 'not_found', 'changed', 'unable']),
  note: z.string().min(5, 'Vui lòng ghi chú kết quả kiểm tra'),
  evidenceHash: z.string().optional(),
  evidenceUrl: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isWithin50m: z.boolean().optional(),
});

export const moderatorVerifyReportSchema = z.object({
  action: z.enum(['verify_and_create_case', 'verify_and_link_case']),
  existingCaseId: z.string().optional(),
  caseTitle: z.string().optional(),
  caseSummary: z.string().optional(),
  priority: z.enum(['normal', 'attention', 'urgent']).default('normal')
});

export const moderatorRejectReportSchema = z.object({
  reason: z.string().min(5, 'Vui lòng nêu lý do từ chối')
});

export const moderatorMergeReportSchema = z.object({
  targetCaseId: z.string().min(1, 'Vui lòng chọn vụ việc cần gộp vào')
});

export const updateCaseStatusSchema = z.object({
  newStatus: z.enum(['new', 'community_verifying', 'confirmed_signal', 'forwarded', 'in_progress', 'resolved', 'closed', 'archived']),
  title: z.string().min(3, 'Vui lòng nhập tiêu đề cập nhật'),
  content: z.string().min(5, 'Vui lòng ghi rõ nội dung cập nhật tiến độ'),
  isPublic: z.boolean().default(true)
});

export const createCommunitySchema = z.object({
  name: z.string().min(3, 'Tên nhóm tối thiểu 3 ký tự'),
  slug: z.string().min(3),
  description: z.string().min(10, 'Mô tả nhóm tối thiểu 10 ký tự'),
  district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  ward: z.string().optional(),
  coverUrl: z.string().optional()
});

export const createPostSchema = z.object({
  title: z.string().min(5, 'Tiêu đề tối thiểu 5 ký tự'),
  content: z.string().min(10, 'Nội dung tối thiểu 10 ký tự'),
  postType: z.enum(['update', 'announcement', 'activity']).default('update'),
  caseId: z.string().optional()
});

export const createCommentSchema = z.object({
  content: z.string().min(2, 'Bình luận tối thiểu 2 ký tự').max(500, 'Tối đa 500 ký tự')
});

export const caseFeedbackSchema = z.object({
  rating: z.number().int('Đánh giá phải là số nguyên').min(1, 'Đánh giá tối thiểu 1 sao').max(5, 'Đánh giá tối đa 5 sao').default(5),
  comment: z.string().max(1000, 'Nhận xét tối đa 1000 ký tự').optional().default(''),
  isSatisfied: z.boolean().default(true),
  requestReinspection: z.boolean().default(false)
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Họ tên tối thiểu 2 ký tự').max(100, 'Họ tên tối đa 100 ký tự').optional(),
  district: z.string().max(100).optional(),
  ward: z.string().max(100).optional(),
  bio: z.string().max(500, 'Tiểu sử tối đa 500 ký tự').optional(),
  displayIdentity: z.enum(['name', 'anonymous']).optional()
});

export const adminChangeRoleSchema = z.object({
  role: z.enum(['citizen', 'community_member', 'moderator', 'admin'], { errorMap: () => ({ message: 'Vai trò không hợp lệ.' }) })
});

export const adminChangeStatusSchema = z.object({
  status: z.enum(['active', 'suspended', 'deleted'], { errorMap: () => ({ message: 'Trạng thái không hợp lệ.' }) })
});

export const moderatorContentActionSchema = z.object({
  action: z.enum(['dismiss', 'hide', 'delete'], { errorMap: () => ({ message: 'Hành động kiểm duyệt không hợp lệ.' }) })
});
