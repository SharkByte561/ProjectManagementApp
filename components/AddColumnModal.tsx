'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus } from 'lucide-react'
import { ColorValue } from '@/types/kanban'

const COLORS: ColorValue[] = ['purple', 'teal', 'orange', 'pink', 'blue', 'green']

interface AddColumnModalProps {
  isOpen: boolean
  onClose: () => void
  onAddColumn: (title: string, color: ColorValue) => void
}

export function AddColumnModal({ isOpen, onClose, onAddColumn }: AddColumnModalProps) {
  const [title, setTitle] = useState('')

  const getRandomColor = (): ColorValue => {
    return COLORS[Math.floor(Math.random() * COLORS.length)]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAddColumn(title, getRandomColor())
      setTitle('')
      onClose()
    }
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
            className="bg-white rounded-2xl shadow-soft-xl w-full max-w-sm overflow-hidden"
          >
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b-2 border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">New Column</h2>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                  Column Name
                </label>
                <input
                  id="title"
                  type="text"
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && title.trim()) {
                      handleSubmit(e as any)
                    }
                  }}
                  placeholder="e.g., Backlog, Review, Deploy..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-soft"
                  maxLength={50}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all text-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={!title.trim()}
                  whileHover={title.trim() ? { scale: 1.02 } : {}}
                  whileTap={title.trim() ? { scale: 0.98 } : {}}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm ${
                    title.trim()
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-soft-md hover:shadow-soft-lg hover:from-purple-600 hover:to-blue-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Plus size={16} />
                  <span>Add</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
