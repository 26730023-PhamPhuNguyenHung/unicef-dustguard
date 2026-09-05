import { sqliteClient } from '../db/sqlite-client.js';
import crypto from 'crypto';

// Tiện ích tính khoảng cách theo công thức Haversine (mét)
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // bán kính Trái Đất theo mét
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// 1. User Repository
export class UserRepository {
  static findByEmail(email: string) {
    return sqliteClient.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  }

  static findById(id: string) {
    return sqliteClient.get('SELECT * FROM users WHERE id = ?', [id]);
  }

  static create(data: {
    id: string;
    email: string;
    passwordHash: string;
    fullName: string;
    phone?: string;
    role?: string;
    district?: string;
    ward?: string;
  }) {
    const now = new Date().toISOString();
    sqliteClient.run(`
      INSERT INTO users (id, email, password_hash, full_name, phone, role, district, ward, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.id,
      data.email.toLowerCase().trim(),
      data.passwordHash,
      data.fullName,
      data.phone || null,
      data.role || 'citizen',
      data.district || null,
      data.ward || null,
      now,
      now
    ]);
    return this.findById(data.id);
  }

  static updateLastLogin(id: string) {
    const now = new Date().toISOString();
    sqliteClient.run('UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?', [now, now, id]);
  }

  static list(params: { role?: string; status?: string; search?: string }) {
    let sql = 'SELECT id, email, phone, full_name as fullName, avatar_url as avatarUrl, role, status, district, ward, bio, display_identity as displayIdentity, created_at as createdAt, last_login_at as lastLoginAt FROM users WHERE 1=1';
    const args: any[] = [];
    if (params.role) {
      sql += ' AND role = ?';
      args.push(params.role);
    }
    if (params.status) {
      sql += ' AND status = ?';
      args.push(params.status);
    }
    if (params.search) {
      sql += ' AND (full_name LIKE ? OR email LIKE ?)';
      args.push(`%${params.search}%`, `%${params.search}%`);
    }
    sql += ' ORDER BY created_at DESC';
    return sqliteClient.all(sql, args);
  }

  static updateRole(id: string, role: string) {
    const now = new Date().toISOString();
    sqliteClient.run('UPDATE users SET role = ?, updated_at = ? WHERE id = ?', [role, now, id]);
    return this.findById(id);
  }

  static updateStatus(id: string, status: string) {
    const now = new Date().toISOString();
    sqliteClient.run('UPDATE users SET status = ?, updated_at = ? WHERE id = ?', [status, now, id]);
    return this.findById(id);
  }

  static updateProfile(id: string, data: { fullName?: string; district?: string; ward?: string; bio?: string; displayIdentity?: string }) {
    const now = new Date().toISOString();
    sqliteClient.run(`
      UPDATE users 
      SET full_name = COALESCE(?, full_name),
          district = COALESCE(?, district),
          ward = COALESCE(?, ward),
          bio = COALESCE(?, bio),
          display_identity = COALESCE(?, display_identity),
          updated_at = ?
      WHERE id = ?
    `, [data.fullName || null, data.district || null, data.ward || null, data.bio || null, data.displayIdentity || null, now, id]);
    return this.findById(id);
  }
}

// 2. Report Repository
export class ReportRepository {
  static create(data: {
    id: string;
    reportCode: string;
    reporterId: string;
    title: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    address: string;
    ward?: string;
    district: string;
    city?: string;
    observedAt: string;
    visibility?: string;
    status?: string;
    severityObservation?: string;
    source?: string;
    caseId?: string | null;
  }) {
    const now = new Date().toISOString();
    sqliteClient.run(`
      INSERT INTO reports (
        id, report_code, reporter_id, title, description, category, latitude, longitude, address, ward,
        district, city, observed_at, visibility, status, severity_observation, source, case_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.id,
      data.reportCode,
      data.reporterId,
      data.title,
      data.description,
      data.category,
      data.latitude,
      data.longitude,
      data.address,
      data.ward || null,
      data.district,
      data.city || 'TP. Hồ Chí Minh',
      data.observedAt,
      data.visibility || 'public',
      data.status || 'submitted',
      data.severityObservation || 'unknown',
      data.source || 'citizen',
      data.caseId || null,
      now,
      now
    ]);
    return this.findById(data.id);
  }

  static addMedia(data: {
    id: string;
    reportId: string;
    uploadedBy: string;
    fileName: string;
    filePath: string;
    mimeType: string;
    fileSize: number;
    mediaType?: string;
    caption?: string;
    sha256Hash: string;
  }) {
    const now = new Date().toISOString();
    sqliteClient.run(`
      INSERT INTO report_media (
        id, report_id, uploaded_by, file_name, file_path, mime_type, file_size, media_type, caption, sha256_hash, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.id,
      data.reportId,
      data.uploadedBy,
      data.fileName,
      data.filePath,
      data.mimeType,
      data.fileSize,
      data.mediaType || 'image',
      data.caption || null,
      data.sha256Hash,
      now
    ]);
  }

  static findById(id: string) {
    const rep = sqliteClient.get(`
      SELECT r.*, u.full_name as reporterName, u.display_identity as reporterDisplayIdentity
      FROM reports r
      LEFT JOIN users u ON r.reporter_id = u.id
      WHERE r.id = ? OR r.report_code = ?
    `, [id, id]);
    if (!rep) return null;

    const media = sqliteClient.all('SELECT * FROM report_media WHERE report_id = ?', [rep.id]);
    return {
      ...rep,
      media
    };
  }

  static list(params: {
    status?: string;
    category?: string;
    district?: string;
    search?: string;
    reporterId?: string;
    limit?: number;
    offset?: number;
  }) {
    let sql = `
      SELECT r.*, u.full_name as reporterName, u.display_identity as reporterDisplayIdentity,
             (SELECT file_path FROM report_media WHERE report_id = r.id LIMIT 1) as thumbnailPath
      FROM reports r
      LEFT JOIN users u ON r.reporter_id = u.id
      WHERE 1=1
    `;
    const args: any[] = [];
    if (params.status) {
      sql += ' AND r.status = ?';
      args.push(params.status);
    }
    if (params.category) {
      sql += ' AND r.category = ?';
      args.push(params.category);
    }
    if (params.district) {
      sql += ' AND r.district = ?';
      args.push(params.district);
    }
    if (params.reporterId) {
      sql += ' AND r.reporter_id = ?';
      args.push(params.reporterId);
    }
    if (params.search) {
      sql += ' AND (r.title LIKE ? OR r.address LIKE ? OR r.report_code LIKE ?)';
      args.push(`%${params.search}%`, `%${params.search}%`, `%${params.search}%`);
    }
    sql += ' ORDER BY r.created_at DESC';
    if (params.limit) {
      sql += ' LIMIT ?';
      args.push(params.limit);
      if (params.offset) {
        sql += ' OFFSET ?';
        args.push(params.offset);
      }
    }
    return sqliteClient.all(sql, args);
  }

  static findNearbyReportsOrCases(lat: number, lon: number, radiusMeters: number = 150) {
    // Lấy tất cả cases đang hoạt động và tính khoảng cách
    const activeCases = sqliteClient.all(`
      SELECT c.*, 
             (SELECT COUNT(*) FROM confirmations WHERE case_id = c.id) as confirmationCount
      FROM cases c
      WHERE c.status NOT IN ('closed', 'archived')
    `);

    const nearbyCases = activeCases
      .map((c: any) => {
        const dist = calculateDistanceMeters(lat, lon, c.latitude, c.longitude);
        return { ...c, distanceMeters: dist };
      })
      .filter((c: any) => c.distanceMeters <= radiusMeters)
      .sort((a: any, b: any) => a.distanceMeters - b.distanceMeters);

    return nearbyCases;
  }

  static updateStatus(id: string, status: string, caseId?: string | null) {
    const now = new Date().toISOString();
    sqliteClient.run(`
      UPDATE reports 
      SET status = ?, case_id = COALESCE(?, case_id), updated_at = ?
      WHERE id = ?
    `, [status, caseId || null, now, id]);
    return this.findById(id);
  }
}

// 3. Case Repository
export class CaseRepository {
  static create(data: {
    id: string;
    caseCode: string;
    title: string;
    summary: string;
    category: string;
    latitude: number;
    longitude: number;
    address: string;
    ward?: string;
    district: string;
    city?: string;
    status?: string;
    priority?: string;
    createdBy: string;
  }) {
    const now = new Date().toISOString();
    sqliteClient.run(`
      INSERT INTO cases (
        id, case_code, title, summary, category, latitude, longitude, address, ward,
        district, city, status, priority, signal_count, unique_reporter_count,
        first_reported_at, last_activity_at, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?, ?, ?, ?)
    `, [
      data.id,
      data.caseCode,
      data.title,
      data.summary,
      data.category,
      data.latitude,
      data.longitude,
      data.address,
      data.ward || null,
      data.district,
      data.city || 'TP. Hồ Chí Minh',
      data.status || 'new',
      data.priority || 'normal',
      now,
      now,
      data.createdBy,
      now,
      now
    ]);
    return this.findById(data.id);
  }

  static findById(id: string, currentUserId?: string) {
    const c = sqliteClient.get('SELECT * FROM cases WHERE id = ? OR case_code = ?', [id, id]);
    if (!c) return null;

    const confCount = sqliteClient.get('SELECT COUNT(*) as count FROM confirmations WHERE case_id = ?', [c.id])?.count || 0;
    const obsCount = sqliteClient.get('SELECT COUNT(*) as count FROM observations WHERE case_id = ?', [c.id])?.count || 0;
    const repCount = sqliteClient.get('SELECT COUNT(*) as count FROM case_reports WHERE case_id = ?', [c.id])?.count || 0;

    let isConfirmedByMe = false;
    let isSavedByMe = false;

    if (currentUserId) {
      const conf = sqliteClient.get('SELECT id FROM confirmations WHERE case_id = ? AND user_id = ?', [c.id, currentUserId]);
      isConfirmedByMe = !!conf;

      const save = sqliteClient.get('SELECT id FROM saved_cases WHERE case_id = ? AND user_id = ?', [c.id, currentUserId]);
      isSavedByMe = !!save;
    }

    const updates = sqliteClient.all(`
      SELECT cu.*, u.full_name as creatorName
      FROM case_updates cu
      LEFT JOIN users u ON cu.created_by = u.id
      WHERE cu.case_id = ?
      ORDER BY cu.created_at ASC
    `, [c.id]);

    const media = sqliteClient.all(`
      SELECT rm.id, rm.file_path as filePath, rm.sha256_hash as sha256Hash, rm.caption, rm.created_at as createdAt
      FROM report_media rm
      JOIN reports r ON rm.report_id = r.id
      WHERE r.case_id = ?
      ORDER BY rm.created_at DESC
    `, [c.id]);

    return {
      ...c,
      confirmationCount: confCount,
      observationCount: obsCount,
      reportCount: Math.max(repCount, c.signal_count),
      isConfirmedByMe,
      isSavedByMe,
      updates,
      media
    };
  }

  static list(params: {
    status?: string;
    category?: string;
    district?: string;
    priority?: string;
    search?: string;
    sort?: 'newest' | 'signals' | 'recent_activity';
    limit?: number;
    offset?: number;
    currentUserId?: string;
  }) {
    let sql = `
      SELECT c.*,
             (SELECT COUNT(*) FROM confirmations WHERE case_id = c.id) as confirmationCount,
             (SELECT COUNT(*) FROM observations WHERE case_id = c.id) as observationCount,
             (SELECT file_path FROM report_media rm JOIN reports r ON rm.report_id = r.id WHERE r.case_id = c.id LIMIT 1) as thumbnailPath
      FROM cases c
      WHERE 1=1
    `;
    const args: any[] = [];
    if (params.status) {
      sql += ' AND c.status = ?';
      args.push(params.status);
    }
    if (params.category) {
      sql += ' AND c.category = ?';
      args.push(params.category);
    }
    if (params.district) {
      sql += ' AND c.district = ?';
      args.push(params.district);
    }
    if (params.priority) {
      sql += ' AND c.priority = ?';
      args.push(params.priority);
    }
    if (params.search) {
      sql += ' AND (c.title LIKE ? OR c.address LIKE ? OR c.case_code LIKE ?)';
      args.push(`%${params.search}%`, `%${params.search}%`, `%${params.search}%`);
    }

    if (params.sort === 'signals') {
      sql += ' ORDER BY confirmationCount DESC, c.signal_count DESC';
    } else if (params.sort === 'recent_activity') {
      sql += ' ORDER BY c.last_activity_at DESC';
    } else {
      sql += ' ORDER BY c.created_at DESC';
    }

    if (params.limit) {
      sql += ' LIMIT ?';
      args.push(params.limit);
      if (params.offset) {
        sql += ' OFFSET ?';
        args.push(params.offset);
      }
    }

    const items = sqliteClient.all(sql, args);
    return items;
  }

  static updateStatus(id: string, newStatus: string, title: string, content: string, userId: string, isPublic: boolean = true) {
    const now = new Date().toISOString();
    return sqliteClient.transaction(() => {
      const old = sqliteClient.get('SELECT status FROM cases WHERE id = ?', [id]);
      const oldStatus = old ? old.status : null;

      const resolvedAt = newStatus === 'resolved' ? now : null;

      sqliteClient.run(`
        UPDATE cases 
        SET status = ?, last_activity_at = ?, resolved_at = COALESCE(?, resolved_at), updated_at = ?
        WHERE id = ?
      `, [newStatus, now, resolvedAt, now, id]);

      sqliteClient.run(`
        INSERT INTO case_updates (id, case_id, update_type, title, content, old_status, new_status, created_by, is_public, created_at)
        VALUES (?, ?, 'status_change', ?, ?, ?, ?, ?, ?, ?)
      `, [
        `upd_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`,
        id,
        title,
        content,
        oldStatus,
        newStatus,
        userId,
        isPublic ? 1 : 0,
        now
      ]);

      return this.findById(id);
    });
  }

  static addTimelineUpdate(id: string, data: {
    updateType: string;
    title: string;
    content: string;
    createdBy: string;
    isPublic?: boolean;
  }) {
    const now = new Date().toISOString();
    sqliteClient.run(`
      INSERT INTO case_updates (id, case_id, update_type, title, content, created_by, is_public, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      `upd_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`,
      id,
      data.updateType,
      data.title,
      data.content,
      data.createdBy,
      data.isPublic !== false ? 1 : 0,
      now
    ]);
    sqliteClient.run('UPDATE cases SET last_activity_at = ?, updated_at = ? WHERE id = ?', [now, now, id]);
  }

  static linkReport(caseId: string, reportId: string, linkedBy: string) {
    const now = new Date().toISOString();
    sqliteClient.transaction(() => {
      sqliteClient.run(`
        INSERT OR IGNORE INTO case_reports (id, case_id, report_id, linked_by, created_at)
        VALUES (?, ?, ?, ?, ?)
      `, [`cr_${caseId}_${reportId}`, caseId, reportId, linkedBy, now]);

      sqliteClient.run(`
        UPDATE reports SET case_id = ?, status = 'verified', updated_at = ? WHERE id = ?
      `, [caseId, now, reportId]);

      sqliteClient.run(`
        UPDATE cases SET signal_count = signal_count + 1, last_activity_at = ?, updated_at = ? WHERE id = ?
      `, [now, now, caseId]);
    });
  }
}

// 4. Observation Repository
export class ObservationRepository {
  static create(data: {
    id: string;
    caseId: string;
    userId: string;
    observationType: string;
    comment: string;
    observedAt: string;
    latitude?: number;
    longitude?: number;
  }) {
    const now = new Date().toISOString();
    return sqliteClient.transaction(() => {
      sqliteClient.run(`
        INSERT INTO observations (id, case_id, user_id, observation_type, comment, observed_at, latitude, longitude, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        data.id,
        data.caseId,
        data.userId,
        data.observationType,
        data.comment,
        data.observedAt,
        data.latitude || null,
        data.longitude || null,
        now
      ]);

      // Cập nhật last_activity của case
      sqliteClient.run('UPDATE cases SET last_activity_at = ?, updated_at = ? WHERE id = ?', [now, now, data.caseId]);

      // Thêm timeline update nhẹ
      sqliteClient.run(`
        INSERT INTO case_updates (id, case_id, update_type, title, content, created_by, is_public, created_at)
        VALUES (?, ?, 'community_update', 'Quan sát mới từ cộng đồng', ?, ?, 1, ?)
      `, [
        `upd_${Date.now()}_obs`,
        data.caseId,
        data.comment,
        data.userId,
        now
      ]);

      return data;
    });
  }

  static addMedia(data: {
    id: string;
    observationId: string;
    filePath: string;
    mimeType: string;
    fileSize: number;
    sha256Hash: string;
  }) {
    const now = new Date().toISOString();
    sqliteClient.run(`
      INSERT INTO observation_media (id, observation_id, file_path, mime_type, file_size, sha256_hash, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [data.id, data.observationId, data.filePath, data.mimeType, data.fileSize, data.sha256Hash, now]);
  }

  static listByCaseId(caseId: string) {
    const obs = sqliteClient.all(`
      SELECT o.*, u.full_name as userName, u.display_identity as userDisplayIdentity
      FROM observations o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.case_id = ?
      ORDER BY o.created_at DESC
    `, [caseId]);

    return obs.map((o: any) => {
      const media = sqliteClient.all('SELECT * FROM observation_media WHERE observation_id = ?', [o.id]);
      return { ...o, media };
    });
  }
}

// 5. Confirmation Repository ("Tôi cũng ghi nhận")
export class ConfirmationRepository {
  static toggle(caseId: string, userId: string): { confirmed: boolean; newCount: number } {
    const existing = sqliteClient.get('SELECT id FROM confirmations WHERE case_id = ? AND user_id = ?', [caseId, userId]);
    const now = new Date().toISOString();

    if (existing) {
      sqliteClient.run('DELETE FROM confirmations WHERE case_id = ? AND user_id = ?', [caseId, userId]);
      const count = sqliteClient.get('SELECT COUNT(*) as count FROM confirmations WHERE case_id = ?', [caseId])?.count || 0;
      return { confirmed: false, newCount: count };
    } else {
      sqliteClient.run('INSERT INTO confirmations (id, case_id, user_id, created_at) VALUES (?, ?, ?, ?)', [
        `conf_${caseId}_${userId}`,
        caseId,
        userId,
        now
      ]);
      sqliteClient.run('UPDATE cases SET last_activity_at = ?, updated_at = ? WHERE id = ?', [now, now, caseId]);
      const count = sqliteClient.get('SELECT COUNT(*) as count FROM confirmations WHERE case_id = ?', [caseId])?.count || 0;
      return { confirmed: true, newCount: count };
    }
  }

  static countByCaseId(caseId: string): number {
    return sqliteClient.get('SELECT COUNT(*) as count FROM confirmations WHERE case_id = ?', [caseId])?.count || 0;
  }
}

// 6. Saved Cases Repository
export class SavedCaseRepository {
  static toggle(caseId: string, userId: string): { saved: boolean } {
    const existing = sqliteClient.get('SELECT id FROM saved_cases WHERE case_id = ? AND user_id = ?', [caseId, userId]);
    if (existing) {
      sqliteClient.run('DELETE FROM saved_cases WHERE case_id = ? AND user_id = ?', [caseId, userId]);
      return { saved: false };
    } else {
      sqliteClient.run('INSERT INTO saved_cases (id, case_id, user_id, created_at) VALUES (?, ?, ?, ?)', [
        `save_${caseId}_${userId}`,
        caseId,
        userId,
        new Date().toISOString()
      ]);
      return { saved: true };
    }
  }

  static listSavedByUser(userId: string) {
    return sqliteClient.all(`
      SELECT c.*,
             (SELECT COUNT(*) FROM confirmations WHERE case_id = c.id) as confirmationCount,
             (SELECT COUNT(*) FROM observations WHERE case_id = c.id) as observationCount
      FROM saved_cases sc
      JOIN cases c ON sc.case_id = c.id
      WHERE sc.user_id = ?
      ORDER BY sc.created_at DESC
    `, [userId]);
  }
}

// 7. Community Repository
export class CommunityRepository {
  static list(currentUserId?: string) {
    const list = sqliteClient.all(`
      SELECT c.*,
             (SELECT COUNT(*) FROM community_members WHERE community_id = c.id) as memberCount,
             (SELECT COUNT(*) FROM cases WHERE district = c.district AND status NOT IN ('closed', 'archived')) as activeCaseCount
      FROM communities c
      WHERE c.status = 'active'
      ORDER BY c.created_at ASC
    `);

    if (currentUserId) {
      return list.map((c: any) => {
        const mem = sqliteClient.get('SELECT role FROM community_members WHERE community_id = ? AND user_id = ?', [c.id, currentUserId]);
        return {
          ...c,
          isMember: !!mem,
          myRole: mem ? mem.role : null
        };
      });
    }
    return list;
  }

  static findBySlug(slug: string, currentUserId?: string) {
    const c = sqliteClient.get('SELECT * FROM communities WHERE slug = ? OR id = ?', [slug, slug]);
    if (!c) return null;

    const memberCount = sqliteClient.get('SELECT COUNT(*) as count FROM community_members WHERE community_id = ?', [c.id])?.count || 0;
    const activeCaseCount = sqliteClient.get('SELECT COUNT(*) as count FROM cases WHERE district = ? AND status NOT IN (\'closed\', \'archived\')', [c.district])?.count || 0;

    let isMember = false;
    let myRole = null;
    if (currentUserId) {
      const mem = sqliteClient.get('SELECT role FROM community_members WHERE community_id = ? AND user_id = ?', [c.id, currentUserId]);
      isMember = !!mem;
      myRole = mem ? mem.role : null;
    }

    return {
      ...c,
      memberCount,
      activeCaseCount,
      isMember,
      myRole
    };
  }

  static join(communityId: string, userId: string) {
    const now = new Date().toISOString();
    sqliteClient.run(`
      INSERT OR IGNORE INTO community_members (id, community_id, user_id, role, joined_at)
      VALUES (?, ?, ?, 'member', ?)
    `, [`cm_${communityId}_${userId}`, communityId, userId, now]);
    return true;
  }

  static leave(communityId: string, userId: string) {
    sqliteClient.run('DELETE FROM community_members WHERE community_id = ? AND user_id = ?', [communityId, userId]);
    return true;
  }

  static listPosts(communityId: string) {
    return sqliteClient.all(`
      SELECT p.*, u.full_name as authorName,
             (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as commentCount
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.community_id = ? AND p.status = 'published'
      ORDER BY p.created_at DESC
    `, [communityId]);
  }

  static createPost(data: {
    id: string;
    communityId: string;
    authorId: string;
    title: string;
    content: string;
    postType?: string;
    caseId?: string | null;
  }) {
    const now = new Date().toISOString();
    sqliteClient.run(`
      INSERT INTO posts (id, community_id, author_id, title, content, post_type, case_id, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?, ?)
    `, [
      data.id,
      data.communityId,
      data.authorId,
      data.title,
      data.content,
      data.postType || 'update',
      data.caseId || null,
      now,
      now
    ]);
    return sqliteClient.get('SELECT * FROM posts WHERE id = ?', [data.id]);
  }

  static listComments(postId: string) {
    return sqliteClient.all(`
      SELECT c.*, u.full_name as userName
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ? AND c.status = 'visible'
      ORDER BY c.created_at ASC
    `, [postId]);
  }

  static createComment(data: {
    id: string;
    postId: string;
    userId: string;
    content: string;
  }) {
    const now = new Date().toISOString();
    sqliteClient.run(`
      INSERT INTO comments (id, post_id, user_id, content, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'visible', ?, ?)
    `, [data.id, data.postId, data.userId, data.content, now, now]);
    return sqliteClient.get(`
      SELECT c.*, u.full_name as userName
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [data.id]);
  }
}

// 8. Verification Tasks Repository
export class TaskRepository {
  static list(params: { status?: string; taskType?: string }) {
    let sql = `
      SELECT t.*, u.full_name as assignedUserName, c.case_code as caseCode, c.title as caseTitle
      FROM verification_tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN cases c ON t.case_id = c.id
      WHERE 1=1
    `;
    const args: any[] = [];
    if (params.status) {
      sql += ' AND t.status = ?';
      args.push(params.status);
    }
    if (params.taskType) {
      sql += ' AND t.task_type = ?';
      args.push(params.taskType);
    }
    sql += ' ORDER BY t.created_at DESC';
    return sqliteClient.all(sql, args);
  }

  static findById(id: string) {
    return sqliteClient.get(`
      SELECT t.*, u.full_name as assignedUserName, c.case_code as caseCode, c.title as caseTitle
      FROM verification_tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN cases c ON t.case_id = c.id
      WHERE t.id = ?
    `, [id]);
  }

  static claim(taskId: string, userId: string) {
    const now = new Date().toISOString();
    sqliteClient.run(`
      UPDATE verification_tasks 
      SET status = 'claimed', assigned_to = ?, updated_at = ?
      WHERE id = ? AND status = 'open'
    `, [userId, now, taskId]);
    return this.findById(taskId);
  }

  static submit(
    taskId: string,
    userId: string,
    result: string,
    note: string,
    extra?: {
      evidenceHash?: string;
      evidenceUrl?: string;
      latitude?: number;
      longitude?: number;
      isWithin50m?: boolean;
    }
  ) {
    const now = new Date().toISOString();
    return sqliteClient.transaction(() => {
      try { sqliteClient.run(`ALTER TABLE task_submissions ADD COLUMN evidence_hash TEXT`); } catch {}
      try { sqliteClient.run(`ALTER TABLE task_submissions ADD COLUMN evidence_url TEXT`); } catch {}
      try { sqliteClient.run(`ALTER TABLE task_submissions ADD COLUMN latitude REAL`); } catch {}
      try { sqliteClient.run(`ALTER TABLE task_submissions ADD COLUMN longitude REAL`); } catch {}
      try { sqliteClient.run(`ALTER TABLE task_submissions ADD COLUMN is_within_50m INTEGER`); } catch {}

      sqliteClient.run(`
        INSERT INTO task_submissions (id, task_id, user_id, result, note, evidence_hash, evidence_url, latitude, longitude, is_within_50m, submitted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        `sub_${taskId}_${Date.now()}`,
        taskId,
        userId,
        result,
        note,
        extra?.evidenceHash || null,
        extra?.evidenceUrl || null,
        extra?.latitude || null,
        extra?.longitude || null,
        extra?.isWithin50m ? 1 : 0,
        now
      ]);

      sqliteClient.run(`
        UPDATE verification_tasks 
        SET status = 'completed', completed_at = ?, updated_at = ?
        WHERE id = ?
      `, [now, now, taskId]);

      // Ghi nhận contribution
      sqliteClient.run(`
        INSERT INTO user_contributions (id, user_id, type, entity_id, status, created_at)
        VALUES (?, ?, 'verification', ?, 'accepted', ?)
      `, [`uc_${Date.now()}`, userId, taskId, now]);

      return this.findById(taskId);
    });
  }
}

// 9. Notification Repository
export class NotificationRepository {
  static listByUserId(userId: string) {
    return sqliteClient.all('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  }

  static markAsRead(id: string, userId: string) {
    const now = new Date().toISOString();
    sqliteClient.run('UPDATE notifications SET is_read = 1, read_at = ? WHERE id = ? AND user_id = ?', [now, id, userId]);
  }

  static markAllAsRead(userId: string) {
    const now = new Date().toISOString();
    sqliteClient.run('UPDATE notifications SET is_read = 1, read_at = ? WHERE user_id = ?', [now, userId]);
  }

  static create(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    entityType?: string;
    entityId?: string;
  }) {
    const now = new Date().toISOString();
    sqliteClient.run(`
      INSERT INTO notifications (id, user_id, type, title, message, entity_type, entity_id, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
    `, [
      `notif_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`,
      data.userId,
      data.type,
      data.title,
      data.message,
      data.entityType || null,
      data.entityId || null,
      now
    ]);
  }
}

// 10. Audit Log Repository
export class AuditRepository {
  static log(data: {
    actorId?: string | null;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: any;
    ipAddress?: string;
  }) {
    const now = new Date().toISOString();
    sqliteClient.run(`
      INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      `aud_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`,
      data.actorId || null,
      data.action,
      data.entityType,
      data.entityId,
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.ipAddress || '127.0.0.1',
      now
    ]);
  }

  static list(params: { actorId?: string; action?: string; limit?: number }) {
    let sql = `
      SELECT a.*, u.full_name as actorName, u.email as actorEmail
      FROM audit_logs a
      LEFT JOIN users u ON a.actor_id = u.id
      WHERE 1=1
    `;
    const args: any[] = [];
    if (params.actorId) {
      sql += ' AND a.actor_id = ?';
      args.push(params.actorId);
    }
    if (params.action) {
      sql += ' AND a.action = ?';
      args.push(params.action);
    }
    sql += ' ORDER BY a.created_at DESC';
    if (params.limit) {
      sql += ' LIMIT ?';
      args.push(params.limit);
    }
    return sqliteClient.all(sql, args);
  }
}

// 11. Dashboard Aggregations (Truy vấn DB thật 100%, không fake)
export class DashboardRepository {
  static getCommunityDashboard() {
    const newReports = sqliteClient.get('SELECT COUNT(*) as count FROM reports WHERE status = \'submitted\'')?.count || 0;
    const verifyingCases = sqliteClient.get('SELECT COUNT(*) as count FROM cases WHERE status = \'community_verifying\'')?.count || 0;
    const inProgressCases = sqliteClient.get('SELECT COUNT(*) as count FROM cases WHERE status = \'in_progress\'')?.count || 0;
    const updatedToday = sqliteClient.get('SELECT COUNT(*) as count FROM case_updates WHERE created_at >= date(\'now\', \'-1 day\')')?.count || 0;

    const nearbyCases = sqliteClient.all(`
      SELECT c.*,
             (SELECT COUNT(*) FROM confirmations WHERE case_id = c.id) as confirmationCount,
             (SELECT COUNT(*) FROM observations WHERE case_id = c.id) as observationCount
      FROM cases c
      WHERE c.status NOT IN ('closed', 'archived')
      ORDER BY c.last_activity_at DESC
      LIMIT 5
    `);

    const recentUpdates = sqliteClient.all(`
      SELECT cu.*, c.case_code as caseCode, c.title as caseTitle
      FROM case_updates cu
      JOIN cases c ON cu.case_id = c.id
      ORDER BY cu.created_at DESC
      LIMIT 6
    `);

    const priorityCases = sqliteClient.all(`
      SELECT c.*,
             (SELECT COUNT(*) FROM confirmations WHERE case_id = c.id) as confirmationCount
      FROM cases c
      WHERE c.priority = 'urgent' AND c.status NOT IN ('closed', 'archived')
      ORDER BY c.signal_count DESC
      LIMIT 3
    `);

    return {
      stats: {
        newReports,
        verifyingCases,
        inProgressCases,
        updatedToday
      },
      nearbyCases,
      recentActivity: recentUpdates.map((u: any) => ({
        id: u.id,
        type: u.update_type,
        title: u.title,
        description: u.content,
        time: u.created_at,
        entityId: u.case_id,
        caseId: u.case_id,
        caseCode: u.caseCode
      })),
      priorityCases
    };
  }

  static getModeratorDashboard() {
    const reportsToday = sqliteClient.get('SELECT COUNT(*) as count FROM reports WHERE date(created_at) = date(\'now\')')?.count || 0;
    const needsReview = sqliteClient.get('SELECT COUNT(*) as count FROM reports WHERE status IN (\'submitted\', \'reviewing\')')?.count || 0;
    const activeCases = sqliteClient.get('SELECT COUNT(*) as count FROM cases WHERE status NOT IN (\'closed\', \'archived\')')?.count || 0;
    const resolvedThisWeek = sqliteClient.get('SELECT COUNT(*) as count FROM cases WHERE status = \'resolved\' AND resolved_at >= date(\'now\', \'-7 days\')')?.count || 0;

    const statusRows = sqliteClient.all(`
      SELECT status, COUNT(*) as count FROM cases GROUP BY status
    `);

    const districtRows = sqliteClient.all(`
      SELECT district, COUNT(*) as cases, 
             (SELECT COUNT(*) FROM reports WHERE district = c.district) as reports
      FROM cases c
      GROUP BY district
    `);

    // Tính toán báo cáo 7 ngày gần nhất từ dữ liệu thực
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const reports7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayLabel = days[d.getDay()];
      const count = sqliteClient.get('SELECT COUNT(*) as count FROM reports WHERE date(created_at) = ?', [dateStr])?.count || 0;
      reports7Days.push({ date: dayLabel, count });
    }

    const possibleDuplicates = sqliteClient.get(
      `SELECT COUNT(*) as count FROM reports r1
       WHERE status = 'submitted' AND EXISTS (
         SELECT 1 FROM reports r2 
         WHERE r2.id != r1.id AND r2.district = r1.district AND ABS(r2.latitude - r1.latitude) < 0.001 AND ABS(r2.longitude - r1.longitude) < 0.001
       )`
    )?.count || 0;

    return {
      stats: {
        reportsToday,
        needsReview,
        possibleDuplicates,
        activeCases,
        resolvedThisWeek
      },
      charts: {
        reports7Days,
        statusDistribution: statusRows.map((s: any) => ({ status: s.status, count: s.count })),
        districtActivity: districtRows
      }
    };
  }

  static getAdminDashboard() {
    const totalUsers = sqliteClient.get('SELECT COUNT(*) as count FROM users')?.count || 0;
    const totalReports = sqliteClient.get('SELECT COUNT(*) as count FROM reports')?.count || 0;
    const activeCases = sqliteClient.get('SELECT COUNT(*) as count FROM cases WHERE status NOT IN (\'closed\', \'archived\')')?.count || 0;
    const resolvedCases = sqliteClient.get('SELECT COUNT(*) as count FROM cases WHERE status = \'resolved\'')?.count || 0;
    const newUsersThisMonth = sqliteClient.get("SELECT COUNT(*) as count FROM users WHERE created_at >= date('now', 'start of month')")?.count || 0;
    const moderationBacklogCount = sqliteClient.get("SELECT COUNT(*) as count FROM reports WHERE status IN ('submitted', 'reviewing')")?.count || 0;
    const mediaSize = sqliteClient.get("SELECT COALESCE(SUM(file_size), 0) as total FROM report_media")?.total || 0;

    // Tính toán tăng trưởng người dùng & hoạt động 4 tháng gần nhất từ CSDL thật
    const userGrowth = [];
    const reportActivity = [];
    for (let i = 3; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = `T${d.getMonth() + 1}`;
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString();

      const uCount = sqliteClient.get("SELECT COUNT(*) as count FROM users WHERE created_at < ?", [endOfMonth])?.count || 0;
      userGrowth.push({ month: monthStr, users: uCount });

      const rCount = sqliteClient.get("SELECT COUNT(*) as count FROM reports WHERE created_at >= ? AND created_at < ?", [startOfMonth, endOfMonth])?.count || 0;
      const cCount = sqliteClient.get("SELECT COUNT(*) as count FROM cases WHERE created_at >= ? AND created_at < ?", [startOfMonth, endOfMonth])?.count || 0;
      reportActivity.push({ month: monthStr, reports: rCount, cases: cCount });
    }

    return {
      stats: {
        totalUsers,
        newUsersThisMonth,
        totalReports,
        activeCases,
        resolvedCases,
        storageUsageBytes: Number(mediaSize),
        moderationBacklogCount
      },
      charts: {
        userGrowth,
        reportActivity
      }
    };
  }
}
