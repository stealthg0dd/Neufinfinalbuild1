import { Component, ReactNode } from 'react';
import { Card, CardContent } from './ui/card';
import { AlertCircle } from 'lucide-react';

interface SafeComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface SafeComponentState {
  hasError: boolean;
  error?: Error;
}

export class SafeComponent extends Component<SafeComponentProps, SafeComponentState> {
  constructor(props: SafeComponentProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SafeComponentState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(`Error in ${this.props.componentName || 'component'}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-red-500/20">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {this.props.componentName || 'Component'} failed to load
            </p>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
