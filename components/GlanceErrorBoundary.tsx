"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class GlanceErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Glance Dashboard recovered from error:", error, errorInfo);
  }

  private handleReset = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("lifehub_custom_activities");
        localStorage.removeItem("lifehub_habits_history");
        localStorage.removeItem("lifehub_habits_base");
      }
    } catch {}
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full p-6 sm:p-8 rounded-2xl bg-[#111215] border border-neutral-700 text-neutral-200 space-y-4 shadow-2xl my-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {this.props.fallbackTitle || "Glance Dashboard Workspace"}
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Recovered safely from client-side state discrepancy.
              </p>
            </div>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed font-sans max-w-xl">
            A temporary browser storage format mismatch was caught and isolated. Click below to refresh with clean, verified default schedules and live widgets.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs font-mono flex items-center gap-2 hover:bg-neutral-200 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset & Refresh Dashboard</span>
            </button>

            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-mono hover:text-white transition-colors"
            >
              Try Re-rendering
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
