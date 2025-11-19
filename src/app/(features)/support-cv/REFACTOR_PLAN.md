# Support CV - Complete Refactor Plan

## 🎯 Mục tiêu
- Clean code, dễ maintain
- Tối ưu performance
- Xử lý lỗi tốt hơn
- Better UX với loading states
- Separation of concerns

## 📐 Kiến trúc mới

### 1. Context & State Management
```
contexts/
  ├── CVBuilderContext.tsx       # Global state cho CV builder
  └── AIServiceContext.tsx        # AI service state & quota tracking
```

### 2. Custom Hooks (Business Logic)
```
hooks/
  ├── useCVUpload.ts              # Handle upload & extract
  ├── useCVAnalysis.ts            # AI analysis logic
  ├── useCVReview.ts              # AI review logic
  ├── useCVAutoEdit.ts            # Auto-edit logic
  ├── useCVExport.ts              # Export logic
  └── useAIQuota.ts               # Track AI quota & rate limits
```

### 3. Services (Clean)
```
services/
  ├── pdf/
  │   ├── extractor.service.ts
  │   └── parser.service.ts
  ├── ai/
  │   ├── gemini.client.ts        # Gemini API wrapper
  │   ├── analyzer.service.ts
  │   ├── reviewer.service.ts
  │   ├── editor.service.ts
  │   ├── rate-limiter.service.ts
  │   └── queue.service.ts
  ├── export/
  │   ├── pdf-export.service.ts
  │   └── docx-export.service.ts
  └── validation/
      └── cv-validator.service.ts
```

### 4. Components (Presentation Only)
```
components/
  ├── steps/
  │   ├── UploadStep.tsx
  │   ├── ReviewStep.tsx
  │   ├── ComparisonStep.tsx
  │   ├── EditStep.tsx
  │   ├── PreviewStep.tsx
  │   └── ExportStep.tsx
  ├── shared/
  │   ├── StepIndicator.tsx
  │   ├── LoadingDialog.tsx
  │   ├── ErrorBoundary.tsx
  │   └── QuotaWarning.tsx
  └── editor/
      └── (existing sections)
```

### 5. Utils
```
utils/
  ├── cv-parser.util.ts
  ├── text-cleaner.util.ts
  ├── score-calculator.util.ts
  └── error-handler.util.ts
```

## ✨ Improvements

### Error Handling
- Centralized error boundary
- User-friendly error messages
- Automatic retry with exponential backoff
- Fallback strategies

### Loading States
- Skeleton loaders
- Progressive loading
- Optimistic updates

### Performance
- Lazy loading components
- Memoization
- Request deduplication
- Smart caching

### UX
- Clear feedback
- Progress indicators
- Undo/Redo capability
- Auto-save drafts

## 🚀 Implementation Order
1. ✅ Setup contexts & providers
2. ✅ Refactor services layer
3. ✅ Create custom hooks
4. ✅ Refactor components
5. ✅ Add error boundaries
6. ✅ Testing & optimization
