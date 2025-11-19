'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CourseRegistration } from '../../types';

interface ParticipantsDialogProps {
  open: boolean;
  onClose: () => void;
  courseId: number;
  meetingLink?: string;
}

export default function ParticipantsDialog({ open, onClose, courseId, meetingLink }: ParticipantsDialogProps) {
  const [participants, setParticipants] = useState<CourseRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/consulting/mentor/courses/${courseId}/participants`);
      if (response.ok) {
        const data = await response.json();
        setParticipants(data.participants);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast({
        title: 'Error',
        description: 'Failed to load participants',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (open) {
      fetchParticipants();
    }
  }, [open, fetchParticipants]);

  const copyMeetingLink = () => {
    if (meetingLink) {
      navigator.clipboard.writeText(meetingLink);
      toast({
        title: 'Copied!',
        description: 'Meeting link copied to clipboard',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Course Participants</DialogTitle>
          <DialogDescription>
            View and manage participants for this course
          </DialogDescription>
        </DialogHeader>

        {meetingLink && (
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">Google Meet Link</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={meetingLink}
                readOnly
                className="flex-1 px-3 py-2 text-sm border rounded bg-background"
              />
              <Button size="sm" variant="outline" onClick={copyMeetingLink}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={() => window.open(meetingLink, '_blank')}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">
              Registered Participants ({participants.length})
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : participants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No participants yet
            </div>
          ) : (
            <div className="space-y-2">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{participant.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{participant.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {participant.userEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={participant.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                      {participant.paymentStatus}
                    </Badge>
                    {participant.attended && (
                      <Badge variant="outline">Attended</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
