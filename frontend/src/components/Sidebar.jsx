// src/components/Sidebar.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import FlightForm from './FlightForm';
import FilterForm from './FilterForm';
import FlightList from './FlightList';
import Modal from './Modal';

// O Sidebar recebe as props do 'App' que são compartilhadas com o Mapa
function Sidebar({ onFlightSelect, newPolygonPoints, onClearPolygon }) {

  // --- 1. Lógica de DADOS (movida do App.jsx) ---
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    mission: '', operatorSarpas: '', droneSisant: ''
  });

  // --- 2. Lógica do MODAL (movida do App.jsx) ---
  const [modalData, setModalData] = useState(null);

  // Função de busca de voos
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

  // useEffect para buscar dados quando os filtros mudam
  useEffect(() => {
    const fetchTimeout = setTimeout(() => {
      fetchFlights();
    }, 500);
    return () => clearTimeout(fetchTimeout);
  }, [filters]);

  // Handler para atualizar os filtros
  const handleFilterChange = (filterName, filterValue) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: filterValue
    }));
  };

  // Handler para quando um voo é criado
  const handleFlightCreated = (newFlight) => {
    fetchFlights(); // Apenas recarrega a lista
    setModalData(newFlight); // Abre o modal
    // A limpeza do polígono ainda é controlada pelo App,
    // mas o 'onClearPolygon' é chamado pelo FlightForm
  };

  // Função para formatar a data (para o modal)
  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    // O 'list-panel' agora é o Sidebar
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
        onFlightSelect={onFlightSelect} // Passa o 'handler' do App para o FlightList
      />

      {/* O Modal agora 'vive' dentro do Sidebar */}
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
}

export default Sidebar;