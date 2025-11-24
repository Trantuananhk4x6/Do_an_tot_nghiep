"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash, FileText, Calendar, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { Resume } from "@/models/resume";
import { motion } from "framer-motion";

interface ResumeTableProps {
  resumes: Resume[];
  onDelete: (id: number) => void;
}

const ResumeTable: React.FC<ResumeTableProps> = ({ resumes, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Glowing background effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
      
      <div className="relative glass-effect rounded-3xl p-8 border border-purple-500/20 overflow-hidden">
        {/* Animated corner decorations */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-purple-500/30 rounded-tl-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-pink-500/30 rounded-br-3xl" />
        
        {/* Scanning line effect */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          animate={{ 
            y: [0, 600, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <Table>
          <TableCaption className="text-gray-400 mt-6">
            <motion.div 
              className="flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span>A list of your resume documents</span>
              <Sparkles className="w-4 h-4 text-pink-400" />
            </motion.div>
          </TableCaption>
          <TableHeader>
            <TableRow className="border-b border-purple-500/20 hover:bg-transparent">
              <TableHead className="text-purple-300 font-bold text-base">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  File Name
                </div>
              </TableHead>
              <TableHead className="text-purple-300 font-bold text-base">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600/30 to-blue-600/30 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-pink-400" />
                  </div>
                  Document Type
                </div>
              </TableHead>
              <TableHead className="text-purple-300 font-bold text-base">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/30 to-purple-600/30 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  Upload Date
                </div>
              </TableHead>
              <TableHead className="text-purple-300 font-bold text-base text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resumes.map((resume, index) => (
              <motion.tr
                key={resume.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="border-b border-purple-500/10 hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-pink-500/5 transition-all group cursor-pointer"
              >
                <TableCell className="font-medium text-gray-200 py-6">
                  <motion.div 
                    className="flex items-center gap-4"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/40 to-pink-600/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                      <FileText className="w-6 h-6 text-purple-300" />
                    </div>
                    <div>
                      <p className="text-gray-100 font-semibold group-hover:text-purple-300 transition-colors">
                        {resume.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">PDF Document</p>
                    </div>
                  </motion.div>
                </TableCell>
                <TableCell className="text-gray-300 py-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-sm font-semibold border border-purple-500/30 hover:border-purple-500/50 transition-all">
                    <Sparkles className="w-3 h-3" />
                    Resume
                  </span>
                </TableCell>
                <TableCell className="text-gray-300 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium">{formatDate(resume.createdAt)}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Upload date</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-6">
                  <div className="flex justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => onDelete(resume.id)}
                        variant="outline"
                        className="relative group/btn h-12 px-6 bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 transition-all rounded-xl overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity"
                          animate={{
                            x: ['-100%', '100%']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                        <Trash className="w-5 h-5 relative z-10 group-hover/btn:animate-bounce" />
                      </Button>
                    </motion.div>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default ResumeTable;
