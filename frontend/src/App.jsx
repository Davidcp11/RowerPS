import React, { useState, useEffect } from 'react'; // 1. Importe useEffect
import axios from 'axios'; // 2. Importe axios
import MapViewer from './components/MapViewer';
import FlightList from './components/FlightList';
import FlightForm from './components/FlightForm';



function App() {
  // --- Estados do 'Filho' (FlightList) movidos para o 'Pai' (App) ---
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // -----------------------------------------------------------------

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  // 3. Crie a função de busca de voos aqui
  const fetchFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/flights');
      setFlights(response.data);
    } catch (err) {
      setError('Não foi possível carregar os voos.');
      console.error('Erro ao buscar voos:', err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Use o useEffect para buscar os voos na inicialização
  useEffect(() => {
    fetchFlights();
  }, []); // O array vazio [] garante que rode só uma vez

  // Função de seleção de voo (sem alteração)
  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    if (mapInstance) {
      const parsedPolygon = JSON.parse(flight.polygonJson);
      const polygonBounds = parsedPolygon.map(p => [p.lat, p.lng]);
      mapInstance.fitBounds(polygonBounds, { padding: [50, 50] });
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Gerenciador de Voos ROWER</h1>
      </header>

      <main className="app-main">
        <div className="list-panel">
          <FlightForm />
          {/* 5. Passe os dados dos voos (loading, error, flights) para o FlightList */}
          <FlightList 
            loading={loading}
            error={error}
            flights={flights}
            onFlightSelect={handleFlightSelect} 
          />
        </div>

        <div className="map-panel">
          <MapViewer 
            selectedFlight={selectedFlight}
            onMapReady={setMapInstance} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;