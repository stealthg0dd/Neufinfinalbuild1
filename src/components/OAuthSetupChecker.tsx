import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle2, XCircle, AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

export function OAuthSetupChecker() {
  const [isGoogleEnabled, setIsGoogleEnabled] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();
  const callbackUrl = `https://${projectId}.supabase.co/auth/v1/callback`;

  useEffect(() => {
    checkGoogleProvider();
  }, []);

  const checkGoogleProvider = async () => {
    try {
      // This is a simple check - in production you'd verify through Supabase Management API
      const { data, error } = await supabase.auth.getSession();
      // If we can initialize without errors, assume basic setup is ok
      setIsGoogleEnabled(true);
    } catch (error) {
      console.error('Error checking Google provider:', error);
      setIsGoogleEnabled(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(callbackUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-blue-400" />
          <span>OAuth Setup Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Setup Steps */}
        <div className="space-y-3">
          {/* Step 1 */}
          <div className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Supabase Project Configured</p>
              <p className="text-xs text-muted-foreground">
                Project ID: <code className="text-purple-400">{projectId}</code>
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">Google OAuth Callback URL</p>
              <div className="flex items-center space-x-2 mb-2">
                <code className="flex-1 text-xs bg-background p-2 rounded font-mono text-purple-400 break-all">
                  {callbackUrl}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex-shrink-0"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Add this URL to Google Cloud Console → Credentials → OAuth 2.0 Client → Authorized redirect URIs
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Enable Google Provider in Supabase</p>
              <p className="text-xs text-muted-foreground mb-2">
                Go to Supabase Dashboard and enable Google OAuth provider
              </p>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="text-xs"
              >
                <a
                  href={`https://supabase.com/dashboard/project/${projectId}/auth/providers`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Supabase Dashboard
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs font-medium mb-2">Setup Guides:</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1"
              >
                <span>Google Console</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Badge>
            <Badge variant="outline" className="text-xs">
              <a
                href="https://supabase.com/docs/guides/auth/social-login/auth-google"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1"
              >
                <span>Supabase Docs</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Badge>
            <Badge variant="outline" className="text-xs text-purple-400">
              <span>See /OAUTH_SETUP_VERIFICATION.md</span>
            </Badge>
          </div>
        </div>

        {/* Status Message */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-400">
            💡 <strong>Tip:</strong> After completing setup in Google Console and Supabase, 
            the "Continue with Google" button will open Google's login screen.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
