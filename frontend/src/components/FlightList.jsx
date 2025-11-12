import React from 'react';
// 1. Não precisamos mais de useState, useEffect ou axios
// (Eles foram movidos para o App.jsx)

// 2. Receba as novas props: loading, error, flights
export default function FlightList({ loading, error, flights, onFlightSelect }) {

  // 3. A lógica de useState, useEffect e fetchFlights foi REMOVIDA

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
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flight-list-container">
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