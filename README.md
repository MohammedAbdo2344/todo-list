# TaskFlow - Modern Task Management Application

A comprehensive task management web application built with Next.js, featuring multi-profile support, JWT authentication, and a modern SaaS dashboard design.

## Features

### 🎯 Core Functionality
- **Multi-Profile System**: Users can create and switch between multiple profiles
- **Task Management**: Create, edit, delete, and organize tasks with status tracking
- **Categories**: Organize tasks into color-coded categories
- **Priority Levels**: Set task priorities (Low, Medium, High)
- **Status Tracking**: Track tasks through To Do → In Progress → Completed
- **Soft Delete & Recovery**: Deleted tasks can be restored from the trash

### 🔐 Authentication
- JWT-based authentication system
- User registration with profile information
- Secure session management
- Automatic redirect for authenticated/unauthenticated users

### 📊 Dashboard
- Statistics overview (total tasks, completion percentages)
- Recent tasks display
- Profile switcher
- Quick action buttons

### 🎨 UI/UX Features
- Modern SaaS dashboard design
- Responsive layout (desktop, tablet, mobile)
- Clean typography and spacing
- Status-based color coding
- Priority indicators
- Accessible color contrast
- Error states and empty states

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **Forms**: React Hook Form, Zod validation
- **HTTP Client**: Axios
- **State Management**: React hooks
- **Icons**: Heroicons, Lucide React

## Project Structure

```
app/
├── api/                    # API routes
│   ├── auth/              # Authentication endpoints
│   ├── profiles/          # Profile management
│   ├── categories/        # Category management
│   └── tasks/             # Task management
├── dashboard/             # Main dashboard page
├── login/                 # Login page
├── register/              # Registration page
├── tasks/                 # Task management page
├── categories/            # Category management page
├── deleted-tasks/         # Deleted tasks recovery
├── settings/              # Profile & account settings
└── layout.tsx             # Root layout with error boundary

components/
├── layout/                # Layout components
│   ├── Header.tsx
│   └── Sidebar.tsx
├── tasks/                 # Task-related components
│   ├── TaskForm.tsx
│   └── TaskCard.tsx
├── categories/            # Category-related components
│   ├── CategoryForm.tsx
│   └── CategoryCard.tsx
└── ui/                    # Reusable UI components
    ├── Button.tsx
    ├── Input.tsx
    ├── Modal.tsx
    ├── Badge.tsx
    ├── Card.tsx
    ├── EmptyState.tsx
    ├── LoadingSpinner.tsx
    └── ErrorBoundary.tsx

lib/
├── services/              # API service layer
│   ├── api.ts            # Axios configuration
│   ├── auth.ts           # Authentication service
│   ├── profiles.ts       # Profile service
│   ├── categories.ts     # Category service
│   └── tasks.ts          # Task service
└── utils.ts               # Utility functions
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Authentication
- Register a new account or use existing credentials:
  - Email: `user@example.com`
  - Password: `password`

### Navigation
- **Dashboard**: Overview of tasks and statistics
- **Tasks**: Full task management with filtering
- **Categories**: Manage task categories
- **Deleted Tasks**: Restore permanently deleted tasks
- **Settings**: Update profile and account information

### Features
- Create multiple profiles for different contexts
- Organize tasks with categories and priorities
- Track task progress through status updates
- Filter tasks by status, category, or search terms
- Restore accidentally deleted tasks

## API Structure

The application uses mock API endpoints in `app/api/` for demonstration:

- `POST /api/auth` - Login and registration
- `GET/POST /api/profiles` - Profile management
- `GET/POST /api/categories` - Category management  
- `GET/POST /api/tasks` - Task operations
- `PUT/DELETE /api/tasks/[id]` - Individual task operations

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Component Architecture
- Component-based design with reusable UI components
- Service layer for API calls
- TypeScript for type safety
- Responsive design with Tailwind CSS

### Error Handling
- Global error boundary for unhandled errors
- Form validation with error states
- API error handling with user feedback
- Empty states for better UX

## Deployment

The application can be deployed on any platform that supports Next.js:

- [Vercel](https://vercel.com) (recommended)
- [Netlify](https://netlify.com)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- Self-hosted with Docker

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
