"use client";

import { ArrowLeft, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AnimatedStars } from "@/components/ui/animated-stars";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { AssessmentResult } from "../mock-interview/types/assessment";

// Dynamically import the radar chart to avoid SSR issues
const RadarChart = dynamic(() => import("./components/RadarChart"), { ssr: false });

const AssessmentReport = () => {
  const [assessmentReport, setAssessmentReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load assessment from sessionStorage
    const assessmentJSON = sessionStorage.getItem('latestAssessment');
    
    if (assessmentJSON) {
      try {
        const assessment: AssessmentResult = JSON.parse(assessmentJSON);
        console.log('✅ Loaded assessment from sessionStorage:', assessment);
        
        // Transform AI assessment data to match UI format
        const transformedReport = {
          overallScore: assessment.overallScore,
          readinessLevel: assessment.overallScore, // Use same as overallScore
          feedback: [
            ...assessment.strengths.map(s => `✓ ${s}`),
            ...assessment.weaknesses.map(w => `✗ ${w}`)
          ],
          interviewSummary: assessment.interviewSummary ? 
            [assessment.interviewSummary] :
            ['Assessment completed successfully.'],
          suggestions: assessment.improvementAreas?.map(a => a.suggestion) || [],
          skills: assessment.skillsRadar && assessment.skillsRadar.length > 0 ? 
            assessment.skillsRadar.map(skill => ({
              name: skill.name,
              score: skill.score,
              maxScore: skill.maxScore
            })) : 
            [
              { name: "Technical Skills", score: assessment.scores.technicalSkills.score, maxScore: 100 },
              { name: "Problem Solving", score: assessment.scores.problemSolving.score, maxScore: 100 },
              { name: "Communication", score: assessment.scores.communication.score, maxScore: 100 },
              { name: "Experience", score: assessment.scores.experience.score, maxScore: 100 },
              { name: "Professionalism", score: assessment.scores.professionalism.score, maxScore: 100 }
            ]
        };
        
        setAssessmentReport(transformedReport);
      } catch (error) {
        console.error('❌ Error parsing assessment:', error);
        // Fallback to default data
        setAssessmentReport(getDefaultReport());
      }
    } else {
      console.warn('⚠️ No assessment found in sessionStorage');
      // Fallback to default data
      setAssessmentReport(getDefaultReport());
    }
    
    setLoading(false);
  }, []);
  
  function getDefaultReport() {
    return {
      overallScore: 0,
      readinessLevel: 0,
      feedback: ['No interview data available. Please complete an interview first.'],
      interviewSummary: ['No interview summary available.'],
      suggestions: ['Complete a mock interview to receive personalized suggestions.'],
      skills: [
        { name: "Technical Skills", score: 0, maxScore: 100 },
        { name: "Problem Solving", score: 0, maxScore: 100 },
        { name: "Communication", score: 0, maxScore: 100 },
        { name: "Experience", score: 0, maxScore: 100 },
        { name: "Professionalism", score: 0, maxScore: 100 }
      ]
    };
  }
  
  if (loading || !assessmentReport) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative">
        <AnimatedStars />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading assessment report...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 xl:p-8 relative">
      <AnimatedStars />
      {/* Header with enhanced styling */}
      <div className="max-w-7xl mx-auto mb-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass-effect rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-4">
            <Link href="/mock-interview">
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-white/10 hover:text-purple-400 transition-all duration-200"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold gradient-text">
                Interview Performance Analysis
              </h1>
              <p className="text-sm text-gray-400">Detailed insights into your interview performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400 bg-white/5 px-4 py-2 rounded-full hover:bg-white/10 transition-colors border border-white/10">
            <Clock className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium">{new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="max-w-7xl mx-auto relative z-10">
        <Tabs defaultValue="recap" className="mb-8">
          <TabsList className="glass-effect p-1 rounded-xl border border-white/10">
            <TabsTrigger 
              value="recap" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Recap
            </TabsTrigger>
            <TabsTrigger 
              value="detail"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Detail
            </TabsTrigger>
            <TabsTrigger 
              value="coach"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Coach
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recap">
            <div className="space-y-6">
              {/* Overview Card with enhanced design */}
              <Card className="glass-effect hover:shadow-neon transition-all duration-200 border border-white/10">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-6 gradient-text flex items-center gap-2">
                    Overview
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-600"></span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-2xl border border-purple-500/30">
                      <p className="text-sm font-medium text-gray-300 mb-2">Overall Readiness Score</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold gradient-text animate-in fade-in duration-700">
                          {assessmentReport.overallScore}
                        </span>
                        <span className="text-gray-400 text-lg">/100</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-2xl border border-purple-500/30">
                      <p className="text-sm font-medium text-gray-300 mb-2">Your Readiness Level</p>
                      <div className="text-5xl font-bold gradient-text animate-in fade-in duration-700">
                        {assessmentReport.readinessLevel.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Feedback Section */}
              <Card className="glass-effect hover:shadow-neon transition-all duration-200 border border-white/10 overflow-hidden">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-6 gradient-text flex items-center gap-2">
                    Key Feedback
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-600"></span>
                  </h2>
                  <div className="space-y-4">
                    {assessmentReport.feedback.map((feedback, index) => {
                      // Determine if it's strength (✓) or weakness (✗)
                      const isStrength = feedback.startsWith('✓');
                      const isWeakness = feedback.startsWith('✗');
                      
                      return (
                        <div 
                          key={index}
                          className={`group p-4 rounded-xl backdrop-blur-sm border transition-all duration-200 ${
                            isStrength 
                              ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 hover:border-green-400/50 hover:from-green-500/20 hover:to-emerald-500/20'
                              : isWeakness
                              ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30 hover:border-red-400/50 hover:from-red-500/20 hover:to-orange-500/20'
                              : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:border-purple-400/50 hover:from-purple-500/20 hover:to-pink-500/20'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 h-2 w-2 rounded-full transition-colors ${
                              isStrength 
                                ? 'bg-green-500 group-hover:bg-green-400'
                                : isWeakness
                                ? 'bg-red-500 group-hover:bg-red-400'
                                : 'bg-purple-500 group-hover:bg-purple-400'
                            }`} />
                            <p className="text-gray-200 group-hover:text-white transition-colors leading-relaxed">{feedback}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Interview Summary */}
              <Card className="glass-effect hover:shadow-neon transition-all duration-200 border border-white/10">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-6 gradient-text flex items-center gap-2">
                    Interview Summary
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-600"></span>
                  </h2>
                  <div className="space-y-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30">
                    {assessmentReport.interviewSummary.map((sentence, index) => (
                      <p 
                        key={index} 
                        className="text-gray-200 leading-relaxed animate-in fade-in slide-in-from-bottom-2"
                      >
                        {sentence}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Suggestions for Improvement */}
              <Card className="glass-effect hover:shadow-neon transition-all duration-200 border border-white/10">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-6 gradient-text flex items-center gap-2">
                    Improvement Areas
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-600"></span>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {assessmentReport.suggestions?.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="group p-4 rounded-xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 hover:shadow-neon transition-all duration-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center group-hover:bg-purple-500/50 transition-colors border border-purple-500/50">
                            <span className="text-purple-300 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                            {suggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Section with enhanced visualization */}
              <Card className="glass-effect hover:shadow-neon transition-all duration-200 border border-white/10">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-6 gradient-text flex items-center gap-2">
                    Skill Analysis
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-600"></span>
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-[300px] bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30">
                      <RadarChart data={assessmentReport.skills} />
                    </div>
                    <div className="space-y-6">
                      {assessmentReport.skills.map((skill) => (
                        <div key={skill.name} className="group">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-300 group-hover:text-purple-400 transition-colors duration-200">
                              {skill.name}
                            </span>
                            <span className="text-sm text-gray-400">{skill.score}</span>
                          </div>
                          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out group-hover:from-purple-600 group-hover:to-pink-600"
                              style={{ width: `${(skill.score / skill.maxScore) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1.5 group-hover:text-purple-400 transition-colors duration-200">
                            {skill.maxScore}% of total score
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* DETAIL TAB - Chi tiết từng category */}
          <TabsContent value="detail">
            <div className="space-y-6">
              {/* Load from sessionStorage to get detailed feedback */}
              {(() => {
                const assessmentJSON = sessionStorage.getItem('latestAssessment');
                if (!assessmentJSON) {
                  return (
                    <Card className="glass-effect border border-white/10">
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-300">No detailed assessment data available.</p>
                        <p className="text-sm text-gray-400 mt-2">Complete a mock interview to see detailed feedback.</p>
                      </CardContent>
                    </Card>
                  );
                }

                const assessment: AssessmentResult = JSON.parse(assessmentJSON);
                const categories = [
                  { 
                    key: 'technicalSkills', 
                    title: 'Technical Skills',
                    icon: '💻',
                    description: 'Technical knowledge, terminology, and best practices'
                  },
                  { 
                    key: 'problemSolving', 
                    title: 'Problem-Solving',
                    icon: '🧩',
                    description: 'Analytical thinking, structured approach, trade-off analysis'
                  },
                  { 
                    key: 'communication', 
                    title: 'Communication',
                    icon: '💬',
                    description: 'Clarity, structure, conciseness, and relevance'
                  },
                  { 
                    key: 'experience', 
                    title: 'Experience',
                    icon: '📚',
                    description: 'Real-world examples, measurable results, practical knowledge'
                  },
                  { 
                    key: 'professionalism', 
                    title: 'Professionalism',
                    icon: '⭐',
                    description: 'Enthusiasm, teamwork, adaptability, and growth mindset'
                  }
                ];

                return categories.map((category, idx) => {
                  const categoryData = assessment.scores[category.key as keyof typeof assessment.scores];
                  const score = categoryData.score;
                  const justification = categoryData.justification;

                  // Get rating based on score
                  let rating = 'Fair';
                  let ratingColor = 'text-yellow-400 bg-yellow-900/30 border border-yellow-500/30';
                  if (score >= 90) {
                    rating = 'Excellent';
                    ratingColor = 'text-emerald-400 bg-emerald-900/30 border border-emerald-500/30';
                  } else if (score >= 80) {
                    rating = 'Strong';
                    ratingColor = 'text-green-400 bg-green-900/30 border border-green-500/30';
                  } else if (score >= 70) {
                    rating = 'Good';
                    ratingColor = 'text-blue-400 bg-blue-900/30 border border-blue-500/30';
                  } else if (score < 60) {
                    rating = 'Needs Improvement';
                    ratingColor = 'text-red-400 bg-red-900/30 border border-red-500/30';
                  }

                  // Find detailed feedback for this category
                  const detailedFeedbackItem = assessment.detailedFeedback?.find(
                    (item) => item.category.toLowerCase().includes(category.key.toLowerCase()) ||
                              item.category.toLowerCase().includes(category.title.toLowerCase().replace('-', ' '))
                  );

                  return (
                    <Card key={idx} className="glass-effect hover:shadow-neon transition-all duration-200 border border-white/10">
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{category.icon}</span>
                            <div>
                              <h3 className="text-xl font-bold gradient-text">{category.title}</h3>
                              <p className="text-sm text-gray-400">{category.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold gradient-text">{score}</div>
                            <div className="text-sm text-gray-400">/ 100</div>
                          </div>
                        </div>

                        <Separator className="my-4 bg-white/10" />

                        {/* Rating Badge */}
                        <div className="mb-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${ratingColor}`}>
                            {rating}
                          </span>
                        </div>

                        {/* AI Justification */}
                        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm p-4 rounded-xl border border-purple-500/30 mb-4">
                          <h4 className="text-sm font-semibold text-purple-300 mb-2">AI Assessment:</h4>
                          <p className="text-gray-200 leading-relaxed">{justification}</p>
                        </div>

                        {/* Detailed Feedback if available */}
                        {detailedFeedbackItem && (
                          <div className="bg-gradient-to-r from-purple-500/15 to-pink-500/15 backdrop-blur-sm p-4 rounded-xl border border-purple-400/40">
                            <h4 className="text-sm font-semibold text-purple-300 mb-2">Detailed Review:</h4>
                            <p className="text-gray-200 leading-relaxed">{detailedFeedbackItem.comment}</p>
                          </div>
                        )}

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                });
              })()}
            </div>
          </TabsContent>

          {/* COACH TAB - Improvement recommendations */}
          <TabsContent value="coach">
            <div className="space-y-6">
              {(() => {
                const assessmentJSON = sessionStorage.getItem('latestAssessment');
                if (!assessmentJSON) {
                  return (
                    <Card className="glass-effect border border-white/10">
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-300">No coaching recommendations available.</p>
                        <p className="text-sm text-gray-400 mt-2">Complete a mock interview to receive personalized coaching.</p>
                      </CardContent>
                    </Card>
                  );
                }

                const assessment: AssessmentResult = JSON.parse(assessmentJSON);

                return (
                  <>
                    {/* Strengths Card */}
                    <Card className="glass-effect hover:shadow-neon transition-all duration-200 border-l-4 border-l-green-500 border-t border-r border-b border-white/10">
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                            <span className="text-2xl">💪</span>
                          </div>
                          <div>
                            <h2 className="text-xl font-bold gradient-text">Your Strengths</h2>
                            <p className="text-sm text-gray-400">Areas where you excel</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {assessment.strengths.map((strength, idx) => (
                            <div 
                              key={idx}
                              className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-xl border border-green-500/30 hover:border-green-400/50 hover:from-green-500/20 hover:to-emerald-500/20 transition-all"
                            >
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                ✓
                              </div>
                              <p className="text-gray-200 leading-relaxed">{strength}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Weaknesses Card */}
                    <Card className="glass-effect hover:shadow-neon transition-all duration-200 border-l-4 border-l-orange-500 border-t border-r border-b border-white/10">
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-orange-900/30 rounded-lg border border-orange-500/30">
                            <span className="text-2xl">⚠️</span>
                          </div>
                          <div>
                            <h2 className="text-xl font-bold gradient-text">Areas for Growth</h2>
                            <p className="text-sm text-gray-400">Opportunities to improve</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {assessment.weaknesses.map((weakness, idx) => (
                            <div 
                              key={idx}
                              className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-xl border border-orange-500/30 hover:border-orange-400/50 hover:from-orange-500/20 hover:to-red-500/20 transition-all"
                            >
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                !
                              </div>
                              <p className="text-gray-200 leading-relaxed">{weakness}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Improvement Areas with Priority */}
                    <Card className="glass-effect hover:shadow-neon transition-all duration-200 border-l-4 border-l-purple-500 border-t border-r border-b border-white/10">
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                            <span className="text-2xl">🎯</span>
                          </div>
                          <div>
                            <h2 className="text-xl font-bold gradient-text">Actionable Improvement Plan</h2>
                            <p className="text-sm text-gray-400">Specific steps to enhance your skills</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {assessment.improvementAreas?.map((area, idx) => {
                            const priorityColors = {
                              'High': 'bg-red-500/20 text-red-300 border-red-400/50',
                              'Medium': 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50',
                              'Low': 'bg-blue-500/20 text-blue-300 border-blue-400/50'
                            };
                            
                            return (
                              <div 
                                key={idx}
                                className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl border border-purple-500/30 hover:border-purple-400/50 hover:from-purple-500/20 hover:to-pink-500/20 hover:shadow-neon transition-all"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <h3 className="text-lg font-semibold gradient-text">{area.area}</h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${priorityColors[area.priority]}`}>
                                    {area.priority} Priority
                                  </span>
                                </div>
                                <p className="text-gray-200 leading-relaxed">{area.suggestion}</p>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recommended Actions */}
                    {assessment.recommendedActions && assessment.recommendedActions.length > 0 && (
                      <Card className="glass-effect hover:shadow-neon transition-all duration-200 border border-purple-500/30">
                        <CardContent className="p-6 sm:p-8">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                              <span className="text-2xl">📋</span>
                            </div>
                            <div>
                              <h2 className="text-xl font-bold gradient-text">Next Steps</h2>
                              <p className="text-sm text-gray-400">Concrete actions you can take today</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {assessment.recommendedActions.map((action, idx) => (
                              <div 
                                key={idx}
                                className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-indigo-500/30 hover:border-indigo-400/50 hover:from-indigo-500/20 hover:to-purple-500/20 transition-all"
                              >
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm border border-indigo-500/50">
                                  {idx + 1}
                                </div>
                                <p className="text-gray-200 leading-relaxed pt-1">{action}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                );
              })()}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AssessmentReport; 