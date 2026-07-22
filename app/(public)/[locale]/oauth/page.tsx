'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/integrations/supabase/client';

// Initialize the Supabase client using client-safe environment variables
const supabase = createSupabaseBrowserClient();

export default function OAuthTestPage() {
  const [resultText, setResultText] = useState('');

  // Run on mount to check if the user is already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        setResultText(`Logged in as: ${data.session.user.email}`);
      }
    });
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Points back to your Next.js application route
        redirectTo: `${window.location.origin}/oauth`,
      },
    });

    if (error) {
      setResultText(JSON.stringify(error, null, 2));
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Supabase OAuth Test</h1>
      <button 
        onClick={handleLogin}
        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        Sign in with Google
      </button>
      <pre style={{ marginTop: '1rem', background: '#f4f4f4', padding: '1rem' }}>
        {resultText}
      </pre>
    </div>
  );
}
