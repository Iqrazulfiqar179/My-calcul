# AI Scientific Calculator - Deployment Guide

This project is built with React, Vite, and Tailwind CSS. It uses the Gemini AI API for intelligent math assistance.

## Vercel Deployment

To deploy this application on [Vercel](https://vercel.com), follow these steps:

### 1. Environment Variables
The application requires a Gemini API key to function. 
- Go to your Vercel Project Settings.
- Navigate to **Environment Variables**.
- Add a new variable:
  - **Key**: `GEMINI_API_KEY`
  - **Value**: Your Google AI Studio API Key (get one at [aistudio.google.com](https://aistudio.google.com/app/apikey))

### 2. Build Settings
Vercel should automatically detect the Vite configuration, but ensure these settings are correct:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3. Deployment
- Push your code to a GitHub/GitLab/Bitbucket repository.
- Connect the repository to Vercel.
- Deploy!

## Local Development
1. Clone the repository.
2. Install dependencies: `npm install`
3. Create a `.env` file and add `GEMINI_API_KEY=your_key_here`.
4. Start the dev server: `npm run dev`
