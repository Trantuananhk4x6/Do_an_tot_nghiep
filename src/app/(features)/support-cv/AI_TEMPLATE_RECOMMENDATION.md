# AI Template Recommendation Feature

## 📋 Overview

The CV Support feature now includes **AI-powered template recommendation** that analyzes your CV data and suggests the most suitable template based on your profile, experience level, and industry.

## 🎯 Features

### 1. **AI Template Recommender Service**
- **Location:** `services/aiTemplateRecommender.ts`
- **Technology:** Google Gemini 2.0 Flash
- **Functionality:**
  - Analyzes CV data (job title, experience, skills, education)
  - Ranks all 5 templates by suitability (0-100 score)
  - Provides detailed reasoning for each recommendation
  - Lists pros and cons for each template
  - Selects top pick template

### 2. **Template Selector Panel (Right Sidebar)**
- **Location:** `components/TemplateSelectorPanel.tsx`
- **Features:**
  - 🤖 AI Recommendation panel at top
  - 🏆 "Top Pick" badge for best template
  - 📊 Match score (0-100) for each template
  - ✓ Pros/Cons analysis
  - 📋 Expandable template details
  - 🔄 Refresh recommendation button

### 3. **Integration in Editor**
- Replaces AI Suggestions panel in Edit step
- Real-time template preview
- One-click template switching
- Persistent across editing sessions

## 🚀 How It Works

### AI Analysis Process

```typescript
User enters Edit step → AI analyzes CV data → Gemini API call
   ↓
Returns:
- Top pick template (best match)
- All 5 templates ranked with scores
- Reasoning for each recommendation
- Pros & Cons for user profile
```

### Recommendation Algorithm

**AI considers:**
1. **Job Title** - Creative vs. Corporate
2. **Experience Level** - Entry-level vs. Senior
3. **Industry** - Tech vs. Finance vs. Creative
4. **Skills** - Technical vs. Design vs. Management
5. **Projects** - Number and type
6. **Education** - Academic vs. Professional

**Template Scoring:**
- **90-100:** Perfect match
- **80-89:** Excellent choice
- **70-79:** Good option
- **60-69:** Acceptable
- **Below 60:** Not recommended

## 📊 Template Recommendations by Profile

### 🤖 ATS-Friendly
**Best for:**
- Tech companies with ATS systems
- Online applications
- Entry-level positions
- Large corporations

**Score factors:**
- ✅ +20 if applying to tech companies
- ✅ +15 if entry-level (0-2 years)
- ✅ +10 if targeting startups

### 🎨 Modern Professional
**Best for:**
- Mid-level professionals (2-5 years)
- Tech industry
- Startup environment
- Creative-adjacent roles

**Score factors:**
- ✅ +20 if 2-5 years experience
- ✅ +15 if tech skills present
- ✅ +10 if has projects

### 📄 Clean Minimal
**Best for:**
- All industries (universal)
- Senior positions (5+ years)
- Conservative fields
- Academic roles

**Score factors:**
- ✅ +20 if 5+ years experience
- ✅ +15 if academic background
- ✅ +10 for all other cases (safe choice)

### ✨ Creative Bold
**Best for:**
- Designers
- Marketers
- Media professionals
- Creative agencies

**Score factors:**
- ✅ +30 if design/UI/UX skills
- ✅ +20 if marketing background
- ✅ +15 if creative industry
- ⚠️ -20 if conservative field

### 💼 Executive Professional
**Best for:**
- Executive positions (Director+)
- Finance industry
- Legal field
- Consulting firms

**Score factors:**
- ✅ +30 if 10+ years experience
- ✅ +20 if manager/director title
- ✅ +15 if finance/legal/consulting
- ⚠️ -15 if entry-level

## 🎨 UI Components

### AI Recommendation Panel

```
┌─────────────────────────────────┐
│ 🤖 AI Recommendation            │
│ Powered by Gemini               │
├─────────────────────────────────┤
│ Analysis: [2-3 sentence summary]│
├─────────────────────────────────┤
│ 🏆 Top Pick                     │
│ Modern Professional             │
│ [Use This Template] button      │
├─────────────────────────────────┤
│ 🔄 Refresh Recommendation       │
└─────────────────────────────────┘
```

### Template Card (Expanded)

```
┌─────────────────────────────────┐
│ 🤖 ATS-Friendly        ✓        │ ← Selected
│ Optimized for ATS systems       │
├─────────────────────────────────┤
│ AI Match: 95/100                │
│ ████████████████████░░ 95%      │ ← Progress bar
├─────────────────────────────────┤
│ Why: Best for tech applications │
├─────────────────────────────────┤
│ ✓ Pros:                         │
│   • ATS compatible              │
│   • High success rate           │
│ ⚠ Cons:                         │
│   • Less visually distinctive   │
├─────────────────────────────────┤
│ ↑ Less info                     │ ← Toggle
└─────────────────────────────────┘
```

## 🔧 Technical Implementation

### API Call Example

```typescript
// services/aiTemplateRecommender.ts
const prompt = `
Analyze this CV data:
- Job Title: Senior Software Engineer
- Experience: 5 positions
- Skills: React, Node.js, TypeScript
- Projects: 3 major projects

Recommend ALL 5 templates with scores, reasons, pros & cons.
Return JSON format.
`;

const result = await model.generateContent(prompt);
// Returns AITemplateResult with recommendations
```

### Component Integration

```typescript
// components/TemplateSelectorPanel.tsx
const [aiRecommendation, setAiRecommendation] = useState<AITemplateResult | null>(null);

useEffect(() => {
  getAIRecommendation(); // Auto-load on mount
}, []);

// Display top pick
const topPick = aiRecommendation?.topPick;
// Score for each template
const score = getTemplateScore('ats-friendly'); // 0-100
```

## 📱 User Experience Flow

1. **User clicks "Edit" step**
   - AI automatically analyzes CV data
   - Shows loading spinner (2-3 seconds)

2. **AI recommendation appears**
   - Top pick highlighted with 🏆 badge
   - All templates ranked by score
   - Click "Use This Template" to apply

3. **User can:**
   - Accept AI recommendation (1 click)
   - View all templates with scores
   - Expand for detailed pros/cons
   - Manually select different template
   - Refresh recommendation anytime

4. **Template changes:**
   - Instant preview update
   - Persists across sessions
   - Reflects in final export

## ⚠️ Fallback Behavior

If AI service fails:
- Uses rule-based recommendation
- Still provides scores and reasoning
- No user-facing errors
- Logs to console for debugging

```typescript
// Fallback logic
function fallbackRecommendation(cvData: CVData) {
  const experienceLevel = cvData.experiences.length;
  const isCreative = hasDesignSkills(cvData.skills);
  
  // Simple rules
  if (experienceLevel >= 5) return 'professional';
  if (isCreative) return 'creative';
  return 'ats-friendly'; // Safe default
}
```

## 🎯 Benefits

### For Users:
- ✅ No guesswork - AI tells you best template
- ✅ Industry-specific recommendations
- ✅ Confidence in template choice
- ✅ Higher application success rate

### For Developers:
- ✅ Modular service architecture
- ✅ Easy to extend with new templates
- ✅ Fallback for reliability
- ✅ Detailed logging for debugging

## 🔮 Future Enhancements

1. **Multi-language support** - Analyze CVs in Vietnamese
2. **Industry-specific templates** - Add more specialized templates
3. **A/B testing** - Track which templates get more interviews
4. **User feedback loop** - Learn from user template choices
5. **Template customization** - AI suggests color schemes
6. **Real-time updates** - Re-analyze as user edits CV

## 📝 Code Structure

```
support-cv/
├── services/
│   └── aiTemplateRecommender.ts      (AI service)
├── components/
│   ├── TemplateSelectorPanel.tsx     (Right sidebar)
│   └── CVEditor.tsx                  (Integration)
└── templates/
    └── templateData.ts               (Template metadata)
```

## 🧪 Testing

**To test AI recommendation:**

1. Fill in CV data in Edit step
2. Check right sidebar for AI panel
3. Verify top pick makes sense
4. Expand templates to see scores
5. Try "Refresh Recommendation"
6. Change template and verify preview updates

**Test profiles:**

- **Junior Developer** → Should recommend ATS-Friendly
- **Senior Manager** → Should recommend Professional
- **UI Designer** → Should recommend Creative
- **Academic** → Should recommend Minimal

## 📚 References

- Gemini API: https://ai.google.dev/
- Template Design Principles: ATS optimization
- CV Best Practices: Industry standards
