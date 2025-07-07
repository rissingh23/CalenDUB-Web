import './CreateOrganizationModal.css';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import defaultimage from '../../assets/defaultimage.jpg';

interface CreateOrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialName: string;
    createOrganizer(name: string, description: string, picture: File): void;
}

const CreateOrganizationModal : React.FC<CreateOrganizationModalProps> = ({ isOpen, onClose, initialName, createOrganizer }) => {
    const [name, setName] = useState('');
    const [picture, setPicture] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        setName(initialName);
      }, [initialName]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setPicture(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
      }
    };
  
    const handleSubmit = () => {
      if (!name) {
        setError('Please add an organizer name.');
        return;
      }
      if (!description) {
        setError('Please add an organizer description.');
        return;
      }
      if (!picture) {
        setError('Please add an organizer picture.');
        return;
      }

      createOrganizer(name, description, picture);
      onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={`org-modal-overlay ${isOpen ? 'show' : ''}`}>
          <div className={`org-modal-content ${isOpen ? 'show' : ''}`}>
            <button className="org-modal-close-button" onClick={onClose}>&times;</button>
            <div className='org-modal-content-container'>
              <div className='org-file-upload'>
                <img 
                  src={preview || defaultimage} 
                  alt="Organization"
                  className='org-image-preview'
                />
                <div className="org-upload-icon">
                    <FaPlus />
                </div>
                <input type="file" className="org-file-upload-input" onChange={handleFileChange} />
              </div>
              <div className='org-inputs'>
                <input
                  className='name-input'
                  type="text"
                  placeholder="Organizer Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <textarea
                  className='description-input'
                  placeholder="Organizer Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="org-footer">
                {error && <span className="error-text">{error}</span>}
                <button className="create-button" onClick={handleSubmit}>Create</button>
            </div>
          </div>
        </div>
    );
}

export default CreateOrganizationModal;
