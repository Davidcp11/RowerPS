import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import MapViewer from './components/MapViewer';
import FlightList from './components/FlightList';
import FlightForm from './components/FlightForm';
import Modal from './components/Modal';


import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { rowerTheme } from './config/theme';
// ------------------------------------------

export default function App() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [newPolygonPoints, setNewPolygonPoints] = useState([]);
  const [clearPolygonKey, setClearPolygonKey] = useState(Date.now());
  const [modalData, setModalData] = useState(null);

  const [filters, setFilters] = useState({
    mission: '',
    operatorSarpas: '',
    droneSisant: ''
  });

  const fetchFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/flights', {
        params: filters 
      });
      setFlights(response.data);
    } catch (err) {
      setError('Não foi possível carregar os voos.');
      console.error('Erro ao buscar voos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTimeout = setTimeout(() => {
      fetchFlights();
    }, 500); 

    return () => clearTimeout(fetchTimeout); 
  }, [filters]); 

  const handleFilterChange = (filterName, filterValue) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: filterValue
    }));
  };

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    if (mapInstance) {
      const parsedPolygon = JSON.parse(flight.polygonJson);
      const polygonBounds = parsedPolygon.map(p => [p.lat, p.lng]);
      mapInstance.fitBounds(polygonBounds, { padding: [50, 50] });
    }
  };

  const handlePolygonDrawn = (coordinates) => {
    console.log('Polígono desenhado:', coordinates);
    setNewPolygonPoints(coordinates);
  };
  
  const handleFlightCreated = (newFlight) => {
    fetchFlights();
    setNewPolygonPoints([]);
    setClearPolygonKey(Date.now());
    setModalData(newFlight);
  };

  const handleClearPolygon = () => {
    setNewPolygonPoints([]); 
    setClearPolygonKey(Date.now()); 
  };

  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <ThemeProvider theme={rowerTheme}>
      <CssBaseline />
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br"> 
      <div className="app-container">
        <header className="app-header">
          <img src="/logo-rower.png" alt="Rower Logo" className="header-logo" />
          <h1>Gerenciador de Voos ROWER</h1>
        </header>

        <main className="app-main">
          <div className="list-panel">
            <FlightForm 
              polygonPoints={newPolygonPoints}
              onFlightCreated={handleFlightCreated}
              onClearPolygon={handleClearPolygon}
            />
            <FlightList 
              loading={loading}
              error={error}
              flights={flights}
              onFlightSelect={handleFlightSelect}
              filters={filters}
              onFilterChange={handleFilterChange}
              selectedFlightId={selectedFlight?.id}
            />
          </div>

          <div className="map-panel">
            <MapViewer 
              selectedFlight={selectedFlight}
              onMapReady={setMapInstance}
              onPolygonDrawn={handlePolygonDrawn}
              clearPolygonKey={clearPolygonKey} 
            />
          </div>
        </main>

        <Modal 
          isOpen={!!modalData} 
          onClose={() => setModalData(null)} 
        >
          {modalData && (
            <div>
              <h3>Voo Cadastrado com Sucesso!</h3>
              <p><strong>Missão:</strong> {modalData.mission}</p>
              <p><strong>Drone:</strong> {modalData.droneSisant}</p>
              <p><strong>Operador:</strong> {modalData.operatorSarpas}</p>
              <p><strong>Início:</strong> {formatDateTime(modalData.startTime)}</p>
              <p><strong>Fim:</strong> {formatDateTime(modalData.endTime)}</p>
            </div>
          )}
        </Modal>
      </div>
    </LocalizationProvider>
    </ThemeProvider>
    // -----------------------------------
  );
};