"use client";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { Markdown } from "@/components/ui/markdown";
import { Zap, Hand } from "lucide-react";

let socket;
let recorder;

const Page = () => {
  const { messages, append, isLoading } = useChat({
    api: "/api/live-interview",
    maxSteps: 2,
  });
  const [transcript, setTranscript] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState("manual"); // "auto" or "manual"
  const [lastProcessedLength, setLastProcessedLength] = useState(0);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isSharing) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isSharing]);

  // Auto mode: Detect questions and auto-answer
  useEffect(() => {
    if (mode === "auto" && transcript.length > lastProcessedLength) {
      const fullText = transcript.join("");
      const newText = fullText.substring(lastProcessedLength);
      
      // Detect question patterns
      const questionPatterns = [
        /(?:what|how|why|when|where|who|which|can you|could you|would you|do you|are you|is it|will you|should)[^.!?]*\?/gi,
        /(?:tell me|explain|describe|discuss)[^.!?]*[.?]/gi,
      ];
      
      let detectedQuestion = null;
      for (const pattern of questionPatterns) {
        const match = newText.match(pattern);
        if (match && match[0]) {
          detectedQuestion = match[0].trim();
          break;
        }
      }
      
      if (detectedQuestion && !isLoading) {
        console.log("[Auto Mode] Detected question:", detectedQuestion);
        append({ role: "user", content: detectedQuestion });
        setLastProcessedLength(fullText.length);
      }
    }
  }, [transcript, mode, lastProcessedLength, isLoading, append]);

  const startTranscription = async () => {
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then(async (screenStream) => {
        if (!process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY)
          return alert(
            "You must provide a Deepgram API Key in the options page."
          );
        if (screenStream.getAudioTracks().length == 0)
          return alert("You must share your tab with audio. Refresh the page.");

        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const audioContext = new AudioContext();
        const mixed = mix(audioContext, [screenStream, micStream]);

        recorder = new MediaRecorder(mixed, { mimeType: "audio/webm" });

        // Improved Deepgram configuration for better accuracy
        const deepgramParams = new URLSearchParams({
          model: "nova-2",
          language: "en-US",
          punctuate: "true",
          smart_format: "true",
          interim_results: "true",
          utterance_end_ms: "1000",
          vad_events: "true",
          endpointing: "300",
          numerals: "true",
        });

        socket = new WebSocket(
          `${process.env.NEXT_PUBLIC_DEEPGRAM_URL}?${deepgramParams.toString()}`,
          ["token", process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY]
        );

        recorder.addEventListener("dataavailable", (evt) => {
          if (evt.data.size > 0 && socket.readyState == 1)
            socket.send(evt.data);
        });

        socket.onopen = () => {
          recorder.start(500);
        };

        socket.onmessage = (msg) => {
          try {
            const data = JSON.parse(msg.data);
            
            // Check if this is a transcript message (not metadata)
            if (data.channel && data.channel.alternatives) {
              const alternative = data.channel.alternatives[0];
              const transcript = alternative?.transcript;
              const isFinal = data.is_final || data.speech_final;
              
              // Only add final transcripts to avoid duplicates
              if (transcript && isFinal) {
                setTranscript((prevTranscript) => [
                  ...prevTranscript,
                  transcript,
                  " ",
                ]);
              }
            }
          } catch (err) {
            console.error("[Live Interview] Error parsing transcript:", err);
            console.error("[Live Interview] Message data:", msg.data);
          }
        };
        
        socket.onerror = (error) => {
          console.error("[Live Interview] WebSocket error:", error);
          alert("Connection error with transcription service");
        };

        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
          videoRef.current.play();
        }
        setIsSharing(true);
        setTime(0);
      });
  };

  const stopTranscription = () => {
    if (recorder) {
      recorder.stop();
    }
    if (socket) {
      socket.close();
    }
    if (videoRef.current) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setIsSharing(false);
    alert("Transcription ended");
  };

  const clearTranscription = () => {
    setTranscript([]);
    setLastProcessedLength(0);
  };

  const handleTextSelection = () => {
    if (mode === "manual") {
      const selectedText = window.getSelection().toString();
      console.log("[Manual Mode] Selected text:", selectedText);
      setSelectedText(selectedText);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const askAi = async () => {
    if (selectedText) {
      console.log("[Live Interview] Asking AI with text:", selectedText);
      try {
        await append({ role: "user", content: selectedText });
        console.log("[Live Interview] Message sent successfully");
      } catch (err) {
        console.error("[Live Interview] Error asking AI:", err);
        alert("Failed to send question to AI. Please try again.");
      }
    } else {
      alert("Please select some text from the transcript first.");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-6 h-full p-6">
      {/* Left Panel - Video & Transcript */}
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="glass-effect rounded-2xl p-4 border border-white/10">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold gradient-text">Live Interview</h1>
            <div className="space-x-2 flex items-center">
              {isSharing && (
                <div className="ml-4 text-lg font-bold text-purple-400 animate-pulse-glow">
                  {formatTime(time)}
                </div>
              )}
              {!isSharing ? (
                <Button
                  id="start"
                  onClick={startTranscription}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl shadow-neon hover:shadow-neon-hover transition-all duration-300"
                >
                  Start
                </Button>
              ) : (
                <Button
                  id="stop"
                  onClick={stopTranscription}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl shadow-neon hover:shadow-neon-hover transition-all duration-300"
                >
                  Stop
                </Button>
              )}
              <Button
                id="clear"
                onClick={clearTranscription}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50 px-4 py-2 rounded-xl transition-all duration-300"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="glass-effect rounded-2xl p-4 border border-white/10">
          <h3 className="text-sm font-medium text-gray-300 mb-3">AI Response Mode</h3>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setMode("auto");
                setSelectedText("");
                setLastProcessedLength(transcript.join("").length);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                mode === "auto"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 scale-105"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300 border border-white/10"
              }`}
            >
              <Zap className={`h-5 w-5 ${mode === "auto" ? "animate-pulse" : ""}`} />
              <span>Auto Mode</span>
            </button>
            <button
              onClick={() => {
                setMode("manual");
                setSelectedText("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                mode === "manual"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 scale-105"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300 border border-white/10"
              }`}
            >
              <Hand className="h-5 w-5" />
              <span>Manual Mode</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            {mode === "auto" 
              ? "🤖 AI will automatically detect and answer questions"
              : "✋ Select text manually and click 'Ask AI' button"}
          </p>
        </div>

        {/* Video Container */}
        <div className="glass-effect rounded-2xl p-4 border border-white/10">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-xl border border-purple-500/30 bg-black shadow-neon"
          ></video>
        </div>

        {/* Transcript Section */}
        <div className="glass-effect flex-1 overflow-auto rounded-2xl p-4 border border-white/10">
          <h2 className="text-base font-medium gradient-text mb-3 flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Transcript from your interview
          </h2>
          <div id="transcript" onMouseUp={handleTextSelection}>
            <div className={`bg-white/5 backdrop-blur-sm p-4 rounded-xl border min-h-[200px] transition-all duration-300 ${
              mode === "manual" && selectedText 
                ? "border-purple-500/50 shadow-lg shadow-purple-500/20" 
                : "border-white/10"
            }`}>
              <div className="text-gray-300 leading-relaxed" style={{ userSelect: mode === "manual" ? "text" : "none" }}>
                {transcript}
              </div>
            </div>
          </div>
          {mode === "manual" && selectedText && (
            <Button 
              onClick={askAi} 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl mt-3 shadow-neon hover:shadow-neon-hover transition-all duration-300 w-full animate-fade-in"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Thinking...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Ask AI
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Right Panel - AI Assistant */}
      <div className="glass-effect rounded-2xl p-6 border border-white/10 overflow-auto">
        <h2 className="text-base font-bold gradient-text mb-4 flex items-center gap-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Interview with AI
        </h2>
        <div className="mt-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block p-4 rounded-2xl bg-purple-500/10 mb-4">
                <svg className="h-12 w-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">
                Select text from your transcript and click "Ask AI" to get help.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className="mb-4 animate-fade-in">
                  <div className="font-bold uppercase text-xs mb-2 text-purple-400 flex items-center gap-2">
                    {message.role === "user" ? (
                      <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        You
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        AI Assistant
                      </>
                    )}
                  </div>
                  <div className={`p-4 rounded-xl border ${
                    message.role === "user" 
                      ? "bg-purple-500/10 border-purple-500/30" 
                      : "bg-pink-500/10 border-pink-500/30"
                  }`}>
                    <Markdown>{message.content}</Markdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-400 italic animate-pulse-glow">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI is thinking...
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function mix(audioContext, streams) {
  const dest = audioContext.createMediaStreamDestination();
  streams.forEach((stream) => {
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(dest);
  });
  return dest.stream;
}
export default Page;
