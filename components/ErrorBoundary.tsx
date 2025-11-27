import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <GlassCard className="max-w-xl w-full p-8 border-red-500/20 bg-red-900/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/20 rounded-xl text-red-500">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-white">Application Error</h1>
                <p className="text-zinc-400">Something went wrong while rendering the application.</p>
              </div>
            </div>

            <div className="bg-black/40 rounded-lg p-4 mb-6 border border-white/5 overflow-auto max-h-64 custom-scrollbar">
              <code className="text-red-400 font-mono text-sm block mb-2 break-words">
                {this.state.error && this.state.error.toString()}
              </code>
              <pre className="text-zinc-500 font-mono text-xs whitespace-pre-wrap break-all">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>

            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Reload Application
            </button>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}