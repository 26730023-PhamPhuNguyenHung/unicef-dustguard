/**
 * Utility bàn giao vụ việc có trách nhiệm từ Community (Side A) sang Operations (Side B)
 * Chuẩn kết nối: POST http://localhost:4000/api/integrations/community/cases
 */

interface CommunityCasePayload {
  id: string;
  case_code?: string;
  caseCode?: string;
  title: string;
  summary?: string;
  address?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  signal_count?: number;
  confirmationCount?: number;
}

export async function forwardCaseToOperations(caseData: CommunityCasePayload): Promise<{ success: boolean; data?: any; error?: string }> {
  const operationsUrl = process.env.OPERATIONS_API_URL || 'http://localhost:4000/api/integrations/community/cases';

  const payload = {
    external_case_id: caseData.id,
    case_code: caseData.case_code || caseData.caseCode,
    title: caseData.title,
    summary: caseData.summary || 'Hồ sơ chuyển giao từ Cộng đồng DustGuard VN',
    location_text: caseData.address || `${caseData.district || 'TP.HCM'}, Việt Nam`,
    district: caseData.district || 'TP.HCM',
    latitude: caseData.latitude ?? 10.7769,
    longitude: caseData.longitude ?? 106.7009,
    report_count: caseData.signal_count || 1,
    confirmation_count: caseData.confirmationCount || 0
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout

    const res = await fetch(operationsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      console.log(`[Handoff Success] Đã bàn giao vụ việc ${payload.case_code} sang Operations:`, data);
      return { success: true, data };
    } else {
      const errText = await res.text().catch(() => 'Unknown error');
      console.warn(`[Handoff Warning] Operations trả mã lỗi ${res.status}:`, errText);
      return { success: false, error: errText };
    }
  } catch (err: any) {
    // Graceful logging: Operations server có thể chưa bật ở môi trường dev cục bộ
    console.info(`[Handoff Info] Không thể kết nối tới Operations Service (${operationsUrl}): ${err.message}. Hồ sơ đã được lưu cục bộ an toàn.`);
    return { success: false, error: err.message };
  }
}
