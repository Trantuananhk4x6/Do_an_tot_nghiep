'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, DollarSign, ExternalLink } from 'lucide-react';
import { MentorCourse } from '../../types';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface RegisterCourseDialogProps {
  open: boolean;
  onClose: () => void;
  course: MentorCourse;
  onSuccess: () => void;
}

export default function RegisterCourseDialog({ open, onClose, course, onSuccess }: RegisterCourseDialogProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/consulting/courses/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          userName: user?.fullName || user?.firstName || 'User',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Success',
          description: 'Successfully registered for the course!',
        });
        onSuccess();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to register');
      }
    } catch (error: any) {
      console.error('Error registering for course:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to register for course',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const scheduledDate = new Date(course.scheduledDate);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{course.title}</DialogTitle>
          <DialogDescription>
            Review course details before registering
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{course.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Scheduled Date</p>
                <p className="text-muted-foreground">{format(scheduledDate, 'PPP')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Duration</p>
                <p className="text-muted-foreground">{course.duration} minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Participants</p>
                <p className="text-muted-foreground">
                  {course.currentParticipants} / {course.maxParticipants}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Price</p>
                <p className="text-muted-foreground">${course.price}</p>
              </div>
            </div>
          </div>

          {course.mentorName && (
            <div>
              <h3 className="font-semibold mb-2">Mentor</h3>
              <p className="text-muted-foreground">{course.mentorName}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Industry</h3>
            <Badge>{course.industry}</Badge>
          </div>

          {course.tags && course.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {course.portfolio && (
            <div>
              <h3 className="font-semibold mb-2">Mentor Portfolio</h3>
              <a
                href={course.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                View Portfolio <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              After registration, you'll receive the Google Meet link closer to the scheduled time.
              Payment processing will be handled separately.
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleRegister} disabled={loading}>
            {loading ? 'Registering...' : 'Confirm Registration'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
