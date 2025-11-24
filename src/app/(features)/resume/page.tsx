"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/ui/loading";
import NeuralNetworkBg from "@/components/ui/neural-network-bg";
import {
  deleteResume,
  fetchResumes,
  uploadResume,
} from "./services/resumeServices";
import ResumeDialog from "./components/ResumeDialog";
import ResumeTable from "./components/ResumeTable";
import { motion } from "framer-motion";
import { FileText, Upload, Sparkles } from "lucide-react";

const Page = () => {
  const { toast } = useToast();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try {
      const data = await fetchResumes();
      setResumes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (file: File, closeDialog: () => void) => {
    setUploading(true);
    try {
      const response = await uploadResume(file);
      toast({ description: response });
      closeDialog();
      fetchData();
    } catch (err) {
      toast({
        variant: "destructive",
        description: err.response.data,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteResume(id);
      toast({ description: response });
      fetchData();
    } catch (err) {
      toast({
        variant: "destructive",
        description: err.response.data,
      });
    }
  };

  return (
    <>
      <NeuralNetworkBg />
      <div className="relative z-10">
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <div className="relative">
            {/* Glowing background */}
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 rounded-3xl blur-2xl" />
            
            <div className="relative glass-effect rounded-3xl p-8 border border-purple-500/20">
              <div className="flex items-start gap-6">
                {/* Animated Icon */}
                <motion.div
                  className="relative"
                  animate={{ 
                    rotateY: [0, 360],
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <motion.div
                    className="flex items-center gap-3 mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                      User Resume
                    </h1>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start gap-3 text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Upload className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <p className="text-base leading-relaxed">
                      Upload your resume, cover letter, notes or any other application
                      materials to prepare for interview. AI will extract content and
                      response during interview.
                    </p>
                  </motion.div>

                  {/* Stats or info badges */}
                  <motion.div 
                    className="flex flex-wrap gap-3 mt-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm font-medium flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                      AI-Powered Analysis
                    </div>
                    <div className="px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-sm font-medium flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                      Instant Processing
                    </div>
                    <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-medium flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      Secure Storage
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        <ResumeDialog onUpload={handleUpload} uploading={uploading} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {loading ? (
          <Loading />
        ) : resumes.length === 0 ? (
          <motion.div 
            className="relative group"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
          >
            {/* Glowing border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-blue-600/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            
            <div className="relative glass-effect rounded-3xl p-16 text-center border border-purple-500/20">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] rounded-3xl" />
              
              <motion.div 
                className="relative inline-block mb-6"
                animate={{ 
                  rotateY: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-50" />
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                  <svg className="h-20 w-20 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-200 mb-3">No Resumes Yet</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Upload your first resume to get started with AI-powered interview preparation
              </p>
              
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center justify-center gap-2 text-purple-400"
              >
                <Upload className="w-5 h-5" />
                <span className="font-medium">Click Upload button above</span>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <ResumeTable resumes={resumes} onDelete={handleDelete} />
        )}
        </motion.div>
      </div>
    </>
  );
};

export default Page;
