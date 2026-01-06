import { Component, ReactNode } from 'react';
import { Card, CardContent } from './ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class StockDataErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Stock data error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <AlertCircle className="h-12 w-12 text-yellow-500" />
              <div className="text-center">
                <h3 className="text-lg mb-2">Unable to Load Stock Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {this.state.error?.message || 'There was an error fetching real-time stock data. Please try again.'}
                </p>
                <Button onClick={this.handleReset} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
