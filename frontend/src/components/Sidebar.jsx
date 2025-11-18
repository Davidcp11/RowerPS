import { useState, useEffect } from 'react';
import axios from 'axios';

import FlightForm from './FlightForm';
import FilterForm from './FilterForm';
import FlightList from './FlightList';
import Modal from './Modal';

export default function Sidebar({ onFlightSelect, newPolygonPoints, onClearPolygon }) {

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    mission: '', operatorSarpas: '', droneSisant: ''
  });

  const [modalData, setModalData] = useState(null);

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

  const handleFlightCreated = (newFlight) => {
    fetchFlights();
    setModalData(newFlight); // Abre o modal
  };

  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="list-panel">
      <FlightForm 
        polygonPoints={newPolygonPoints}
        onFlightCreated={handleFlightCreated}
        onClearPolygon={onClearPolygon}
      />
      <FilterForm 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <FlightList 
        loading={loading}
        error={error}
        flights={flights}
        onFlightSelect={onFlightSelect} 
      />

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
  );
};
