'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, Sparkles } from 'lucide-react'

interface AIPromptModalProps {
  isOpen: boolean
  isLoading: boolean
  prompt: string
  taskTitle: string
  onClose: () => void
  error?: string
}

export function AIPromptModal({
  isOpen,
  isLoading,
  prompt,
  taskTitle,
  onClose,
  error,
}: AIPromptModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-soft-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b-2 border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="text-purple-500" size={24} />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    AI Prompt Generator
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">{taskTitle}</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="text-purple-500" size={48} />
                  </motion.div>
                  <p className="text-gray-600 font-medium">
                    Generating your prompt...
                  </p>
                </div>
              ) : error ? (
                <div className="rounded-lg bg-red-50 border-2 border-red-200 p-4">
                  <p className="text-red-700 font-medium mb-2">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 border-2 border-gray-200 p-4">
                    <p className="text-xs text-gray-600 font-semibold mb-3 uppercase tracking-wide">
                      Generated Prompt for Claude Code
                    </p>
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {prompt}
                    </p>
                  </div>
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                      💡 <span className="font-semibold">Tip:</span> Copy this prompt and paste it directly into Claude Code to generate the implementation for this feature.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {!isLoading && !error && (
              <div className="bg-gray-50 px-6 py-4 border-t-2 border-gray-200 flex gap-3">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 hover:border-gray-400 transition-all text-sm"
                >
                  Close
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleCopy}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-soft-md hover:shadow-soft-lg hover:from-purple-600 hover:to-blue-600"
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
