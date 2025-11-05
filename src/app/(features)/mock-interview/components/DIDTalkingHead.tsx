import React, { useState, useEffect, useRef } from "react";
import StaticTalkingAvatar from "./StaticTalkingAvatar";

interface DIDTalkingHeadProps {
  text: string;
  avatarUrl?: string;
  voiceGender?: string;
  isSpeaking?: boolean; // ✅ Receive from parent based on actual voice playback
  onVideoReady?: () => void;
  onVideoEnd?: () => void;
}

/**
 * 🎨 CSS ANIMATION MODE - No D-ID API Cost!
 * 
 * This component uses pure CSS animations to create a professional
 * talking avatar effect without any API costs.
 * 
 * Now synchronized with actual voice playback state!
 */
const DIDTalkingHead: React.FC<DIDTalkingHeadProps> = ({ 
  text, 
  avatarUrl, 
  voiceGender = 'female',
  isSpeaking = false, // ✅ Default to false
  onVideoReady,
  onVideoEnd 
}) => {
  useEffect(() => {
    console.log('🎨 CSS Animation Mode - StaticTalkingAvatar');
    console.log('📝 Text:', text?.substring(0, 50) + '...');
    console.log('🖼️ Avatar URL:', avatarUrl);
    console.log('🎤 Voice Gender:', voiceGender);
    console.log('🔊 Is Speaking:', isSpeaking);
  }, [text, avatarUrl, voiceGender, isSpeaking]);

  // Use default avatar if none provided
  const defaultAvatarUrl = voiceGender === 'male'
    ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    : "https://images.unsplash.com/photo-1494790108755-2616b612b15c?w=400&h=400&fit=crop&crop=face";

  const finalAvatarUrl = avatarUrl || defaultAvatarUrl;

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <StaticTalkingAvatar 
        avatarUrl={finalAvatarUrl}
        isSpeaking={isSpeaking} 
        voiceGender={voiceGender}
      />
    </div>
  );
};

export default DIDTalkingHead;

