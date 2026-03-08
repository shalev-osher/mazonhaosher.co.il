import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="text-6xl mb-4">🍪</div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              אופס! משהו השתבש
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              נראה שמשהו לא עבד כמו שצריך. אפשר לנסות לרענן את הדף.
            </p>
            {this.state.error && (
              <details className="text-xs text-muted-foreground bg-muted rounded-xl p-4 text-start">
                <summary className="cursor-pointer font-medium mb-2">פרטים טכניים</summary>
                <code className="block whitespace-pre-wrap break-all mt-2 font-mono">
                  {this.state.error.message}
                </code>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm
                  hover:opacity-90 transition-opacity duration-200 shadow-md"
              >
                נסה שוב
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl bg-muted text-foreground font-medium text-sm
                  hover:bg-secondary transition-colors duration-200"
              >
                רענן דף
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
