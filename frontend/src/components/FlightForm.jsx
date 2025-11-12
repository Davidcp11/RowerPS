// src/components/FlightForm.jsx

import React, { useState } from 'react';
import axios from 'axios'; 

function FlightForm({ polygonPoints, onFlightCreated }) {
  const [mission, setMission] = useState('');
  const [operatorSarpas, setOperatorSarpas] = useState('');
  const [droneSisant, setDroneSisant] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (polygonPoints.length === 0) {
      setFormError('Por favor, desenhe o polígono do voo no mapa.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const startISO = `${startDate}T${startTime}:00Z`;
    const endISO = `${endDate}T${endTime}:00Z`;

    const formData = {
      mission,
      operatorSarpas,
      droneSisant,
      startTime: startISO,
      endTime: endISO,
      polygonJson: polygonPoints, 
    };

    try {
      await axios.post('http://localhost:3000/flights', formData);
      
      setMission('');
      setOperatorSarpas('');
      setDroneSisant('');
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      onFlightCreated(); 

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setFormError(err.response.data.error);
      } else {
        setFormError('Erro ao cadastrar o voo. Tente novamente.');
      }
      console.error('Erro ao enviar formulário:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="flight-form" onSubmit={handleSubmit}>
      <h3>Cadastrar Novo Voo</h3>
      
      {/* --- INÍCIO DOS INPUTS QUE SUMIRAM --- */}
      
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

      {/* --- FIM DOS INPUTS QUE SUMIRAM --- */}
      
      {/* Mensagens de feedback */}
      {formError && (
        <p className="form-error">{formError}</p>
      )}
      {polygonPoints.length === 0 && !formError && (
        <p className="form-info">Use o ícone de polígono no mapa para desenhar a área.</p>
      )}
      {polygonPoints.length > 0 && !formError && (
        <p className="form-success">Área do polígono definida!</p>
      )}

      <button type="submit" className="submit-button" disabled={submitting}>
        {submitting ? 'Cadastrando...' : 'Cadastrar Voo'}
      </button>
    </form>
  );
}

export default FlightForm;