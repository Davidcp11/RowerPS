// src/components/MapViewer.jsx

import React, { useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polygon,
  FeatureGroup // 1. Importe o FeatureGroup
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw'; // 2. Importe o EditControl

// 3. Receba as novas props: 'onPolygonDrawn' e 'clearPolygonKey'
function MapViewer({ selectedFlight, onMapReady, onPolygonDrawn, clearPolygonKey }) {
  const featureGroupRef = useRef();

  const defaultPosition = [-23.203050020264428, -45.87430194541117];
  
  let polygonCoords = null;
  if (selectedFlight) {
    const parsedPolygon = JSON.parse(selectedFlight.polygonJson);
    polygonCoords = parsedPolygon.map(p => [p.lat, p.lng]);
  }

  // 4. Função que é chamada quando o usuário TERMINA de desenhar
  const handlePolygonCreated = (e) => {
    const layer = e.layer;
    const latLngs = layer.getLatLngs()[0] || [];
    
    const coordinates = latLngs.map(latLng => ({
      lat: latLng.lat,
      lng: latLng.lng
    }));
    
    onPolygonDrawn(coordinates);
  };

  const handleDrawStart = () => {
    // 4. Limpa manualmente as camadas ANTES de começar o novo desenho
    // Isso NÃO causa uma re-renderização do React e não cancela o desenho.
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
    }
  };
  
  return (
    <MapContainer 
      center={defaultPosition} 
      zoom={4} 
      style={{ height: '100%', width: '100%' }}
      zoomSnap={0.1}
      zoomDelta={0.25}
      ref={onMapReady}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* 5. FeatureGroup é onde os desenhos vão ficar */}
      <FeatureGroup key={clearPolygonKey} ref={featureGroupRef}>
        <EditControl
          position="topright"
          onCreated={handlePolygonCreated}
          onDrawStart={handleDrawStart}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
            polygon: {
              allowIntersection: false, // Impede polígonos complexos
              shapeOptions: {
                color: '#ECB733' // Cor Secundária ROWER
              }
            }
          }}
          edit={{
            // Desabilitamos a edição e deleção por enquanto
            edit: false,
            remove: false
          }} 
        />
      </FeatureGroup>
      
      {/* Lógica para MOSTRAR o polígono selecionado (sem alteração) */}
      {!selectedFlight ? (
        <Marker position={defaultPosition}>
          <Popup>Casa do Baiano</Popup>
        </Marker>
      ) : (
        <Polygon 
          pathOptions={{ color: '#016C72' }}
          positions={polygonCoords} 
        />
      )}
    </MapContainer>
  );
}

export default MapViewer;