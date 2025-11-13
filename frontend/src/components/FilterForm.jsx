// src/components/FilterForm.jsx

import React from 'react';

// Este componente apenas recebe o estado dos filtros e a função de 'change'
function FilterForm({ filters, onFilterChange }) {
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="filter-container">
      <h4>Filtrar Voos</h4>
      <div className="form-group">
        <input
          type="text"
          name="mission"
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
  );
}

export default FilterForm;