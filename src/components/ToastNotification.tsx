import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastNotificationProps {
  message: string | null;
  onClear: () => void;
}

export default function ToastNotification({ message, onClear }: ToastNotificationProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClear();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, onClear]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          id="toast-notification"
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          transition={{ duration: 0.2 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 bg-ink text-paper text-xs sm:text-sm font-sans font-medium px-4 py-2.5 rounded-full shadow-lg z-50 border border-line/20"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
