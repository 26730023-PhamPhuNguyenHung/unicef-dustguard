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
  center = [10.7769, 106.7009], // Trung tâm TP.HCM
  zoom = 12,
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

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

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
      const markerColor = isUrgent ? '#D92D20' : '#B54708';

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
          <div style="font-size: 11px; color: #D92D20; font-weight: bold; margin-bottom: 2px;">
            ${c.case_code || c.caseCode}
          </div>
          <div style="font-size: 13px; font-weight: bold; color: #101828; margin-bottom: 4px;">
            ${c.title}
          </div>
          <div style="font-size: 11px; color: #667085; margin-bottom: 8px;">
            ${c.address}
          </div>
          <a href="/cases/${c.id}" style="
            display: inline-block;
            background: #D92D20;
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
    if (selectedLocation) {
      const selectIcon = L.divIcon({
        className: 'selected-pin',
        html: `
          <div style="
            background-color: #12B76A;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const selMarker = L.marker([selectedLocation.lat, selectedLocation.lng], { icon: selectIcon });
      selMarker.bindPopup('<b style="font-size: 12px;">Vị trí bạn đã chọn</b>');
      markersLayerRef.current.addLayer(selMarker);
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
