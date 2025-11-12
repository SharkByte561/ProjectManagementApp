'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { useKanban } from '@/hooks/useKanban'
import { Column } from './Column'
import { AddColumnModal } from './AddColumnModal'
import { AIPromptModal } from './AIPromptModal'
import { ColorValue } from '@/types/kanban'

export function Board() {
  const {
    state,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    deleteColumn,
  } = useKanban()

  const [showAddColumn, setShowAddColumn] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showAIPrompt, setShowAIPrompt] = useState(false)
  const [aiPromptLoading, setAIPromptLoading] = useState(false)
  const [aiPromptText, setAIPromptText] = useState('')
  const [aiPromptTaskTitle, setAIPromptTaskTitle] = useState('')
  const [aiPromptError, setAIPromptError] = useState<string | undefined>()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 5,
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event

    if (!over) return

    const activeTaskId = active.id as string
    const overId = over.id as string

    // Don't process if dropping on same position
    if (activeTaskId === overId) return

    const activeTask = state.tasks[activeTaskId]
    if (!activeTask) return

    // Find target column - overId could be a column ID or a task ID
    let targetColumnId: string | null = null
    let newIndex = 0

    const overColumn = state.columns.find((col) => col.id === overId)
    if (overColumn) {
      // Dropping on a column directly
      targetColumnId = overId
      newIndex = overColumn.taskIds.length
    } else {
      // Dropping on another task - find its column and position
      const overTask = state.tasks[overId]
      if (overTask) {
        targetColumnId = overTask.columnId
        const column = state.columns.find((col) => col.id === targetColumnId)
        if (column) {
          const overIndex = column.taskIds.indexOf(overId)
          newIndex = overIndex >= 0 ? overIndex : column.taskIds.length
        }
      }
    }

    if (!targetColumnId) return

    // Only move if the target is different
    if (activeTask.columnId !== targetColumnId || true) {
      moveTask(activeTaskId, activeTask.columnId, targetColumnId, newIndex)
    }
  }

  const handleAddColumn = (title: string, color: ColorValue) => {
    addColumn(title, color)
    setShowAddColumn(false)
  }

  const handleUpdateTask = (taskId: string, title: string, notes: string) => {
    updateTask(taskId, { title, notes })
  }

  const handleGeneratePrompt = async (
    _taskId: string,
    title: string,
    notes: string
  ) => {
    setShowAIPrompt(true)
    setAIPromptTaskTitle(title)
    setAIPromptLoading(true)
    setAIPromptError(undefined)

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, notes }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate prompt')
      }

      const data = await response.json()
      setAIPromptText(data.prompt)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred'
      setAIPromptError(errorMessage)
    } finally {
      setAIPromptLoading(false)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-soft"
      >
        <div className="max-w-full px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  ✓
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Vibe App Design Board
                  </h1>
                  <p className="text-xs text-gray-500">
                    Design, plan, and manage your app projects
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 overflow-x-auto overflow-y-hidden"
        >
          <div className="inline-flex gap-4 p-6 min-w-full">
            {state.columns.map((column) => {
              const columnTasks = column.taskIds
                .map((taskId) => state.tasks[taskId])
                .filter((task) => task !== undefined)

              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  onAddTask={addTask}
                  onDeleteTask={deleteTask}
                  onUpdateTask={handleUpdateTask}
                  onDeleteColumn={deleteColumn}
                  onGeneratePrompt={handleGeneratePrompt}
                  isDragging={activeId !== null}
                />
              )
            })}

            {/* Add Column Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0 w-80"
            >
              <button
                onClick={() => setShowAddColumn(true)}
                className="w-full h-full min-h-96 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 flex items-center justify-center group"
              >
                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block mb-3"
                  >
                    <Plus
                      size={32}
                      className="text-gray-400 group-hover:text-blue-500 transition-colors"
                    />
                  </motion.div>
                  <h3 className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                    Add Column
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600">
                    Create new workflow stage
                  </p>
                </motion.div>
              </button>
            </motion.div>

            {/* Empty State */}
            {state.columns.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-96 w-full"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No columns yet
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Click the "Add Column" card to get started
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.main>
      </DndContext>

      {/* AI Prompt Modal */}
      <AIPromptModal
        isOpen={showAIPrompt}
        isLoading={aiPromptLoading}
        prompt={aiPromptText}
        taskTitle={aiPromptTaskTitle}
        error={aiPromptError}
        onClose={() => {
          setShowAIPrompt(false)
          setAIPromptText('')
          setAIPromptError(undefined)
        }}
      />

      {/* Add Column Modal */}
      <AddColumnModal
        isOpen={showAddColumn}
        onClose={() => setShowAddColumn(false)}
        onAddColumn={handleAddColumn}
      />
    </div>
  )
}
