'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, DollarSign, Video, ExternalLink, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface CourseRegistration {
  id: number;
  courseId: number;
  registeredAt: string;
  paymentStatus: string;
  course: {
    id: number;
    title: string;
    description: string;
    mentorEmail: string;
    mentorName?: string;
    scheduledDate: string;
    duration: number;
    price: number;
    industry: string;
    meetingLink?: string;
    status: string;
  };
}

export default function MyCoursesPage() {
  const { user } = useUser();
  const [registrations, setRegistrations] = useState<CourseRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyRegistrations();
    }
  }, [user]);

  const fetchMyRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/consulting/courses/my-registrations');
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.registrations || []);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your courses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = (meetingLink?: string, courseId?: number) => {
    if (meetingLink) {
      // Check if it's an internal meeting link
      if (meetingLink.startsWith('/meeting/')) {
        window.location.href = meetingLink;
      } else {
        window.open(meetingLink, '_blank');
      }
    } else {
      toast({
        title: 'Info',
        description: 'Meeting link will be available when the session starts',
      });
    }
  };

  const upcomingCourses = registrations.filter(r => 
    r.course && new Date(r.course.scheduledDate) > new Date()
  );
  const pastCourses = registrations.filter(r => 
    r.course && new Date(r.course.scheduledDate) <= new Date()
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <Link href="/consulting" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Consulting
        </Link>
        <h1 className="text-4xl font-bold mb-2">My Courses</h1>
        <p className="text-muted-foreground">
          View and manage your registered courses
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingCourses.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastCourses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingCourses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No upcoming courses</h3>
                <p className="text-muted-foreground mb-4">
                  Browse available courses and register to get started
                </p>
                <Link href="/consulting/courses">
                  <Button>Browse Courses</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingCourses.map(reg => (
                <Card key={reg.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{reg.course.title}</CardTitle>
                      <Badge variant={reg.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                        {reg.paymentStatus}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {reg.course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(reg.course.scheduledDate), 'PPP p')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{reg.course.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{reg.course.industry}</Badge>
                    </div>
                    
                    <div className="pt-4 flex gap-2">
                      <Button 
                        className="flex-1" 
                        onClick={() => handleJoinMeeting(reg.course.meetingLink, reg.course.id)}
                        disabled={!reg.course.meetingLink}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Join Meeting
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastCourses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No past courses</h3>
                <p className="text-muted-foreground">
                  Your completed courses will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {pastCourses.map(reg => (
                <Card key={reg.id} className="hover:shadow-lg transition-shadow opacity-75">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{reg.course.title}</CardTitle>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {reg.course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(reg.course.scheduledDate), 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{reg.course.industry}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
