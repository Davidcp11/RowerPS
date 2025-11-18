import { useState } from 'react';
import axios from 'axios'; 

const initialFormState = {
  mission: '',
  operatorSarpas: '',
  droneSisant: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
};

export default function FlightForm({ polygonPoints, onFlightCreated, onClearPolygon }) {
  const [formData, setFormData] = useState(initialFormState);
  
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

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

    const startISO = `${formData.startDate}T${formData.startTime}:00Z`;
    const endISO = `${formData.endDate}T${formData.endTime}:00Z`;

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
      <div className="form-group">
        <label>Missão</label>
        <input 
          type="text" 
          name="mission" 
          value={formData.mission} 
          onChange={handleChange}
          required 
        />
      </div>

      <div className="form-group">
        <label>SARPAS do Operador (ex: 123ABC)</label>
        <input 
          type="text" 
          name="operatorSarpas"
          value={formData.operatorSarpas}
          onChange={handleChange}
          required 
          maxLength={6}
        />
      </div>

      <div className="form-group">
        <label>SISANT do Drone (ex: PP-1234567)</label>
        <input 
          type="text" 
          name="droneSisant"
          value={formData.droneSisant}
          onChange={handleChange}
          required 
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Data Início</label>
          <input 
            type="date" 
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="form-group">
          <label>Hora Início</label>
          <input 
            type="time" 
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required 
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Data Fim</label>
          <input 
            type="date" 
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="form-group">
          <label>Hora Fim</label>
          <input 
            type="time" 
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required 
          />
        </div>
      </div>

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
};