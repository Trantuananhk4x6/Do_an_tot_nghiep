import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LanguageWarningProps {
  language: string;
  show: boolean;
}

const LanguageWarning: React.FC<LanguageWarningProps> = ({ language, show }) => {
  // Only show warning for non-English languages
  if (language === 'en' || !show) return null;

  const languageNames: Record<string, string> = {
    vi: 'tiếng Việt',
    ja: '日本語',
    zh: '中文',
    ko: '한국어'
  };

  const languageName = languageNames[language] || language;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-amber-900 mb-1">
              ⚠️ Lưu ý về nhận diện giọng nói
            </h4>
            <p className="text-sm text-amber-800 leading-relaxed">
              Trình duyệt Chrome có hỗ trợ hạn chế cho nhận diện giọng nói <strong>{languageName}</strong>. 
              Để có kết quả tốt nhất:
            </p>
            <ul className="mt-2 ml-4 text-sm text-amber-800 space-y-1 list-disc">
              <li>Nói <strong>chậm rãi và rõ ràng</strong></li>
              <li>Nói trong môi trường <strong>yên tĩnh</strong></li>
              <li>Sử dụng <strong>micro chất lượng tốt</strong></li>
              <li>Nếu gặp khó khăn, bạn có thể <strong>gõ câu trả lời</strong> thay vì dùng micro</li>
            </ul>
            <p className="mt-2 text-xs text-amber-700 italic">
              💡 Tip: Bấm nút <strong>Stop</strong> sau khi nói xong để gửi câu trả lời
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LanguageWarning;
