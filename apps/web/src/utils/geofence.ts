/**
 * Tiện ích kiểm định vị trí địa lý & Geofence Buffer 50m cho DustGuard VN
 * Dùng để xác thực nhà thầu hoặc tình nguyện viên có mặt trực tiếp tại công trường.
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeofenceResult {
  valid: boolean;
  within50m: boolean;
  distanceMeters: number;
  allowedBufferMeters: number;
  matchStatus: 'VALID_50M_BUFFER' | 'NEARBY_WARNING' | 'OUT_OF_BOUNDS';
  message: string;
}

/**
 * Tính khoảng cách Haversine giữa 2 tọa độ GPS theo mét
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Infinity;
  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return Infinity;

  const R = 6371000; // Bán kính Trái Đất (mét)
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Đánh giá tính hợp lệ của Geofence Buffer (mặc định 50m)
 */
export function evaluateGeofenceBuffer(
  contractorCoords: Coordinates | null | undefined,
  siteCoords: Coordinates | null | undefined,
  bufferMeters: number = 50
): GeofenceResult {
  if (!contractorCoords || !siteCoords) {
    return {
      valid: false,
      within50m: false,
      distanceMeters: Infinity,
      allowedBufferMeters: bufferMeters,
      matchStatus: 'OUT_OF_BOUNDS',
      message: 'Chưa xác định được tọa độ công trình hoặc tọa độ thiết bị của bạn.',
    };
  }

  const distance = calculateHaversineDistance(
    contractorCoords.lat,
    contractorCoords.lng,
    siteCoords.lat,
    siteCoords.lng
  );

  const valid = distance <= bufferMeters;

  let matchStatus: 'VALID_50M_BUFFER' | 'NEARBY_WARNING' | 'OUT_OF_BOUNDS' = 'OUT_OF_BOUNDS';
  let message = '';

  if (valid) {
    matchStatus = 'VALID_50M_BUFFER';
    message = `Vị trí hợp lệ: Cách công trình ${distance}m (Trong bán kính quy chuẩn ${bufferMeters}m).`;
  } else if (distance <= bufferMeters * 2) {
    matchStatus = 'NEARBY_WARNING';
    message = `Vị trí cảnh báo: Cách công trình ${distance}m (Vượt quá bán kính ${bufferMeters}m).`;
  } else {
    matchStatus = 'OUT_OF_BOUNDS';
    message = `Vị trí ngoài phạm vi: Cách công trình ${distance}m. Vui lòng nộp minh chứng tại hiện trường công trình.`;
  }

  return {
    valid,
    within50m: valid,
    distanceMeters: distance,
    allowedBufferMeters: bufferMeters,
    matchStatus,
    message,
  };
}
