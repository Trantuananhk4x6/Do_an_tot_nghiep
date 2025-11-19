import React from "react";
import { User, UserCircle2 } from "lucide-react";
import MessageAudioProgress from "./messageAudioProgress";
import { cn } from "@/lib/utils";

interface TranscriptMessageProps {
  isUser: boolean;
  message: string;
  timestamp: string;
  isPlaying?: boolean;
}

const TranscriptMessage: React.FC<TranscriptMessageProps> = ({
  isUser,
  message,
  timestamp,
  isPlaying = false,
}) => (
  <div className="flex w-full">
    <div
      className={cn(
        "flex gap-4 max-w-[80%]",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300",
          isUser 
            ? "bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30" 
            : "bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10"
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <UserCircle2 className="h-5 w-5 text-purple-300" />
        )}
      </div>
      <div
        className={cn(
          "flex-1 rounded-2xl px-4 py-3 transition-all duration-300",
          isUser
            ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-tr-none shadow-lg shadow-purple-500/20"
            : "bg-white/5 backdrop-blur-sm border border-white/10 rounded-tl-none hover:bg-white/10"
        )}
      >
        <p className="text-sm break-words leading-relaxed">{message}</p>
        <span
          className={cn(
            "text-xs mt-2 block opacity-70",
            isUser ? "text-white" : "text-gray-400"
          )}
        >
          {timestamp}
        </span>
        {!isUser && <MessageAudioProgress isPlaying={isPlaying} />}
      </div>
    </div>
  </div>
);

export default TranscriptMessage;
