import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-ivory">
      <div className="text-center">
        <h1 className="font-display text-6xl text-deep-saffron mb-4">404</h1>
        <p className="font-body text-lg text-warm-brown mb-6">Page not found</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
