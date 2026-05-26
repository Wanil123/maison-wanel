import { Component } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught:", error, info);
    }
    // Chunk load errors after a deploy: force one reload, then stop looping.
    if (error?.name === "ChunkLoadError" || /Loading chunk \d+ failed/.test(error?.message || "")) {
      if (!sessionStorage.getItem("lm_chunk_reload")) {
        sessionStorage.setItem("lm_chunk_reload", "1");
        window.location.reload();
      }
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    sessionStorage.removeItem("lm_chunk_reload");
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div role="alert" className="min-h-[70vh] flex items-center justify-center px-4 bg-luxury-ivory dark:bg-gray-900">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-500" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-3">
            Oups, une erreur est survenue
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Désolé pour la gêne. Vous pouvez recharger la page ou revenir à l'accueil.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-luxury-charcoal text-accent border border-accent/20 font-semibold rounded-xl hover:bg-luxury-wine transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </button>
            <Link
              to="/"
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
