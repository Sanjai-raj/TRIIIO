import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-50 text-center p-10">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong.</h1>
                        <p className="text-gray-600 mb-6">We're sorry, but the application encountered an error.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#008B9E] text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#006D7C] transition"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
