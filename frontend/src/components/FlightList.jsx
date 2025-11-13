import React from 'react';
// 1. Não precisamos mais de useState, useEffect ou axios
// (Eles foram movidos para o App.jsx)

// 2. Receba as novas props: loading, error, flights
export default function FlightList({ loading, error, flights, onFlightSelect, filters, onFilterChange }) {

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value); // Avisa o App.jsx
  };
  // 4. A lógica de renderização permanece a mesma,
  //    pois ela agora usa as props
  if (loading) {
    return <p>Carregando voos...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="flight-list-container">
      <div className="filter-container">
        <h4>Filtrar Voos</h4>
        <div className="form-group">
          <input
            type="text"
            name="mission" // O 'name' deve bater com o estado
            placeholder="Filtrar por Missão"
            value={filters.mission}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="operatorSarpas"
            placeholder="Filtrar por Operador"
            value={filters.operatorSarpas}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="droneSisant"
            placeholder="Filtrar por Drone"
            value={filters.droneSisant}
            onChange={handleChange}
          />
        </div>
      </div>
      {/* --- FIM DOS FILTROS --- */}
      {flights.length === 0 ? (
        <p>Nenhum voo cadastrado.</p>
      ) : (
        <ul className="flight-list">
          {flights.map((flight) => (
            <li key={flight.id} className="flight-item">
              <strong>{flight.mission}</strong>
              <p>Drone: {flight.droneSisant}</p>
              <p>Operador: {flight.operatorSarpas}</p>
              <p><strong>Início:</strong> {formatDateTime(flight.startTime)}</p>
              <p><strong>Fim:</strong> {formatDateTime(flight.endTime)}</p>
              <span className={`flight-status ${flight.status === 'Concluído' ? 'status-completed' : 'status-scheduled'}`}>
                {flight.status}
              </span>
              <button 
                className="view-button"
                onClick={() => onFlightSelect(flight)}
              >
                Ver no Mapa
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}