import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

function getColor(available, total) {
  const ratio = available / total;
  if (ratio <= 0) return { main: '#6B7280', bg: '#F3F4F6' };
  if (ratio < 0.1) return { main: '#EF4444', bg: '#FEE2E2' };
  if (ratio < 0.35) return { main: '#F59E0B', bg: '#FEF3C7' };
  return { main: '#22C55E', bg: '#DCFCE7' };
}

export default function CampusMap({ mapRef, region, garages, onMarkerPress, style }) {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerLayerRef = useRef(null);
  const garagesRef = useRef(garages);
  garagesRef.current = garages;
  const onMarkerPressRef = useRef(onMarkerPress);
  onMarkerPressRef.current = onMarkerPress;

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => initMap();
    document.head.appendChild(script);

    function initMap() {
      if (!containerRef.current || mapInstanceRef.current) return;
      const L = window.L;
      const map = L.map(containerRef.current, {
        center: [region.latitude, region.longitude],
        zoom: 14,
        zoomControl: false,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      markerLayerRef.current = L.layerGroup().addTo(map);
      renderMarkers();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  function renderMarkers() {
    const L = window.L;
    if (!markerLayerRef.current || !L) return;
    markerLayerRef.current.clearLayers();

    garagesRef.current.forEach((g) => {
      const c = getColor(g.availableSpaces, g.totalSpaces);
      const spotsText = g.availableSpaces <= 0 ? 'Full' : `${g.availableSpaces} spots`;
      const html = `<div style="position:relative;display:inline-block;">
        <div style="display:flex;align-items:center;gap:6px;background:#fff;border-radius:14px;padding:6px 10px 6px 7px;box-shadow:0 2px 10px rgba(0,0,0,0.15);border:1px solid #eee;cursor:pointer;white-space:nowrap;">
          <div style="width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:15px;background:${c.bg};color:${c.main};font-family:system-ui;flex-shrink:0;">P</div>
          <div style="display:flex;flex-direction:column;">
            <div style="font-size:11px;font-weight:800;color:#1A1A2E;font-family:system-ui;line-height:1.2;">${g.shortName}</div>
            <div style="font-size:10px;font-weight:700;color:${c.main};font-family:system-ui;line-height:1.2;margin-top:1px;">${spotsText}</div>
          </div>
        </div>
        <div style="width:12px;height:12px;background:#fff;border-right:1px solid #eee;border-bottom:1px solid #eee;transform:rotate(45deg);position:absolute;bottom:-7px;left:calc(50% - 6px);box-shadow:2px 2px 4px rgba(0,0,0,0.06);"></div>
      </div>`;

      const icon = L.divIcon({
        html,
        className: '',
        iconSize: [110, 56],
        iconAnchor: [55, 56],
      });

      L.marker([g.latitude, g.longitude], { icon })
        .addTo(markerLayerRef.current)
        .on('click', () => {
          const fresh = garagesRef.current.find((x) => x.id === g.id);
          if (fresh && onMarkerPressRef.current) onMarkerPressRef.current(fresh);
        });
    });
  }

  useEffect(() => {
    renderMarkers();
  }, [garages]);

  if (mapRef) {
    mapRef.current = {
      animateToRegion: (r) => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([r.latitude, r.longitude], 16, { animate: true });
        }
      },
    };
  }

  return (
    <View style={[styles.container, style]}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
