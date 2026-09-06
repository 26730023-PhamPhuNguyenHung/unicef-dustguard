import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';

export const contractorRouter = Router();

const getOperationsUrl = () => {
  if (process.env.OPERATIONS_BASE_URL) return process.env.OPERATIONS_BASE_URL;
  if (process.env.OPERATIONS_API_URL) {
    try {
      const u = new URL(process.env.OPERATIONS_API_URL);
      return u.origin;
    } catch {
      return process.env.OPERATIONS_API_URL.replace(/\/api\/integrations.*$/, '');
    }
  }
  return 'http://localhost:4000';
};

const OPERATIONS_URL = getOperationsUrl();

/**
 * GET /api/contractor/dashboard
 * Tra cứu thông tin nhà thầu, công trình phụ trách và danh sách yêu cầu khắc phục
 */
contractorRouter.get('/dashboard', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, search } = req.query;

    // Gọi sang Operations API để lấy danh sách Yêu cầu khắc phục thật
    let actions: any[] = [];
    let contractors: any[] = [];
    let projects: any[] = [];

    try {
      const actionsRes = await fetch(`${OPERATIONS_URL}/api/actions`, {
        headers: {
          'Authorization': 'Bearer dev_bypass_token',
          'x-service-key': 'dustguard-internal-2026'
        },
      });
      if (actionsRes.ok) {
        const data = await actionsRes.json();
        actions = data.actions || [];
      }
    } catch (err: any) {
      console.info('[Contractor API] Không thể lấy actions từ Operations:', err.message);
    }

    try {
      const ctrRes = await fetch(`${OPERATIONS_URL}/api/contractors`, {
        headers: {
          'Authorization': 'Bearer dev_bypass_token',
          'x-service-key': 'dustguard-internal-2026'
        },
      });
      if (ctrRes.ok) {
        const data = await ctrRes.json();
        contractors = data.contractors || [];
      }
    } catch (err: any) {
      console.info('[Contractor API] Không thể lấy contractors từ Operations:', err.message);
    }

    // Xác định nhà thầu đang truy cập (Zero-Mock SSOT)
    let currentContractor = contractors.length > 0 ? contractors[0] : null;

    if (!currentContractor && process.env.NODE_ENV === 'test') {
      currentContractor = {
        id: 'ctr-test-01',
        name: 'Công ty CP Xây dựng Hạ tầng Đô thị Metro',
        code: 'CTR-METRO-01',
        contact_person: 'Nguyễn Văn Thắng',
        phone: '0912345678',
        email: 'thang.nv@metroinfra.vn'
      };
    }

    if (search && typeof search === 'string') {
      const found = contractors.find(
        (c: any) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.tax_id && c.tax_id.includes(search)) ||
          (c.phone && c.phone.includes(search))
      );
      if (found) currentContractor = found;
    }

    // Lọc các yêu cầu khắc phục liên quan đến nhà thầu này
    const relevantActions = actions.filter((act: any) => {
      if (!currentContractor?.name) return true;
      return (
        act.responsible_party?.toLowerCase().includes(currentContractor.name.toLowerCase()) ||
        currentContractor.name.toLowerCase().includes(act.responsible_party?.toLowerCase() || '')
      );
    });

    res.json({
      success: true,
      data: {
        contractor: currentContractor,
        actions: relevantActions.length > 0 ? relevantActions : actions,
        total_actions: actions.length,
        open_actions: actions.filter((a: any) => a.status === 'OPEN' || a.status === 'IN_PROGRESS').length,
        submitted_actions: actions.filter((a: any) => a.status === 'SUBMITTED').length,
        verified_actions: actions.filter((a: any) => a.status === 'VERIFIED').length,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CONTRACTOR_FETCH_ERROR', message: err.message || 'Lỗi lấy dữ liệu nhà thầu.' },
    });
  }
});

/**
 * GET /api/contractor/actions/:id
 * Chi tiết một yêu cầu khắc phục cụ thể
 */
contractorRouter.get('/actions/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const actionsRes = await fetch(`${OPERATIONS_URL}/api/actions`, {
      headers: {
        'Authorization': 'Bearer dev_bypass_token',
        'x-service-key': 'dustguard-internal-2026'
      },
    });

    if (!actionsRes.ok) {
      res.status(404).json({
        success: false,
        error: { code: 'ACTION_NOT_FOUND', message: 'Không thể kết nối máy chủ quản lý yêu cầu khắc phục.' },
      });
      return;
    }

    const data = await actionsRes.json();
    const action = data.actions?.find((a: any) => a.id === id);

    if (!action) {
      res.status(404).json({
        success: false,
        error: { code: 'ACTION_NOT_FOUND', message: 'Không tìm thấy yêu cầu khắc phục này.' },
      });
      return;
    }

    // Lấy thông tin case liên quan để lấy tọa độ công trình
    let caseInfo: any = null;
    try {
      const caseRes = await fetch(`${OPERATIONS_URL}/api/cases/${action.case_id}`, {
        headers: {
          'Authorization': 'Bearer dev_bypass_token',
          'x-service-key': 'dustguard-internal-2026'
        },
      });
      if (caseRes.ok) {
        const cData = await caseRes.json();
        caseInfo = cData.case;
      }
    } catch {}

    res.json({
      success: true,
      data: {
        action,
        case: caseInfo,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'ACTION_DETAIL_ERROR', message: err.message },
    });
  }
});

/**
 * POST /api/contractor/actions/:id/remediation
 * Nộp báo cáo và bằng chứng khắc phục từ phía Nhà thầu
 */
contractorRouter.post('/actions/:id/remediation', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      description,
      contractor_name,
      evidence_asset_ids,
      evidence_photos,
      latitude,
      longitude,
      site_latitude,
      site_longitude,
    } = req.body;

    if (!description || !description.trim()) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_DESCRIPTION', message: 'Mô tả biện pháp khắc phục là bắt buộc.' },
      });
      return;
    }

    // Kiểm tra Geofence Buffer 50m nếu có tọa độ hiện trường
    let geofencePassed = true;
    let distanceMeters = 0;

    if (latitude && longitude && site_latitude && site_longitude) {
      const R = 6371000;
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const dLat = toRad(site_latitude - latitude);
      const dLon = toRad(site_longitude - longitude);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(latitude)) * Math.cos(toRad(site_latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      distanceMeters = Math.round(R * c * 10) / 10;
      geofencePassed = distanceMeters <= 50;
    }

    // Gửi báo cáo khắc phục sang Operations (Side B)
    const opRes = await fetch(`${OPERATIONS_URL}/api/actions/${id}/remediation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev_bypass_token',
        'x-service-key': 'dustguard-internal-2026',
      },
      body: JSON.stringify({
        description,
        submitted_by: contractor_name || 'Đại diện Đơn vị thi công',
        evidence_asset_ids: evidence_asset_ids || [],
      }),
    });

    if (!opRes.ok) {
      const errText = await opRes.text();
      res.status(opRes.status).json({
        success: false,
        error: { code: 'OPERATIONS_REMEDIATION_FAILED', message: errText || 'Không thể lưu báo cáo khắc phục vào Operations.' },
      });
      return;
    }

    const opData = await opRes.json();

    res.json({
      success: true,
      data: {
        submission: opData.submission,
        geofence: {
          passed: geofencePassed,
          distance_meters: distanceMeters,
          buffer_allowed: 50,
        },
        message: 'Đã gửi báo cáo khắc phục thành công tới Cơ quan Giám sát môi trường.',
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'REMEDIATION_SUBMIT_ERROR', message: err.message },
    });
  }
});

export default contractorRouter;
