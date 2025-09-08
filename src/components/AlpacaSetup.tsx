import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { initializeAlpaca } from '@/services/alpacaWebSocket';
import { KeyRound, Wifi } from 'lucide-react';

interface AlpacaSetupProps {
  onSetupComplete: () => void;
}

export default function AlpacaSetup({ onSetupComplete }: AlpacaSetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    if (!apiKey.trim() || !secretKey.trim()) {
      setError('Please enter both API key and secret key');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const { alpacaWS } = initializeAlpaca({
        apiKey: apiKey.trim(),
        secretKey: secretKey.trim()
      });

      await alpacaWS.connect();
      
      // Store keys in localStorage for this session
      localStorage.setItem('alpaca_api_key', apiKey.trim());
      localStorage.setItem('alpaca_secret_key', secretKey.trim());
      
      onSetupComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Alpaca');
    } finally {
      setIsConnecting(false);
    }
  };

  const loadSavedKeys = () => {
    const savedApiKey = localStorage.getItem('alpaca_api_key');
    const savedSecretKey = localStorage.getItem('alpaca_secret_key');
    
    if (savedApiKey && savedSecretKey) {
      setApiKey(savedApiKey);
      setSecretKey(savedSecretKey);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <KeyRound className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Connect to Alpaca</CardTitle>
          <CardDescription>
            Enter your Alpaca API credentials to access real-time market data
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert>
            <Wifi className="h-4 w-4" />
            <AlertDescription>
              Your API keys are stored locally in your browser and are not sent to our servers.
              For production use, consider using Supabase for secure key management.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="text"
              placeholder="PK..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isConnecting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secretKey">Secret Key</Label>
            <Input
              id="secretKey"
              type="password"
              placeholder="Your secret key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              disabled={isConnecting}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={loadSavedKeys}
              disabled={isConnecting}
              className="flex-1"
            >
              Load Saved
            </Button>
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex-1"
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              Don't have an Alpaca account?{' '}
              <a 
                href="https://alpaca.markets" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Sign up here
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}