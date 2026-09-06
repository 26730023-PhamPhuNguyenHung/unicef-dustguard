import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CaseDto } from '@dustguard/shared';

interface LeafletMapProps {
  cases?: CaseDto[] | any[];
  selectedLocation?: { lat: number; lng: number } | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  onMarkerClick?: (c: any) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  cases = [],
  selectedLocation,
  onLocationSelect,
  center = [21.0205, 105.8078], // 62 Nguyễn Chí Thanh, Hà Nội (SSOT Origin)
  zoom = 14,
  height = '450px',
  onMarkerClick
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true
      });

      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      });
      tileLayer.on('tileerror', () => {});
      tileLayer.addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      if (onLocationSelect) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          onLocationSelect(e.latlng.lat, e.latlng.lng);
        });
      }
    }

    return () => {
      // Dọn dẹp map khi unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Cập nhật marker
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Vẽ các case markers
    cases.forEach((c) => {
      if (!c.latitude || !c.longitude) return;

      const isUrgent = c.priority === 'urgent';
      const markerColor = isUrgent ? '#9F241F' : '#B45309';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: ${markerColor};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: bold;
          ">
            ${c.signal_count || c.signalCount || 1}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([c.latitude, c.longitude], { icon: customIcon });

      const popupContent = `
        <div style="min-width: 180px; font-family: sans-serif;">
          <div style="font-size: 11px; color: #9F241F; font-weight: bold; margin-bottom: 2px;">
            ${c.case_code || c.caseCode}
          </div>
          <div style="font-size: 13px; font-weight: bold; color: #171313; margin-bottom: 4px;">
            ${c.title}
          </div>
          <div style="font-size: 11px; color: #5C5550; margin-bottom: 8px;">
            ${c.address}
          </div>
          <a href="/cases/${c.id}" style="
            display: inline-block;
            background: #9F241F;
            color: white;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            text-decoration: none;
            font-weight: 600;
          ">
            Xem vụ việc
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(c));
      }

      markersLayerRef.current?.addLayer(marker);
    });

    // 2. Vẽ marker đã chọn (nếu có)
    if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
      const isDraggable = Boolean(onLocationSelect);

      // Icon dạng giọt nước chuẩn bản đồ với mũi nhọn chỉ chuẩn xác tọa độ
      const selectIcon = L.divIcon({
        className: 'custom-selected-pin',
        html: `
          <div style="position: relative; width: 32px; height: 42px; cursor: ${isDraggable ? 'grab' : 'default'};">
            <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 5px rgba(0,0,0,0.35));">
              <path d="M16 0C7.163 0 0 7.163 0 16C0 26.5 14.5 40.5 15.15 41.13C15.61 41.58 16.39 41.58 16.85 41.13C17.5 40.5 32 26.5 32 16C32 7.163 24.837 0 16 0Z" fill="#B51F24"/>
              <circle cx="16" cy="15" r="7" fill="white"/>
              <circle cx="16" cy="15" r="4.5" fill="#B51F24"/>
            </svg>
            ${isDraggable ? `
              <div style="
                position: absolute;
                bottom: -2px;
                left: 50%;
                transform: translateX(-50%);
                width: 14px;
                height: 4px;
                background: rgba(0,0,0,0.25);
                border-radius: 50%;
                filter: blur(1px);
              "></div>
            ` : ''}
          </div>
        `,
        iconSize: [32, 42],
        iconAnchor: [16, 42], // Mũi nhọn ở đáy chính giữa
        popupAnchor: [0, -42]
      });

      const selMarker = L.marker([selectedLocation.lat, selectedLocation.lng], {
        icon: selectIcon,
        draggable: isDraggable
      });

      if (isDraggable) {
        selMarker.bindTooltip('Kéo ghim để chỉnh vị trí chính xác', {
          direction: 'top',
          offset: [0, -42],
          opacity: 0.95
        });

        selMarker.on('dragend', (e: any) => {
          const latlng = e.target.getLatLng();
          if (onLocationSelect) {
            onLocationSelect(Number(latlng.lat.toFixed(6)), Number(latlng.lng.toFixed(6)));
          }
        });
      } else {
        selMarker.bindPopup('<div style="font-weight: bold; font-size: 12px; color: #171313;">Vị trí quan sát</div>');
      }

      markersLayerRef.current.addLayer(selMarker);

      // Tự động căn giữa bản đồ theo tọa độ chọn
      try {
        const currentZoom = mapInstanceRef.current.getZoom();
        const targetZoom = currentZoom < 14 ? 15 : currentZoom;
        mapInstanceRef.current.flyTo([selectedLocation.lat, selectedLocation.lng], targetZoom, {
          duration: 0.6
        });
      } catch {
        // Safe fallback
      }
    }
  }, [cases, selectedLocation]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%' }}
      className="border border-border-subtle rounded-civic shadow-sm overflow-hidden z-0"
    />
  );
};
