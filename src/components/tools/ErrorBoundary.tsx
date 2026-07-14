"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("Tool error:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <h3 className="font-semibold text-red-700">Something went wrong</h3>
          <p className="text-sm text-red-700">
            {this.state.error?.message || "Please try again later."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded bg-nuvora-500 px-4 py-2 text-white hover:bg-nuvora-600"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
