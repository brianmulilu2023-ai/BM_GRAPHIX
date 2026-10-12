import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('BM Graphix ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    try {
      sessionStorage.clear();
      localStorage.removeItem('bm_has_preloaded');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] text-[#F5F1E8] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <img
              src="/assets/logo/BM_OFFICIAL_LOGO.png"
              alt="BM Graphix"
              className="w-14 h-14 object-contain filter drop-shadow-[0_4px_12px_rgba(212,175,55,0.4)]"
            />
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F5F1E8] mb-2 tracking-wide">
            BM GRAPHIX
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-6">
            Designs That Move People
          </p>

          <div className="max-w-md p-4 mb-6 rounded-xl bg-[#141414] border border-white/10 text-xs text-[#A0A0A0] text-left overflow-auto font-mono">
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </div>

          <button
            onClick={this.handleReload}
            className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#B8860B] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-95 transition"
          >
            Reload Website
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
