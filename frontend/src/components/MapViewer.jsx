// src/components/MapViewer.jsx

import React from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polygon, 
  useMap      
} from 'react-leaflet';

function ChangeView({ bounds }) {
  const map = useMap(); // Pega a instância do mapa
  if (bounds) {
    map.fitBounds(bounds, { padding: [50, 50] });
  } // Voa para os limites do polígono, instantaneo map.fitBounds(bounds, { padding: [50, 50] });
  return null;
}



export default function MapViewer({ selectedFlight }) {
  // Posição inicial do mapa (ex: centro do Brasil)
  const defaultPosition = [-23.18677, -45.86346];

  let polygonCoords = null;
  let polygonBounds = null;

  if (selectedFlight) {
    // 6. Se um voo foi selecionado, parseamos seu polígono
    const parsedPolygon = JSON.parse(selectedFlight.polygonJson);
    
    // 7. Convertemos de {lat, lng} para [lat, lng] (que o Leaflet usa)
    polygonCoords = parsedPolygon.map(p => [p.lat, p.lng]);
    
    // 8. Definimos os limites para o zoom
    polygonBounds = polygonCoords;
  }

  return (
    <MapContainer 
      center={defaultPosition} 
      zoom={4} 
      style={{ height: '100%', width: '100%' }}
      zoomSnap={0.1}
      zoomDelta={0.5}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {!selectedFlight ? (
        // Se nenhum voo estiver selecionado, mostra o marcador padrão
        <Marker position={defaultPosition}>
          <Popup>Centro do Brasil</Popup>
        </Marker>
      ) : (
        // Se um voo ESTIVER selecionado:
        <>
          <Polygon 
            pathOptions={{ color: '#016C72' }} // Cor Primária ROWER
            positions={polygonCoords} 
          />
          <ChangeView bounds={polygonBounds} />
        </>
      )}
    </MapContainer>
  );
}

