// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthChange = async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          // Check if the user is a superadmin
          const { data, error } = await supabase
            .from('user_roles')  // Replace with your actual table name
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (error) throw error;

          if (data && data.role === 'superadmin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          navigate('/'); // Default to dashboard if there's an error
        } finally {
          setLoading(false);
        }
      } else if (!session) {
        navigate('/login');
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null;
};

export default AuthCallback;