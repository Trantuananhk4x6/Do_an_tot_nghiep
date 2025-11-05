export async function GET() {
  const voices = [
    {
      id: "1",
      name: "Sarah Chen",
      gender: "female",
      age: 28,
      voiceTone: "young-energetic",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      title: "Senior Software Engineer",
      expertise: "full-stack-development",
      yearsOfExperience: 6,
      interviewStyle: "technical-deep-dive",
      focusAreas: ["system design", "coding best practices", "scalability", "problem-solving"],
      questionTypes: ["scenario-based", "coding-challenges", "architecture-design"],
      personality: "friendly and encouraging, focuses on technical depth and real-world applications"
    },
    {
      id: "2", 
      name: "David Kim",
      gender: "male",
      age: 35,
      voiceTone: "mature-confident",
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
      title: "Technical Lead",
      expertise: "team-leadership",
      yearsOfExperience: 12,
      interviewStyle: "leadership-focused",
      focusAreas: ["technical leadership", "code review", "mentoring", "project architecture", "team collaboration"],
      questionTypes: ["leadership-scenarios", "conflict-resolution", "technical-decisions"],
      personality: "calm and analytical, emphasizes leadership skills and strategic thinking"
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      gender: "female",
      age: 32,
      voiceTone: "warm-professional",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
      title: "HR Manager",
      expertise: "behavioral-assessment",
      yearsOfExperience: 9,
      interviewStyle: "behavioral-soft-skills",
      focusAreas: ["communication skills", "cultural fit", "teamwork", "conflict management", "adaptability"],
      questionTypes: ["behavioral-questions", "situational-judgement", "company-culture-fit"],
      personality: "empathetic and insightful, focuses on soft skills and cultural alignment"
    },
    {
      id: "4",
      name: "Michael Thompson",
      gender: "male",
      age: 40,
      voiceTone: "experienced-steady",
      avatarUrl: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop&crop=face",
      title: "Product Manager",
      expertise: "product-strategy",
      yearsOfExperience: 15,
      interviewStyle: "product-thinking",
      focusAreas: ["product vision", "user needs", "prioritization", "cross-functional collaboration", "metrics"],
      questionTypes: ["product-design", "prioritization-scenarios", "stakeholder-management"],
      personality: "strategic and pragmatic, evaluates product sense and business acumen"
    },
    {
      id: "5",
      name: "Lisa Wang",
      gender: "female", 
      age: 29,
      voiceTone: "young-enthusiastic",
      avatarUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&crop=face",
      title: "Data Scientist",
      expertise: "data-analysis-ml",
      yearsOfExperience: 5,
      interviewStyle: "analytical-technical",
      focusAreas: ["machine learning", "statistical analysis", "data modeling", "python/r", "visualization"],
      questionTypes: ["data-problems", "algorithm-design", "case-studies"],
      personality: "curious and detail-oriented, focuses on analytical thinking and technical precision"
    },
    {
      id: "6",
      name: "James Wilson",
      gender: "male",
      age: 33,
      voiceTone: "calm-technical",
      avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face", 
      title: "DevOps Engineer",
      expertise: "infrastructure-automation",
      yearsOfExperience: 8,
      interviewStyle: "ops-focused",
      focusAreas: ["CI/CD", "cloud infrastructure", "automation", "monitoring", "security"],
      questionTypes: ["troubleshooting-scenarios", "system-reliability", "deployment-strategies"],
      personality: "practical and solution-oriented, emphasizes operational excellence"
    },
    {
      id: "7",
      name: "Anna Martinez",
      gender: "female",
      age: 27,
      voiceTone: "young-creative",
      avatarUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=face",
      title: "UX Designer",
      expertise: "user-experience-design",
      yearsOfExperience: 4,
      interviewStyle: "design-thinking",
      focusAreas: ["user research", "design systems", "prototyping", "usability", "visual design"],
      questionTypes: ["design-challenges", "portfolio-review", "user-empathy"],
      personality: "creative and user-centric, evaluates design process and empathy"
    },
    {
      id: "8",
      name: "Robert Johnson",
      gender: "male", 
      age: 45,
      voiceTone: "senior-authoritative",
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop&crop=face",
      title: "Engineering Manager",
      expertise: "engineering-management",
      yearsOfExperience: 20,
      interviewStyle: "management-strategic",
      focusAreas: ["team building", "strategic planning", "performance management", "hiring", "budget"],
      questionTypes: ["management-scenarios", "team-challenges", "strategic-planning"],
      personality: "wise and mentoring, focuses on leadership maturity and strategic vision"
    },
    {
      id: "9",
      name: "Jennifer Lee",
      gender: "female",
      age: 38,
      voiceTone: "mature-dynamic",
      avatarUrl: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=face", 
      title: "Marketing Director",
      expertise: "marketing-strategy",
      yearsOfExperience: 14,
      interviewStyle: "marketing-business",
      focusAreas: ["brand strategy", "market analysis", "campaign planning", "ROI", "customer acquisition"],
      questionTypes: ["campaign-scenarios", "market-analysis", "creative-thinking"],
      personality: "dynamic and results-driven, evaluates marketing creativity and business impact"
    },
    {
      id: "10",
      name: "Alex Chen",
      gender: "male",
      age: 31,
      voiceTone: "professional-balanced",
      avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop&crop=face",
      title: "Business Analyst",
      expertise: "business-analysis",
      yearsOfExperience: 7,
      interviewStyle: "analytical-business",
      focusAreas: ["requirements gathering", "process improvement", "stakeholder management", "data analysis", "documentation"],
      questionTypes: ["business-problems", "process-optimization", "stakeholder-scenarios"],
      personality: "systematic and thorough, focuses on analytical skills and business understanding"
    }
  ];

  try {
    return new Response(JSON.stringify(voices), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // Cache 1 giờ
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    console.error("Error in voices API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json"
      }
    });
  }
}

// Hỗ trợ OPTIONS method cho CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}