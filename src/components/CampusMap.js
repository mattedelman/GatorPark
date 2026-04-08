import React, { useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

function getColor(available, total) {
  const ratio = available / total;
  if (ratio <= 0) return { main: '#6B7280', bg: '#F3F4F6' };
  if (ratio < 0.1) return { main: '#EF4444', bg: '#FEE2E2' };
  if (ratio < 0.35) return { main: '#F59E0B', bg: '#FEF3C7' };
  return { main: '#22C55E', bg: '#DCFCE7' };
}

function buildHTML(garages, region) {
  const markers = garages.map((g) => {
    const c = getColor(g.availableSpaces, g.totalSpaces);
    const spotsText = g.availableSpaces <= 0 ? 'Full' : `${g.availableSpaces} spots`;
    return `{
      lat: ${g.latitude}, lng: ${g.longitude},
      id: "${g.id}", name: "${g.shortName}",
      spots: "${spotsText}", color: "${c.main}", bg: "${c.bg}"
    }`;
  }).join(',\n      ');

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; }
    html, body, #map { width: 100%; height: 100%; }
    .marker-pin {
      display: flex; align-items: center; gap: 6px;
      background: #fff; border-radius: 14px;
      padding: 6px 10px 6px 7px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
      border: 1px solid #eee;
      cursor: pointer;
      white-space: nowrap;
      transition: transform 0.15s ease;
    }
    .marker-pin:hover { transform: scale(1.05); }
    .marker-icon {
      width: 32px; height: 32px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 15px; font-family: system-ui;
      flex-shrink: 0;
    }
    .marker-info { display: flex; flex-direction: column; }
    .marker-name {
      font-size: 11px; font-weight: 800; color: #1A1A2E;
      font-family: system-ui; line-height: 1.2;
    }
    .marker-spots {
      font-size: 10px; font-weight: 700;
      font-family: system-ui; line-height: 1.2; margin-top: 1px;
    }
    .marker-arrow {
      width: 12px; height: 12px; background: #fff;
      border-right: 1px solid #eee; border-bottom: 1px solid #eee;
      transform: rotate(45deg);
      position: absolute; bottom: -7px; left: calc(50% - 6px);
      box-shadow: 2px 2px 4px rgba(0,0,0,0.06);
    }
    .marker-wrap {
      position: relative; display: inline-block;
    }
    .leaflet-popup-close-button { display: none !important; }
    .leaflet-control-attribution { font-size: 8px !important; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      center: [${region.latitude}, ${region.longitude}],
      zoom: 14, zoomControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19
    }).addTo(map);

    var garages = [${markers}];
    var markerLayer = L.layerGroup().addTo(map);

    function renderMarkers(data) {
      markerLayer.clearLayers();
      data.forEach(function(g) {
        var html = '<div class="marker-wrap">' +
          '<div class="marker-pin" onclick="onTap(\\''+g.id+'\\')">'+
            '<div class="marker-icon" style="background:'+g.bg+';color:'+g.color+'">P</div>'+
            '<div class="marker-info">'+
              '<div class="marker-name">'+g.name+'</div>'+
              '<div class="marker-spots" style="color:'+g.color+'">'+g.spots+'</div>'+
            '</div>'+
          '</div>'+
          '<div class="marker-arrow"></div>'+
        '</div>';

        var icon = L.divIcon({
          html: html,
          className: '',
          iconSize: [110, 56],
          iconAnchor: [55, 56]
        });

        L.marker([g.lat, g.lng], { icon: icon }).addTo(markerLayer);
      });
    }

    renderMarkers(garages);

    function onTap(id) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerPress', id: id }));
    }

    window.updateMarkers = function(data) {
      renderMarkers(data);
    };

    document.addEventListener('message', function(e) {
      try {
        var msg = JSON.parse(e.data);
        if (msg.type === 'updateMarkers') renderMarkers(msg.garages);
        if (msg.type === 'focusGarage') {
          map.setView([msg.lat, msg.lng], 16, { animate: true });
        }
      } catch(err) {}
    });
    window.addEventListener('message', function(e) {
      try {
        var msg = JSON.parse(e.data);
        if (msg.type === 'updateMarkers') renderMarkers(msg.garages);
        if (msg.type === 'focusGarage') {
          map.setView([msg.lat, msg.lng], 16, { animate: true });
        }
      } catch(err) {}
    });
  </script>
</body>
</html>`;
}

export default function CampusMap({ mapRef, region, garages, onMarkerPress, style }) {
  const webRef = useRef(null);

  const garageData = useMemo(() => garages.map((g) => {
    const c = getColor(g.availableSpaces, g.totalSpaces);
    return {
      lat: g.latitude, lng: g.longitude,
      id: g.id, name: g.shortName,
      spots: g.availableSpaces <= 0 ? 'Full' : `${g.availableSpaces} spots`,
      color: c.main, bg: c.bg,
    };
  }), [garages]);

  useEffect(() => {
    if (webRef.current) {
      webRef.current.postMessage(JSON.stringify({
        type: 'updateMarkers',
        garages: garageData,
      }));
    }
  }, [garageData]);

  if (mapRef) {
    mapRef.current = {
      animateToRegion: (r) => {
        if (webRef.current) {
          webRef.current.postMessage(JSON.stringify({
            type: 'focusGarage',
            lat: r.latitude,
            lng: r.longitude,
          }));
        }
      },
    };
  }

  const html = useMemo(() => buildHTML(garages, region), []);

  const handleMessage = (event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'markerPress') {
        const garage = garages.find((g) => g.id === msg.id);
        if (garage && onMarkerPress) onMarkerPress(garage);
      }
    } catch (e) {}
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webRef}
        source={{ html }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1, backgroundColor: 'transparent' },
});
