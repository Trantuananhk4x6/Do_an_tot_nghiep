'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  Users, MessageSquare, Settings, MonitorUp, 
  Hand, MoreVertical, Copy, Check, Loader2,
  Volume2, VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isHost: boolean;
  stream?: MediaStream;
}

interface VideoRoomProps {
  roomId: string;
  userName: string;
  isHost: boolean;
  onLeave: () => void;
}

export default function VideoRoom({ roomId, userName, isHost, onLeave }: VideoRoomProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [copied, setCopied] = useState(false);
  const [handRaised, setHandRaised] = useState(false);

  // Initialize local media
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const initMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // Add self as participant
        setParticipants([{
          id: 'local',
          name: userName,
          isMuted: false,
          isVideoOff: false,
          isHost: isHost,
          stream: stream,
        }]);
        
        setIsConnecting(false);
        
        toast({
          title: 'Connected',
          description: 'You have joined the meeting',
        });
      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast({
          title: 'Error',
          description: 'Failed to access camera/microphone. Please check permissions.',
          variant: 'destructive',
        });
        setIsConnecting(false);
      }
    };

    initMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [userName, isHost]);

  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        
        setParticipants(prev => prev.map(p => 
          p.id === 'local' ? { ...p, isMuted: !audioTrack.enabled } : p
        ));
      }
    }
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
        
        setParticipants(prev => prev.map(p => 
          p.id === 'local' ? { ...p, isVideoOff: !videoTrack.enabled } : p
        ));
      }
    }
  }, [localStream]);

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.stop();
        }
        // Restart camera
        try {
          const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setLocalStream(newStream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = newStream;
          }
        } catch (error) {
          console.error('Error restarting camera:', error);
        }
      }
      setIsScreenSharing(false);
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setLocalStream(screenStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
        
        // Handle when user stops sharing via browser UI
        screenStream.getVideoTracks()[0].onended = () => {
          toggleScreenShare();
        };
      } catch (error) {
        console.error('Error sharing screen:', error);
        toast({
          title: 'Error',
          description: 'Failed to share screen',
          variant: 'destructive',
        });
      }
    }
  };

  const leaveMeeting = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    onLeave();
  };

  const copyMeetingLink = () => {
    const link = `${window.location.origin}/consulting/meeting/${roomId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied',
      description: 'Meeting link copied to clipboard',
    });
  };

  const toggleHandRaise = () => {
    setHandRaised(!handRaised);
    toast({
      title: handRaised ? 'Hand lowered' : 'Hand raised',
      description: handRaised ? 'You have lowered your hand' : 'The host will see your raised hand',
    });
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
            <h2 className="text-xl font-semibold mb-2">Connecting to meeting...</h2>
            <p className="text-gray-400">Please allow camera and microphone access</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-white font-semibold">Meeting Room</h1>
          <Badge variant="outline" className="text-green-400 border-green-400">
            Live
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={copyMeetingLink}
            className="gap-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          
          <div className="text-gray-400 text-sm">
            Room: {roomId.slice(0, 8)}...
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Grid */}
        <div className="flex-1 p-4">
          <div className={`grid gap-4 h-full ${
            participants.length === 1 ? 'grid-cols-1' :
            participants.length <= 4 ? 'grid-cols-2' :
            'grid-cols-3'
          }`}>
            {/* Local Video */}
            <motion.div
              layout
              className="relative bg-gray-800 rounded-2xl overflow-hidden aspect-video"
            >
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
              />
              
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="w-24 h-24 rounded-full bg-purple-500 flex items-center justify-center text-3xl font-bold text-white">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
              
              {/* User Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
                  <span className="text-white text-sm">{userName} (You)</span>
                  {isHost && (
                    <Badge className="bg-purple-500 text-xs">Host</Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {isMuted && (
                    <div className="bg-red-500 p-1 rounded-full">
                      <MicOff className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {handRaised && (
                    <div className="bg-yellow-500 p-1 rounded-full animate-pulse">
                      <Hand className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Screen Share Indicator */}
              {isScreenSharing && (
                <div className="absolute top-4 left-4 bg-green-500 px-3 py-1 rounded-full text-white text-sm flex items-center gap-2">
                  <MonitorUp className="h-4 w-4" />
                  Sharing Screen
                </div>
              )}
            </motion.div>

            {/* Other Participants (placeholder for future WebRTC implementation) */}
            {participants.slice(1).map((participant) => (
              <motion.div
                key={participant.id}
                layout
                className="relative bg-gray-800 rounded-2xl overflow-hidden aspect-video"
              >
                {participant.isVideoOff ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-3xl font-bold text-white">
                      {participant.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                ) : (
                  <video
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
                
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
                    <span className="text-white text-sm">{participant.name}</span>
                    {participant.isHost && (
                      <Badge className="bg-purple-500 text-xs">Host</Badge>
                    )}
                  </div>
                  
                  {participant.isMuted && (
                    <div className="bg-red-500 p-1 rounded-full">
                      <MicOff className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <AnimatePresence>
          {(showChat || showParticipants) && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-gray-800 border-l border-gray-700 overflow-hidden"
            >
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">
                    {showParticipants ? 'Participants' : 'Chat'}
                  </h3>
                  <Badge>{participants.length}</Badge>
                </div>
                
                {showParticipants && (
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {participants.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700">
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">
                            {p.name} {p.id === 'local' && '(You)'}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {p.isHost ? 'Host' : 'Participant'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {p.isMuted ? (
                            <MicOff className="h-4 w-4 text-red-400" />
                          ) : (
                            <Mic className="h-4 w-4 text-green-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {showChat && (
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto mb-4">
                      <p className="text-gray-400 text-center py-8">
                        No messages yet
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-700 border-none rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <Button size="icon">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-4">
        <div className="flex items-center justify-center gap-4">
          {/* Mute/Unmute */}
          <Button
            variant={isMuted ? 'destructive' : 'outline'}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={toggleMute}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>
          
          {/* Video On/Off */}
          <Button
            variant={isVideoOff ? 'destructive' : 'outline'}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={toggleVideo}
          >
            {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
          </Button>
          
          {/* Screen Share */}
          <Button
            variant={isScreenSharing ? 'default' : 'outline'}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={toggleScreenShare}
          >
            <MonitorUp className="h-6 w-6" />
          </Button>
          
          {/* Raise Hand */}
          <Button
            variant={handRaised ? 'default' : 'outline'}
            size="lg"
            className={`rounded-full w-14 h-14 ${handRaised ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
            onClick={toggleHandRaise}
          >
            <Hand className="h-6 w-6" />
          </Button>
          
          {/* Participants */}
          <Button
            variant={showParticipants ? 'default' : 'outline'}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={() => {
              setShowParticipants(!showParticipants);
              setShowChat(false);
            }}
          >
            <Users className="h-6 w-6" />
          </Button>
          
          {/* Chat */}
          <Button
            variant={showChat ? 'default' : 'outline'}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={() => {
              setShowChat(!showChat);
              setShowParticipants(false);
            }}
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
          
          {/* Leave Meeting */}
          <Button
            variant="destructive"
            size="lg"
            className="rounded-full w-14 h-14 ml-4"
            onClick={leaveMeeting}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
