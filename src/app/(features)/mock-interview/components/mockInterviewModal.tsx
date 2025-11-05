import React, { useState, useEffect } from "react";
import { X, Check, Building2, Briefcase, Clock, ChevronLeft, FileText } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";
import WarningPopup from "./warningPopup";
import Image from "next/image";

interface Voice {
  id: string;
  name: string;
  gender: string;
  age: number;
  voiceTone: string;
  avatarUrl: string;
  title: string;
  expertise: string;
  yearsOfExperience: number;
  interviewStyle: string;
  focusAreas: string[];
  questionTypes: string[];
  personality: string;
}

interface InterviewCard {
  id: string;
  companyName: string;
  resumeName: string;
  createdAt: string;
}

interface MockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (voice: Voice, interviewId: string) => void;
}

const MockInterviewModal: React.FC<MockInterviewModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [activeTab, setActiveTab] = useState<'interview' | 'voice'>('interview');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [interviews, setInterviews] = useState<InterviewCard[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interviewsResponse, voicesResponse] = await Promise.all([
          axios.get("/api/prepare-hub"),
          // axios.get("https://service-api.beatinterview.com/api/voices")
          axios.get("/voices") 
        ]);
        setInterviews(interviewsResponse.data);
        setVoices(voicesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (!selectedVoice || !selectedInterview) {
      setShowWarning(true);
      return;
    }
    onSelect(selectedVoice, selectedInterview);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <WarningPopup
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        title="Missing Information"
        message="Please select both an interview set and a voice before proceeding."
      />
      
      <div className="glass-effect rounded-3xl w-full max-w-xl shadow-2xl border border-white/10" role="dialog" aria-modal="true">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold gradient-text">
              Interview Setup
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-all duration-300"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="border-b border-white/10">
          <nav className="flex -mb-px" aria-label="Tabs">
            {['interview', 'voice'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'interview' | 'voice')}
                className={cn(
                  "w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-all duration-300",
                  activeTab === tab
                    ? "border-purple-500 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-white/20"
                )}
                aria-selected={activeTab === tab}
                role="tab"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Selection
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            activeTab === 'interview' ? (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-300">Select Interview Set</h3>
                <div className="space-y-3">
                {interviews.map((interview) => (
                    <div
                      key={interview.id}
                      onClick={() => setSelectedInterview(interview.id)}
                      className={cn(
                        "rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] transform border",
                        selectedInterview === interview.id
                          ? "ring-2 ring-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50 shadow-lg shadow-purple-500/20"
                          : "hover:bg-white/5 border-white/10 hover:border-white/20"
                      )}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4">
                            <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 border border-purple-500/30">
                              <Briefcase className="h-6 w-6 text-purple-400" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-white">Software Engineer</h4>
                              <div className="flex gap-2 items-center text-gray-400">
                                <Building2 className="h-4 w-4" />
                                <p className="text-sm">{interview.companyName}</p>
                              </div>
                            </div>
                          </div>
                          {selectedInterview === interview.id && (
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex gap-2 items-center text-gray-400">
                            <FileText className="h-4 w-4" />
                            <p className="text-sm">Resume: {interview.resumeName}</p>
                          </div>
                          <div className="flex gap-2 items-center text-gray-400">
                            <Clock className="h-4 w-4" />
                            <p className="text-sm">
                              Added: {new Date(interview.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-300">Select Voice</h3>
                <div className="grid grid-cols-2 gap-4">
                  {voices.map((voice) => (
                    <div
                      key={voice.name}
                      onClick={() => setSelectedVoice(voice)}
                      className={cn(
                        "rounded-xl cursor-pointer transition-all p-6 flex flex-col items-center relative border",
                        "hover:scale-105 transform duration-300 ease-in-out",
                        selectedVoice?.name === voice.name
                          ? "ring-2 ring-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50 shadow-lg shadow-purple-500/20"
                          : "hover:bg-white/5 border-white/10 hover:border-white/20"
                      )}
                    >
                      <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-purple-500/30 shadow-lg">
                        <Image
                          src={voice.avatarUrl}
                          alt={voice.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-1">{voice.name}</h4>
                      <div className="flex flex-col items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300 border border-purple-500/50">
                          {voice.title}
                        </span>
                        <div className="text-xs text-gray-400 text-center">
                          {voice.yearsOfExperience}+ years exp
                        </div>
                      </div>
                      {selectedVoice?.name === voice.name && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1.5 shadow-lg">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        <div className="p-6 border-t border-white/10 flex justify-between items-center bg-black/20">
          <div className="flex gap-2">
            {activeTab === 'voice' && (
              <button
                onClick={() => setActiveTab('interview')}
                className="inline-flex items-center px-4 py-3 text-sm font-medium text-gray-300 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </button>
            )}
          </div>
          <button
            onClick={activeTab === 'interview' ? () => setActiveTab('voice') : handleConfirm}
            disabled={activeTab === 'interview' ? !selectedInterview : !selectedVoice}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:shadow-purple-500/20 disabled:hover:shadow-none"
          >
            {activeTab === 'interview' ? 'Next' : 'Start Interview'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockInterviewModal; 