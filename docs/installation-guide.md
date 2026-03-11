# Installation Guide

## Prerequisites
- Node.js 20 LTS
- npm 10+
- Git

## 1. Clone
```bash
git clone <your-repo-url>
cd grammar-paws-adventure
```

## 2. Install Dependencies
```bash
npm install
```

## 3. Install Git Hooks (Required)
```bash
npm run hooks:install
```

## 4. Run Locally
```bash
npm run dev
```
Open `http://localhost:3000`.

## 5. Validate Build and Tests
```bash
npm run build
npm run test:unit
```

## Optional Test Levels
```bash
npm run test:integration
npm run test:acceptance
```

## Legacy Stitch Preview (Optional)
```bash
python3 -m http.server 5173
```
Then open `http://localhost:5173/src/ui/stitch/screen1-home-start-journey.html`.
