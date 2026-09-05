import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { UserRepository, AuditRepository } from '../repositories/index.js';
import { loginSchema, registerSchema } from '@dustguard/shared';
import { authenticateToken, AuthRequest, JWT_SECRET } from '../middlewares/auth.js';

const router = Router();

router.post('/register', (req, res: Response): void => {
  try {
    const validated = registerSchema.safeParse(req.body);
    if (!validated.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validated.error.errors[0]?.message || 'Dữ liệu không hợp lệ.'
        }
      });
      return;
    }

    const { email, password, fullName, phone, district, ward } = validated.data;
    const existing = UserRepository.findByEmail(email);
    if (existing) {
      res.status(400).json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'Email này đã được sử dụng.'
        }
      });
      return;
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const userId = `usr_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;
    const user = UserRepository.create({
      id: userId,
      email,
      passwordHash,
      fullName,
      phone,
      district,
      ward
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, fullName: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    AuditRepository.log({
      actorId: user.id,
      action: 'LOGIN',
      entityType: 'user',
      entityId: user.id,
      metadata: { action: 'register' },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          district: user.district,
          ward: user.ward,
          avatarUrl: user.avatar_url
        }
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message }
    });
  }
});

router.post('/login', (req, res: Response): void => {
  try {
    const validated = loginSchema.safeParse(req.body);
    if (!validated.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validated.error.errors[0]?.message || 'Vui lòng điền email và mật khẩu.'
        }
      });
      return;
    }

    const { email, password } = validated.data;
    const user = UserRepository.findByEmail(email);
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email hoặc mật khẩu không chính xác.'
        }
      });
      return;
    }

    if (user.status === 'suspended') {
      res.status(403).json({
        success: false,
        error: {
          code: 'USER_SUSPENDED',
          message: 'Tài khoản của bạn tạm thời bị khóa.'
        }
      });
      return;
    }

    const passwordMatch = bcrypt.compareSync(password, user.password_hash);
    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email hoặc mật khẩu không chính xác.'
        }
      });
      return;
    }

    UserRepository.updateLastLogin(user.id);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, fullName: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    AuditRepository.log({
      actorId: user.id,
      action: 'LOGIN',
      entityType: 'user',
      entityId: user.id,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          district: user.district,
          ward: user.ward,
          avatarUrl: user.avatar_url
        }
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message }
    });
  }
});

router.get('/me', authenticateToken, (req: AuthRequest, res: Response): void => {
  const user = UserRepository.findById(req.user!.id);
  if (!user) {
    res.status(404).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'Không tìm thấy người dùng.' }
    });
    return;
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      phone: user.phone,
      role: user.role,
      status: user.status,
      district: user.district,
      ward: user.ward,
      bio: user.bio,
      avatarUrl: user.avatar_url,
      displayIdentity: user.display_identity,
      createdAt: user.created_at
    }
  });
});

router.post('/logout', (req, res): void => {
  res.json({ success: true, data: { message: 'Đăng xuất thành công.' } });
});

// Tiện ích dev: chuyển tài khoản sang role mong muốn ngay lập tức
router.post('/dev-switch-role', (req, res: Response): void => {
  const { role } = req.body;
  const emailMap: Record<string, string> = {
    citizen: 'citizen@dustguard.local',
    community_member: 'member@dustguard.local',
    member: 'member@dustguard.local',
    moderator: 'moderator@dustguard.local',
    admin: 'admin@dustguard.local'
  };
  const targetEmail = emailMap[role] || `${role}@dustguard.local`;
  const user = UserRepository.findByEmail(targetEmail);
  if (!user) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Tài khoản demo không tồn tại.' } });
    return;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, fullName: user.full_name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        district: user.district,
        ward: user.ward
      }
    }
  });
});

export default router;
