# VibeKanban - Beautiful Project Management App

A modern, beautiful Kanban board application built with Next.js, Tailwind CSS, and smooth drag-and-drop animations.

## Features

✨ **Beautiful UI Design**
- Soft, rounded cards with elegant shadows
- Pastel color palette (purple, teal, orange, pink, blue, green)
- Smooth animations and transitions
- Responsive design

🎯 **Core Functionality**
- Kanban board with customizable columns
- Create, edit, and delete tasks
- Add detailed notes to tasks
- Drag and drop tasks between columns
- Create custom columns with color themes

💾 **Persistent Storage**
- Local storage for data persistence
- No backend required
- No authentication needed

🎮 **Great UX**
- Smooth drag-and-drop with @dnd-kit
- Beautiful animations with framer-motion
- Keyboard navigation support
- Optimistic UI updates

## Tech Stack

- **Frontend Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS v3
- **Drag & Drop**: @dnd-kit (modern, accessible)
- **Animations**: framer-motion
- **Icons**: lucide-react
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm

### Installation

1. Navigate to the project directory:
```bash
cd VibeKanban
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating Tasks
1. Click "Add Task" on any column
2. Enter the task title (required)
3. Optionally add notes with details
4. Click "Add Task" to create

### Managing Tasks
- **Edit Title**: Click on the task title
- **Add Notes**: Click "Add notes" to expand the notes section
- **Delete**: Hover over a task and click the trash icon
- **Move**: Drag a task to another column

### Creating Columns
1. Click "Add Column" in the header
2. Enter a column title
3. Select a color theme
4. Click "Add Column"

### Deleting Columns
- Custom columns: Click the trash icon in the column header
- Default columns (TODO, In Progress, Completed) cannot be deleted

## File Structure

```
VibeKanban/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── Board.tsx           # Main board component with drag-drop logic
│   ├── Column.tsx          # Column component
│   ├── TaskCard.tsx        # Task card component
│   ├── AddTaskModal.tsx    # Modal for adding tasks
│   └── AddColumnModal.tsx  # Modal for adding columns
├── hooks/
│   ├── useLocalStorage.ts  # Custom hook for local storage
│   └── useKanban.ts        # State management hook
├── types/
│   └── kanban.ts           # TypeScript interfaces
├── lib/
│   └── utils.ts            # Utility functions
├── public/                 # Static assets
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
└── README.md              # This file
```

## Design System

### Colors
- **Purple**: `#E9D5FF` (light), `#C084FC` (dark)
- **Teal**: `#99F6E4` (light), `#2DD4BF` (dark)
- **Orange**: `#FED7AA` (light), `#FB923C` (dark)
- **Pink**: `#FBCFE8` (light), `#EC4899` (dark)
- **Blue**: `#BFDBFE` (light), `#3B82F6` (dark)
- **Green**: `#BBEF63` (light), `#84CC16` (dark)

### Spacing
- Cards: 16-20px padding
- Columns: 24px gap
- Border radius: 12-16px

### Animations
- Drag: scale(1.02) with shadow enhancement
- Hover: translateY(-2px), shadow increase
- Transitions: 200-300ms ease-out

## Local Storage

All data is stored in browser's local storage under the key `kanban-board`. The structure is:

```json
{
  "columns": [...],
  "tasks": {...}
}
```

To reset the board, clear your browser's local storage for this site.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Optimizations

- Virtual scrolling for large task lists (can be added)
- Memoized components to prevent unnecessary re-renders
- Optimized animations with GPU acceleration
- Debounced local storage writes (can be added)

## Future Enhancements

- 📁 Project templates
- 🏷️ Task tags and labels
- 🔍 Search and filter functionality
- 📱 Mobile app (React Native)
- ☁️ Cloud sync with authentication
- 📊 Analytics and statistics
- 🎨 Theme customization
- ⌨️ Keyboard shortcuts
- 📤 Export to CSV/JSON
- 🔔 Notifications and reminders

## License

MIT

## Contributing

Feel free to fork and submit pull requests for any improvements!

---

Built with ❤️ using Next.js and Tailwind CSS
