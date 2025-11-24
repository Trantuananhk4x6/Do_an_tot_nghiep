"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import NeuralNetworkBg from "@/components/ui/neural-network-bg";

export default function AboutTutorialPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white relative overflow-hidden">
      <NeuralNetworkBg />
      <div className="container mx-auto px-6 py-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Hướng dẫn sử dụng
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Hướng dẫn nhanh về các tính năng chính và cách tốt nhất để sử dụng AI Interview.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[{
              title: 'Live Interview',
              desc: 'Tham gia phỏng vấn trực tiếp (mentor hoặc phỏng vấn trực tuyến). Dùng để tập luyện, ghi âm, và nhận phản hồi.'
            },{
              title: 'Mock Interview',
              desc: 'Phỏng vấn giả lập với AI; nhấn "Leave" để gửi transcript cho AI chấm điểm và tạo báo cáo.'
            },{
              title: 'Preparation Hub',
              desc: 'Tạo và quản lý bộ câu hỏi theo vị trí và ngôn ngữ.'
            },{
              title: 'User Document',
              desc: 'Upload CV/ tài liệu để AI tham khảo tạo câu hỏi và feedback.'
            },{
              title: 'Support CV',
              desc: 'Phân tích CV và gợi ý chỉnh sửa tự động.'
            },{
              title: 'Find Job',
              desc: 'Tìm việc phù hợp với bạn và lưu các cơ hội.'
            },{
              title: 'Consulting & Network',
              desc: 'Kết nối với mentor và khoá học chuyên sâu.'
            },{
              title: 'Quiz',
              desc: 'Luyện câu hỏi trắc nghiệm để nâng cao kỹ năng kỹ thuật.'
            },{
              title: 'Summarize',
              desc: 'Tóm tắt CV, job description, hoặc transcript phỏng vấn.'
            }].map((item, idx) => (
              <div key={idx} className="glass-effect rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all">
                <h3 className="text-xl font-bold mb-2 text-purple-400">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
                {idx === 1 && (
                  <p className="text-sm text-yellow-300 mt-3">Tip: Khi bấm "Leave" ở Mock Interview, hệ thống gửi transcript lên AI để chấm điểm — set `language: 'vi'` nếu bạn muốn phản hồi bằng tiếng Việt.</p>
                )}
              </div>
            ))}
          </div>

          <div className="max-w-6xl mx-auto mt-4 p-6 rounded-xl border border-white/10 bg-gradient-to-r from-purple-900/10 to-pink-900/10">
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Mẹo khi sử dụng</h4>
            <ul className="text-gray-300 list-disc list-inside space-y-2">
              <li>Cho phép access microphone và camera để hệ thống ghi đúng.</li>
              <li>Nếu gặp lỗi rate-limit (429/quota), dữ liệu vẫn được lưu; thử lại sau một vài phút.</li>
              <li>Tùy chỉnh ngôn ngữ trong Preparation Hub hoặc trước khi bắt đầu mock để nhận feedback ngôn ngữ mong muốn.</li>
              <li>Assessment report được lưu tạm trong `sessionStorage` - export nếu cần lưu lâu dài.</li>
            </ul>
          </div>

          <div className="max-w-6xl mx-auto mt-8 text-center">
            <Link href="/mock-interview">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:scale-105 transition-transform">Bắt đầu Mock Interview</button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
