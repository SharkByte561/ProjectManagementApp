'use client'

import { useCallback } from 'react'
import { BoardState, Task, Column, ColorValue } from '@/types/kanban'
import { generateId } from '@/lib/utils'
import { useLocalStorage } from './useLocalStorage'

const DEFAULT_COLUMNS: Column[] = [
  {
    id: 'todo',
    title: 'TODO',
    color: 'purple',
    taskIds: [],
    createdAt: Date.now(),
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'teal',
    taskIds: [],
    createdAt: Date.now(),
  },
  {
    id: 'completed',
    title: 'Completed',
    color: 'green',
    taskIds: [],
    createdAt: Date.now(),
  },
]

const DEFAULT_STATE: BoardState = {
  columns: DEFAULT_COLUMNS,
  tasks: {},
}

export function useKanban() {
  const [state, setState] = useLocalStorage<BoardState>('kanban-board', DEFAULT_STATE)

  const addTask = useCallback(
    (columnId: string, title: string, notes: string = '') => {
      const newTaskId = generateId()
      const newTask: Task = {
        id: newTaskId,
        title,
        notes,
        columnId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      setState({
        ...state,
        tasks: { ...state.tasks, [newTaskId]: newTask },
        columns: state.columns.map((col) =>
          col.id === columnId
            ? { ...col, taskIds: [...col.taskIds, newTaskId] }
            : col
        ),
      })

      return newTaskId
    },
    [state, setState]
  )

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      const task = state.tasks[taskId]
      if (!task) return

      setState({
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: { ...task, ...updates, updatedAt: Date.now() },
        },
      })
    },
    [state, setState]
  )

  const deleteTask = useCallback(
    (taskId: string) => {
      const task = state.tasks[taskId]
      if (!task) return

      const { [taskId]: _, ...remainingTasks } = state.tasks

      setState({
        ...state,
        tasks: remainingTasks,
        columns: state.columns.map((col) => ({
          ...col,
          taskIds: col.taskIds.filter((id) => id !== taskId),
        })),
      })
    },
    [state, setState]
  )

  const moveTask = useCallback(
    (taskId: string, fromColumnId: string, toColumnId: string, newIndex: number) => {
      const task = state.tasks[taskId]
      if (!task) return

      const fromColumn = state.columns.find((col) => col.id === fromColumnId)
      const toColumn = state.columns.find((col) => col.id === toColumnId)

      if (!fromColumn || !toColumn) return

      const newFromTaskIds = fromColumn.taskIds.filter((id) => id !== taskId)
      const newToTaskIds = [...toColumn.taskIds]
      newToTaskIds.splice(newIndex, 0, taskId)

      setState({
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: { ...task, columnId: toColumnId, updatedAt: Date.now() },
        },
        columns: state.columns.map((col) => {
          if (col.id === fromColumnId) {
            return { ...col, taskIds: newFromTaskIds }
          }
          if (col.id === toColumnId) {
            return { ...col, taskIds: newToTaskIds }
          }
          return col
        }),
      })
    },
    [state, setState]
  )

  const addColumn = useCallback(
    (title: string, color: ColorValue) => {
      const newColumnId = generateId()
      const newColumn: Column = {
        id: newColumnId,
        title,
        color,
        taskIds: [],
        createdAt: Date.now(),
      }

      setState({
        ...state,
        columns: [...state.columns, newColumn],
      })

      return newColumnId
    },
    [state, setState]
  )

  const deleteColumn = useCallback(
    (columnId: string) => {
      const column = state.columns.find((col) => col.id === columnId)
      if (!column) return

      // Delete all tasks in the column
      const tasksToDelete = column.taskIds
      const remainingTasks = { ...state.tasks }
      tasksToDelete.forEach((taskId) => {
        delete remainingTasks[taskId]
      })

      setState({
        ...state,
        tasks: remainingTasks,
        columns: state.columns.filter((col) => col.id !== columnId),
      })
    },
    [state, setState]
  )

  const updateColumn = useCallback(
    (columnId: string, updates: Partial<Column>) => {
      const column = state.columns.find((col) => col.id === columnId)
      if (!column) return

      setState({
        ...state,
        columns: state.columns.map((col) =>
          col.id === columnId ? { ...col, ...updates } : col
        ),
      })
    },
    [state, setState]
  )

  return {
    state,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    deleteColumn,
    updateColumn,
  }
}
