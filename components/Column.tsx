'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { Column as ColumnType, Task } from '@/types/kanban'
import { getColorBgClasses } from '@/lib/utils'
import { TaskCard } from './TaskCard'
import { AddTaskModal } from './AddTaskModal'

interface ColumnProps {
  column: ColumnType
  tasks: Task[]
  onAddTask: (columnId: string, title: string, notes: string) => void
  onDeleteTask: (taskId: string) => void
  onUpdateTask: (taskId: string, title: string, notes: string) => void
  onDeleteColumn: (columnId: string) => void
  onGeneratePrompt?: (taskId: string, title: string, notes: string) => void
  isDragging?: boolean
}

function SortableTaskCard({
  task,
  onDelete,
  onUpdateTitle,
  onUpdateNotes,
  onGeneratePrompt,
  isDragging: isColumnDragging,
}: any) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        isDragging={isDragging || isColumnDragging}
        onDelete={onDelete}
        onUpdateTitle={onUpdateTitle}
        onUpdateNotes={onUpdateNotes}
        onGeneratePrompt={onGeneratePrompt}
      />
    </div>
  )
}

export function Column({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  onDeleteColumn,
  onGeneratePrompt,
  isDragging,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const [showAddModal, setShowAddModal] = useState(false)
  const bgColor = getColorBgClasses(column.color)

  return (
    <motion.div
      layout
      className="flex-shrink-0 w-80 flex flex-col bg-white rounded-lg overflow-hidden shadow-soft hover:shadow-soft-md transition-shadow duration-200"
      animate={{
        boxShadow: isOver ? '0 20px 25px -5px rgba(0, 0, 0, 0.15)' : '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Column Header */}
      <div className={`${bgColor} px-4 py-3 border-b border-opacity-30`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <h2 className={`text-sm font-semibold text-gray-900 truncate`}>
              {column.title}
            </h2>
            <p className={`text-xs text-gray-500 mt-1`}>
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </p>
          </div>
          {column.id !== 'todo' && column.id !== 'in-progress' && column.id !== 'completed' && (
            <motion.button
              onClick={() => onDeleteColumn(column.id)}
              className="p-1.5 hover:bg-red-100 rounded transition-colors text-red-500 hover:text-red-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Delete column"
            >
              <Trash2 size={16} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Tasks Container */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 overflow-y-auto transition-all duration-200 ${
          isOver
            ? 'bg-gradient-to-b from-blue-50 to-blue-100/50 ring-2 ring-inset ring-blue-300'
            : 'bg-white'
        }`}
        style={{ minHeight: '500px' }}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {tasks.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                className="text-center py-12 pointer-events-none"
              >
                <p className="text-xs text-gray-400">Drag tasks here</p>
              </motion.div>
            ) : (
              <motion.div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="animate-slide-in">
                    <SortableTaskCard
                      task={task}
                      onDelete={onDeleteTask}
                      onUpdateTitle={(taskId: string, title: string) =>
                        onUpdateTask(taskId, title, task.notes)
                      }
                      onUpdateNotes={(taskId: string, notes: string) =>
                        onUpdateTask(taskId, task.title, notes)
                      }
                      onGeneratePrompt={onGeneratePrompt}
                      isDragging={isDragging}
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </SortableContext>
      </div>

      {/* Add Task Button */}
      <motion.button
        onClick={() => setShowAddModal(true)}
        className={`${bgColor} px-4 py-2 flex items-center justify-center gap-2 text-xs font-medium text-gray-700 hover:opacity-90 transition-opacity border-t`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus size={16} />
        <span>Add Task</span>
      </motion.button>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddModal}
        columnId={column.id}
        columnTitle={column.title}
        onClose={() => setShowAddModal(false)}
        onAddTask={onAddTask}
      />
    </motion.div>
  )
}
