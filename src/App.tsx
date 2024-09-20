// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import Auth from './components/Auth';
import AuthCallback from './components/AuthCallback'; 
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Navbar from './components/Navbar';
import './styles/modal.css';

function App() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkAdminStatus(session.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkAdminStatus(session.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role_id')
      .eq('user_id', userId)
      .single();
    
    if (data && data.role_id === 1) {
      setIsAdmin(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
    {/* <div className="bg-background min-h-screen">
        {session ? (
          <div className="flex">
            <Navbar isAdmin={isAdmin} />
            <div className="flex-1 p-8 ml-64">
              <Routes>
                <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/" replace />} />
                <Route path="/" element={<Dashboard isAdmin={isAdmin} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <Routes>
              <Route path="/login" element={<Auth />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        )}
      </div> */}
      <div className="bg-background min-h-screen">
      {session && location.pathname !== '/login' && <Navbar isAdmin={isAdmin} />}
      <div className={session && location.pathname !== '/login' ? "ml-64 p-8" : ""}>
        <Routes>
          <Route path="/login" element={
            !session ? <Auth /> : <Navigate to="/" replace />
          } />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/admin" element={
            session && isAdmin ? <AdminPanel /> : <Navigate to="/" replace />
          } />
          <Route path="/" element={
            session ? <Dashboard isAdmin={isAdmin} /> : <Navigate to="/login" replace />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;