'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedUser: {
    fullName: string;
    avatar: string;
    currentPosition: string;
    industry: string;
  };
}

export default function MatchModal({ isOpen, onClose, matchedUser }: MatchModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-purple-500/30 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Hearts Animation */}
              <div className="relative mb-6">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center"
                >
                  <Heart className="w-12 h-12 text-white fill-current" />
                </motion.div>

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: [-20, -60],
                      x: Math.sin(i) * 30,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                    className="absolute top-0 left-1/2 w-2 h-2 bg-pink-400 rounded-full"
                  />
                ))}
              </div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                It's a Match!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center text-gray-300 mb-6"
              >
                You and {matchedUser.fullName} liked each other
              </motion.p>

              {/* User Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-900/50 rounded-2xl p-4 mb-6"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={matchedUser.avatar}
                    alt={matchedUser.fullName}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full border-2 border-purple-400"
                  />
                  <div>
                    <h3 className="font-semibold text-white text-lg">
                      {matchedUser.fullName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {matchedUser.currentPosition}
                    </p>
                    <p className="text-xs text-purple-300">
                      {matchedUser.industry}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  size="lg"
                  onClick={() => {
                    // TODO: Navigate to chat
                    onClose();
                  }}
                >
                  Send Message
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-purple-500/30 hover:bg-purple-500/10"
                  onClick={onClose}
                >
                  Keep Swiping
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
