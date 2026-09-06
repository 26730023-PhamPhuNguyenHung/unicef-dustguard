import { get } from '../../db/connection.js';

/**
 * syncCaseToCommunity — Đồng bộ hai chiều từ Side B (Operations) sang Side A (Community)
 * Gọi tự động khi trạng thái vụ việc, thanh tra, yêu cầu khắc phục hoặc đóng hồ sơ thay đổi.
 */
export async function syncCaseToCommunity(
  caseId: string,
  extraData: {
    status_label?: string;
    stage?: string;
    actor_name?: string;
    contractor_name?: string;
    description?: string;
    remediation_status?: string;
    findings_summary?: string;
    closure_note?: string;
  } = {}
): Promise<{ success: boolean; error?: string }> {
  try {
    const targetCase = get<any>(`SELECT * FROM cases WHERE id = ?`, [caseId]);
    if (!targetCase) return { success: false, error: 'Case not found' };

    // Chỉ đồng bộ nếu vụ việc có nguồn gốc từ Cộng đồng hoặc có mã tham chiếu ngoài
    if (targetCase.source !== 'COMMUNITY' || !targetCase.source_reference) {
      return { success: true };
    }

    const communitySyncUrl =
      process.env.COMMUNITY_SYNC_URL || 'http://localhost:3001/api/integrations/operations/sync';

    const payload = {
      external_case_id: targetCase.source_reference,
      operations_case_id: targetCase.id,
      operations_case_code: targetCase.case_code,
      status: targetCase.status,
      contractor_name: targetCase.contractor_name,
      ...extraData,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(communitySyncUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-service-key': process.env.INTEGRATION_SERVICE_KEY || 'dustguard-internal-2026',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    }).catch((err) => {
      console.info(`[Sync Info] Không thể kết nối tới Community (${communitySyncUrl}): ${err.message}`);
      return null;
    });

    clearTimeout(timeout);

    if (res && res.ok) {
      console.log(`[Cross-Side Sync Success] Đã đồng bộ vụ việc ${targetCase.case_code} sang Community.`);
      return { success: true };
    }

    return { success: false, error: 'Community sync request failed or timed out' };
  } catch (err: any) {
    console.warn(`[Cross-Side Sync Warning] Lỗi đồng bộ:`, err.message);
    return { success: false, error: err.message };
  }
}
