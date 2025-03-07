'use client';

import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWindow from './ChatWindow';
import { useTheme } from 'next-themes';

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Determine solid background color based on theme
  const getBgColor = () => {
    if (typeof window === 'undefined') return '#ffffff';
    
    // Use solid colors instead of CSS variables
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      return '#1a1a1a'; // Dark background
    }
    return '#ffffff'; // Light background
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{ 
              backgroundColor: getBgColor(),
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
            }}
            className="absolute bottom-16 right-0 mb-2 w-80 sm:w-96 h-[500px] rounded-lg overflow-hidden border border-border"
          >
            {/* Multiple background layers for maximum opacity */}
            <div className="absolute inset-0" style={{ backgroundColor: getBgColor(), opacity: 1 }} />
            <div className="absolute inset-0" style={{ backgroundColor: getBgColor(), opacity: 1 }} />
            <div className="absolute inset-0" style={{ backgroundColor: getBgColor(), opacity: 1 }} />
            
            {/* Content layer */}
            <div className="relative z-10 h-full" style={{ backgroundColor: getBgColor() }}>
              <ChatWindow onClose={toggleChat} bgColor={getBgColor()} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
        style={{
          backgroundColor: theme === 'dark' ? '#7c3aed' : '#8b5cf6', // Solid purple color
          color: '#ffffff'
        }}
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </motion.button>
    </div>
  );
} 