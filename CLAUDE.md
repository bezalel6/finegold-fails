# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript chess application called "Finegold Fails" that analyzes Lichess games and categorizes them based on chess mistakes and achievements (particularly the infamous "f3" move). The app uses OAuth2 to authenticate with Lichess, fetches game data via streaming API, parses PGN notation, and displays results with an animated scales visualization.

## Development Commands

```bash
# Start development server (opens on http://localhost:3000)
npm start

# Run tests in watch mode
npm test

# Build for production
npm run build

# TypeScript type checking (project uses strict mode)
npx tsc --noEmit
```

## Architecture & Key Components

### Core Data Flow
1. **Authentication**: OAuth2 PKCE flow via `src/components/Auth.ts` (Ctrl class manages tokens)
2. **Game Fetching**: Streaming API from Lichess in `src/GameParser.ts` (NDJSON format, chunked reading)
3. **Game Analysis**: PGN parsing in `GameParser.ts` → Game class extracts moves, players, results
4. **Categorization**: `src/Categories.tsx` defines all fail/win categories with rarity system
5. **State Management**: Categories use React hooks for dynamic updates, no external state library
6. **Visualization**: Animated scales in `src/components/Scales.tsx` with CSS transforms

### Component Structure
- **App.tsx**: Main component, orchestrates form submission, summary display, category grid
- **Category.tsx**: Individual category card, tracks counts, creates game icons dynamically
- **Scales.tsx**: Complex animated balance scale using CSS transforms and DOM manipulation
- **GameParser.ts**: Core parsing logic - converts PGN to structured Game objects
- **Categories.tsx**: Category definitions with win/fail classification and rarity levels

### Important Patterns
- **Dynamic Move Conversion**: `Game.convertDynamic()` flips coordinates based on player color (white plays from row 1, black from row 8)
- **Streaming Game Processing**: Uses ReadableStream to handle large game datasets without blocking
- **Category Registration**: Categories register `addToCategory` and `resetCategory` callbacks via useEffect
- **Global State via Exports**: `createdChildren` array and `setNumAnalyzed` exported for cross-component access
- **Scales State Management**: ScalesState class maintains DOM elements via MyElement wrapper, uses CSS transforms for animation

### TypeScript Configuration
- Strict mode enabled with all type checks
- JSX uses React 18's automatic runtime (`"jsx": "react-jsx"`)
- Target ES5 for broad browser compatibility
- Custom types in `decs.d.ts` for module declarations

## Key Technical Details

### Lichess API Integration
- Base URL: `https://lichess.org/api/games/user/{username}?rated=true`
- Requires OAuth token for private game access (optional, falls back to public games)
- Returns NDJSON stream (newline-delimited JSON with triple newlines as separators)
- Auth token stored in Ctrl class via `@bity/oauth2-auth-code-pkce` library

### PGN Parsing Logic
- Uses regex to extract properties: `\[PropertyName "value"\]`
- Move parsing splits on `[0-9]+[.]` to separate move numbers
- White/Black moves extracted from space-separated pairs
- Special handling for games ending on white's move (no final black move)

### Category System
- Two kinds: "fail" (sins) and "win" (redemptions)
- Rarity levels: Common, Uncommon, Epic, Legendary (from `Rarity.tsx`)
- Each category tracks `numMade` count and provides example links to Lichess games
- Outer categories group related categories (F3, Misc)

### Scales Animation
- Uses CSS transforms (rotate, translate, scale) applied via JavaScript
- MyElement wrapper class manages transform strings and applies them to DOM
- ScalesState calculates rotation: `numDeg = convertToDeg(rightItems) - convertToDeg(leftItems)`
- Conversion rate: 0.1 degrees per item
- Listeners notify child elements when parent transforms change

## Common Development Tasks

### Adding a New Category
1. Define CategoryInterface in `Categories.tsx` with name, explanation, rarity, kind, outerCategory
2. Add to `allCategories` array
3. Implement detection logic in `game()` function in `GameParser.ts`
4. Call `category.addToCategory!(game)` when condition is met

### Modifying Game Analysis
- Edit `game()` function in `GameParser.ts` to add new move detection
- Use `game.didIPlay()` or `game.didOpponentPlay()` with move notation or DynamicMove
- Access game properties: `game.didWin`, `game.didLose`, `game.didDraw`, `game.termination`
- DynamicMove automatically converts based on player color (white vs black perspective)

### Styling
- Main styles in `src/App.css`
- Scales animation styles in `src/components/Scales.css`
- Material-UI theming in `src/index.tsx` (dark/light mode toggle via ColorModeContext)
- Icon sizing controlled by `data-size` attribute based on icon count

## Dependencies
- **UI**: Material-UI v5 (`@mui/material`, `@emotion/react`, `@emotion/styled`)
- **Auth**: `@bity/oauth2-auth-code-pkce` for Lichess OAuth2 PKCE flow
- **Chess**: `lichess` and `lichess-api` packages (currently imported but not actively used)
- **Testing**: Jest with React Testing Library
- **Build**: Create React App (react-scripts)

## Environment Variables
- `.env` file exists but not currently used in code (likely placeholder for future tokens)
- OAuth tokens managed at runtime via Auth.ts

## Git Status Notes
- Several deleted files in staging: `Auth.ts`, `Category.tsx`, `LoginComponent.tsx`, `Scales.tsx` from root
- New `src/components/` directory contains reorganized versions
- Modified files: `App.tsx`, `Categories.tsx`, `GameParser.ts`, `index.tsx`
