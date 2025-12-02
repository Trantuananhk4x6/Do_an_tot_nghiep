'use client';

import React from 'react';
import { Bot, FileText, Lightbulb, Sparkles, Target, CheckCircle, Clock } from 'lucide-react';

interface AutoEditLoadingDialogProps {
  isOpen: boolean;
  progress: number; // 0-100
  currentStep: string;
}

export default function AutoEditLoadingDialog({ 
  isOpen, 
  progress, 
  currentStep 
}: AutoEditLoadingDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <div className="relative glass-effect border-2 border-purple-500/50 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-scale-in">
        {/* Glow Effect Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-3xl blur-2xl -z-10 animate-pulse-glow" />
        
        {/* Icon with Orbital Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Orbiting Rings */}
            <div className="absolute inset-0 w-24 h-24 -left-2 -top-2">
              <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full animate-spin-slow" />
              <div className="absolute inset-2 border-2 border-blue-500/30 rounded-full animate-spin-reverse" style={{ animationDelay: '0.5s' }} />
            </div>
            
            {/* Main Icon */}
            <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 animate-pulse-glow">
              <Bot className="w-10 h-10 text-white animate-bounce-slow" />
            </div>
            
            {/* Status Indicator */}
            <div className="absolute -top-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-slate-900 flex items-center justify-center shadow-lg shadow-green-500/50">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
            </div>
          </div>
        </div>

        {/* Title with Gradient */}
        <h3 className="text-3xl font-bold text-center gradient-text mb-2 animate-text-shimmer">
          AI Auto-Editing Your CV
        </h3>
        <p className="text-gray-300 text-center text-sm mb-6 animate-fade-in-up flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Applying <span className="text-purple-400 font-semibold">STAR method</span> and optimizations...
        </p>

        {/* Enhanced Progress Bar with Wave Effect */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-200 font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              {currentStep}
            </span>
            <span className="text-lg text-purple-400 font-bold tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="relative h-4 bg-gray-800/80 rounded-full overflow-hidden border-2 border-purple-500/40 shadow-inner">
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer-fast" />
            
            {/* Progress Fill */}
            <div 
              className="relative h-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 rounded-full transition-all duration-700 ease-out overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Animated Shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              
              {/* Wave Effect */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-full bg-white/20 animate-wave" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Steps Checklist */}
        <div className="space-y-2 mb-6">
          <StepItem 
            icon={<FileText className="w-5 h-5" />}
            label="Analyzing CV content" 
            status={progress > 5 ? 'complete' : progress > 0 ? 'active' : 'pending'} 
          />
          <StepItem 
            icon={<Lightbulb className="w-5 h-5" />}
            label="Generating improvements" 
            status={progress > 35 ? 'complete' : progress > 10 ? 'active' : 'pending'} 
          />
          <StepItem 
            icon={<Sparkles className="w-5 h-5" />}
            label="Applying STAR method" 
            status={progress > 65 ? 'complete' : progress > 35 ? 'active' : 'pending'} 
          />
          <StepItem 
            icon={<Target className="w-5 h-5" />}
            label="Adding metrics & action verbs" 
            status={progress > 90 ? 'complete' : progress > 65 ? 'active' : 'pending'} 
          />
          <StepItem 
            icon={<CheckCircle className="w-5 h-5" />}
            label="Finalizing changes" 
            status={progress >= 100 ? 'complete' : progress > 90 ? 'active' : 'pending'} 
          />
        </div>

        {/* Info Banner with Animation */}
        <div className="relative bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-purple-900/40 border border-purple-500/40 rounded-xl p-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-shimmer-slow" />
          <div className="relative flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center animate-pulse">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-purple-300">Processing Time</p>
              <p className="text-xs text-gray-400">10-30 seconds depending on CV complexity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StepItemProps {
  icon: React.ReactNode;
  label: string;
  status: 'pending' | 'active' | 'complete';
}

function StepItem({ icon, label, status }: StepItemProps) {
  return (
    <div className={`
      relative flex items-center gap-3 p-3 rounded-xl transition-all duration-500 overflow-hidden
      ${status === 'complete' 
        ? 'bg-gradient-to-r from-green-900/40 to-green-800/20 border-2 border-green-500/50 shadow-lg shadow-green-500/20' 
        : status === 'active' 
        ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-2 border-purple-500/50 shadow-lg shadow-purple-500/20 animate-pulse-slow' 
        : 'bg-gray-800/30 border border-gray-700/30'
      }
    `}>
      {/* Background Shimmer Effect */}
      {status === 'active' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-shimmer-fast" />
      )}
      
      {/* Icon with Animation */}
      <div className={`
        relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
        ${status === 'complete' 
          ? 'bg-green-500/30 scale-110 text-green-400' 
          : status === 'active' 
          ? 'bg-purple-500/30 animate-bounce-subtle text-purple-400' 
          : 'bg-gray-700/30 text-gray-500'
        }
      `}>
        <span className={status === 'active' ? 'animate-bounce-slow' : ''}>
          {icon}
        </span>
      </div>
      
      {/* Label */}
      <span className={`
        relative flex-1 text-sm font-semibold transition-all duration-300
        ${status === 'complete' 
          ? 'text-green-300' 
          : status === 'active' 
          ? 'text-purple-300' 
          : 'text-gray-500'
        }
      `}>
        {label}
      </span>
      
      {/* Status Icon */}
      <div className="relative w-6 h-6 flex items-center justify-center">
        {status === 'complete' && (
          <div className="relative">
            <svg className="w-6 h-6 text-green-400 animate-scale-in" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <div className="absolute inset-0 bg-green-400 rounded-full blur animate-pulse" />
          </div>
        )}
        {status === 'active' && (
          <div className="relative">
            <div className="w-6 h-6 border-3 border-purple-400 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 border-3 border-purple-400/20 rounded-full animate-ping" />
          </div>
        )}
        {status === 'pending' && (
          <div className="w-6 h-6 border-2 border-gray-600 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-600 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
