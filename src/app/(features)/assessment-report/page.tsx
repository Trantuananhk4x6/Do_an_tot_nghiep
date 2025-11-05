"use client";

import { ArrowLeft, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment report...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 lg:p-6 xl:p-8">
      {/* Header with enhanced styling */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Link href="/mock-interview">
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-gray-50 hover:text-indigo-600 transition-all duration-200"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                Interview Performance Analysis
              </h1>
              <p className="text-sm text-gray-500">Detailed insights into your interview performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
            <Clock className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-medium">{new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="recap" className="mb-8">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            <TabsTrigger 
              value="recap" 
              className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg transition-all duration-200"
            >
              Recap
            </TabsTrigger>
            <TabsTrigger 
              value="detail"
              className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg transition-all duration-200"
            >
              Detail
            </TabsTrigger>
            <TabsTrigger 
              value="coach"
              className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg transition-all duration-200"
            >
              Coach
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recap">
            <div className="space-y-6">
              {/* Overview Card with enhanced design */}
              <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    Overview
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100/50">
                      <p className="text-sm font-medium text-gray-600 mb-2">Overall Readiness Score</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-indigo-600 animate-in fade-in duration-700">
                          {assessmentReport.overallScore}
                        </span>
                        <span className="text-gray-500 text-lg">/100</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100/50">
                      <p className="text-sm font-medium text-gray-600 mb-2">Your Readiness Level</p>
                      <div className="text-5xl font-bold text-indigo-600 animate-in fade-in duration-700">
                        {assessmentReport.readinessLevel.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Feedback Section */}
              <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm overflow-hidden">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    Key Feedback
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  </h2>
                  <div className="space-y-4">
                    {assessmentReport.feedback.map((feedback, index) => (
                      <div 
                        key={index}
                        className="group p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-indigo-100 transition-all duration-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500 group-hover:bg-indigo-600 transition-colors" />
                          <p className="text-gray-600 group-hover:text-gray-700 transition-colors">{feedback}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Interview Summary */}
              <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    Interview Summary
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  </h2>
                  <div className="space-y-4 bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                    {assessmentReport.interviewSummary.map((sentence, index) => (
                      <p 
                        key={index} 
                        className="text-gray-600 leading-relaxed animate-in fade-in slide-in-from-bottom-2"
                      >
                        {sentence}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Suggestions for Improvement */}
              <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    Improvement Areas
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {assessmentReport.suggestions?.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="group p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100/50 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                            <span className="text-indigo-600 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                            {suggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Section with enhanced visualization */}
              <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    Skill Analysis
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-[300px] bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100">
                      <RadarChart data={assessmentReport.skills} />
                    </div>
                    <div className="space-y-6">
                      {assessmentReport.skills.map((skill) => (
                        <div key={skill.name} className="group">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
                              {skill.name}
                            </span>
                            <span className="text-sm text-gray-500">{skill.score}</span>
                          </div>
                          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500 ease-out group-hover:from-indigo-600 group-hover:to-indigo-700"
                              style={{ width: `${(skill.score / skill.maxScore) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1.5 group-hover:text-indigo-500 transition-colors duration-200">
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
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-600">No detailed assessment data available.</p>
                        <p className="text-sm text-gray-500 mt-2">Complete a mock interview to see detailed feedback.</p>
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
                  let ratingColor = 'text-yellow-600 bg-yellow-50';
                  if (score >= 90) {
                    rating = 'Excellent';
                    ratingColor = 'text-emerald-600 bg-emerald-50';
                  } else if (score >= 80) {
                    rating = 'Strong';
                    ratingColor = 'text-green-600 bg-green-50';
                  } else if (score >= 70) {
                    rating = 'Good';
                    ratingColor = 'text-blue-600 bg-blue-50';
                  } else if (score < 60) {
                    rating = 'Needs Improvement';
                    ratingColor = 'text-red-600 bg-red-50';
                  }

                  // Find detailed feedback for this category
                  const detailedFeedbackItem = assessment.detailedFeedback?.find(
                    (item) => item.category.toLowerCase().includes(category.key.toLowerCase()) ||
                              item.category.toLowerCase().includes(category.title.toLowerCase().replace('-', ' '))
                  );

                  return (
                    <Card key={idx} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{category.icon}</span>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">{category.title}</h3>
                              <p className="text-sm text-gray-500">{category.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-indigo-600">{score}</div>
                            <div className="text-sm text-gray-500">/ 100</div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        {/* Rating Badge */}
                        <div className="mb-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${ratingColor}`}>
                            {rating}
                          </span>
                        </div>

                        {/* AI Justification */}
                        <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">AI Assessment:</h4>
                          <p className="text-gray-600 leading-relaxed">{justification}</p>
                        </div>

                        {/* Detailed Feedback if available */}
                        {detailedFeedbackItem && (
                          <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-100">
                            <h4 className="text-sm font-semibold text-indigo-700 mb-2">Detailed Review:</h4>
                            <p className="text-gray-600 leading-relaxed">{detailedFeedbackItem.comment}</p>
                          </div>
                        )}

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
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
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-600">No coaching recommendations available.</p>
                        <p className="text-sm text-gray-500 mt-2">Complete a mock interview to receive personalized coaching.</p>
                      </CardContent>
                    </Card>
                  );
                }

                const assessment: AssessmentResult = JSON.parse(assessmentJSON);

                return (
                  <>
                    {/* Strengths Card */}
                    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm border-l-4 border-l-green-500">
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <span className="text-2xl">💪</span>
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-800">Your Strengths</h2>
                            <p className="text-sm text-gray-500">Areas where you excel</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {assessment.strengths.map((strength, idx) => (
                            <div 
                              key={idx}
                              className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-white rounded-xl border border-green-100"
                            >
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                                ✓
                              </div>
                              <p className="text-gray-700 leading-relaxed">{strength}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Weaknesses Card */}
                    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm border-l-4 border-l-orange-500">
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-orange-50 rounded-lg">
                            <span className="text-2xl">⚠️</span>
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-800">Areas for Growth</h2>
                            <p className="text-sm text-gray-500">Opportunities to improve</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {assessment.weaknesses.map((weakness, idx) => (
                            <div 
                              key={idx}
                              className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-white rounded-xl border border-orange-100"
                            >
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                                !
                              </div>
                              <p className="text-gray-700 leading-relaxed">{weakness}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Improvement Areas with Priority */}
                    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm border-l-4 border-l-indigo-500">
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-indigo-50 rounded-lg">
                            <span className="text-2xl">🎯</span>
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-800">Actionable Improvement Plan</h2>
                            <p className="text-sm text-gray-500">Specific steps to enhance your skills</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {assessment.improvementAreas?.map((area, idx) => {
                            const priorityColors = {
                              'High': 'bg-red-100 text-red-700 border-red-200',
                              'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
                              'Low': 'bg-blue-100 text-blue-700 border-blue-200'
                            };
                            
                            return (
                              <div 
                                key={idx}
                                className="p-5 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100 hover:shadow-md transition-all"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <h3 className="text-lg font-semibold text-gray-800">{area.area}</h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${priorityColors[area.priority]}`}>
                                    {area.priority} Priority
                                  </span>
                                </div>
                                <p className="text-gray-600 leading-relaxed">{area.suggestion}</p>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recommended Actions */}
                    {assessment.recommendedActions && assessment.recommendedActions.length > 0 && (
                      <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-gradient-to-br from-purple-50 to-white">
                        <CardContent className="p-6 sm:p-8">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-purple-100 rounded-lg">
                              <span className="text-2xl">📋</span>
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-gray-800">Next Steps</h2>
                              <p className="text-sm text-gray-500">Concrete actions you can take today</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {assessment.recommendedActions.map((action, idx) => (
                              <div 
                                key={idx}
                                className="flex items-start gap-3 p-4 bg-white rounded-xl border border-purple-100 hover:border-purple-200 transition-all"
                              >
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                                  {idx + 1}
                                </div>
                                <p className="text-gray-700 leading-relaxed pt-1">{action}</p>
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