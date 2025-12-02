'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';

export type Language = 'vi' | 'en' | 'ja' | 'zh' | 'ko';

interface Translations {
  match: {
    title: string;
    excellent: string;
    good: string;
    average: string;
    needMore: string;
    fieldMatch: string;
    skillCoverage: string;
    hotSkillsInField: string;
    suggestions: string;
  };
  market: {
    marketInfo: string;
    field: string;
    demand: string;
    salary: string;
    jobs: string;
    trend: string;
    trendUp: string;
    trendStable: string;
    competition: string;
    high: string;
    medium: string;
    low: string;
    hotSkills: string;
    topCompanies: string;
    tips: string;
    loading: string;
    noData: string;
  };
  career: {
    careerInsights: string;
    basedOnProfile: string;
    developmentPath: string;
    nextStep: string;
    estimatedTime: string;
    years: string;
    suggestedSkills: string;
    viewRoadmap: string;
    noSuggestions: string;
    uploadCVForSuggestions: string;
    yourPath: string;
    currentPosition: string;
  };
  page: {
    title: string;
    subtitle: string;
  };
  steps: {
    upload: string;
    field: string;
    level: string;
    preferences: string;
    results: string;
  };
  upload: {
    title: string;
    subtitle: string;
    analyzing: string;
    button: string;
    skip: string;
    skipNote: string;
    features: {
      analyze: string;
      extract: string;
      match: string;
    };
    processing: {
      extracting: string;
      analyzing: string;
      matching: string;
    };
    success: string;
    foundSkills: string;
    error: string;
    tryAgain: string;
  };
  field: {
    title: string;
    subtitle: string;
    aiSuggestion: string;
    basedOnCV: string;
    recommended: string;
    search: string;
    popular: string;
    all: string;
  };
  level: {
    title: string;
    subtitle: string;
    cvAnalysis: string;
    suggestedLevel: string;
    detectedExperience: string;
    years: string;
    intern: { name: string; desc: string; exp: string };
    fresher: { name: string; desc: string; exp: string };
    junior: { name: string; desc: string; exp: string };
    middle: { name: string; desc: string; exp: string };
    senior: { name: string; desc: string; exp: string };
    lead: { name: string; desc: string; exp: string };
    manager: { name: string; desc: string; exp: string };
  };
  preferences: {
    title: string;
    subtitle: string;
    location: string;
    locationDesc: string;
    autoDetect: string;
    detectingLocation: string;
    detected: string;
    willingToRelocate: string;
    workType: string;
    workTypeDesc: string;
    companySize: string;
    companySizeDesc: string;
    salaryEstimate: string;
    basedOn: string;
    salaryNote: string;
    findNow: string;
  };
  results: {
    title: string;
    subtitle: string;
    searchInfo: string;
    position: string;
    level: string;
    location: string;
    workType: string;
    expectedSalary: string;
    openAll: string;
    selected: string;
    select: string;
    selectedBtn: string;
    openPage: string;
    searchUrl: string;
    tips: string;
    tipItems: string[];
    platforms: string;
    selectedCount: string;
    demandFor: string;
    openPositions: string;
    hotSkills: string;
    vietnamPlatforms: string;
    internationalPlatforms: string;
    startNewSearch: string;
  };
  common: {
    loading: string;
    error: string;
    retry: string;
    all: string;
    back: string;
    continue: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

// Translation objects
const viTranslations: Translations = {
    match: {
        title: 'Đánh giá độ phù hợp',
        excellent: 'Phù hợp xuất sắc!',
        good: 'Phù hợp tốt!',
        average: 'Phù hợp trung bình',
        needMore: 'Cần bổ sung thêm kỹ năng',
        fieldMatch: 'Độ khớp lĩnh vực',
        skillCoverage: 'Độ phủ kỹ năng hot',
        hotSkillsInField: 'Kỹ năng hot trong ngành:',
        suggestions: 'Gợi ý cải thiện:',
    },
    market: {
        marketInfo: 'Thông tin thị trường',
        field: 'Lĩnh vực',
        demand: 'Nhu cầu',
        salary: 'Mức lương',
        jobs: 'việc làm',
        trend: 'Xu hướng',
        trendUp: 'Đang tăng',
        trendStable: 'Ổn định',
        competition: 'Cạnh tranh',
        high: 'Cao',
        medium: 'Trung bình',
        low: 'Thấp',
        hotSkills: 'Kỹ năng hot',
        topCompanies: 'Công ty hàng đầu',
        tips: 'Mẹo ứng tuyển',
        loading: 'Đang tải thông tin thị trường...',
        noData: 'Không có dữ liệu thị trường',
    },
    career: {
        careerInsights: 'Định hướng nghề nghiệp',
        basedOnProfile: 'Dựa trên hồ sơ của bạn',
        developmentPath: 'Lộ trình phát triển',
        nextStep: 'Bước tiếp theo',
        estimatedTime: 'Thời gian dự kiến',
        years: 'năm',
        suggestedSkills: 'Kỹ năng cần phát triển',
        viewRoadmap: 'Xem lộ trình chi tiết',
        noSuggestions: 'Chưa có gợi ý',
        uploadCVForSuggestions: 'Tải CV để nhận gợi ý phát triển nghề nghiệp',
        yourPath: 'Lộ trình của bạn',
        currentPosition: 'Vị trí hiện tại',
    },
    page: {
        title: 'Tìm Việc Làm',
        subtitle: 'Khám phá cơ hội nghề nghiệp phù hợp với bạn',
    },
    steps: {
        upload: 'Tải CV',
        field: 'Lĩnh vực',
        level: 'Cấp bậc',
        preferences: 'Tùy chọn',
        results: 'Kết quả',
    },
    upload: {
        title: 'Bắt đầu hành trình tìm việc',
        subtitle: 'Tải CV của bạn lên để AI phân tích và đề xuất việc làm phù hợp',
        analyzing: 'Đang phân tích CV của bạn...',
        button: 'Tải CV (PDF)',
        skip: 'Bỏ qua bước này',
        skipNote: 'Bạn có thể tự chọn lĩnh vực mà không cần CV',
        features: {
            analyze: 'Phân tích kỹ năng từ CV',
            extract: 'Trích xuất kinh nghiệm làm việc',
            match: 'Đề xuất công việc phù hợp',
        },
        processing: {
            extracting: 'Đang trích xuất nội dung...',
            analyzing: 'Đang phân tích kỹ năng...',
            matching: 'Đang tìm kiếm việc phù hợp...',
        },
        success: 'Phân tích CV thành công!',
        foundSkills: 'Đã tìm thấy các kỹ năng',
        error: 'Lỗi khi phân tích CV',
        tryAgain: 'Thử lại',
    },
    field: {
        title: 'Chọn lĩnh vực công việc',
        subtitle: 'Lựa chọn ngành nghề phù hợp với kỹ năng của bạn',
        aiSuggestion: 'Gợi ý từ AI',
        basedOnCV: 'Dựa trên CV của bạn',
        recommended: 'Đề xuất',
        search: 'Tìm kiếm lĩnh vực...',
        popular: 'Lĩnh vực phổ biến',
        all: 'Tất cả lĩnh vực',
    },
    level: {
        title: 'Chọn cấp độ kinh nghiệm',
        subtitle: 'Xác định cấp bậc phù hợp với kinh nghiệm của bạn',
        cvAnalysis: 'Phân tích CV của bạn',
        suggestedLevel: 'Cấp độ phù hợp dựa trên CV',
        detectedExperience: 'Kinh nghiệm phát hiện được',
        years: 'năm',
        intern: { name: 'Thực tập sinh', desc: 'Sinh viên hoặc người mới bắt đầu', exp: '0 năm kinh nghiệm' },
        fresher: { name: 'Fresher', desc: 'Mới ra trường, ít kinh nghiệm', exp: 'Dưới 1 năm kinh nghiệm' },
        junior: { name: 'Junior', desc: 'Có kiến thức cơ bản', exp: '1-2 năm kinh nghiệm' },
        middle: { name: 'Middle', desc: 'Có thể làm việc độc lập', exp: '2-4 năm kinh nghiệm' },
        senior: { name: 'Senior', desc: 'Kinh nghiệm chuyên sâu', exp: '4-7 năm kinh nghiệm' },
        lead: { name: 'Team Lead', desc: 'Quản lý nhóm, dẫn dắt dự án', exp: '5+ năm kinh nghiệm' },
        manager: { name: 'Manager', desc: 'Quản lý cấp cao', exp: '7+ năm kinh nghiệm' },
    },
    preferences: {
        title: 'Tùy chỉnh tìm kiếm',
        subtitle: 'Cho chúng tôi biết thêm về mong muốn của bạn để tìm được công việc phù hợp nhất',
        location: 'Vị trí làm việc',
        locationDesc: 'Chọn thành phố bạn muốn tìm việc',
        autoDetect: 'Tự động xác định vị trí',
        detectingLocation: 'Đang xác định vị trí...',
        detected: 'Đã xác định',
        willingToRelocate: 'Sẵn sàng chuyển đến thành phố khác',
        workType: 'Hình thức làm việc',
        workTypeDesc: 'Bạn muốn làm việc theo hình thức nào?',
        companySize: 'Quy mô công ty',
        companySizeDesc: 'Bạn thích làm việc ở công ty quy mô nào?',
        salaryEstimate: 'Mức lương ước tính',
        basedOn: 'Dựa trên',
        salaryNote: 'Mức lương tham khảo theo thị trường Việt Nam',
        findNow: 'Tìm việc ngay',
    },
    results: {
        title: 'Kết quả tìm kiếm',
        subtitle: 'Chọn các nền tảng để bắt đầu tìm kiếm',
        searchInfo: 'Thông tin tìm kiếm',
        position: 'Vị trí',
        level: 'Cấp bậc',
        location: 'Địa điểm',
        workType: 'Hình thức',
        expectedSalary: 'Mức lương mong muốn',
        openAll: 'Mở tất cả',
        selected: 'trang đã chọn',
        select: 'Chọn',
        selectedBtn: 'Đã chọn',
        openPage: 'Mở trang',
        searchUrl: 'URL tìm kiếm',
        tips: 'Mẹo tìm việc hiệu quả',
        tipItems: [
            'Tạo tài khoản trên các nền tảng để lưu việc làm và nhận thông báo',
            'Cập nhật CV và profile thường xuyên để tăng cơ hội tiếp cận',
            'Đọc kỹ mô tả công việc và yêu cầu trước khi ứng tuyển',
        ],
        platforms: 'Nền tảng',
        selectedCount: 'Đã chọn',
        demandFor: 'Nhu cầu tuyển dụng cho',
        openPositions: 'vị trí đang mở',
        hotSkills: 'Kỹ năng hot',
        vietnamPlatforms: 'Nền tảng Việt Nam',
        internationalPlatforms: 'Nền tảng Quốc tế',
        startNewSearch: 'Bắt đầu tìm kiếm mới',
    },
    common: {
        loading: 'Đang tải...',
        error: 'Có lỗi xảy ra',
        retry: 'Thử lại',
        all: 'Tất cả',
        back: 'Quay lại',
        continue: 'Tiếp tục',
    },
};

const enTranslations: Translations = {
    match: {
        title: 'Match Assessment',
        excellent: 'Excellent match!',
        good: 'Good match!',
        average: 'Average match',
        needMore: 'Need more skills',
        fieldMatch: 'Field match',
        skillCoverage: 'Hot skills coverage',
        hotSkillsInField: 'Hot skills in this field:',
        suggestions: 'Improvement suggestions:',
    },
    market: {
        marketInfo: 'Market Information',
        field: 'Field',
        demand: 'Demand',
        salary: 'Salary',
        jobs: 'jobs',
        trend: 'Trend',
        trendUp: 'Growing',
        trendStable: 'Stable',
        competition: 'Competition',
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        hotSkills: 'Hot Skills',
        topCompanies: 'Top Companies',
        tips: 'Application Tips',
        loading: 'Loading market information...',
        noData: 'No market data available',
    },
    career: {
        careerInsights: 'Career Insights',
        basedOnProfile: 'Based on your profile',
        developmentPath: 'Development Path',
        nextStep: 'Next Step',
        estimatedTime: 'Estimated Time',
        years: 'years',
        suggestedSkills: 'Skills to develop',
        viewRoadmap: 'View detailed roadmap',
        noSuggestions: 'No suggestions yet',
        uploadCVForSuggestions: 'Upload your CV to get career development suggestions',
        yourPath: 'Your Path',
        currentPosition: 'Current Position',
    },
    page: {
        title: 'Find Jobs',
        subtitle: 'Discover career opportunities that match you',
    },
    steps: {
        upload: 'Upload CV',
        field: 'Field',
        level: 'Level',
        preferences: 'Preferences',
        results: 'Results',
    },
    upload: {
        title: 'Start Your Job Search Journey',
        subtitle: 'Upload your CV for AI analysis and job recommendations',
        analyzing: 'Analyzing your CV...',
        button: 'Upload CV (PDF)',
        skip: 'Skip this step',
        skipNote: 'You can manually select your field without a CV',
        features: {
            analyze: 'Analyze skills from CV',
            extract: 'Extract work experience',
            match: 'Suggest suitable jobs',
        },
        processing: {
            extracting: 'Extracting content...',
            analyzing: 'Analyzing skills...',
            matching: 'Finding suitable jobs...',
        },
        success: 'CV analysis successful!',
        foundSkills: 'Skills found',
        error: 'Error analyzing CV',
        tryAgain: 'Try again',
    },
    field: {
        title: 'Select Your Field',
        subtitle: 'Choose the industry that matches your skills',
        aiSuggestion: 'AI Suggestion',
        basedOnCV: 'Based on your CV',
        recommended: 'Recommended',
        search: 'Search fields...',
        popular: 'Popular Fields',
        all: 'All Fields',
    },
    level: {
        title: 'Select Experience Level',
        subtitle: 'Determine the level that matches your experience',
        cvAnalysis: 'Your CV Analysis',
        suggestedLevel: 'Suggested level based on CV',
        detectedExperience: 'Detected experience',
        years: 'years',
        intern: { name: 'Intern', desc: 'Student or beginner', exp: '0 years experience' },
        fresher: { name: 'Fresher', desc: 'Fresh graduate, little experience', exp: 'Less than 1 year experience' },
        junior: { name: 'Junior', desc: 'Basic knowledge', exp: '1-2 years experience' },
        middle: { name: 'Middle', desc: 'Can work independently', exp: '2-4 years experience' },
        senior: { name: 'Senior', desc: 'Deep expertise', exp: '4-7 years experience' },
        lead: { name: 'Team Lead', desc: 'Team management, project leadership', exp: '5+ years experience' },
        manager: { name: 'Manager', desc: 'Senior management', exp: '7+ years experience' },
    },
    preferences: {
        title: 'Customize Search',
        subtitle: 'Tell us more about your preferences to find the most suitable job',
        location: 'Work Location',
        locationDesc: 'Choose the city where you want to work',
        autoDetect: 'Auto-detect location',
        detectingLocation: 'Detecting location...',
        detected: 'Detected',
        willingToRelocate: 'Willing to relocate to another city',
        workType: 'Work Type',
        workTypeDesc: 'What work type do you prefer?',
        companySize: 'Company Size',
        companySizeDesc: 'What company size do you prefer?',
        salaryEstimate: 'Estimated Salary',
        basedOn: 'Based on',
        salaryNote: 'Reference salary according to Vietnam market',
        findNow: 'Find Jobs Now',
    },
    results: {
        title: 'Search Results',
        subtitle: 'Select platforms to start searching',
        searchInfo: 'Search Information',
        position: 'Position',
        level: 'Level',
        location: 'Location',
        workType: 'Work Type',
        expectedSalary: 'Expected Salary',
        openAll: 'Open All',
        selected: 'selected pages',
        select: 'Select',
        selectedBtn: 'Selected',
        openPage: 'Open',
        searchUrl: 'Search URL',
        tips: 'Effective Job Search Tips',
        tipItems: [
            'Create accounts on platforms to save jobs and receive notifications',
            'Update your CV and profile regularly to increase opportunities',
            'Read job descriptions and requirements carefully before applying',
        ],
        platforms: 'Platforms',
        selectedCount: 'Selected',
        demandFor: 'Hiring demand for',
        openPositions: 'open positions',
        hotSkills: 'Hot skills',
        vietnamPlatforms: 'Vietnam Platforms',
        internationalPlatforms: 'International Platforms',
        startNewSearch: 'Start New Search',
    },
    common: {
        loading: 'Loading...',
        error: 'An error occurred',
        retry: 'Retry',
        all: 'All',
        back: 'Back',
        continue: 'Continue',
    },
};

// Japanese translations
const jaTranslations: Translations = {
    match: {
        title: 'マッチング評価',
        excellent: '非常にマッチ！',
        good: '良いマッチ！',
        average: '普通のマッチ',
        needMore: 'スキルが必要です',
        fieldMatch: '分野マッチ',
        skillCoverage: '人気スキルカバー率',
        hotSkillsInField: 'この分野の人気スキル：',
        suggestions: '改善提案：',
    },
    market: {
        marketInfo: '市場情報',
        field: '分野',
        demand: '需要',
        salary: '給与',
        jobs: '求人',
        trend: 'トレンド',
        trendUp: '上昇中',
        trendStable: '安定',
        competition: '競争',
        high: '高い',
        medium: '中程度',
        low: '低い',
        hotSkills: '人気スキル',
        topCompanies: 'トップ企業',
        tips: '応募のコツ',
        loading: '市場情報を読み込み中...',
        noData: '市場データがありません',
    },
    career: {
        careerInsights: 'キャリアインサイト',
        basedOnProfile: 'プロフィールに基づく',
        developmentPath: '成長パス',
        nextStep: '次のステップ',
        estimatedTime: '予想時間',
        years: '年',
        suggestedSkills: '開発すべきスキル',
        viewRoadmap: '詳細ロードマップを見る',
        noSuggestions: '提案はまだありません',
        uploadCVForSuggestions: '履歴書をアップロードして提案を受け取る',
        yourPath: 'あなたのパス',
        currentPosition: '現在の職位',
    },
    page: {
        title: '求人検索',
        subtitle: 'あなたに合ったキャリア機会を発見',
    },
    steps: {
        upload: '履歴書',
        field: '分野',
        level: 'レベル',
        preferences: '設定',
        results: '結果',
    },
    upload: {
        title: '就職活動を始めよう',
        subtitle: 'AIによる分析と求人推薦のために履歴書をアップロード',
        analyzing: '履歴書を分析中...',
        button: '履歴書をアップロード (PDF)',
        skip: 'このステップをスキップ',
        skipNote: '履歴書なしで分野を選択できます',
        features: {
            analyze: '履歴書からスキルを分析',
            extract: '職歴を抽出',
            match: '適切な求人を提案',
        },
        processing: {
            extracting: 'コンテンツを抽出中...',
            analyzing: 'スキルを分析中...',
            matching: '適切な求人を検索中...',
        },
        success: '履歴書の分析完了！',
        foundSkills: '見つかったスキル',
        error: '履歴書の分析エラー',
        tryAgain: '再試行',
    },
    field: {
        title: '分野を選択',
        subtitle: 'あなたのスキルに合った業界を選択',
        aiSuggestion: 'AI提案',
        basedOnCV: '履歴書に基づく',
        recommended: 'おすすめ',
        search: '分野を検索...',
        popular: '人気の分野',
        all: 'すべての分野',
    },
    level: {
        title: '経験レベルを選択',
        subtitle: 'あなたの経験に合ったレベルを選択',
        cvAnalysis: '履歴書の分析',
        suggestedLevel: '履歴書に基づく推奨レベル',
        detectedExperience: '検出された経験',
        years: '年',
        intern: { name: 'インターン', desc: '学生または初心者', exp: '経験0年' },
        fresher: { name: '新卒', desc: '卒業したて、経験少ない', exp: '1年未満の経験' },
        junior: { name: 'ジュニア', desc: '基礎知識あり', exp: '1-2年の経験' },
        middle: { name: 'ミドル', desc: '独立して働ける', exp: '2-4年の経験' },
        senior: { name: 'シニア', desc: '深い専門知識', exp: '4-7年の経験' },
        lead: { name: 'リーダー', desc: 'チーム管理、プロジェクトリード', exp: '5年以上の経験' },
        manager: { name: 'マネージャー', desc: '上級管理職', exp: '7年以上の経験' },
    },
    preferences: {
        title: '検索をカスタマイズ',
        subtitle: '最適な求人を見つけるために詳細を教えてください',
        location: '勤務地',
        locationDesc: '働きたい都市を選択',
        autoDetect: '位置を自動検出',
        detectingLocation: '位置を検出中...',
        detected: '検出済み',
        willingToRelocate: '他の都市への転居可能',
        workType: '勤務形態',
        workTypeDesc: '希望の勤務形態は？',
        companySize: '会社規模',
        companySizeDesc: '希望の会社規模は？',
        salaryEstimate: '予想給与',
        basedOn: '基準',
        salaryNote: 'ベトナム市場の参考給与',
        findNow: '今すぐ検索',
    },
    results: {
        title: '検索結果',
        subtitle: 'プラットフォームを選択して検索開始',
        searchInfo: '検索情報',
        position: '職種',
        level: 'レベル',
        location: '場所',
        workType: '勤務形態',
        expectedSalary: '希望給与',
        openAll: 'すべて開く',
        selected: '選択済みページ',
        select: '選択',
        selectedBtn: '選択済み',
        openPage: '開く',
        searchUrl: '検索URL',
        tips: '効果的な求人検索のコツ',
        tipItems: [
            'プラットフォームでアカウントを作成して求人を保存',
            '履歴書とプロフィールを定期的に更新',
            '応募前に求人内容と要件をよく読む',
        ],
        platforms: 'プラットフォーム',
        selectedCount: '選択済み',
        demandFor: 'の採用需要',
        openPositions: '募集中',
        hotSkills: '人気スキル',
        vietnamPlatforms: 'ベトナムのプラットフォーム',
        internationalPlatforms: '国際プラットフォーム',
        startNewSearch: '新しい検索を開始',
    },
    common: {
        loading: '読み込み中...',
        error: 'エラーが発生しました',
        retry: '再試行',
        all: 'すべて',
        back: '戻る',
        continue: '続ける',
    },
};

// Chinese translations
const zhTranslations: Translations = {
    match: {
        title: '匹配评估',
        excellent: '非常匹配！',
        good: '良好匹配！',
        average: '一般匹配',
        needMore: '需要更多技能',
        fieldMatch: '领域匹配',
        skillCoverage: '热门技能覆盖',
        hotSkillsInField: '该领域热门技能：',
        suggestions: '改进建议：',
    },
    market: {
        marketInfo: '市场信息',
        field: '领域',
        demand: '需求',
        salary: '薪资',
        jobs: '职位',
        trend: '趋势',
        trendUp: '上升中',
        trendStable: '稳定',
        competition: '竞争',
        high: '高',
        medium: '中等',
        low: '低',
        hotSkills: '热门技能',
        topCompanies: '顶尖公司',
        tips: '申请技巧',
        loading: '正在加载市场信息...',
        noData: '暂无市场数据',
    },
    career: {
        careerInsights: '职业洞察',
        basedOnProfile: '基于您的资料',
        developmentPath: '发展路径',
        nextStep: '下一步',
        estimatedTime: '预计时间',
        years: '年',
        suggestedSkills: '需要发展的技能',
        viewRoadmap: '查看详细路线图',
        noSuggestions: '暂无建议',
        uploadCVForSuggestions: '上传简历获取职业发展建议',
        yourPath: '您的路径',
        currentPosition: '当前职位',
    },
    page: {
        title: '找工作',
        subtitle: '发现适合您的职业机会',
    },
    steps: {
        upload: '上传简历',
        field: '领域',
        level: '级别',
        preferences: '偏好',
        results: '结果',
    },
    upload: {
        title: '开始您的求职之旅',
        subtitle: '上传简历进行AI分析和职位推荐',
        analyzing: '正在分析您的简历...',
        button: '上传简历 (PDF)',
        skip: '跳过此步骤',
        skipNote: '您可以不上传简历手动选择领域',
        features: {
            analyze: '从简历分析技能',
            extract: '提取工作经验',
            match: '推荐合适的职位',
        },
        processing: {
            extracting: '正在提取内容...',
            analyzing: '正在分析技能...',
            matching: '正在寻找合适的职位...',
        },
        success: '简历分析成功！',
        foundSkills: '发现的技能',
        error: '简历分析错误',
        tryAgain: '重试',
    },
    field: {
        title: '选择您的领域',
        subtitle: '选择与您技能匹配的行业',
        aiSuggestion: 'AI建议',
        basedOnCV: '基于您的简历',
        recommended: '推荐',
        search: '搜索领域...',
        popular: '热门领域',
        all: '所有领域',
    },
    level: {
        title: '选择经验级别',
        subtitle: '确定与您经验匹配的级别',
        cvAnalysis: '您的简历分析',
        suggestedLevel: '基于简历的建议级别',
        detectedExperience: '检测到的经验',
        years: '年',
        intern: { name: '实习生', desc: '学生或初学者', exp: '0年经验' },
        fresher: { name: '应届生', desc: '刚毕业，经验少', exp: '少于1年经验' },
        junior: { name: '初级', desc: '基础知识', exp: '1-2年经验' },
        middle: { name: '中级', desc: '可以独立工作', exp: '2-4年经验' },
        senior: { name: '高级', desc: '深厚专业知识', exp: '4-7年经验' },
        lead: { name: '团队负责人', desc: '团队管理，项目领导', exp: '5年以上经验' },
        manager: { name: '经理', desc: '高级管理', exp: '7年以上经验' },
    },
    preferences: {
        title: '自定义搜索',
        subtitle: '告诉我们更多关于您的偏好以找到最合适的工作',
        location: '工作地点',
        locationDesc: '选择您想工作的城市',
        autoDetect: '自动检测位置',
        detectingLocation: '正在检测位置...',
        detected: '已检测',
        willingToRelocate: '愿意搬迁到其他城市',
        workType: '工作类型',
        workTypeDesc: '您喜欢什么工作类型？',
        companySize: '公司规模',
        companySizeDesc: '您喜欢什么规模的公司？',
        salaryEstimate: '预估薪资',
        basedOn: '基于',
        salaryNote: '参考越南市场薪资',
        findNow: '立即搜索',
    },
    results: {
        title: '搜索结果',
        subtitle: '选择平台开始搜索',
        searchInfo: '搜索信息',
        position: '职位',
        level: '级别',
        location: '地点',
        workType: '工作类型',
        expectedSalary: '期望薪资',
        openAll: '全部打开',
        selected: '已选页面',
        select: '选择',
        selectedBtn: '已选',
        openPage: '打开',
        searchUrl: '搜索网址',
        tips: '有效求职技巧',
        tipItems: [
            '在平台上创建账户以保存职位和接收通知',
            '定期更新您的简历和个人资料以增加机会',
            '申请前仔细阅读职位描述和要求',
        ],
        platforms: '平台',
        selectedCount: '已选',
        demandFor: '的招聘需求',
        openPositions: '开放职位',
        hotSkills: '热门技能',
        vietnamPlatforms: '越南平台',
        internationalPlatforms: '国际平台',
        startNewSearch: '开始新搜索',
    },
    common: {
        loading: '加载中...',
        error: '发生错误',
        retry: '重试',
        all: '全部',
        back: '返回',
        continue: '继续',
    },
};

// Korean translations
const koTranslations: Translations = {
    match: {
        title: '매칭 평가',
        excellent: '탁월한 매칭!',
        good: '좋은 매칭!',
        average: '보통 매칭',
        needMore: '더 많은 스킬 필요',
        fieldMatch: '분야 매칭',
        skillCoverage: '인기 스킬 커버리지',
        hotSkillsInField: '이 분야의 인기 스킬:',
        suggestions: '개선 제안:',
    },
    market: {
        marketInfo: '시장 정보',
        field: '분야',
        demand: '수요',
        salary: '급여',
        jobs: '채용',
        trend: '트렌드',
        trendUp: '상승 중',
        trendStable: '안정',
        competition: '경쟁',
        high: '높음',
        medium: '보통',
        low: '낮음',
        hotSkills: '인기 스킬',
        topCompanies: '최고 기업',
        tips: '지원 팁',
        loading: '시장 정보 로딩 중...',
        noData: '시장 데이터 없음',
    },
    career: {
        careerInsights: '커리어 인사이트',
        basedOnProfile: '프로필 기반',
        developmentPath: '성장 경로',
        nextStep: '다음 단계',
        estimatedTime: '예상 시간',
        years: '년',
        suggestedSkills: '개발할 스킬',
        viewRoadmap: '상세 로드맵 보기',
        noSuggestions: '아직 제안 없음',
        uploadCVForSuggestions: '이력서를 업로드하여 제안 받기',
        yourPath: '당신의 경로',
        currentPosition: '현재 직위',
    },
    page: {
        title: '채용 검색',
        subtitle: '당신에게 맞는 커리어 기회 발견',
    },
    steps: {
        upload: '이력서',
        field: '분야',
        level: '레벨',
        preferences: '설정',
        results: '결과',
    },
    upload: {
        title: '취업 여정을 시작하세요',
        subtitle: 'AI 분석 및 채용 추천을 위해 이력서를 업로드하세요',
        analyzing: '이력서 분석 중...',
        button: '이력서 업로드 (PDF)',
        skip: '이 단계 건너뛰기',
        skipNote: '이력서 없이 분야를 수동으로 선택할 수 있습니다',
        features: {
            analyze: '이력서에서 스킬 분석',
            extract: '경력 추출',
            match: '적합한 채용 제안',
        },
        processing: {
            extracting: '내용 추출 중...',
            analyzing: '스킬 분석 중...',
            matching: '적합한 채용 검색 중...',
        },
        success: '이력서 분석 완료!',
        foundSkills: '발견된 스킬',
        error: '이력서 분석 오류',
        tryAgain: '재시도',
    },
    field: {
        title: '분야 선택',
        subtitle: '스킬에 맞는 산업 선택',
        aiSuggestion: 'AI 제안',
        basedOnCV: '이력서 기반',
        recommended: '추천',
        search: '분야 검색...',
        popular: '인기 분야',
        all: '모든 분야',
    },
    level: {
        title: '경험 레벨 선택',
        subtitle: '경험에 맞는 레벨 결정',
        cvAnalysis: '이력서 분석',
        suggestedLevel: '이력서 기반 추천 레벨',
        detectedExperience: '감지된 경험',
        years: '년',
        intern: { name: '인턴', desc: '학생 또는 초보자', exp: '경험 0년' },
        fresher: { name: '신입', desc: '갓 졸업, 경험 적음', exp: '1년 미만 경험' },
        junior: { name: '주니어', desc: '기본 지식', exp: '1-2년 경험' },
        middle: { name: '미들', desc: '독립적으로 일할 수 있음', exp: '2-4년 경험' },
        senior: { name: '시니어', desc: '깊은 전문 지식', exp: '4-7년 경험' },
        lead: { name: '리드', desc: '팀 관리, 프로젝트 리더십', exp: '5년 이상 경험' },
        manager: { name: '매니저', desc: '상위 관리', exp: '7년 이상 경험' },
    },
    preferences: {
        title: '검색 맞춤 설정',
        subtitle: '가장 적합한 직업을 찾기 위해 선호도를 알려주세요',
        location: '근무 위치',
        locationDesc: '일하고 싶은 도시 선택',
        autoDetect: '위치 자동 감지',
        detectingLocation: '위치 감지 중...',
        detected: '감지됨',
        willingToRelocate: '다른 도시로 이전 가능',
        workType: '근무 유형',
        workTypeDesc: '선호하는 근무 유형은?',
        companySize: '회사 규모',
        companySizeDesc: '선호하는 회사 규모는?',
        salaryEstimate: '예상 급여',
        basedOn: '기준',
        salaryNote: '베트남 시장 참고 급여',
        findNow: '지금 검색',
    },
    results: {
        title: '검색 결과',
        subtitle: '검색을 시작할 플랫폼 선택',
        searchInfo: '검색 정보',
        position: '직위',
        level: '레벨',
        location: '위치',
        workType: '근무 유형',
        expectedSalary: '희망 급여',
        openAll: '모두 열기',
        selected: '선택된 페이지',
        select: '선택',
        selectedBtn: '선택됨',
        openPage: '열기',
        searchUrl: '검색 URL',
        tips: '효과적인 구직 팁',
        tipItems: [
            '플랫폼에서 계정을 만들어 채용을 저장하고 알림 받기',
            '이력서와 프로필을 정기적으로 업데이트',
            '지원 전 채용 설명과 요구사항을 주의 깊게 읽기',
        ],
        platforms: '플랫폼',
        selectedCount: '선택됨',
        demandFor: '의 채용 수요',
        openPositions: '모집 중',
        hotSkills: '인기 스킬',
        vietnamPlatforms: '베트남 플랫폼',
        internationalPlatforms: '국제 플랫폼',
        startNewSearch: '새 검색 시작',
    },
    common: {
        loading: '로딩 중...',
        error: '오류가 발생했습니다',
        retry: '재시도',
        all: '전체',
        back: '뒤로',
        continue: '계속',
    },
};

const translations: Record<Language, Translations> = {
  vi: viTranslations,
  en: enTranslations,
  ja: jaTranslations,
  zh: zhTranslations,
  ko: koTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('vi');

  const t = useMemo(() => {
    return translations[language];
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
