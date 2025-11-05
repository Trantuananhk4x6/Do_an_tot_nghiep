"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/ui/loading";
import {
  deleteResume,
  fetchResumes,
  uploadResume,
} from "./services/resumeServices";
import ResumeDialog from "./components/ResumeDialog";
import ResumeTable from "./components/ResumeTable";

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">User Resume</h1>
        <div className="mt-1 max-w-[640px] text-sm font-medium text-gray-400">
          Upload your resume, cover letter, notes or any other application
          materials to prepare for interview. AI will extract content and
          response during interview.
        </div>
      </div>
      <div className="mb-6">
        <ResumeDialog onUpload={handleUpload} uploading={uploading} />
      </div>
      <div>
        {loading ? (
          <Loading />
        ) : resumes.length === 0 ? (
          <div className="glass-effect rounded-2xl p-12 text-center border border-white/10">
            <div className="inline-block p-4 rounded-2xl bg-purple-500/10 mb-4">
              <svg className="h-16 w-16 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg mb-2">No resumes uploaded yet</p>
            <p className="text-gray-500 text-sm">Upload your first resume to get started</p>
          </div>
        ) : (
          <ResumeTable resumes={resumes} onDelete={handleDelete} />
        )}
      </div>
    </>
  );
};

export default Page;
