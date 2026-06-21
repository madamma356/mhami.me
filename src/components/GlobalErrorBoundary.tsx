"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class GlobalErrorBoundary extends Component<Props, State> {
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
        <div style={{ padding: "2rem", color: "red", backgroundColor: "black", minHeight: "100vh" }}>
          <h1>Client-Side Error Caught!</h1>
          <p><strong>Error:</strong> {this.state.error?.toString()}</p>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.8rem", color: "yellow", marginTop: "1rem" }}>
            {this.state.error?.stack}
          </pre>
          <hr style={{ margin: "2rem 0", borderColor: "white" }} />
          <p><strong>Component Stack:</strong></p>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.8rem", color: "pink" }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
