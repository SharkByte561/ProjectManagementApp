'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2 } from 'lucide-react'

interface AddTaskModalProps {
  isOpen: boolean
  columnId: string
  columnTitle: string
  onClose: () => void
  onAddTask: (columnId: string, title: string, notes: string) => void
}

export function AddTaskModal({
  isOpen,
  columnId,
  columnTitle,
  onClose,
  onAddTask,
}: AddTaskModalProps) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAddTask(columnId, title, notes)
      setTitle('')
      setNotes('')
      onClose()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const titleLength = title.length
  const notesLength = notes.length

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
            className="bg-white rounded-2xl shadow-soft-xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-white px-6 py-5 border-b-2 border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">New Task</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Adding to <span className="font-semibold text-gray-700">{columnTitle}</span>
                </p>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-gray-600 hover:shadow-soft"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-3">
                  What needs to be done?
                </label>
                <input
                  id="title"
                  type="text"
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Type your task..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-soft hover:shadow-soft-md"
                  maxLength={100}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">{titleLength}/100 characters</p>
                  {titleLength > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1 text-xs text-green-600"
                    >
                      <CheckCircle2 size={14} />
                      <span>Title added</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Notes Input */}
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-gray-900 mb-3">
                  Add Details (Optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes, context, or details..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none shadow-soft hover:shadow-soft-md"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {notesLength}/500 characters
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all shadow-soft"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={!title.trim()}
                  whileHover={title.trim() ? { scale: 1.02 } : {}}
                  whileTap={title.trim() ? { scale: 0.98 } : {}}
                  className={`flex-1 px-4 py-3 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    title.trim()
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-soft-md hover:shadow-soft-lg hover:from-blue-600 hover:to-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 size={18} />
                  <span>Add Task</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
