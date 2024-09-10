// EditCommentModal.jsx
import React, { useState } from "react";
import "./EditCommentModal.css"; // Adicione o CSS para o modal

const EditCommentModal = ({ isOpen, onClose, onSave, initialComment }) => {
  const [commentText, setCommentText] = useState(initialComment);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(commentText);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Comentário</h2>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={handleSave}>Salvar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default EditCommentModal;
