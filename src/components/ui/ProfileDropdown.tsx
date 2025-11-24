'use client';

import { useState } from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, Briefcase, MapPin, Edit } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfileDropdown() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-all duration-200"
      >
        <Image
          src={user.imageUrl}
          alt={user.fullName || 'User'}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full border-2 border-purple-400/50 hover:border-purple-400 transition-all"
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* User Info */}
              <div className="p-4 border-b border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                <div className="flex items-center gap-3">
                  <Image
                    src={user.imageUrl}
                    alt={user.fullName || 'User'}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full border-2 border-purple-400/50"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {user.fullName}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <Link
                  href="/consulting/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-500/20 transition-all duration-200 text-gray-300 hover:text-white group"
                >
                  <User className="w-5 h-5 text-purple-400" />
                  <div className="flex-1">
                    <p className="font-medium">My Profile</p>
                    <p className="text-xs text-gray-500">View and edit profile</p>
                  </div>
                </Link>

                <Link
                  href="/consulting/profile/edit"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-500/20 transition-all duration-200 text-gray-300 hover:text-white group"
                >
                  <Edit className="w-5 h-5 text-blue-400" />
                  <div className="flex-1">
                    <p className="font-medium">Edit Profile</p>
                    <p className="text-xs text-gray-500">Update your information</p>
                  </div>
                </Link>

                <Link
                  href="/consulting/my-courses"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-500/20 transition-all duration-200 text-gray-300 hover:text-white group"
                >
                  <Briefcase className="w-5 h-5 text-green-400" />
                  <div className="flex-1">
                    <p className="font-medium">My Courses</p>
                    <p className="text-xs text-gray-500">Manage your courses</p>
                  </div>
                </Link>

                <Link
                  href="/consulting/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-500/20 transition-all duration-200 text-gray-300 hover:text-white group"
                >
                  <Settings className="w-5 h-5 text-orange-400" />
                  <div className="flex-1">
                    <p className="font-medium">Settings</p>
                    <p className="text-xs text-gray-500">Privacy and preferences</p>
                  </div>
                </Link>

                <div className="border-t border-purple-500/20 my-2" />

                <SignOutButton>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 transition-all duration-200 text-gray-300 hover:text-red-400 group">
                    <LogOut className="w-5 h-5 text-red-400" />
                    <div className="flex-1 text-left">
                      <p className="font-medium">Sign Out</p>
                      <p className="text-xs text-gray-500">Log out of your account</p>
                    </div>
                  </button>
                </SignOutButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
