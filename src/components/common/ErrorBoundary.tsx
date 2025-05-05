import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import Button from './Button';
import { isProduction } from '../../utils/validateEnv';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Log error to an error reporting service
    this.logError(error, errorInfo);
  }

  private logError = (error: Error, errorInfo: ErrorInfo): void => {
    // In production, you would send this to your error tracking service
    // e.g. Sentry, LogRocket, etc.
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Example of how you might report to a service
    if (isProduction()) {
      // If we had an error reporting service configured, we would call it here
      // Example: Sentry.captureException(error);
    }
  };

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // If a custom fallback is provided, use it
      if (fallback) {
        return fallback;
      }

      // Otherwise, use the default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-tv-bg-primary p-4">
          <div className="max-w-md w-full bg-white dark:bg-tv-bg-secondary shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center mb-4">
              <FiAlertTriangle className="text-4xl text-red-500" />
            </div>
            
            <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Something Went Wrong
            </h1>
            
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              We're sorry, but an error occurred while trying to render this component.
            </p>
            
            {!isProduction() && error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded-md">
                <h2 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                  Error Details:
                </h2>
                <p className="text-xs text-red-800 dark:text-red-300 font-mono whitespace-pre-wrap">
                  {error.toString()}
                </p>
                
                {errorInfo && (
                  <div className="mt-2">
                    <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                      Component Stack:
                    </h3>
                    <p className="text-xs text-red-800 dark:text-red-300 font-mono overflow-auto max-h-32 whitespace-pre-wrap">
                      {errorInfo.componentStack}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                variant="outline"
                leftIcon={<FiRefreshCw />}
                onClick={this.handleReset}
                fullWidth
              >
                Try Again
              </Button>
              
              <Button
                variant="primary"
                onClick={this.handleReload}
                fullWidth
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;