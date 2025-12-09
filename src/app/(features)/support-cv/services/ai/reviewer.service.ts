// ============================================================================
// CV Reviewer Service - Analyze and provide feedback on CV
// ============================================================================

import { CVData } from '../../types/cv.types';
import { Result, Ok } from '../../lib/result';
import { geminiClient, parseJSONResponse } from './gemini.client';
import { rateLimiter } from './rate-limiter.service';

// ============================================================================
// Types
// ============================================================================

export interface CVReview {
  overallScore: number;
  atsScore: number;
  impactScore: number;
  clarityScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

// ============================================================================
// Service Class
// ============================================================================

class CVReviewerService {
  async review(cvData: CVData): Promise<Result<CVReview, Error>> {
    console.log('[CV Reviewer] Starting review...');

    // Check if AI is available
    if (!geminiClient.isAvailable()) {
      console.warn('[CV Reviewer] AI not available, using fallback');
      return Ok(this.fallbackReview(cvData));
    }

    try {
      // Use rate limiter
      const result = await rateLimiter.execute(async () => {
        return await geminiClient.generateContent(this.buildPrompt(cvData), {
          temperature: 0.4,
        });
      });

      if (!result.success) {
        console.warn('[CV Reviewer] AI failed, using fallback');
        return Ok(this.fallbackReview(cvData));
      }

      // Parse JSON response
      const parseResult = parseJSONResponse<CVReview>(result.data.text);
      if (!parseResult.success) {
        console.error('[CV Reviewer] Failed to parse JSON');
        return Ok(this.fallbackReview(cvData));
      }

      const review = parseResult.data;
      console.log(`[CV Reviewer] ✓ Review complete. Score: ${review.overallScore}/100`);
      return Ok(review);

    } catch (error: any) {
      console.error('[CV Reviewer] Error:', error);
      
      // Always fallback to basic review on error
      return Ok(this.fallbackReview(cvData));
    }
  }

  private buildPrompt(cvData: CVData): string {
    return `Review this CV and provide detailed feedback.

**CV DATA:**
${JSON.stringify(cvData, null, 2).slice(0, 6000)}

**OUTPUT JSON:**
{
  "overallScore": 85,
  "atsScore": 90,
  "impactScore": 80,
  "clarityScore": 85,
  "strengths": [
    "Clear layout and structure",
    "Strong technical skills",
    "Quantified achievements",
    "Professional summary included",
    "Good use of action verbs"
  ],
  "weaknesses": [
    "Missing specific metrics in some achievements",
    "No LinkedIn profile provided",
    "GPA not mentioned",
    "No certifications listed",
    "Some descriptions are too generic"
  ],
  "suggestions": [
    "Add metrics to all achievements (e.g., 'Improved performance by 23%')",
    "Include LinkedIn and GitHub profiles",
    "Add 2-3 relevant certifications",
    "Use STAR method: Situation, Task, Action, Result",
    "Replace weak verbs with strong action verbs",
    "Add a projects section",
    "Include language proficiency",
    "Optimize for ATS keywords"
  ]
}

**SCORING CRITERIA:**
- ATS Score (0-100): Headers, Fonts, Keywords, No Graphics, Contact Info, Skills, Chronological Order, Format
- Impact Score (0-100): Quantifiable Metrics, Action Verbs, STAR Method, Results-Oriented, Business Impact
- Clarity Score (0-100): Layout, Formatting, Section Organization, Grammar, Appropriate Length, Professional Tone

Overall Score = (ATS + Impact + Clarity) / 3

**RULES:**
1. Be honest but constructive
2. Focus on actionable feedback
3. Return ONLY valid JSON (no markdown)
`;
  }
//   {
//   "overallScore": 85,
//   "atsScore": 90,
//   "impactScore": 80,
//   "clarityScore": 85,
//   "strengths": [
//     "Bố cục rõ ràng và mạch lạc",
//     "Kỹ năng kỹ thuật mạnh",
//     "Thành tựu có số liệu định lượng",
//     "Có phần tóm tắt chuyên nghiệp",
//     "Sử dụng động từ hành động tốt"
//   ],
//   "weaknesses": [
//     "Một số thành tựu thiếu số liệu cụ thể",
//     "Chưa có liên kết LinkedIn",
//     "Không ghi GPA",
//     "Không có chứng chỉ",
//     "Một vài mô tả còn chung chung"
//   ],
//   "suggestions": [
//     "Thêm số liệu cho tất cả thành tựu (ví dụ: 'Cải thiện hiệu suất 23%')",
//     "Bổ sung LinkedIn và GitHub",
//     "Thêm 2–3 chứng chỉ liên quan",
//     "Áp dụng STAR: Situation, Task, Action, Result",
//     "Thay các động từ yếu bằng động từ mạnh",
//     "Thêm mục Dự án",
//     "Bổ sung phần kỹ năng ngôn ngữ",
//     "Tối ưu từ khóa cho ATS"
//   ]
// }
// TIÊU CHÍ CHẤM ĐIỂM (SCORING CRITERIA):

// ATS Score (0–100): Tiêu đề, font, từ khóa, không dùng hình ảnh, thông tin liên hệ, kỹ năng, thứ tự thời gian, định dạng

// Impact Score (0–100): Số liệu đo lường, động từ hành động, STAR, hướng đến kết quả, tác động kinh doanh

// Clarity Score (0–100): Bố cục, trình bày, tổ chức mục, ngữ pháp, độ dài phù hợp, giọng văn chuyên nghiệp

// Công thức Overall Score:
// → (ATS + Impact + Clarity) / 3

  private fallbackReview(cvData: CVData): CVReview {
    const hasExperience = cvData.experiences && cvData.experiences.length > 0;
    const hasEducation = cvData.education && cvData.education.length > 0;
    const hasSkills = cvData.skills && cvData.skills.length >= 5;
    const hasProjects = cvData.projects && cvData.projects.length > 0;
    const hasSummary = cvData.personalInfo.summary && cvData.personalInfo.summary.length > 50;

    // Calculate scores
    let atsScore = 50;
    if (hasExperience) atsScore += 15;
    if (hasEducation) atsScore += 10;
    if (hasSkills) atsScore += 15;
    if (cvData.personalInfo.email) atsScore += 10;

    let impactScore = 40;
    if (hasExperience && cvData.experiences.some(exp => exp.achievements?.length > 0)) {
      impactScore += 30;
    }
    if (hasSummary) impactScore += 15;
    if (hasProjects) impactScore += 15;

    let clarityScore = 60;
    if (hasSummary) clarityScore += 15;
    if (hasSkills) clarityScore += 15;
    if (cvData.personalInfo.phone && cvData.personalInfo.email) clarityScore += 10;

    return {
      overallScore: Math.round((atsScore + impactScore + clarityScore) / 3),
      atsScore,
      impactScore,
      clarityScore,
      strengths: [
        hasExperience ? 'Work experience section is present' : 'Personal information is complete',
        hasSkills ? 'Skills section is well-populated' : 'Contact information provided',
        hasEducation ? 'Education background included' : 'Basic structure is clear'
      ],
      weaknesses: [
        !hasSummary ? 'Missing professional summary' : 'Some achievements could be more quantified',
        !hasProjects ? 'No projects section' : 'Could add more detailed metrics',
        !cvData.certifications?.length ? 'No certifications listed' : 'LinkedIn profile not provided',
        'Could improve ATS compatibility',
        'Action verbs could be stronger'
      ],
      suggestions: [
        'Add quantifiable metrics to all achievements (e.g., percentages, numbers, time saved)',
        'Use strong action verbs: Led, Developed, Implemented, Achieved, Optimized',
        'Apply STAR method: Situation, Task, Action, Result for each experience',
        'Add a projects section showcasing your work',
        'Include relevant certifications to boost credibility',
        'Optimize keywords for ATS (Applicant Tracking Systems)',
        'Add LinkedIn and GitHub profiles if available',
        '⚠️ Note: AI review temporarily unavailable, using basic analysis'
      ]
    };
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const cvReviewer = new CVReviewerService();
