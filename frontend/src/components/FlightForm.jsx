import React, { useState } from 'react';

export default function FlightForm() {
  // 1. Criar um estado para cada campo do formulário
  const [mission, setMission] = useState('');
  const [operatorSarpas, setOperatorSarpas] = useState('');
  const [droneSisant, setDroneSisant] = useState('');
  // Para datas e horas, o HTML5 lida bem com strings
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    // Lógica de combinação de data/hora
    // Ex: "2025-12-01" + "T" + "10:00" + ":00Z" -> "2025-12-01T10:00:00Z"
    const startISO = `${startDate}T${startTime}:00Z`;
    const endISO = `${endDate}T${endTime}:00Z`;

    const formData = {
      mission,
      operatorSarpas,
      droneSisant,
      startTime: startISO,
      endTime: endISO,
      // O polígono virá do mapa depois
      polygonJson: [], 
    };

    console.log('Dados do formulário para enviar:', formData);
    // Aqui, no futuro, chamaremos o axios.post
  };

  return (
    <form className="flight-form" onSubmit={handleSubmit}>
      <h3>Cadastrar Novo Voo</h3>
      
      <div className="form-group">
        <label>Missão</label>
        <input 
          type="text" 
          value={mission}
          onChange={(e) => setMission(e.target.value)}
          required 
        />
      </div>

      <div className="form-group">
        <label>SARPAS do Operador (ex: 123ABC)</label>
        <input 
          type="text" 
          value={operatorSarpas}
          onChange={(e) => setOperatorSarpas(e.target.value)}
          required 
          maxLength={6}
        />
      </div>

      <div className="form-group">
        <label>SISANT do Drone (ex: PP-1234567)</label>
        <input 
          type="text" 
          value={droneSisant}
          onChange={(e) => setDroneSisant(e.target.value)}
          required 
        />
      </div>

      {/* Inputs de Data e Hora */}
      <div className="form-row">
        <div className="form-group">
          <label>Data Início</label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <label>Hora Início</label>
          <input 
            type="time" 
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required 
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Data Fim</label>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <label>Hora Fim</label>
          <input 
            type="time" 
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required 
          />
        </div>
      </div>

      <button type="submit" className="submit-button">
        Cadastrar Voo
      </button>
    </form>
  );
}