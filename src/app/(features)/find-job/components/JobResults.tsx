'use client';

import React, { useState } from 'react';
import { JobSearchPlatform } from '../types/job.types';
import { formatLevelForPlatform } from '../services/jobPlatforms';

interface JobResultsProps {
  platforms: JobSearchPlatform[];
  keyword: string;
  location: string;
  level: string;
  onBack: () => void;
}

export default function JobResults({ platforms, keyword, location, level, onBack }: JobResultsProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    platforms.map(p => p.id)
  );

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const getSearchUrl = (platform: JobSearchPlatform) => {
    const formattedLevel = formatLevelForPlatform(level, platform.id);
    return platform.searchUrlTemplate
      .replace(/{keyword}/g, encodeURIComponent(keyword))
      .replace(/{location}/g, encodeURIComponent(location))
      .replace(/{level}/g, encodeURIComponent(formattedLevel));
  };

  const openAllSelected = () => {
    const selected = platforms.filter(p => selectedPlatforms.includes(p.id));
    selected.forEach(platform => {
      window.open(getSearchUrl(platform), '_blank');
    });
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          🎯 Tìm Việc Làm
        </h2>
        <p className="text-gray-300">
          Chọn các nền tảng bạn muốn tìm kiếm
        </p>
      </div>

      {/* Search Summary */}
      <div className="glass-effect rounded-2xl p-6 mb-8 border border-purple-500/30">
        <div className="flex items-start gap-4">
          <span className="text-4xl">🔍</span>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-3">Thông Tin Tìm Kiếm</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Vị trí</p>
                <p className="text-white font-medium">{keyword}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Cấp độ</p>
                <p className="text-white font-medium capitalize">{level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Địa điểm</p>
                <p className="text-white font-medium">{location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={onBack}
          className="px-6 py-3 glass-effect border-2 border-white/20 text-white rounded-xl font-medium hover:border-purple-400 transition-all duration-300"
        >
          ← Quay lại
        </button>
        <button
          onClick={openAllSelected}
          disabled={selectedPlatforms.length === 0}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl glow-effect disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🚀 Mở tất cả ({selectedPlatforms.length}) trang đã chọn
        </button>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          const searchUrl = getSearchUrl(platform);
          
          return (
            <div
              key={platform.id}
              className={`glass-effect rounded-2xl p-6 transition-all duration-300 ${
                isSelected 
                  ? 'border-2 border-purple-500 glow-effect' 
                  : 'border-2 border-white/20'
              }`}
            >
              {/* Platform Header */}
              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">{platform.logo}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {platform.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {platform.description}
                  </p>
                  <a 
                    href={platform.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {platform.url} ↗
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => togglePlatform(platform.id)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'bg-purple-500 text-white hover:bg-purple-600'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  {isSelected ? '✓ Đã chọn' : 'Chọn'}
                </button>
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
                >
                  Mở trang →
                </a>
              </div>

              {/* Preview URL */}
              <div className="mt-4 p-3 bg-black/30 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">URL tìm kiếm:</p>
                <p className="text-xs text-gray-300 break-all">
                  {searchUrl}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="mt-8 glass-effect border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <h4 className="font-bold text-blue-300 mb-2">Mẹo tìm việc hiệu quả</h4>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Tạo tài khoản trên các nền tảng để lưu việc làm và nhận thông báo</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Cập nhật CV và profile thường xuyên để tăng khả năng được nhà tuyển dụng chú ý</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Đọc kỹ mô tả công việc và yêu cầu trước khi apply</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Customize CV cho từng vị trí để tăng tỷ lệ thành công</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-3 gap-6">
        <div className="text-center glass-effect rounded-xl p-6">
          <div className="text-3xl mb-2">🎯</div>
          <p className="text-2xl font-bold text-white mb-1">{platforms.length}</p>
          <p className="text-sm text-gray-400">Nền tảng tuyển dụng</p>
        </div>
        <div className="text-center glass-effect rounded-xl p-6">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-2xl font-bold text-white mb-1">{selectedPlatforms.length}</p>
          <p className="text-sm text-gray-400">Nền tảng đã chọn</p>
        </div>
        <div className="text-center glass-effect rounded-xl p-6">
          <div className="text-3xl mb-2">🚀</div>
          <p className="text-2xl font-bold text-white mb-1">1 Click</p>
          <p className="text-sm text-gray-400">Mở tất cả cùng lúc</p>
        </div>
      </div>
    </div>
  );
}
