# Minesweeper Game

A modern implementation of the classic Minesweeper game built with React and TypeScript.

## Technologies

- React 19
- TypeScript
- CSS Modules
- Vite

## Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Locally preview production build
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
src/
├── assets/        # Static assets
├── components/    # React components
│   ├── Board/     # Game board component
│   └── Cell/      # Individual cell component
├── contexts/      # React contexts
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── App.tsx        # Root component
```

## How to Play

1. Left click to reveal a cell
2. Right click to flag a potential mine
3. Clear all non-mine cells to win
4. If you hit a mine, game over!

## Features

- Modern React with Hooks
- Type-safe code with TypeScript
- CSS Modules for scoped styling
- Theme customization support
- Fast development server with Vite
