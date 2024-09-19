import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) navigate('/')
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Login error:', error)
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  if (session) {
    return <div>Redirecting to dashboard...</div>
  }

  return (
    <div className="w-full max-w-md p-8 bg-primary rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-text">Welcome to Your App</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <button
          type="submit"
          className="w-full p-2 bg-secondary text-text rounded hover:bg-opacity-90 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : null}
          {loading ? 'Loading...' : 'Login with Google'}
        </button>
      </form>
    </div>
  );
};