"use client";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { Markdown } from "@/components/ui/markdown";
import { Zap, Hand } from "lucide-react";
import NeuralNetworkBg from "@/components/ui/neural-network-bg";

let socket;
let recorder;

const Page = () => {
  const { messages, append, isLoading, error } = useChat({
    api: "/api/live-interview",
    maxSteps: 2,
    onError: (error) => {
      console.error("[Live Interview] Chat error:", error);
      alert("⚠️ AI Error: " + error.message + "\n\nPlease try asking your question again.");
    },
    onFinish: (message) => {
      console.log("[Live Interview] AI response finished:", message.content.substring(0, 100));
    },
  });
  const [transcript, setTranscript] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState("manual"); // "auto" or "manual"
  const [lastProcessedLength, setLastProcessedLength] = useState(0);
  const [lastQuestionSent, setLastQuestionSent] = useState(""); // Track last question to prevent duplicates
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const autoModeTimeoutRef = useRef(null);
  const transcriptContainerRef = useRef(null);
  const messageRefs = useRef(new Map());

  // Debug: Log messages whenever they change
  useEffect(() => {
    console.log("[Live Interview] Messages updated, count:", messages.length);
    if (messages.length > 0) {
      console.log("[Live Interview] Last message:", messages[messages.length - 1]);
    }
  }, [messages]);

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

  // Auto-scroll transcript to bottom when new transcript lines are added
  useEffect(() => {
    if (transcriptContainerRef.current) {
      // Scroll to bottom after the component has rendered the new text
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcript]);

  // Auto mode: Detect questions and auto-answer with minimal delay
  useEffect(() => {
    // Clear any pending timeout
    if (autoModeTimeoutRef.current) {
      clearTimeout(autoModeTimeoutRef.current);
    }

    if (mode === "auto" && transcript.length > 0 && !isLoading) {
      const fullText = transcript.join("").trim();
      
      // Skip if no new content
      if (fullText.length <= lastProcessedLength) {
        return;
      }
      
      const newText = fullText.substring(lastProcessedLength);
      console.log("[Auto Mode] New text to analyze:", newText);
      
      // Check if we have a complete question with question mark - process immediately
      const hasQuestionMark = /\?/.test(newText);
      const delay = hasQuestionMark ? 200 : 500; // 0.2s if has ?, otherwise 0.5s
      
      console.log("[Auto Mode] Using delay:", delay, "ms, hasQuestionMark:", hasQuestionMark);
      
      // Quick debounce to wait for complete sentences
      autoModeTimeoutRef.current = setTimeout(() => {
        // Improved question detection patterns
        const questionPatterns = [
          // Direct questions with question mark
          /(?:what|how|why|when|where|who|which|whose|whom)[^.!]*\?/gi,
          // Modal verb questions
          /(?:can you|could you|would you|will you|should you|may you|might you)[^.!?]*\?/gi,
          // Do/Does/Did questions
          /(?:do you|does|did|are you|is it|was|were)[^.!?]*\?/gi,
          // Imperative questions (tell me, talk about)
          /(?:tell me|explain|describe|discuss|talk about|share|give me).{10,}[.?]/gi,
          // You + verb patterns (You tell me, You talk about)
          /you\s+(?:tell|talk|explain|describe|discuss|share|give).{10,}[.?]/gi,
          // Vietnamese questions translated to English
          /(?:bạn|anh|chị|em).*(?:gì|sao|như thế nào|tại sao|khi nào|ở đâu|ai)/gi,
        ];
        
        let detectedQuestion = null;
        let allMatches = [];
        
        // Collect all matches from all patterns
        for (const pattern of questionPatterns) {
          const matches = newText.match(pattern);
          if (matches && matches.length > 0) {
            allMatches = allMatches.concat(matches);
          }
        }
        
        if (allMatches.length > 0) {
          // Get the longest match (usually more complete question)
          detectedQuestion = allMatches.reduce((longest, current) => 
            current.length > longest.length ? current : longest, ""
          ).trim();
          
          // Clean up the question
          detectedQuestion = detectedQuestion
            .replace(/\s+/g, ' ')  // Remove extra spaces
            .replace(/^[,.:;]\s*/, '') // Remove leading punctuation
            .replace(/\s+[.?]+$/, '?'); // Ensure it ends with question mark
          
          console.log("[Auto Mode] All matches found:", allMatches);
          console.log("[Auto Mode] Selected question:", detectedQuestion);
        } else if (newText.trim().length > 20) {
          // If no pattern matched but we have substantial text, treat it as a question
          detectedQuestion = newText.trim();
          console.log("[Auto Mode] No pattern matched, using full text as question:", detectedQuestion);
        }
        
        // Check if question is valid and not duplicate
        if (detectedQuestion && 
            detectedQuestion.length > 10 && 
            detectedQuestion !== lastQuestionSent) {
          
          console.log("[Auto Mode] ✅ Detected valid question:", detectedQuestion);
          console.log("[Auto Mode] Question length:", detectedQuestion.length);
          console.log("[Auto Mode] Sending to AI NOW...");
          
          // Update last question immediately to prevent duplicates
          setLastQuestionSent(detectedQuestion);
          
          append({ role: "user", content: detectedQuestion })
            .then(() => {
              console.log("[Auto Mode] ✅ Question sent successfully, waiting for response...");
              // Update processed length after successful send
              setLastProcessedLength(fullText.length);
            })
            .catch((err) => {
              console.error("[Auto Mode] ❌ Failed to send question:", err);
              // Reset last question on error so user can retry
              setLastQuestionSent("");
              alert("⚠️ Failed to send question to AI. Please try Manual Mode.");
            });
        } else if (detectedQuestion && detectedQuestion === lastQuestionSent) {
          console.log("[Auto Mode] ⏭️ Question already sent, skipping duplicate:", detectedQuestion);
        } else if (detectedQuestion) {
          console.log("[Auto Mode] ⚠️ Question too short:", detectedQuestion);
        }
      }, delay);
    }

    return () => {
      if (autoModeTimeoutRef.current) {
        clearTimeout(autoModeTimeoutRef.current);
      }
    };
  }, [transcript, mode, lastProcessedLength, isLoading, append, lastQuestionSent]);

  const startTranscription = async () => {
    try {
      // Check for Deepgram API Key first
      if (!process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY) {
        alert("⚠️ Deepgram API Key is missing. Please configure it in your environment variables.");
        return;
      }

      // Request screen sharing with audio
      console.log("[Live Interview] Requesting screen sharing permission...");
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true, 
        audio: true 
      });

      console.log("[Live Interview] Screen sharing granted");
      console.log("[Live Interview] Audio tracks:", screenStream.getAudioTracks().length);

      if (screenStream.getAudioTracks().length === 0) {
        alert("⚠️ No audio detected! Please:\n1. Click 'Share' again\n2. Select the tab you want to share\n3. Make sure to check 'Share audio' checkbox");
        screenStream.getTracks().forEach(track => track.stop());
        return;
      }

      // Request microphone access
      console.log("[Live Interview] Requesting microphone permission...");
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      console.log("[Live Interview] Microphone access granted");

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
        console.log("[Live Interview] WebSocket connected to Deepgram");
        recorder.start(500);
      };

      socket.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          console.log("[Deepgram] Received message type:", data.type);
          
          // Check if this is a transcript message (not metadata)
          if (data.channel && data.channel.alternatives && data.channel.alternatives.length > 0) {
            const alternative = data.channel.alternatives[0];
            const transcript = alternative?.transcript;
            const isFinal = data.is_final || data.speech_final;
            
            console.log("[Deepgram] Transcript:", transcript, "isFinal:", isFinal);
            
            // Only add final transcripts to avoid duplicates and ensure quality
            if (transcript && transcript.trim().length > 0 && isFinal) {
              console.log("[Deepgram] Adding final transcript:", transcript);
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
        alert("❌ Connection error with transcription service. Please check your internet connection and try again.");
      };

      socket.onclose = () => {
        console.log("[Live Interview] WebSocket closed");
      };

      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
        videoRef.current.play();
      }
      setIsSharing(true);
      setTime(0);
      console.log("[Live Interview] Transcription started successfully");

    } catch (error) {
      console.error("[Live Interview] Error starting transcription:", error);
      
      // Handle specific errors
      if (error.name === 'NotAllowedError') {
        alert("❌ Permission Denied!\n\nYou need to allow:\n1. Screen sharing permission\n2. Microphone permission\n\nPlease click 'Start' again and allow the permissions.");
      } else if (error.name === 'NotFoundError') {
        alert("❌ No microphone found!\n\nPlease connect a microphone and try again.");
      } else if (error.name === 'NotReadableError') {
        alert("❌ Device is busy!\n\nYour microphone or screen is being used by another application. Please close other apps and try again.");
      } else {
        alert(`❌ Error: ${error.message}\n\nPlease try again or contact support if the problem persists.`);
      }
    }
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
    setLastQuestionSent(""); // Reset last question when clearing
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
    if (selectedText && selectedText.trim().length > 0) {
      console.log("[Live Interview] Asking AI with text:", selectedText);
      try {
        await append({ role: "user", content: selectedText });
        console.log("[Live Interview] Message sent successfully, waiting for AI response...");
        setSelectedText(""); // Clear selection after sending
      } catch (err) {
        console.error("[Live Interview] Error asking AI:", err);
        alert("⚠️ Failed to send question to AI:\n" + (err.message || "Unknown error") + "\n\nPlease try again.");
      }
    } else {
      alert("⚠️ Please select some text from the transcript first.");
    }
  };

  return (
    <>
      <NeuralNetworkBg />
      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-6 h-full p-6">
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
                setLastQuestionSent(""); // Reset to allow processing from this point
                // Don't reset lastProcessedLength - allow processing of existing text
                console.log("[Mode Switch] Switched to Auto mode");
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
                console.log("[Mode Switch] Switched to Manual mode");
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
              ? "🤖 Questions with '?' → Instant AI response (0.2s) | Others → Wait 0.5s"
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
          <div id="transcript" ref={transcriptContainerRef} onMouseUp={handleTextSelection} className="overflow-auto max-h-[28rem]">
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
          {isLoading && (
            <span className="ml-2 text-xs text-purple-400 animate-pulse-glow flex items-center gap-1">
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          )}
        </h2>
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <strong>Error:</strong> {error.message}
          </div>
        )}
        <div className="mt-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block p-4 rounded-2xl bg-purple-500/10 mb-4">
                <svg className="h-12 w-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">
                {mode === "auto" 
                  ? "🤖 Auto Mode Active: Speak clearly and end with '?' for instant response!"
                  : "✋ Manual Mode: Select text from transcript and click 'Ask AI'"}
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
                        Question
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        AI Assistant
                        {/* Nút Copy chỉ hiển thị với câu trả lời của AI */}
                        <button
                          className="ml-2 px-2 py-1 text-xs rounded bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200"
                          style={{ display: message.role === "assistant" ? "inline-block" : "none" }}
                          onClick={() => {
                            navigator.clipboard.writeText(message.content);
                            alert("Đã copy câu trả lời của AI!");
                          }}
                        >
                          Copy
                        </button>
                      </>
                    )}
                  </div>
                  <div className={`p-4 rounded-xl border ${
                    message.role === "user" 
                      ? "bg-purple-500/10 border-purple-500/30" 
                      : "bg-pink-500/10 border-pink-500/30"
                  }`}>
                    <div ref={(el) => {
                      if (el) messageRefs.current.set(message.id, el);
                      else messageRefs.current.delete(message.id);
                    }}>
                      <Markdown>{message.content}</Markdown>
                    </div>
                    {/* Ask AI (selection-aware) button below the message content for assistant responses */}
                    {message.role === "assistant" && (
                      <div className="mt-3 flex justify-end">
                        <button
                          className="px-3 py-1 text-xs rounded bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 transition-all duration-200"
                          aria-label="Ask AI about selection"
                          disabled={isLoading}
                          onClick={async () => {
                            try {
                              // Check selection within this message's content
                              let selectedText = "";
                              try {
                                const sel = window.getSelection();
                                if (sel && !sel.isCollapsed) {
                                  const container = messageRefs.current.get(message.id);
                                  if (container && container.contains(sel.anchorNode) && container.contains(sel.focusNode)) {
                                    selectedText = sel.toString().trim();
                                  }
                                }
                              } catch (selErr) {
                                console.error("Selection check failed:", selErr);
                              }

                              if (selectedText && selectedText.length > 1) {
                                // Send selected text
                                await append({ role: "user", content: selectedText });
                                setLastQuestionSent(selectedText);
                                console.log("[Live Interview] Sent selected text as question:", selectedText.substring(0, 120));
                              } else if (!selectedText) {
                                // No selection; send full AI answer content
                                await append({ role: "user", content: message.content });
                                setLastQuestionSent(message.content);
                                console.log("[Live Interview] Sent full AI answer as question:", message.content.substring(0, 120));
                              } else {
                                // Selected text too short
                                alert("⚠️ Please select a more substantial portion of the AI answer to ask about (or just click Ask to send the full answer). ");
                              }
                            } catch (err) {
                              console.error("[Live Interview] Error sending message from AI answer selection:", err);
                              alert("⚠️ Không thể gửi câu hỏi: " + (err.message || "Unknown error"));
                            }
                          }}
                        >
                          Ask AI
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="mb-4 animate-fade-in">
                  <div className="font-bold uppercase text-xs mb-2 text-pink-400 flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Assistant
                  </div>
                  <div className="p-4 rounded-xl border bg-pink-500/10 border-pink-500/30">
                    <div className="flex items-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-pink-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-gray-300 italic">AI is thinking and preparing your answer...</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </>
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
