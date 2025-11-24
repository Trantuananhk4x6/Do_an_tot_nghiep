'use client';

import { motion } from 'framer-motion';
import { Instagram, Facebook, Linkedin, Mail, Heart, Sparkles, Target, Users } from 'lucide-react';
import Link from 'next/link';
import NeuralNetworkBg from '@/components/ui/neural-network-bg';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white relative overflow-hidden">
      <NeuralNetworkBg />
      
      {/* Header */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            About AI Interview
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Empowering job seekers with AI-powered interview preparation
          </p>
        </motion.div>

        {/* Founder Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto mb-20"
        >
          <div className="glass-effect rounded-3xl p-8 md:p-12 border border-purple-500/30">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Photo */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-30"></div>
                <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-purple-500/50">
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 flex items-center justify-center">
                    <div className="text-9xl font-bold text-white/20">TA</div>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Trần Tuấn Anh
                  </h2>
                  <p className="text-purple-400 text-lg font-semibold">Founder & Creator • Born 2002</p>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    🚀 Passionate about leveraging AI to democratize interview preparation and help everyone land their dream jobs.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    💡 Inspired by the challenges of job hunting, I created AI Interview to make professional interview preparation accessible to everyone, regardless of their background or resources.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    🎯 My mission is to empower job seekers with intelligent tools that build confidence, refine skills, and open doors to opportunities.
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex gap-4 pt-4">
                  <a
                    href="https://www.instagram.com/tonytrank4x6/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:scale-110 transition-transform"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a
                    href="https://www.facebook.com/machinek4x6/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-blue-600 rounded-xl hover:scale-110 transition-transform"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          <div className="glass-effect rounded-2xl p-8 border border-purple-500/30 hover:border-purple-500/60 transition-all">
            <Heart className="h-12 w-12 text-pink-500 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-purple-400">Our Mission</h3>
            <p className="text-gray-300">
              To make high-quality interview preparation accessible to everyone through AI technology, helping job seekers build confidence and ace their interviews.
            </p>
          </div>

          <div className="glass-effect rounded-2xl p-8 border border-blue-500/30 hover:border-blue-500/60 transition-all">
            <Sparkles className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-blue-400">Our Vision</h3>
            <p className="text-gray-300">
              To become the world's most trusted AI-powered interview preparation platform, empowering millions to achieve their career dreams.
            </p>
          </div>

          <div className="glass-effect rounded-2xl p-8 border border-green-500/30 hover:border-green-500/60 transition-all">
            <Target className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-green-400">Our Values</h3>
            <p className="text-gray-300">
              Innovation, accessibility, and user success drive everything we do. We believe everyone deserves a fair shot at their dream career.
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Why AI Interview?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'AI-Powered Interviews',
                desc: 'Practice with intelligent AI that adapts to your responses'
              },
              {
                icon: '📊',
                title: 'Real-time Feedback',
                desc: 'Get instant analysis and improvement suggestions'
              },
              {
                icon: '🎓',
                title: 'Personalized Learning',
                desc: 'Questions tailored to your CV and target role'
              },
              {
                icon: '🌍',
                title: 'Multi-language Support',
                desc: 'Practice in Vietnamese, English, Japanese, Chinese, Korean'
              },
              {
                icon: '📝',
                title: 'CV Analysis',
                desc: 'AI-powered resume optimization and suggestions'
              },
              {
                icon: '💼',
                title: 'Job Matching',
                desc: 'Find the perfect jobs matching your skills'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="glass-effect rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-purple-400">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <div className="glass-effect rounded-3xl p-12 border border-purple-500/30">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ready to Ace Your Next Interview?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of successful candidates who prepared with AI Interview
            </p>
            <Link href="/live-interview">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg hover:scale-105 transition-transform shadow-lg shadow-purple-500/50">
                Start Free Practice
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
}
