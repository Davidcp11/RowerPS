import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FlightList({ onFlightSelect }) {
  // 1. Criamos um estado para armazenar a lista de voos
  const [flights, setFlights] = useState([]);
  // 2. Criamos um estado para loading (boa prática)
  const [loading, setLoading] = useState(true);
  // 3. Criamos um estado para erros
  const [error, setError] = useState(null);

  // 4. useEffect: Roda UMA VEZ quando o componente é montado
  useEffect(() => {
    // 5. Função assíncrona para buscar os dados
    const fetchFlights = async () => {
      try {
        // 6. Usamos o Axios para fazer o GET no nosso backend
        const response = await axios.get('http://localhost:3000/flights');
        
        // 7. Atualizamos o estado com os dados recebidos
        setFlights(response.data);
      } catch (err) {
        // 8. Se der erro, guardamos a mensagem de erro
        setError('Não foi possível carregar os voos.');
        console.error('Erro ao buscar voos:', err);
      } finally {
        // 9. Independentemente de sucesso ou erro, paramos o loading
        setLoading(false);
      }
    };

    fetchFlights(); // Executa a função de busca
  }, []); // O array vazio [] garante que isso rode só uma vez

  // 10. Lógica de Renderização
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
                onClick={() => onFlightSelect(flight)} // Envia o voo para o App.jsx
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