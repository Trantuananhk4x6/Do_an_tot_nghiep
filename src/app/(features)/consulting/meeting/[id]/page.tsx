'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Video, Mic, MicOff, VideoOff, Loader2, ArrowLeft, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import VideoRoom to avoid SSR issues with media APIs
const VideoRoom = dynamic(() => import('@/components/ui/VideoRoom'), { ssr: false });

interface MeetingInfo {
  id: string;
  title: string;
  hostName: string;
  hostEmail: string;
  scheduledDate: string;
  duration: number;
  participantCount: number;
}

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const roomId = params.id as string;
  
  const [step, setStep] = useState<'preview' | 'meeting'>('preview');
  const [loading, setLoading] = useState(true);
  const [meetingInfo, setMeetingInfo] = useState<MeetingInfo | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [previewVideo, setPreviewVideo] = useState(true);
  const [previewAudio, setPreviewAudio] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [hasMediaAccess, setHasMediaAccess] = useState(false);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      setDisplayName(user.fullName || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'Guest');
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/consulting/meeting/${roomId}`);
        if (response.ok) {
          const data = await response.json();
          setMeetingInfo(data.meeting);
          setIsHost(data.isHost);
        } else {
          // Room doesn't exist in database, but allow joining anyway (for demo)
          setMeetingInfo({
            id: roomId,
            title: 'Meeting Room',
            hostName: 'Host',
            hostEmail: '',
            scheduledDate: new Date().toISOString(),
            duration: 60,
            participantCount: 1,
          });
        }
      } catch (error) {
        console.error('Error fetching meeting info:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInfo();
  }, [roomId]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    // Get preview stream
    const getPreview = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: previewVideo,
          audio: previewAudio,
        });
        setPreviewStream(stream);
        setHasMediaAccess(true);
      } catch (error) {
        console.error('Error accessing media:', error);
        setHasMediaAccess(false);
      }
    };

    if (step === 'preview') {
      getPreview();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [step, previewVideo, previewAudio]);

  const joinMeeting = () => {
    if (!displayName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your display name',
        variant: 'destructive',
      });
      return;
    }

    // Stop preview stream before joining
    if (previewStream) {
      previewStream.getTracks().forEach(track => track.stop());
    }
    
    setStep('meeting');
  };

  const leaveMeeting = () => {
    router.push('/consulting');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
            <h2 className="text-xl font-semibold mb-2">Loading meeting...</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'meeting') {
    return (
      <VideoRoom
        roomId={roomId}
        userName={displayName}
        isHost={isHost}
        onLeave={leaveMeeting}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Link href="/consulting" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Consulting
        </Link>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Video Preview */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-0 overflow-hidden rounded-lg">
              <div className="relative aspect-video bg-gray-900">
                {hasMediaAccess && previewVideo ? (
                  <video
                    ref={(ref) => {
                      if (ref && previewStream) {
                        ref.srcObject = previewStream;
                      }
                    }}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-purple-500 flex items-center justify-center text-5xl font-bold text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                
                {/* Preview Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                  <Button
                    variant={previewAudio ? 'outline' : 'destructive'}
                    size="icon"
                    className="rounded-full w-12 h-12"
                    onClick={() => setPreviewAudio(!previewAudio)}
                  >
                    {previewAudio ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant={previewVideo ? 'outline' : 'destructive'}
                    size="icon"
                    className="rounded-full w-12 h-12"
                    onClick={() => setPreviewVideo(!previewVideo)}
                  >
                    {previewVideo ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Join Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-green-400 border-green-400">
                  Ready to join
                </Badge>
                {isHost && (
                  <Badge className="bg-purple-500">Host</Badge>
                )}
              </div>
              <CardTitle className="text-2xl">{meetingInfo?.title || 'Meeting Room'}</CardTitle>
              <CardDescription>
                {meetingInfo?.hostName && `Hosted by ${meetingInfo.hostName}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {meetingInfo && (
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{meetingInfo.participantCount} participant(s)</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="displayName">Your Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              {!hasMediaAccess && (
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-yellow-200 text-sm">
                  ⚠️ Camera/Microphone access denied. You can still join but others won't see or hear you.
                </div>
              )}

              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                size="lg"
                onClick={joinMeeting}
              >
                <Video className="mr-2 h-5 w-5" />
                Join Meeting
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By joining, you agree to our terms of service
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
