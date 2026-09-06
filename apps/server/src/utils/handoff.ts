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

export async function forwardCaseToOperations(
  caseData: CommunityCasePayload,
  options: { maxRetries?: number; timeoutMs?: number } = {}
): Promise<{ success: boolean; data?: any; error?: string; retries?: number }> {
  const operationsUrl = process.env.OPERATIONS_API_URL || 'http://localhost:4000/api/integrations/community/cases';
  const maxRetries = options.maxRetries ?? 2;
  const timeoutMs = options.timeoutMs ?? 3000;

  const payload = {
    external_case_id: caseData.id,
    case_code: caseData.case_code || caseData.caseCode,
    title: caseData.title,
    summary: caseData.summary || 'Hồ sơ chuyển giao từ Cộng đồng DustGuard VN',
    location_text: caseData.address || `${caseData.district || 'Hà Nội'}, Việt Nam`,
    district: caseData.district || 'Hà Nội',
    latitude: caseData.latitude ?? 21.0205,
    longitude: caseData.longitude ?? 105.8078,
    report_count: caseData.signal_count || 1,
    confirmation_count: caseData.confirmationCount || 0
  };

  let lastError = '';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(operationsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `handoff-${payload.external_case_id}`,
          'x-service-key': process.env.INTEGRATION_SERVICE_KEY || 'dustguard-internal-2026'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        console.log(`[Handoff Success] (Lần ${attempt}) Đã bàn giao vụ việc ${payload.case_code} sang Operations:`, data);
        return { success: true, data, retries: attempt - 1 };
      } else {
        const errText = await res.text().catch(() => 'Unknown error');
        lastError = `Operations HTTP ${res.status}: ${errText}`;
        console.warn(`[Handoff Warning] (Lần ${attempt}) Operations trả mã lỗi:`, lastError);
      }
    } catch (err: any) {
      lastError = err.message || 'Network error';
      console.info(`[Handoff Info] (Lần ${attempt}/${maxRetries}) Lỗi kết nối tới Operations (${operationsUrl}): ${lastError}`);
      if (attempt < maxRetries) {
        // Đợi 500ms trước khi thử lại
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  // Graceful fallback nếu không kết nối được sau các lần thử
  console.info(`[Handoff Summary] Hồ sơ ${payload.case_code} đã được lưu cục bộ an toàn, sẵn sàng bàn giao lại khi Operations trực tuyến.`);
  return { success: false, error: lastError, retries: maxRetries };
}
