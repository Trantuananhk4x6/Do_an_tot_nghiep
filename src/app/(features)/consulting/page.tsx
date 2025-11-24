'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, GraduationCap, Network, MessageSquare, Sparkles, Shuffle, Filter, MapPin } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import Animated3DBackground from '@/components/ui/Animated3DBackground';
import ProfileDropdown from '@/components/ui/ProfileDropdown';
import MatchingCard from '@/components/ui/MatchingCard';
import MatchModal from '@/components/ui/MatchModal';
import { useToast } from '@/hooks/use-toast';

export default function ConsultingAndConnectionPage() {
  const isMobile = useIsMobile();
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('network');
  const [matchingMode, setMatchingMode] = useState<'industry' | 'random' | 'location'>('industry');
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [matchedUsers, setMatchedUsers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<any>(null);

  // Fetch users based on matching mode
  useEffect(() => {
    fetchUsers();
  }, [matchingMode]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/consulting/users?mode=${matchingMode}&limit=20`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setCurrentUserIndex(0);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load users',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async (userId: string, type: 'like' | 'call' | 'message') => {
    try {
      const currentUser = users[currentUserIndex];
      const response = await fetch('/api/consulting/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUserEmail: currentUser.userEmail,
          type,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.isMatch) {
          // Show match modal
          setMatchedUser(currentUser);
          setShowMatchModal(true);
        } else {
          toast({
            title: type === 'like' ? 'Liked!' : type === 'call' ? 'Call request sent!' : 'Message sent!',
            description: data.message,
          });
        }
        
        setMatchedUsers([...matchedUsers, { userId, type }]);
        setCurrentUserIndex((prev) => prev + 1);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send request',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating match:', error);
      toast({
        title: 'Error',
        description: 'Failed to send request',
        variant: 'destructive',
      });
    }
  };

  const handleSkip = (userId: string) => {
    console.log(`Skipped user ${userId}`);
    setCurrentUserIndex((prev) => prev + 1);
  };

  const currentUser = users[currentUserIndex];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Animated3DBackground />
      
      {/* Fixed Header với Profile Dropdown */}
      <div
        className="fixed top-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-purple-500/20"
        style={{ left: isMobile ? 0 : 'var(--sidebar-width)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"
            >
              <Network className="w-5 h-5 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Consulting & Network
            </h1>
          </div>
          
          <ProfileDropdown />
        </div>
      </div>

      {/* Main Content - Full Screen */}
      <div className="relative z-10 pt-20 min-h-screen">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full">
        {/* Tab Navigation */}
        <div className="bg-gray-900/50 backdrop-blur-sm border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-6">
            <TabsList className="bg-transparent border-0 h-14">
              <TabsTrigger 
                value="network" 
                className="text-base data-[state=active]:bg-purple-500/20 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
              >
                <Network className="mr-2 h-5 w-5" />
                Professional Network
              </TabsTrigger>
              <TabsTrigger 
                value="consulting"
                className="text-base data-[state=active]:bg-purple-500/20 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                Mentorship
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Professional Network Tab - Matching Interface */}
        <TabsContent value="network" className="mt-0 min-h-[calc(100vh-140px)]">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Matching Mode Selector */}
            <div className="mb-8 flex items-center justify-center gap-4">
              <Button
                variant={matchingMode === 'industry' ? 'default' : 'outline'}
                onClick={() => setMatchingMode('industry')}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Same Industry
              </Button>
              <Button
                variant={matchingMode === 'location' ? 'default' : 'outline'}
                onClick={() => setMatchingMode('location')}
                className="gap-2"
              >
                <MapPin className="w-4 h-4" />
                Same Location
              </Button>
              <Button
                variant={matchingMode === 'random' ? 'default' : 'outline'}
                onClick={() => setMatchingMode('random')}
                className="gap-2"
              >
                <Shuffle className="w-4 h-4" />
                Random Match
              </Button>
            </div>

            {/* Matching Description */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {matchingMode === 'industry' && 'Connect with professionals in your industry'}
                {matchingMode === 'location' && 'Meet people in your city'}
                {matchingMode === 'random' && 'Discover new connections randomly'}
              </h2>
              <p className="text-gray-400">
                {matchingMode === 'industry' && 'Match with professionals who share your industry interests'}
                {matchingMode === 'location' && 'Connect with nearby professionals for networking'}
                {matchingMode === 'random' && 'Explore diverse connections and expand your network'}
              </p>
            </div>

            {/* Matching Card */}
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                  <p className="text-gray-400 mt-4">Loading profiles...</p>
                </div>
              ) : currentUser ? (
                <MatchingCard
                  key={currentUserIndex}
                  user={{
                    id: currentUser.id || currentUser.userEmail,
                    fullName: currentUser.fullName,
                    avatar: currentUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + currentUser.fullName,
                    currentPosition: currentUser.currentPosition || 'Professional',
                    industry: currentUser.industry || 'General',
                    location: currentUser.location,
                    yearsOfExperience: currentUser.yearsOfExperience,
                    skills: currentUser.skills || [],
                    bio: currentUser.bio,
                    matchScore: currentUser.matchScore,
                  }}
                  onMatch={handleMatch}
                  onSkip={handleSkip}
                />
              ) : (
                <div className="text-center py-20">
                  <p className="text-2xl text-gray-400 mb-4">No more profiles</p>
                  <Button onClick={fetchUsers} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Reload
                  </Button>
                </div>
              )}
            </AnimatePresence>

            {/* Match Modal */}
            {matchedUser && (
              <MatchModal
                isOpen={showMatchModal}
                onClose={() => setShowMatchModal(false)}
                matchedUser={{
                  fullName: matchedUser.fullName,
                  avatar: matchedUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + matchedUser.fullName,
                  currentPosition: matchedUser.currentPosition || 'Professional',
                  industry: matchedUser.industry || 'General',
                }}
              />
            )}

            {/* Stats */}
            <div className="mt-8 flex justify-center gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-purple-400">{matchedUsers.length}</p>
                <p className="text-sm text-gray-400">Matches Today</p>
              </div>
              <div className="w-px bg-purple-500/20" />
              <div>
                <p className="text-3xl font-bold text-blue-400">{currentUserIndex + 1}</p>
                <p className="text-sm text-gray-400">Profiles Viewed</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Mentorship Tab */}
        <TabsContent value="consulting" className="mt-0 min-h-[calc(100vh-140px)]">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Mentor Option */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="h-full hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer border-purple-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <GraduationCap className="h-12 w-12 text-purple-400" />
                    </div>
                    <CardTitle className="text-2xl text-white">Become a Mentor</CardTitle>
                    <CardDescription className="text-gray-400">
                      Share your expertise and create courses for aspiring professionals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">✓</span>
                        Create and schedule courses
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">✓</span>
                        Set your own pricing
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">✓</span>
                        Automatic Google Meet integration
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">✓</span>
                        Manage participants and schedule
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">✓</span>
                        Share your portfolio
                      </li>
                    </ul>
                    <Link href="/consulting/mentor">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" size="lg">
                        Start Teaching
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Student Option */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer border-blue-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Users className="h-12 w-12 text-blue-400" />
                    </div>
                    <CardTitle className="text-2xl text-white">Join as Student</CardTitle>
                    <CardDescription className="text-gray-400">
                      Learn from experienced mentors and attend expert-led sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        Browse available courses
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        View mentor portfolios
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        Register for sessions
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        Join via Google Meet
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        Rate and review courses
                      </li>
                    </ul>
                    <Link href="/consulting/courses">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600" size="lg">
                        Browse Courses
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Additional Features */}
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <Link href="/consulting/network/connections">
                <Card className="hover:shadow-md hover:shadow-purple-500/20 transition-all cursor-pointer h-full border-purple-500/20">
                  <CardHeader>
                    <Users className="h-10 w-10 text-purple-400 mb-2" />
                    <CardTitle className="text-lg text-white">My Connections</CardTitle>
                    <CardDescription className="text-gray-400">
                      View and manage your professional connections
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/consulting/network/messages">
                <Card className="hover:shadow-md hover:shadow-blue-500/20 transition-all cursor-pointer h-full border-blue-500/20">
                  <CardHeader>
                    <MessageSquare className="h-10 w-10 text-blue-400 mb-2" />
                    <CardTitle className="text-lg text-white">Messages</CardTitle>
                    <CardDescription className="text-gray-400">
                      Chat with your connections and build relationships
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/consulting/profile">
                <Card className="hover:shadow-md hover:shadow-green-500/20 transition-all cursor-pointer h-full border-green-500/20">
                  <CardHeader>
                    <GraduationCap className="h-10 w-10 text-green-400 mb-2" />
                    <CardTitle className="text-lg text-white">My Profile</CardTitle>
                    <CardDescription className="text-gray-400">
                      Complete your professional profile
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
