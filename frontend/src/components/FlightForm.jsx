// src/components/FlightForm.jsx

import React, { useState } from 'react';
import axios from 'axios'; 

// 1. Defina o estado inicial do formulário aqui
const initialFormState = {
  mission: '',
  operatorSarpas: '',
  droneSisant: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
};

function FlightForm({ polygonPoints, onFlightCreated, onClearPolygon }) {
  // 2. Use um único 'useState' para todos os campos do formulário
  const [formData, setFormData] = useState(initialFormState);
  
  // Os estados de controle permanecem separados (o que é bom)
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // 3. Crie um 'handler' genérico para atualizar o estado do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (polygonPoints.length === 0) {
      setFormError('Por favor, desenhe o polígono do voo no mapa.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    // 4. Use os valores do objeto 'formData'
    const startISO = `${formData.startDate}T${formData.startTime}:00Z`;
    const endISO = `${formData.endDate}T${formData.endTime}:00Z`;

    // Crie o objeto de envio
    const submissionData = {
      mission: formData.mission,
      operatorSarpas: formData.operatorSarpas,
      droneSisant: formData.droneSisant,
      startTime: startISO,
      endTime: endISO,
      polygonJson: polygonPoints, 
    };

    try {
      const response = await axios.post('http://localhost:3000/flights', submissionData);
      
      // Limpar o formulário é muito mais fácil agora!
      setFormData(initialFormState); 
      onFlightCreated(response.data); 

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
      
      {/* --- MUDANÇA NOS INPUTS ---
        Agora, cada input usa:
        1. value={formData.nomeDoCampo}
        2. onChange={handleChange}
        3. name="nomeDoCampo" (IMPORTANTE!)
      */}
      
      <div className="form-group">
        <label>Missão</label>
        <input 
          type="text" 
          name="mission" // Adicionado
          value={formData.mission} // Mudou
          onChange={handleChange} // Mudou
          required 
        />
      </div>

      <div className="form-group">
        <label>SARPAS do Operador (ex: 123ABC)</label>
        <input 
          type="text" 
          name="operatorSarpas" // Adicionado
          value={formData.operatorSarpas} // Mudou
          onChange={handleChange} // Mudou
          required 
          maxLength={6}
        />
      </div>

      <div className="form-group">
        <label>SISANT do Drone (ex: PP-1234567)</label>
        <input 
          type="text" 
          name="droneSisant" // Adicionado
          value={formData.droneSisant} // Mudou
          onChange={handleChange} // Mudou
          required 
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Data Início</label>
          <input 
            type="date" 
            name="startDate" // Adicionado
            value={formData.startDate} // Mudou
            onChange={handleChange} // Mudou
            required 
          />
        </div>
        <div className="form-group">
          <label>Hora Início</label>
          <input 
            type="time" 
            name="startTime" // Adicionado
            value={formData.startTime} // Mudou
            onChange={handleChange} // Mudou
            required 
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Data Fim</label>
          <input 
            type="date" 
            name="endDate" // Adicionado
            value={formData.endDate} // Mudou
            onChange={handleChange} // Mudou
            required 
          />
        </div>
        <div className="form-group">
          <label>Hora Fim</label>
          <input 
            type="time" 
            name="endTime" // Adicionado
            value={formData.endTime} // Mudou
            onChange={handleChange} // Mudou
            required 
          />
        </div>
      </div>

      {/* --- O restante do formulário (feedback de erro, botões) --- */}
      {/* Nenhuma mudança necessária aqui */}

      {formError && (
        <p className="form-error">{formError}</p>
      )}

      {polygonPoints.length === 0 && !formError && (
        <p className="form-info">Use o ícone de polígono no mapa para desenhar a área.</p>
      )}

      {polygonPoints.length > 0 && (
        <div className={!!formError ? "form-success-wrapper":"form-error-wrapper"}>
          {!!formError ? (
            <p>Área do polígono definida!</p>
          ) : (
            <p>Escolha outro polígono!</p>
          )}

          <button 
            type="button" 
            className="cancel-button" 
            onClick={onClearPolygon}
          >
            Refazer
          </button>
        </div>
      )}

      <button type="submit" className="submit-button" disabled={submitting}>
        {submitting ? 'Cadastrando...' : 'Cadastrar Voo'}
      </button>
    </form>
  );
}

export default FlightForm;