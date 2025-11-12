'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { Task } from '@/types/kanban'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
  onDelete: (taskId: string) => void
  onUpdateTitle: (taskId: string, title: string) => void
  onUpdateNotes: (taskId: string, notes: string) => void
  onGeneratePrompt?: (taskId: string, title: string, notes: string) => void
}

export function TaskCard({
  task,
  isDragging,
  onDelete,
  onUpdateTitle,
  onUpdateNotes,
  onGeneratePrompt,
}: TaskCardProps) {
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={`group cursor-grab active:cursor-grabbing touch-none select-none ${
        isDragging ? '' : ''
      }`}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <motion.div
        className={`relative bg-white rounded-xl p-3 border-2 transition-all duration-150 ${
          isDragging
            ? 'scale-105 shadow-2xl border-blue-400 ring-2 ring-blue-200 z-50'
            : isHovering
            ? 'shadow-soft-md border-blue-300 bg-blue-50/30'
            : 'shadow-soft border-gray-200 hover:shadow-soft-md hover:border-gray-300'
        }`}
        whileHover={isDragging ? {} : { y: -3, transition: { duration: 0.2 } }}
        animate={{
          boxShadow: isDragging
            ? '0 20px 25px -5px rgba(59, 130, 246, 0.4)'
            : isHovering
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Drag Handle */}
        <motion.div
          className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 rounded-l-xl ${
            isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          } transition-opacity duration-200`}
          animate={isDragging ? { width: '4px' } : { width: '4px' }}
        />

        {/* Visual feedback indicator */}
        {isDragging && (
          <motion.div
            className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}

        {/* AI Button */}
        {onGeneratePrompt && (
          <motion.button
            onClick={() => onGeneratePrompt(task.id, task.title, task.notes)}
            className="absolute -top-2 -right-8 bg-purple-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-600 shadow-soft"
            aria-label="Generate AI prompt"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Generate Claude Code prompt with AI"
          >
            <Sparkles size={12} />
          </motion.button>
        )}

        {/* Delete Button */}
        <motion.button
          onClick={() => onDelete(task.id)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-soft"
          aria-label="Delete task"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 size={12} />
        </motion.button>

        {/* Title */}
        <div className="mb-2">
          {isEditingTitle ? (
            <input
              autoFocus
              type="text"
              value={task.title}
              onChange={(e) => onUpdateTitle(task.id, e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEditingTitle(false)
              }}
              className="w-full px-2 py-1 text-xs font-semibold border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white"
              maxLength={100}
            />
          ) : (
            <h3
              onClick={() => setIsEditingTitle(true)}
              className="text-xs font-semibold text-gray-900 break-words cursor-pointer hover:text-blue-600 transition-colors line-clamp-3"
            >
              {task.title || 'Untitled Task'}
            </h3>
          )}
        </div>

        {/* Notes Toggle */}
        {(task.notes || isNotesOpen) && (
          <motion.button
            onClick={() => setIsNotesOpen(!isNotesOpen)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isNotesOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            <span className="text-xs">{task.notes ? 'Notes' : 'Add notes'}</span>
          </motion.button>
        )}

        {/* Notes Section */}
        {isNotesOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 pt-2 border-t border-gray-200"
          >
            {isEditingNotes ? (
              <textarea
                autoFocus
                value={task.notes}
                onChange={(e) => onUpdateNotes(task.id, e.target.value)}
                onBlur={() => setIsEditingNotes(false)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded text-gray-700 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
                rows={2}
                maxLength={500}
                placeholder="Add your notes here..."
              />
            ) : (
              <p
                onClick={() => setIsEditingNotes(true)}
                className="text-xs text-gray-600 whitespace-pre-wrap break-words cursor-pointer hover:text-gray-700 transition-colors"
              >
                {task.notes || 'Click to add notes...'}
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
