import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// interface AddEventModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onEventAdded: () => void;
// }

const AddEventModal = ({ isOpen, onClose, onEventAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{ name, description }])
        .select();

      if (error) throw error;

      onEventAdded();
      onClose();
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-background p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-text">Add New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 text-text">Event Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded text-text bg-white"
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-1 text-text">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded text-text bg-white"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-logout text-white rounded hover:bg-opacity-90">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-secondary text-text rounded hover:bg-opacity-90">Add Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;