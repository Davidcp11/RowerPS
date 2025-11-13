import React from 'react';

// Removidas as props 'filters' e 'onFilterChange'
function FlightList({ loading, error, flights, onFlightSelect }) {

  // A função 'handleChange' foi removida
  
  if (loading) {
    return <p>Carregando voos...</p>;
  }
  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString('pt-BR', {
      hour: '2-digit', minute: '2-digit', day: '2-digit',
      month: '2-digit', year: 'numeric',
    });
  };

  return (
    <div className="flight-list-container">
      {/* O 'filter-container' foi REMOVIDO daqui */}
      
      {flights.length === 0 ? (
        <p>Nenhum voo encontrado.</p>
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

export default FlightList;