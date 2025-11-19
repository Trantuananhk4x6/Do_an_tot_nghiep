import { InterviewSession, InterviewerProfile } from "../types/assessment";

/**
 * Build AI prompt for interview assessment
 */
export function buildAssessmentPrompt(session: InterviewSession): string {
  const { interviewer, transcript, duration, questionsAsked, language = 'en' } = session;
  
  // Language detection for output
  const languageInstruction = language === 'vi' 
    ? '\n\n⚠️ CRITICAL: You MUST provide ALL assessment content in VIETNAMESE language. All feedback, comments, suggestions, and recommendations must be written in Vietnamese.'
    : language === 'ja'
    ? '\n\n⚠️ CRITICAL: You MUST provide ALL assessment content in JAPANESE language. All feedback, comments, suggestions, and recommendations must be written in Japanese.'
    : language === 'zh'
    ? '\n\n⚠️ CRITICAL: You MUST provide ALL assessment content in CHINESE language. All feedback, comments, suggestions, and recommendations must be written in Chinese.'
    : language === 'ko'
    ? '\n\n⚠️ CRITICAL: You MUST provide ALL assessment content in KOREAN language. All feedback, comments, suggestions, and recommendations must be written in Korean.'
    : '\n\n⚠️ CRITICAL: You MUST provide ALL assessment content in ENGLISH language.';
  
  // ✅ Format questions with expected vs actual answers for comparison
  let questionsComparison = '';
  if (questionsAsked && questionsAsked.length > 0) {
    questionsComparison = '\n\n## QUESTIONS WITH EXPECTED VS ACTUAL ANSWERS\n\n';
    questionsComparison += questionsAsked.map((qa, idx) => {
      const candidateAnswer = qa.candidateAnswer || '[NO ANSWER PROVIDED]';
      const answerLength = candidateAnswer.trim().length;
      const hasAnswer = answerLength > 20; // Minimum 20 chars to be considered a real answer
      
      return `### Question ${idx + 1}:
**Question:** ${qa.question}

**Expected Answer (Reference):**
${qa.expectedAnswer}

**Candidate's Actual Answer:**
${candidateAnswer}
${!hasAnswer ? '\n⚠️ WARNING: Candidate provided NO valid answer (empty or too short - less than 20 characters)\n' : ''}

---`;
    }).join('\n\n');
  }
  
  // Format transcript for AI
  const formattedTranscript = transcript
    .map(entry => {
      const speaker = entry.speaker === 'interviewer' ? interviewer.name : 'Candidate';
      const timeInSeconds = Math.floor(entry.timestamp / 1000);
      return `[${timeInSeconds}s] ${speaker}: ${entry.message}`;
    })
    .join('\n\n');

  const durationMinutes = duration ? Math.floor(duration / 60) : 0;
  const yearsOfExperience = interviewer.yearsOfExperience || 10;
  const focusAreas = interviewer.focusAreas || ['General Software Engineering'];
  const interviewStyle = interviewer.interviewStyle || 'Professional';

  return `You are an expert technical interviewer conducting a comprehensive performance assessment.
${languageInstruction}

## Interview Context

**Interviewer Profile:**
- Name: ${interviewer.name}
- Role: ${interviewer.title}
- Expertise: ${interviewer.expertise}
- Years of Experience: ${yearsOfExperience}
- Focus Areas: ${Array.isArray(focusAreas) ? focusAreas.join(', ') : 'General'}
- Interview Style: ${interviewStyle}

**Interview Details:**
- Duration: ${durationMinutes} minutes
- Position: Software Engineer (assumed based on technical questions)
- Total Exchanges: ${transcript.length}
- Total Questions Asked: ${questionsAsked?.length || 0}

${questionsComparison}

## Complete Interview Transcript

${formattedTranscript}

---

## Your Assessment Task

Analyze the **entire interview transcript** thoroughly and provide a comprehensive, **objective** assessment.

### ⚠️ CRITICAL SCORING RULES:

1. **NO ANSWER = 0 POINTS**: If candidate provided NO answer or answer is too short (< 20 characters), that question gets 0 points
2. **WRONG ANSWER = Low Score**: Compare candidate's answer with expected answer. If completely wrong or irrelevant, give very low score (0-30)
3. **PARTIALLY CORRECT = Medium Score**: If answer is on the right track but missing key points, give medium score (40-65)
4. **CORRECT ANSWER = High Score**: If answer matches expected answer well, give high score (70-100)
5. **EXCELLENT ANSWER = Full Score**: If answer exceeds expectations with great examples and depth, give 90-100

### Scoring Criteria (Each category: 0-100 points)

#### 1. Technical Skills (0-100)
Evaluate BY COMPARING WITH EXPECTED ANSWERS:
- **Accuracy** - Does answer match expected answer?
- **Correctness** - Are technical facts correct?
- **Depth** of knowledge (surface vs. deep understanding)
- **Best practices** awareness
- **Tools/frameworks** familiarity
- **Terminology** usage (correct tech terms)
- **Explanation clarity** of technical concepts

Scoring Guide:
- 90-100: Expert - Answers match or exceed expected answers, deep understanding
- 75-89: Advanced - Most answers correct, strong knowledge
- 60-74: Intermediate - Some correct answers, some gaps
- 40-59: Beginner - Many wrong answers, missing key concepts
- 0-39: Weak - Most answers wrong, empty, or no answers provided

#### 2. Problem-Solving & Analytical Thinking (0-100)
Evaluate:
- **Structured approach** (methodical vs. random)
- **Problem decomposition** (breaking down complex issues)
- **Trade-off analysis** (pros/cons consideration)
- **Multiple solutions** offered
- **Critical thinking** demonstrated

Scoring Guide:
- 90-100: Systematic, multiple angles, evaluates trade-offs thoroughly
- 75-89: Good structure, considers alternatives
- 60-74: Basic approach, some analysis
- 40-59: Unstructured, limited depth
- 0-39: No clear methodology or no answers

#### 3. Communication Skills (0-100)
Evaluate:
- **Clarity** - Easy to understand
- **Structure** - Organized (e.g., "First... Second... Finally...")
- **Conciseness** - Not rambling or overly verbose
- **Relevance** - Stays on topic, answers the question asked
- **Examples** - Uses concrete examples when appropriate

Scoring Guide:
- 90-100: Crystal clear, well-organized, engaging
- 75-89: Clear, structured, easy to follow
- 60-74: Understandable, somewhat organized
- 40-59: Unclear, lacks structure
- 0-39: Confusing, hard to follow, or no communication

#### 4. Experience & Practical Knowledge (0-100)
Evaluate BY COMPARING WITH EXPECTED ANSWERS:
- **Real-world examples** from past projects
- **Specific details** (not just "I worked on X")
- **Measurable results** (metrics, improvements, "reduced by 40%")
- **Tools/technologies** actually used
- **Implementation challenges** and solutions
- **Match with expected answer** - Does experience align with what was asked?

Scoring Guide:
- 90-100: Specific examples with measurable impact, matches expected answer perfectly
- 75-89: Good examples, clear context, mostly relevant
- 60-74: Basic examples, limited details, somewhat relevant
- 40-59: Vague, mostly theoretical, doesn't match expected
- 0-39: No examples, purely hypothetical, or no answer

#### 5. Professionalism & Soft Skills (0-100)
Evaluate:
- **Enthusiasm** - Passion for the work
- **Teamwork** - Collaboration mentions
- **Adaptability** - Learning and flexibility
- **Growth mindset** - Continuous improvement
- **Professionalism** - Respectful, mature attitude
- **Engagement** - Actually answered questions vs. stayed silent

Scoring Guide:
- 90-100: Highly professional, team-oriented, growth-focused, actively engaged
- 75-89: Professional, collaborative, participates
- 60-74: Adequate professionalism
- 40-59: Some attitude concerns or minimal participation
- 0-39: Unprofessional or did not participate (no answers)

---

### Required Output Format (JSON only, no markdown)

Return ONLY valid JSON with this exact structure:

{
  "scores": {
    "technicalSkills": {
      "score": 85,
      "justification": "Strong understanding of microservices and REST APIs. Correctly explained key concepts with proper terminology. Minor gaps in advanced topics like GraphQL federation."
    },
    "problemSolving": {
      "score": 78,
      "justification": "Demonstrated structured approach to problem-solving. Considered alternatives but could have elaborated more on trade-offs and edge cases."
    },
    "communication": {
      "score": 82,
      "justification": "Clear and well-organized responses. Good use of examples. Occasionally slightly verbose but overall effective communication."
    },
    "experience": {
      "score": 75,
      "justification": "Provided relevant project examples with good context. Would benefit from including specific metrics and quantifiable outcomes."
    },
    "professionalism": {
      "score": 88,
      "justification": "Highly enthusiastic and passionate. Strong teamwork emphasis. Demonstrated clear growth mindset and professionalism throughout."
    }
  },
  "overallScore": 81.6,
  "readinessLevel": "Strong Hire",
  "strengths": [
    "Excellent technical foundation in backend development and microservices architecture",
    "Clear and structured communication with effective use of examples",
    "Strong teamwork and collaboration mindset",
    "Demonstrated enthusiasm for technology and continuous learning",
    "Good problem-solving approach with systematic thinking"
  ],
  "weaknesses": [
    "Could provide more quantifiable results and metrics from past projects",
    "Some gaps in advanced topics (e.g., GraphQL, distributed tracing)",
    "Deeper analysis of system design trade-offs would strengthen responses",
    "Occasionally verbose - could be more concise in certain explanations"
  ],
  "detailedFeedback": [
    {
      "category": "Technical Skills",
      "rating": "Strong",
      "comment": "Demonstrated solid technical foundation with good understanding of modern architecture patterns, API design, and backend development practices. Shows readiness for senior-level technical discussions."
    },
    {
      "category": "Problem-Solving",
      "rating": "Good",
      "comment": "Applied structured thinking to technical challenges. Would benefit from deeper exploration of edge cases and failure scenarios in system design discussions."
    },
    {
      "category": "Communication",
      "rating": "Strong",
      "comment": "Communicated technical concepts clearly with good organization. Effective use of examples to illustrate points. Minor improvements possible in conciseness."
    },
    {
      "category": "Experience",
      "rating": "Good",
      "comment": "Shared relevant project experiences with good context. Adding specific performance metrics and measurable impact would significantly strengthen responses."
    },
    {
      "category": "Professionalism",
      "rating": "Excellent",
      "comment": "Displayed outstanding professionalism, enthusiasm, and collaborative mindset. Clear passion for technology and commitment to continuous growth."
    }
  ],
  "improvementAreas": [
    {
      "area": "Quantifiable Metrics",
      "suggestion": "When discussing past projects, include specific numbers (e.g., 'reduced API latency by 40%', 'improved throughput to 10K requests/sec'). This demonstrates tangible impact.",
      "priority": "High"
    },
    {
      "area": "System Design Depth",
      "suggestion": "Elaborate more on scalability trade-offs, failure handling, and distributed systems challenges. Consider CAP theorem implications and consistency models.",
      "priority": "Medium"
    },
    {
      "area": "Advanced Topics",
      "suggestion": "Strengthen knowledge in GraphQL federation, API gateway patterns, and distributed tracing tools like Jaeger or Zipkin.",
      "priority": "Medium"
    },
    {
      "area": "Conciseness",
      "suggestion": "Practice delivering complete answers in fewer words. Use the 'STAR' method (Situation, Task, Action, Result) for structured yet concise responses.",
      "priority": "Low"
    }
  ],
  "interviewSummary": "The candidate demonstrated strong technical capabilities with a solid foundation in backend development, microservices architecture, and modern software practices. Communication was clear and well-structured, with effective use of examples to illustrate concepts. The candidate showed excellent professionalism, enthusiasm for technology, and a collaborative mindset that would fit well in team environments. Key strengths include technical knowledge, problem-solving approach, and soft skills. Primary areas for improvement involve providing more quantifiable metrics from past work and deepening expertise in advanced distributed systems topics. Overall, this is a strong candidate who shows readiness for a senior software engineering role with minor areas for continued growth.",
  "recommendedActions": [
    "Build a sample GraphQL project with Apollo Federation to deepen understanding of federated graph architectures",
    "Practice system design interviews focusing on scalability, availability, and consistency trade-offs",
    "Document past project achievements with specific metrics and create a portfolio of measurable impacts",
    "Study distributed systems patterns: saga, CQRS, event sourcing, and circuit breaker implementations",
    "Practice concise communication using the STAR method for behavioral and experience questions"
  ],
  "skillsRadar": [
    {
      "name": "Technical Skills",
      "score": 85,
      "maxScore": 100,
      "description": "Strong backend and architecture knowledge"
    },
    {
      "name": "Problem-Solving",
      "score": 78,
      "maxScore": 100,
      "description": "Structured analytical thinking"
    },
    {
      "name": "Communication",
      "score": 82,
      "maxScore": 100,
      "description": "Clear and organized expression"
    },
    {
      "name": "Experience",
      "score": 75,
      "maxScore": 100,
      "description": "Relevant project background"
    },
    {
      "name": "Professionalism",
      "score": 88,
      "maxScore": 100,
      "description": "Excellent attitude and teamwork"
    }
  ]
}

### Critical Requirements:
1. **STRICT SCORING BASED ON ANSWERS** - Compare each answer with expected answer. NO ANSWER = 0 points for that question.
2. **Validate Answer Quality**:
   - If answer is empty or < 20 characters → Consider as NO ANSWER
   - If answer is completely off-topic or irrelevant → Very low score (0-20)
   - If answer is wrong but shows effort → Low score (20-40)
   - If answer is partially correct → Medium score (40-70)
   - If answer matches expected answer → High score (70-100)
3. **Be objective and fair** - Base scores on actual transcript evidence and answer comparison
4. **Provide specific examples** - Reference actual statements from the transcript and compare with expected answers
5. **Balance feedback** - Include both strengths and areas for improvement
6. **Actionable suggestions** - Give concrete steps for improvement
7. **Consider context** - Account for interviewer's focus areas (${Array.isArray(focusAreas) ? focusAreas.join(', ') : 'General'})
8. **JSON only** - Return ONLY valid JSON, no markdown code blocks or additional text
9. **Be encouraging but honest** - Frame feedback constructively while being truthful about gaps

Calculate overallScore as: (technicalSkills * 0.25) + (problemSolving * 0.25) + (communication * 0.20) + (experience * 0.15) + (professionalism * 0.15)

⚠️ IMPORTANT: If candidate provided NO answers or very few answers (< 50% of questions), overall score should be very low (0-30).

Readiness levels:
- 85-100: "Strong Hire"
- 70-84: "Hire"  
- 55-69: "Maybe"
- 40-54: "Weak Maybe"
- 0-39: "No Hire"

Now analyze the interview BY COMPARING EXPECTED VS ACTUAL ANSWERS and return the assessment JSON:`;
}

/**
 * Helper to calculate overall score from individual scores
 */
export function calculateOverallScore(scores: {
  technicalSkills: number;
  problemSolving: number;
  communication: number;
  experience: number;
  professionalism: number;
}): number {
  return (
    scores.technicalSkills * 0.25 +
    scores.problemSolving * 0.25 +
    scores.communication * 0.20 +
    scores.experience * 0.15 +
    scores.professionalism * 0.15
  );
}

/**
 * Helper to determine readiness level from score
 */
export function getReadinessLevel(score: number): string {
  if (score >= 85) return "Strong Hire";
  if (score >= 70) return "Hire";
  if (score >= 55) return "Maybe";
  return "No Hire";
}
