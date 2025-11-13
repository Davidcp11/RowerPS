// src/components/Modal.jsx

import React from 'react';

// 'isOpen' controla a visibilidade
// 'onClose' é a função para fechar (clicar no OK)
// 'children' é o conteúdo que vai dentro do modal
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null; // Não renderiza nada se estiver fechado
  }

  return (
    // O fundo escuro (overlay)
    <div className="modal-overlay" onClick={onClose}>
      {/* O contêiner da janela (para não fechar ao clicar nela) */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* O conteúdo que passamos (os dados do voo) */}
        <div className="modal-body">
          {children}
        </div>
        
        {/* O botão de fechar */}
        <div className="modal-footer">
          <button className="submit-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;