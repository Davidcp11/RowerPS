import React from 'react';
// 1. Não precisamos mais de useState, useEffect ou axios
// (Eles foram movidos para o App.jsx)

// 2. Receba as novas props: loading, error, flights
function FlightList({ loading, error, flights, onFlightSelect }) {

  // 3. A lógica de useState, useEffect e fetchFlights foi REMOVIDA

  // 4. A lógica de renderização permanece a mesma,
  //    pois ela agora usa as props
  if (loading) {
    return <p>Carregando voos...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

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