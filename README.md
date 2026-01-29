# Todo Application

A simple todo application built with React, TypeScript, and PicoCSS.

## Features

- Create, read, update, and delete todos
- Multiple status options (Created, Completed, On Going, Problem)
- Conditional problem description field (only appears when status is "Problem")
- Search functionality
- Responsive design with PicoCSS styling

## Tech Stack

- React
- TypeScript
- PicoCSS
- TanStack Query
- Vite

## Setup

### Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm/yarn

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Open your browser to `http://localhost:5173`

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run linters

## API Integration

The application communicates with a backend API to manage todos. The API endpoints are:

- `GET /api/todos` - Get all todos (with optional search parameter)
- `POST /api/todos` - Create a new todo
- `PATCH /api/todos/:id` - Update an existing todo

## Status Types

The application supports the following todo statuses:

- `created` - Newly created todo
- `completed` - Finished todo
- `on_going` - In-progress todo
- `problem` - Todo with issues that need attention