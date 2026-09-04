import { Router, Response } from 'express';
import { CommunityRepository } from '../repositories/index.js';
import { createPostSchema, createCommentSchema } from '@dustguard/shared';
import { authenticateToken, optionalAuthenticateToken, AuthRequest } from '../middlewares/auth.js';

const router = Router();

// Danh sách nhóm
router.get('/', optionalAuthenticateToken, (req: AuthRequest, res: Response): void => {
  const communities = CommunityRepository.list(req.user?.id);
  res.json({ success: true, data: communities });
});

// Chi tiết nhóm
router.get('/:slug', optionalAuthenticateToken, (req: AuthRequest, res: Response): void => {
  const community = CommunityRepository.findBySlug(req.params.slug, req.user?.id);
  if (!community) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy nhóm cộng đồng.' } });
    return;
  }
  res.json({ success: true, data: community });
});

// Tham gia nhóm
router.post('/:id/join', authenticateToken, (req: AuthRequest, res: Response): void => {
  CommunityRepository.join(req.params.id, req.user!.id);
  res.json({ success: true, data: { message: 'Đã tham gia nhóm thành công.' } });
});

// Rời nhóm
router.post('/:id/leave', authenticateToken, (req: AuthRequest, res: Response): void => {
  CommunityRepository.leave(req.params.id, req.user!.id);
  res.json({ success: true, data: { message: 'Đã rời nhóm.' } });
});

// Danh sách bài viết
router.get('/:id/posts', (req, res: Response): void => {
  const posts = CommunityRepository.listPosts(req.params.id);
  res.json({ success: true, data: posts });
});

// Đăng bài cập nhật
router.post('/:id/posts', authenticateToken, (req: AuthRequest, res: Response): void => {
  const validated = createPostSchema.safeParse(req.body);
  if (!validated.success) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: validated.error.errors[0]?.message } });
    return;
  }

  const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const post = CommunityRepository.createPost({
    id: postId,
    communityId: req.params.id,
    authorId: req.user!.id,
    title: validated.data.title,
    content: validated.data.content,
    postType: validated.data.postType,
    caseId: validated.data.caseId
  });

  res.status(201).json({ success: true, data: post });
});

// Danh sách bình luận
router.get('/posts/:postId/comments', (req, res: Response): void => {
  const comments = CommunityRepository.listComments(req.params.postId);
  res.json({ success: true, data: comments });
});

// Thêm bình luận
router.post('/posts/:postId/comments', authenticateToken, (req: AuthRequest, res: Response): void => {
  const validated = createCommentSchema.safeParse(req.body);
  if (!validated.success) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: validated.error.errors[0]?.message } });
    return;
  }

  const commentId = `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const comment = CommunityRepository.createComment({
    id: commentId,
    postId: req.params.postId,
    userId: req.user!.id,
    content: validated.data.content
  });

  res.status(201).json({ success: true, data: comment });
});

export default router;
