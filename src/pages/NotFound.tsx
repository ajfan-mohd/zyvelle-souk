import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center bg-cream px-6">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[10px] tracking-[0.5em] uppercase text-gold-muted font-bold mb-6 block">Error 404</span>
          <h1 className="text-5xl md:text-7xl font-serif text-olive-dark mb-8">Page Not Found</h1>
          <p className="text-olive-deep/60 max-w-md mx-auto font-light leading-relaxed mb-12 italic">
            Like a misplaced heirloom, the piece you are looking for seems to have vanished.
          </p>
          <Link
            to="/"
            className="inline-block px-12 py-5 bg-olive-dark text-cream text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold-muted transition-all duration-500"
          >
            Return to Store
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
