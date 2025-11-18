import { useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polygon,
  FeatureGroup 
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

export default function MapViewer({ selectedFlight, onMapReady, onPolygonDrawn, clearPolygonKey }) {
  const featureGroupRef = useRef();

  const defaultPosition = [-23.203050020264428, -45.87430194541117];
  
  let polygonCoords = null;
  if (selectedFlight) {
    const parsedPolygon = JSON.parse(selectedFlight.polygonJson);
    polygonCoords = parsedPolygon.map(p => [p.lat, p.lng]);
  }

  //Função que é chamada quando o usuário TERMINA de desenhar
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
              allowIntersection: false, 
              shapeOptions: {
                color: '#ECB733'
              }
            }
          }}
          edit={{
            edit: false,
            remove: false
          }} 
        />
      </FeatureGroup>

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
};
