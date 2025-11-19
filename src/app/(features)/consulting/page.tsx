'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, GraduationCap, Network, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function ConsultingAndConnectionPage() {
  const { user } = useUser();
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Consulting & Connection</h1>
        <p className="text-muted-foreground text-lg">
          Connect with industry professionals, learn from mentors, and expand your network
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="consulting" className="text-lg">
            <GraduationCap className="mr-2 h-5 w-5" />
            Mentorship & Consulting
          </TabsTrigger>
          <TabsTrigger value="networking" className="text-lg">
            <Network className="mr-2 h-5 w-5" />
            Professional Network
          </TabsTrigger>
        </TabsList>

        <TabsContent value="consulting" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mentor Option */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <GraduationCap className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl">Become a Mentor</CardTitle>
                <CardDescription>
                  Share your expertise and create courses for aspiring professionals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Create and schedule courses</li>
                  <li>✓ Set your own pricing</li>
                  <li>✓ Automatic Google Meet integration</li>
                  <li>✓ Manage participants and schedule</li>
                  <li>✓ Share your portfolio</li>
                </ul>
                <Link href="/consulting/mentor">
                  <Button className="w-full" size="lg">
                    Start Teaching
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Student Option */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl">Join as Student</CardTitle>
                <CardDescription>
                  Learn from experienced mentors and attend expert-led sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Browse available courses</li>
                  <li>✓ View mentor portfolios</li>
                  <li>✓ Register for sessions</li>
                  <li>✓ Join via Google Meet</li>
                  <li>✓ Rate and review courses</li>
                </ul>
                <Link href="/consulting/courses">
                  <Button className="w-full" size="lg" variant="outline">
                    Browse Courses
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="networking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Professional Networking</CardTitle>
              <CardDescription>
                Connect with professionals in your industry and expand your network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/consulting/network/discover" className="block">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <Network className="h-10 w-10 text-primary mb-2" />
                      <CardTitle className="text-lg">Discover People</CardTitle>
                      <CardDescription>
                        Find professionals by industry, experience, and skills
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/consulting/network/connections" className="block">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <Users className="h-10 w-10 text-primary mb-2" />
                      <CardTitle className="text-lg">My Connections</CardTitle>
                      <CardDescription>
                        View and manage your professional connections
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/consulting/network/messages" className="block">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <MessageSquare className="h-10 w-10 text-primary mb-2" />
                      <CardTitle className="text-lg">Messages</CardTitle>
                      <CardDescription>
                        Chat with your connections and build relationships
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </div>

              {/* Quick Setup Profile */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Complete Your Profile</h3>
                <p className="text-muted-foreground mb-4">
                  Set up your professional profile to start connecting with others
                </p>
                <Link href="/consulting/profile">
                  <Button size="lg">
                    Setup Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
