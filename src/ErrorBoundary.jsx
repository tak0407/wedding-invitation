import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Wedding invitation render error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-fallback">
          <p className="error-kicker">WEDDING INVITATION</p>
          <h1>김경탁 · 금정민</h1>
          <p>2027년 8월 28일 토요일 낮 12시 30분</p>
          <p>JW컨벤션 울산 루미에르홀</p>
          <button type="button" onClick={() => window.location.reload()}>새로고침</button>
        </main>
      );
    }

    return this.props.children;
  }
}
