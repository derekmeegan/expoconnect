import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

function RequestAccess() {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select('*')
    if (data) setEvents(data)
  }

  const requestAccess = async () => {
    if (!selectedEvent) return

    const { data, error } = await supabase
      .from('access_requests')
      .insert({ user_id: supabase.auth.user().id, event_id: selectedEvent })

    if (data) {
      alert('Access request sent!')
    }
  }

  return (
    <div>
      <h1>Request Access</h1>
      <select onChange={e => setSelectedEvent(e.target.value)}>
        <option value="">Select an event</option>
        {events.map(event => (
          <option key={event.id} value={event.id}>{event.name}</option>
        ))}
      </select>
      <button onClick={requestAccess}>Request Access</button>
    </div>
  )
}

export default RequestAccess