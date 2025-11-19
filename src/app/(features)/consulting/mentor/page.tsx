'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Users, DollarSign, Video } from 'lucide-react';
import Link from 'next/link';
import { MentorCourse } from '../types';
import CreateCourseDialog from './components/CreateCourseDialog';
import CourseCard from './components/CourseCard';
import { toast } from '@/hooks/use-toast';

export default function MentorDashboard() {
  const { user } = useUser();
  const [courses, setCourses] = useState<MentorCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMyCourses();
    }
  }, [user]);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/consulting/mentor/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your courses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const scheduledCourses = courses.filter(c => c.status === 'scheduled');
  const completedCourses = courses.filter(c => c.status === 'completed');
  const totalRevenue = courses.reduce((sum, c) => sum + (c.price * c.currentParticipants), 0);
  const totalStudents = courses.reduce((sum, c) => sum + c.currentParticipants, 0);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Mentor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your courses and connect with students
          </p>
        </div>
        <Button size="lg" onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-5 w-5" />
          Create Course
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{scheduledCourses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalRevenue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Tabs */}
      <Tabs defaultValue="scheduled" className="space-y-6">
        <TabsList>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : scheduledCourses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No scheduled courses</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first course to start teaching
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Course
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {scheduledCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isMentor={true}
                  onUpdate={fetchMyCourses}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedCourses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No completed courses yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {completedCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isMentor={true}
                  onUpdate={fetchMyCourses}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {courses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No courses yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {courses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isMentor={true}
                  onUpdate={fetchMyCourses}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateCourseDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={fetchMyCourses}
      />
    </div>
  );
}
