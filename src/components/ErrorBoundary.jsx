'use client';

import { Component } from 'react';

/* Minimal error boundary. Wrap any subtree that might throw at runtime (e.g. the
   WebGL/Spline 3D scene, which can fail on some mobile browsers) so the failure
   renders a fallback instead of crashing the whole page. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
