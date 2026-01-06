import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '../utils/supabase/client';
import { Loader2 } from 'lucide-react';

export function CustomerPortal() {
  const navigate = useNavigate();
  const supabase = createClient();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // User is already logged in, redirect to customer pane
        navigate('/customer-pane');
      } else {
        // User not logged in, trigger OAuth with dedicated callback
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/customer-auth-callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        });

        if (error) {
          console.error('OAuth error:', error);
          // Fallback to login page if OAuth fails
          navigate('/login');
        }
      }
    };

    checkAuthAndRedirect();
  }, [navigate, supabase]);

  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl mb-2">Redirecting to login...</h2>
        <p className="text-muted-foreground">Please wait while we authenticate you securely.</p>
      </div>
    </div>
  );
}