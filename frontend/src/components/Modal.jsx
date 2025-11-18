export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null; 
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          {children}
        </div>
        
        <div className="modal-footer">
          <button className="submit-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};