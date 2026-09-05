import { SensorQualityMetric } from '../types.js';

export interface RawReading {
  id?: string;
  recorded_at: string;
  pm25: number;
  pm10?: number;
  temperature?: number;
  humidity?: number;
}

export class SensorQualityEngine {
  /**
   * Đánh giá chất lượng chuỗi đo cảm biến môi trường
   */
  public static evaluateDeviceReadings(
    deviceId: string,
    readings: RawReading[]
  ): SensorQualityMetric {
    if (!readings || readings.length === 0) {
      return {
        deviceId,
        packetCount: 0,
        flatlineDetected: false,
        extremeSpikeDetected: false,
        madOutlierCount: 0,
        temporalLagSeconds: 0,
        qualityScore: 0,
        status: 'INVALID',
        reasons: ['Không có gói tin quan trắc nào từ cảm biến này.'],
      };
    }

    const reasons: string[] = [];
    const values = readings.map(r => r.pm25).filter(v => typeof v === 'number' && !isNaN(v));

    if (values.length === 0) {
      return {
        deviceId,
        packetCount: readings.length,
        flatlineDetected: false,
        extremeSpikeDetected: false,
        madOutlierCount: 0,
        temporalLagSeconds: 0,
        qualityScore: 0,
        status: 'INVALID',
        reasons: ['Tất cả giá trị đo PM2.5 đều không hợp lệ.'],
      };
    }

    // 1. Flatline Check: 4 hoặc nhiều hơn các giá trị liên tiếp giống hệt nhau
    let flatlineDetected = false;
    let consecutiveCount = 1;
    for (let i = 1; i < values.length; i++) {
      if (Math.abs(values[i] - values[i - 1]) < 0.001) {
        consecutiveCount++;
        if (consecutiveCount >= 4) {
          flatlineDetected = true;
          break;
        }
      } else {
        consecutiveCount = 1;
      }
    }
    if (flatlineDetected) {
      reasons.push('Phát hiện hiện tượng treo cảm biến (Flatline) với chuỗi số liệu bất biến liên tục.');
    }

    // 2. Extreme Spike Check: Thay đổi đột ngột > 250 µg/m³ trong 1 bước nhảy
    let extremeSpikeDetected = false;
    for (let i = 1; i < values.length; i++) {
      const delta = Math.abs(values[i] - values[i - 1]);
      if (delta > 250) {
        extremeSpikeDetected = true;
        break;
      }
    }
    if (extremeSpikeDetected) {
      reasons.push('Phát hiện đỉnh đột biến cực đoan bất thường (> 250 µg/m³ trong 1 chu kỳ).');
    }

    // 3. Outlier Check bằng Median Absolute Deviation (MAD)
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const absDeviations = sorted.map(v => Math.abs(v - median)).sort((a, b) => a - b);
    const mad = absDeviations[Math.floor(absDeviations.length / 2)] || 1;

    let madOutlierCount = 0;
    for (const v of values) {
      const z = (0.6745 * Math.abs(v - median)) / mad;
      if (z > 3.5) {
        madOutlierCount++;
      }
    }
    if (madOutlierCount > 0) {
      reasons.push(`Ghi nhận ${madOutlierCount} mẫu dữ liệu ngoại lai thống kê bất thường.`);
    }

    // 4. Temporal Lag Check (Độ trễ gói tin cuối)
    const latestTime = new Date(readings[0].recorded_at).getTime();
    const now = Date.now();
    const temporalLagSeconds = Math.max(0, Math.floor((now - latestTime) / 1000));
    if (temporalLagSeconds > 7200) {
      // Trễ hơn 2 tiếng
      reasons.push(`Dữ liệu cảm biến bị gián đoạn truyền tin, độ trễ ${Math.round(temporalLagSeconds / 3600)} giờ.`);
    }

    // 5. Tính toán Quality Score (0..100)
    let score = 100;
    if (flatlineDetected) score -= 40;
    if (extremeSpikeDetected) score -= 25;
    score -= Math.min(20, madOutlierCount * 5);
    if (temporalLagSeconds > 7200) score -= 15;
    score = Math.max(0, Math.min(100, score));

    let status: 'OPTIMAL' | 'DEGRADED' | 'SUSPICIOUS' | 'INVALID' = 'OPTIMAL';
    if (score < 30 || flatlineDetected) {
      status = 'INVALID';
    } else if (score < 60) {
      status = 'SUSPICIOUS';
    } else if (score < 85) {
      status = 'DEGRADED';
    }

    return {
      deviceId,
      packetCount: readings.length,
      flatlineDetected,
      extremeSpikeDetected,
      madOutlierCount,
      temporalLagSeconds,
      qualityScore: score,
      status,
      reasons,
    };
  }
}
