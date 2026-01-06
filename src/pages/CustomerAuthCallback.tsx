import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '../utils/supabase/client';
import { AlertCircle, Loader2 } from 'lucide-react';

export function CustomerAuthCallback() {
  const navigate = useNavigate();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Customer Auth Callback - Processing OAuth response...');
        console.log('Current URL:', window.location.href);
        
        // Wait a bit for Supabase to process the OAuth callback
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Try to get session from URL first (for OAuth callback)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          console.log('Found tokens in URL hash, setting session...');
          const { data: { session: newSession }, error: setError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (setError) {
            console.error('Error setting session:', setError);
            setError(`Failed to complete sign in: ${setError.message}`);
            setTimeout(() => navigate('/customer-portal'), 3000);
            return;
          }
          
          if (newSession) {
            console.log('Session established successfully, redirecting to customer pane');
            // Clear the hash from URL
            window.history.replaceState(null, '', window.location.pathname);
            navigate('/customer-pane');
            return;
          }
        }
        
        // If no tokens in URL, check existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(`Authentication error: ${sessionError.message}`);
          setTimeout(() => navigate('/customer-portal'), 3000);
          return;
        }

        if (!session) {
          console.log('No valid session found');
          setError('No authentication data found. Redirecting to login...');
          setTimeout(() => navigate('/customer-portal'), 2000);
          return;
        }

        console.log('Session found, redirecting to customer pane');
        navigate('/customer-pane');
        
      } catch (error: any) {
        console.error('Error in customer auth callback:', error);
        setError(`Unexpected error: ${error.message || 'Please try again'}`);
        setTimeout(() => navigate('/customer-portal'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, supabase]);

  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        {error ? (
          <div className="space-y-4">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
            <h2 className="text-xl font-semibold text-red-400">Authentication Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground">Redirecting back...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto" />
            <h2 className="text-xl font-semibold">Completing sign in...</h2>
            <p className="text-muted-foreground">Welcome to Neufin Customer Portal</p>
          </div>
        )}
      </div>
    </div>
  );
}
