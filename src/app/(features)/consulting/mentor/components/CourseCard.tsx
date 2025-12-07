'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Users, DollarSign, Video, ExternalLink, Trash2 } from 'lucide-react';
import { MentorCourse } from '../../types';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import ParticipantsDialog from './ParticipantsDialog';

interface CourseCardProps {
  course: MentorCourse;
  isMentor?: boolean;
  onUpdate?: () => void;
  onRegister?: () => void;
}

export default function CourseCard({ course, isMentor = false, onUpdate, onRegister }: CourseCardProps) {
  const [loading, setLoading] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const isFull = course.currentParticipants >= course.maxParticipants;
  const scheduledDate = new Date(course.scheduledDate);
  const isUpcoming = scheduledDate > new Date();
  const canStartMeeting = scheduledDate <= new Date() && course.status === 'scheduled';

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/consulting/mentor/courses/${course.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Course deleted successfully',
        });
        onUpdate?.();
      } else {
        throw new Error('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete course',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartMeeting = async () => {
    // Navigate to internal meeting room instead of external link
    window.location.href = `/consulting/meeting/${course.id}`;
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </div>
            <Badge variant={course.status === 'scheduled' ? 'default' : 'secondary'}>
              {course.status}
            </Badge>
          </div>

          {!isMentor && course.mentorName && (
            <div className="flex items-center gap-2 mt-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={course.mentorAvatar} />
                <AvatarFallback>{course.mentorName[0]}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{course.mentorName}</p>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(scheduledDate, 'PPP')}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{course.duration} minutes</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span>
              {course.currentParticipants} / {course.maxParticipants} participants
            </span>
            {isFull && <Badge variant="destructive">Full</Badge>}
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold">
            <DollarSign className="h-4 w-4" />
            <span>${course.price}</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">{course.industry}</Badge>
            {course.tags?.map((tag, idx) => (
              <Badge key={idx} variant="secondary">{tag}</Badge>
            ))}
          </div>

          {course.portfolio && (
            <a
              href={course.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View Portfolio <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </CardContent>

        <CardFooter className="flex gap-2">
          {isMentor ? (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowParticipants(true)}
              >
                <Users className="mr-2 h-4 w-4" />
                View Participants
              </Button>
              {course.status === 'scheduled' && (
                <Button className="flex-1" onClick={handleStartMeeting}>
                  <Video className="mr-2 h-4 w-4" />
                  Start Meeting
                </Button>
              )}
              {course.status === 'scheduled' && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </>
          ) : (
            <>
              {isFull ? (
                <Button className="w-full" disabled>
                  Course Full
                </Button>
              ) : isUpcoming ? (
                <Button className="w-full" onClick={onRegister} disabled={loading}>
                  Register Now
                </Button>
              ) : (
                <Button className="w-full" disabled>
                  Registration Closed
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>

      {isMentor && (
        <ParticipantsDialog
          open={showParticipants}
          onClose={() => setShowParticipants(false)}
          courseId={course.id}
          meetingLink={course.meetingLink}
        />
      )}
    </>
  );
}
