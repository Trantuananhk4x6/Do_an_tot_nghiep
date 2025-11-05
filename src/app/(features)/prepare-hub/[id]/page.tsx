"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import axios from "axios";
import { use } from "react";
import { toast } from "@/hooks/use-toast";
import { LoaderCircle, MessageCircle, Plus, Sparkles } from "lucide-react";
import { createEmbeddingsForInterviewSet, regenerateAnswer } from "./action";
import Loading from "@/components/ui/loading";

const Page = (props: { params: Promise<{ id: string }> }) => {
  const params = use(props.params);
  const { id } = params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingCopilot, setLoadingCopilot] = useState(false);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [updatingQaId, setUpdatingQaId] = useState<number | null>(null);
  const [editingAnswers, setEditingAnswers] = useState({});
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  useEffect(() => {
    const fetchInterviewSet = async () => {
      try {
        const response = await axios.get(`/api/interview-set?id=${id}`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          description: "Error fetching interview set",
        });
      }
    };

    fetchInterviewSet();
  }, [id]);

  const handleAnswerChange = (qaId: number, newAnswer: string) => {
    setEditingAnswers((prev) => ({
      ...prev,
      [qaId]: newAnswer,
    }));
  };

  const handleSave = async (qaId: number) => {
    try {
      setLoadingUpdate(true);
      setUpdatingQaId(qaId);
      const formData = new FormData();
      formData.append("qaId", qaId.toString());
      formData.append("answer", editingAnswers[qaId]);
      await axios.put("/api/interview-set", formData);
      setData(
        data.map((qa) =>
          qa.id === qaId ? { ...qa, answer: editingAnswers[qaId] } : qa
        )
      );
      toast({
        description: "Answer saved successfully",
      });
      setLoadingUpdate(false);
      setUpdatingQaId(null);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Error saving answer",
      });
      setLoadingUpdate(false);
      setUpdatingQaId(null);
    }
  };

  const handleAddQuestion = async () => {
    try {
      const formData = new FormData();
      formData.append("question", newQuestion);
      formData.append("answer", newAnswer);
      formData.append("interviewSetId", id);

      const response = await axios.post("/api/interview-set", formData);
      setData([response.data[0], ...data]);
      setNewQuestion("");
      setNewAnswer("");
      setShowAddQuestion(false);
      toast({
        description: "Question added successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Error adding question",
      });
    }
  };

  const handleApplyCopilot = async (interviewId: number) => {
    try {
      setLoadingCopilot(true);
      await createEmbeddingsForInterviewSet(interviewId);
      toast({
        description: "Applied Copilot successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Error Applied Copilot",
      });
    } finally {
      setLoadingCopilot(false);
    }
  };

  const handleGenerateQuestion = async () => {
    try {
      setLoadingGenerate(true);
      
      // Get interview set details for generation
      const interviewSetResponse = await axios.get(`/api/interview-set?id=${id}`);
      const firstQA = interviewSetResponse.data[0];
      
      if (!firstQA) {
        toast({
          variant: "destructive",
          description: "No interview set found",
        });
        return;
      }

      // Call the generation endpoint
      const response = await axios.post(`/api/interview-set/generate`, {
        interviewSetId: firstQA.interviewSetId,
      });
      
      // Set the generated question and answer in the form (NOT saved to DB yet)
      setNewQuestion(response.data.question);
      setNewAnswer(response.data.answer);
      
      toast({
        description: "✨ Question generated! Review and click Save to add it.",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Error generating question. Please try again.",
      });
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handleRegenerate = async (
    qaId: number,
    question: string,
    answer: string
  ) => {
    try {
      setLoadingUpdate(true);
      setUpdatingQaId(qaId);
      const response = await regenerateAnswer(
        qaId,
        question,
        answer,
        parseInt(id)
      );
      setData(
        data.map((qa) => (qa.id === qaId ? { ...qa, answer: response } : qa))
      );
      toast({
        description: "Answer regenerated successfully",
      });
      setLoadingUpdate(false);
      setUpdatingQaId(null);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Error regenerating answer",
      });
      setLoadingUpdate(false);
      setUpdatingQaId(null);
    }
  };

  const deleteAddQuestion = () => {
    setNewQuestion("");
    setNewAnswer("");
    setShowAddQuestion(false);
  };

  const handleDelete = async (qaId: number) => {
    try {
      const response = await axios.delete(`/api/interview-set?qaId=${qaId}`);
      setData(data.filter((qa) => qa.id !== qaId));
      toast({
        description: response.data,
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Error deleting question",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="glass-effect rounded-2xl p-6 border border-white/10">
        <h1 className="text-3xl font-bold gradient-text mb-2">Interview Prepare Hub</h1>
      </div>
      <div className="glass-effect rounded-2xl p-4 border border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center gap-4">
            <Button 
              onClick={() => setShowAddQuestion(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-neon hover:shadow-neon-hover transition-all duration-300"
            >
              <Plus className="mr-2" /> Add Question
            </Button>
            <p className="text-gray-300 font-medium">Total Question: <span className="text-purple-400">{data.length}</span></p>
          </div>
          <div className="flex justify-center items-center gap-4">
            
          </div>
        </div>
      </div>
      <div className="mb-14 flex flex-col gap-6">
        {showAddQuestion && (
          <div className="relative flex resize-y gap-3 rounded-2xl border-2 border-purple-500/50 glass-effect p-6 shadow-neon">
            <div className="flex h-full w-1/3 flex-col self-end">
              <div className="mb-[6px] flex items-center font-[500] justify-between">
                <span className="text-gray-300">Question</span>
              </div>
              <Textarea
                className="mt-3 h-[300px] glass-effect border-white/10 text-gray-300"
                placeholder="Enter your question or click 'Generate with AI'"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                disabled={loadingGenerate}
              />
            </div>
            <div className="flex h-full w-2/3 flex-col">
              <div className="mb-[6px] flex flex-wrap-reverse items-center font-[500] gap-4 justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Answer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => handleGenerateQuestion()}
                    variant="default"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-neon hover:shadow-neon-hover transition-all duration-300"
                    disabled={loadingGenerate}
                  >
                    {loadingGenerate ? (
                      <div className="flex items-center gap-2">
                        <LoaderCircle className="animate-spin h-4 w-4" />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Generate with AI</span>
                      </div>
                    )}
                  </Button>
                  <Button 
                    onClick={() => handleAddQuestion()}
                    disabled={!newQuestion || !newAnswer || loadingGenerate}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => deleteAddQuestion()} className="glass-effect border-white/10">
                    Cancel
                  </Button>
                </div>
              </div>
              <Textarea
                className="h-[300px] glass-effect border-white/10 text-gray-300"
                placeholder="Answer will be generated automatically or enter manually"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                disabled={loadingGenerate}
              />
            </div>
          </div>
        )}
        {loading ? (
          <Loading />
        ) : (
          data.map((qa) => (
            <div
              key={qa.id}
              className="relative flex resize-y gap-3 rounded-2xl border border-white/10 glass-effect p-6 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="flex h-full w-1/3 flex-col">
                <div className="mb-[6px] flex items-center font-[500] gap-2">
                  <span className="text-gray-300"> Question</span>
                </div>
                <Textarea
                  className="mt-3 h-[300px] glass-effect border-white/10 text-gray-300"
                  value={qa.question}
                  readOnly
                />
              </div>
              <div className="flex h-full w-2/3 flex-col">
                <div className="mb-[6px] flex flex-wrap-reverse items-center font-[500] gap-4 justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="text-purple-400" />
                    <span className="text-gray-300">Answer</span>
                    <Button
                      variant="outline"
                      className="glass-effect border-white/10 hover:border-purple-500/50"
                      onClick={() =>
                        handleRegenerate(qa.id, qa.question, qa.answer)
                      }
                    >
                      {loadingUpdate && updatingQaId === qa.id ? (
                        <div className="flex justify-center items-center gap-2">
                          <LoaderCircle className="animate-spin" />
                          <span>Regenerating</span>
                        </div>
                      ) : (
                        "Regenerate"
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleSave(qa.id)}
                      disabled={
                        editingAnswers[qa.id] === qa.answer ||
                        !editingAnswers[qa.id]
                      }
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                      onClick={() => handleDelete(qa.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={editingAnswers[qa.id] ?? qa.answer}
                  onChange={(e) => handleAnswerChange(qa.id, e.target.value)}
                  className="h-[300px] glass-effect border-white/10 text-gray-300"
                  disabled={loadingUpdate && updatingQaId === qa.id}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
