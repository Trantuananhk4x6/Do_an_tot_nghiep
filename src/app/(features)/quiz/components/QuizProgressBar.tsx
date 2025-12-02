"use client";

import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizProgressBarProps {
  steps: {
    id: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  currentStep: number;
  language: 'vi' | 'en' | 'ja' | 'zh' | 'ko';
}

export default function QuizProgressBar({
  steps,
  currentStep,
  language
}: QuizProgressBarProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative flex items-center justify-between">
        {/* Progress Line Background */}
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-700/50 -translate-y-1/2 rounded-full" />
        
        {/* Progress Line Active */}
        <motion.div
          className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-purple-500 to-blue-500 -translate-y-1/2 rounded-full"
          initial={{ width: "0%" }}
          animate={{ 
            width: `${(currentStep / (steps.length - 1)) * 100}%` 
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Step Indicators */}
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              {/* Step Circle */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: isCurrent ? 1.2 : 1,
                  opacity: isPending ? 0.5 : 1
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isCompleted 
                    ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                    : isCurrent 
                      ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30 ring-4 ring-purple-500/20"
                      : "bg-gray-700 text-gray-400"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : step.icon ? (
                  <span className="w-5 h-5">{step.icon}</span>
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </motion.div>

              {/* Step Label */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "absolute -bottom-6 text-xs font-medium whitespace-nowrap transition-colors duration-300",
                  isCompleted 
                    ? "text-green-400"
                    : isCurrent 
                      ? "text-purple-400"
                      : "text-gray-500"
                )}
              >
                {step.label}
              </motion.span>

              {/* Pulse Animation for Current */}
              {isCurrent && (
                <motion.div
                  className="absolute w-10 h-10 rounded-full bg-purple-500/30"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
