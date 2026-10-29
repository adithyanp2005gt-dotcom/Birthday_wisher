# Project AMMA — The Digital Rose Garden

A cinematic, interactive birthday surprise experience created with deep burgundy, midnight velvet, warm golden illumination, floating rose petals, and refined typography.

---

## 🌹 Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Modern CSS with CSS Custom Properties (Theme tokens) & Glassmorphism

---

## 📁 Project Structure

```
d:/amma/
├── public/
│   └── rose-icon.svg             # Project favicon
├── src/
│   ├── assets/                   # Static assets, audio, and illustrations
│   ├── components/
│   │   ├── common/               # Shared visual effects (petals, audio, glows)
│   │   └── scenes/               # Chapter/Scene components for the narrative journey
│   ├── styles/
│   │   └── theme.css             # Cinematic color palette & design tokens
│   ├── types/
│   │   └── scene.ts              # Scene navigation & configuration types
│   ├── App.css                   # Main application layout & glass card styling
│   ├── App.tsx                   # Master stage controller & confirmation view
│   ├── index.css                 # Base resets & ambient background lighting
│   └── main.tsx                  # React DOM entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Development & Build Commands

### 1. Install Dependencies (already installed)
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
> The local development server will start at `http://localhost:5173`.

### 3. Build for Production / Typecheck
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```
