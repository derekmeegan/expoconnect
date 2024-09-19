import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function AdminPanel() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('access_requests')
      .select('*, users(email), events(name)')
      .eq('status', 'pending');
    
    if (data) setRequests(data);
    if (error) console.error('Error fetching requests:', error);
  };

  const handleRequest = async (requestId, approved) => {
    const { data, error } = await supabase
      .from('access_requests')
      .update({ status: approved ? 'approved' : 'rejected' })
      .eq('id', requestId);

    if (approved) {
      const request = requests.find(r => r.id === requestId);
      if (request) {
        await supabase
          .from('user_event_roles')
          .insert({ 
            user_id: request.user_id, 
            event_id: request.event_id, 
            role_id: (await supabase.from('roles').select('id').eq('name', 'user').single()).data.id 
          });
      }
    }

    if (error) console.error('Error handling request:', error);
    else {
      fetchRequests(); // Refresh the requests list
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text">Admin Panel</h1>
      <div>
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-text">Access Requests</h2>
        <div className="space-y-4">
          {requests.map(request => (
            <div key={request.id} className="bg-primary p-4 rounded shadow">
              <p className="text-text">{request.users.email} requested access to {request.events.name}</p>
              <div className="mt-2 space-x-2">
                <button 
                  onClick={() => handleRequest(request.id, true)}
                  className="bg-secondary text-text px-3 py-1 rounded hover:bg-opacity-90"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleRequest(request.id, false)}
                  className="bg-logout text-white px-3 py-1 rounded hover:bg-opacity-90"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;