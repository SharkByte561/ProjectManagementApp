export type ColorValue =
  | 'purple'
  | 'teal'
  | 'orange'
  | 'pink'
  | 'blue'
  | 'green'

export interface Task {
  id: string
  title: string
  notes: string
  columnId: string
  createdAt: number
  updatedAt: number
}

export interface Column {
  id: string
  title: string
  color: ColorValue
  taskIds: string[]
  createdAt: number
}

export interface BoardState {
  columns: Column[]
  tasks: Record<string, Task>
}
