'use client';

import { motion } from 'framer-motion';
import { Heart, X, Phone, MessageCircle, MapPin, Briefcase, GraduationCap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface MatchingCardProps {
  user: {
    id: string;
    fullName: string;
    avatar: string;
    currentPosition: string;
    industry: string;
    location?: string;
    yearsOfExperience?: number;
    skills: string[];
    bio?: string;
    matchScore?: number;
  };
  onMatch: (userId: string, type: 'like' | 'call' | 'message') => void;
  onSkip: (userId: string) => void;
}

export default function MatchingCard({ user, onMatch, onSkip }: MatchingCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl">
        {/* Match Score Badge */}
        {user.matchScore && (
          <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold">{user.matchScore}%</span>
          </div>
        )}

        {/* Profile Image */}
        <div className="relative h-96 w-full overflow-hidden">
          <Image
            src={user.avatar || '/images/default-avatar.png'}
            alt={user.fullName}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>

        {/* User Info */}
        <div className="p-6 space-y-4">
          {/* Name and Position */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{user.fullName}</h2>
            <div className="flex items-center gap-2 text-purple-300">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm">{user.currentPosition}</span>
            </div>
          </div>

          {/* Industry and Location */}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              <span>{user.industry}</span>
            </div>
            {user.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            )}
            {user.yearsOfExperience && (
              <div className="flex items-center gap-1">
                <span>{user.yearsOfExperience} years exp</span>
              </div>
            )}
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-gray-300 text-sm line-clamp-3">{user.bio}</p>
          )}

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {user.skills.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300"
              >
                {skill}
              </span>
            ))}
            {user.skills.length > 5 && (
              <span className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-400">
                +{user.skills.length - 5} more
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4">
            {/* Skip */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSkip(user.id)}
              className="w-14 h-14 rounded-full bg-gray-800/80 hover:bg-gray-700 border border-gray-600 flex items-center justify-center transition-all duration-200"
            >
              <X className="w-6 h-6 text-gray-400" />
            </motion.button>

            {/* Call */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onMatch(user.id, 'call')}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/50 transition-all duration-200"
            >
              <Phone className="w-6 h-6 text-white" />
            </motion.button>

            {/* Like/Match */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onMatch(user.id, 'like')}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50 transition-all duration-200"
            >
              <Heart className="w-7 h-7 text-white" />
            </motion.button>

            {/* Message */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onMatch(user.id, 'message')}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 flex items-center justify-center shadow-lg shadow-green-500/50 transition-all duration-200"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.button>
          </div>

          {/* Action Labels */}
          <div className="flex items-center justify-center gap-8 text-xs text-gray-500">
            <span>Skip</span>
            <span className="text-blue-400">Call</span>
            <span className="text-purple-400 font-semibold">Match</span>
            <span className="text-green-400">Message</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
