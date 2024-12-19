// src/components/EditTimerModal.tsx

import React, { useState } from 'react';
import { ModalButton } from './ModalButton'; // Import the ModalButton component
import { Pencil, Trash2 } from 'lucide-react'; // For icons or any other icons you want to use

interface EditTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timer: { id: number; title: string; description: string };
}

export const EditTimerModal: React.FC<EditTimerModalProps> = ({ isOpen, onClose, timer }) => {
  const [title, setTitle] = useState(timer.title);
  const [description, setDescription] = useState(timer.description);

  const handleSave = () => {
    // Handle save logic
    console.log('Timer saved:', { title, description });
    onClose();
  };

  const handleDelete = () => {
    // Handle delete logic
    console.log('Timer deleted:', timer.id);
    onClose();
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h3 className="text-xl">Edit Timer</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Timer Title"
          className="p-2 border rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Timer Description"
          className="p-2 border rounded mt-2"
        />
        <div className="mt-4 flex justify-end gap-2">
          {/* Using the ModalButton component */}
          <ModalButton
            label="Save"
            onClick={handleSave}
            color="primary"
            icon={<Pencil className="w-4 h-4" />}
          />
          <ModalButton
            label="Delete"
            onClick={handleDelete}
            color="danger"
            icon={<Trash2 className="w-4 h-4" />}
          />
          <ModalButton label="Cancel" onClick={onClose} color="secondary" />
        </div>
      </div>
    </div>
  ) : null;
};
