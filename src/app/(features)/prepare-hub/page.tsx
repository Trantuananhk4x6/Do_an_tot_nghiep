"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { LanguageSelector, Language, LANGUAGES } from "@/components/ui/language-selector";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InterviewCard from "./components/InterviewCard";
import { Resume } from "@/models/resume";
import { InterviewSet } from "@/models/interviewSet";
import NeuralNetworkBg from "@/components/ui/neural-network-bg";

const Page = () => {
  const { toast } = useToast();
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [interviewSet, setInterviewSet] = useState<InterviewSet[]>(null);
  const [uploading, setUploading] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");

  const getInterviewSet = async () => {
    try {
      const response = await axios.get("/api/prepare-hub");
      setInterviewSet(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getInterviewSet();
  }, []);

  const getUserResume = async () => {
    try {
      const response = await axios.get("/api/resume");
      setResumes(response.data);
      setResumeLoading(false);
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        description: "Erro get user resume. Please try again",
      });
    }
  };

  const handleJobDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJobDescription(event.target.value);
  };

  const handleResumeChange = (value: string) => {
    setSelectedResume(value);
  };

  const handleSubmit = async () => {
    if (!selectedResume) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("resumeId", selectedResume);
    formData.append("jobDescription", jobDescription);
    formData.append("companyName", companyName);
    formData.append("position", position);
    formData.append("language", selectedLanguage);
    try {
      await axios.post("/api/prepare-hub", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        description: "Questions generated successfully",
      });
      setIsDialogOpen(false);
      getInterviewSet();
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        description: "Error generating questions. Please try again",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (interviewSetId: number) => {
    try {
      await axios.delete(`/api/prepare-hub?Id=${interviewSetId}`);
      setInterviewSet(
        interviewSet.filter((data) => data.id !== interviewSetId)
      );
      toast({
        description: "Interview deleted successfully",
      });
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        description: "Error deleting interview",
      });
    }
  };
  return (
    <>
      <NeuralNetworkBg />
      <div className="relative z-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Interview Preparation Hub</h1>
        <div className="mt-1 max-w-[640px] text-sm font-medium text-gray-400">
          Generate interview questions and answers based on your resume and job
          descriptions
        </div>
      </div>
      <div className="mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => getUserResume()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-neon hover:shadow-neon-hover transition-all duration-300"
            >
              <Plus className="mr-2" /> Prepare Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md glass-effect border border-white/10">
            <DialogHeader>
              <DialogTitle className="gradient-text">Tell us more about your job interview</DialogTitle>
              <DialogDescription className="text-gray-400">
                Add Detail about your job interview. Click save when you are
                done.
              </DialogDescription>
            </DialogHeader>
            {resumeLoading ? (
              <Loading />
            ) : (
              <>
                <div className="flex flex-col space-y-4">
                  <div className="flex-1 gap-2">
                    <Label className="text-gray-300">
                      Output Language <span className="text-red-400">*</span>
                    </Label>
                    <LanguageSelector
                      value={selectedLanguage}
                      onChange={setSelectedLanguage}
                      disabled={uploading}
                    />
                  </div>
                  <div className="flex-1 gap-2">
                    <Label className="text-gray-300">
                      Resume <span className="text-red-400">*</span>
                    </Label>
                    <Select onValueChange={handleResumeChange}>
                      <SelectTrigger className="glass-effect border-white/10 text-gray-300">
                        <SelectValue placeholder="Select your Resumes" />
                      </SelectTrigger>
                      <SelectContent className="glass-effect border border-white/10">
                        {resumes.map((resume: Resume) => (
                          <SelectItem
                            key={resume.id}
                            value={resume.id.toString()}
                            className="text-gray-300"
                          >
                            {resume.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-1 gap-2">
                    <div className="flex-1">
                      <Label htmlFor="name" className="text-gray-300">
                        Company Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        className="glass-effect border-white/10 text-gray-300"
                        type="text"
                        placeholder="ABC Technology"
                        value={companyName}
                        onChange={(event) =>
                          setCompanyName(
                            (event.target as HTMLInputElement).value
                          )
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="name" className="text-gray-300">
                        Position <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        className="glass-effect border-white/10 text-gray-300"
                        type="text"
                        placeholder="Software engineer"
                        value={position}
                        onChange={(event) =>
                          setPosition((event.target as HTMLInputElement).value)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex-1 gap-2">
                    <Label htmlFor="name" className="text-gray-300">Job Description</Label>
                    <Textarea
                      id="jobDescriptionUrl"
                      className="glass-effect border-white/10 text-gray-300"
                      placeholder="Job description"
                      value={jobDescription}
                      onChange={handleJobDescriptionChange}
                      rows={5}
                    />
                  </div>
                </div>
              </>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="glass-effect border border-white/10">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={!selectedResume || uploading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {uploading ? <Loading /> : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        {loading ? (
          <Loading />
        ) : interviewSet.length === 0 ? (
          <div className="glass-effect rounded-2xl p-12 text-center border border-white/10">
            <div className="inline-block p-4 rounded-2xl bg-purple-500/10 mb-4">
              <svg className="h-16 w-16 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">
              Not found any questions. Please upload your resume and
              jobdescription.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviewSet.map((interview: InterviewSet) => (
              <InterviewCard
                key={interview.id}
                id={interview.id}
                companyName={interview.companyName}
                position={interview.position}
                resumeName={interview.resumeName}
                createdAt={interview.createdAt}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default Page;
