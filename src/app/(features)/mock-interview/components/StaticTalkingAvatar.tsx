import React from 'react';
import Image from 'next/image';

interface StaticTalkingAvatarProps {
  avatarUrl: string;
  isSpeaking: boolean;
  voiceGender?: string;
}

const StaticTalkingAvatar: React.FC<StaticTalkingAvatarProps> = ({ 
  avatarUrl, 
  isSpeaking,
  voiceGender = 'female'
}) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Outer glow effect (only when speaking) */}
      {isSpeaking && (
        <>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 animate-pulse blur-xl"></div>
          <div className="absolute -inset-2 rounded-2xl border-2 border-blue-500/30 animate-ping"></div>
        </>
      )}
      
      {/* Main avatar container */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gray-900">
        <div className="relative w-full aspect-square">
          <Image
            src={avatarUrl}
            alt="AI Interviewer"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
        
        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Sound waves */}
            <div className="flex justify-center gap-1 mb-3">
              {[1, 2, 3, 2, 1].map((height, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-white rounded-full animate-sound-wave"
                  style={{
                    height: `${height * 8}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                ></div>
              ))}
            </div>
            
            {/* Status badge */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2 shadow-lg backdrop-blur-sm">
              <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span className="font-semibold">AI is speaking...</span>
            </div>
          </div>
        )}
        
        {/* Not speaking state */}
        {!isSpeaking && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-700/80 text-white px-4 py-2 rounded-full text-xs font-medium backdrop-blur-sm">
              Waiting for your response...
            </div>
          </div>
        )}
      </div>
      
      {/* Info badge */}
      <div className="absolute top-2 right-2 bg-blue-600/90 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm shadow-lg">
        💬 Voice Mode
      </div>
    </div>
  );
};

export default StaticTalkingAvatar;
