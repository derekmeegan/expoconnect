import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import AddEventModal from './AddEventModal';

function Dashboard({ isAdmin }) {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('user_event_roles')
      .select('events(*)')
      .eq('user_id', user.id);
    
    if (data) setEvents(data.map(item => item.events));
  };

  const handleEventAdded = () => {
    setIsModalOpen(false); // Close the modal
    alert('Event added successfully!');
  };

  return (
    <div className="space-y-6">
      <div className = 'flex flex-row align-center gap-2'>
        <h1 className="text-3xl font-bold text-text">Dashboard</h1>
        {isAdmin && (
          <>
            <AddEventModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)}
              onEventAdded={handleEventAdded}
            />
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-secondary text-text px-4 py-2 rounded hover:bg-opacity-90 mb-4"
            >
              +
            </button>
        </>
      )}
      </div>
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(event => (
          <div key={event.id} className="bg-primary p-4 rounded shadow">
            <h2 className="text-xl font-semibold text-text">{event.name}</h2>
            <p className="text-text mt-2">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;