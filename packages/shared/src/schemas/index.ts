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
  district: z.string().optional(),
  ward: z.string().optional()
});

export const createReportSchema = z.object({
  title: z.string().min(5, 'Tiêu đề cần ít nhất 5 ký tự').max(150, 'Tiêu đề tối đa 150 ký tự'),
  description: z.string().min(10, 'Mô tả cần ít nhất 10 ký tự').max(2000, 'Mô tả tối đa 2000 ký tự'),
  category: z.enum(['dust', 'construction_material', 'road_dust', 'illegal_dumping', 'other']),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().min(3, 'Vui lòng nhập địa chỉ'),
  ward: z.string().optional(),
  district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  city: z.string().default('TP. Hồ Chí Minh'),
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
  note: z.string().min(5, 'Vui lòng ghi chú kết quả kiểm tra')
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
