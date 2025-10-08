# Calendar AI Assistant

A Next.js application that provides intelligent calendar management through an AI-powered chat interface.

## Overview

This application integrates Google Calendar with Azure OpenAI to create an intelligent assistant that helps users manage their calendars through natural language conversations. Users can ask questions about their schedule, create meetings, check availability, and perform other calendar operations using conversational AI.

## Key Features

- **Google Calendar Integration**: Uses Composio API for seamless calendar access
- **AI-Powered Chat**: ChatGPT-style interface powered by Azure OpenAI GPT-4o
- **User Authentication**: Secure login system with Supabase
- **Real-time Calendar Data**: AI responses based on actual calendar information
- **Modern UI**: Responsive design with Tailwind CSS and custom components

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Authentication**: Supabase Auth
- **Calendar API**: Composio Google Calendar integration
- **AI**: Azure OpenAI GPT-4o
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons

## Setup

1. Create accounts and get API keys:
   - Composio account at [https://app.composio.dev/](https://app.composio.dev/)
   - Supabase project at [https://supabase.com/](https://supabase.com/)
   - Azure OpenAI service

2. Add environment variables to `.env.local`:
```bash
COMPOSIO_API_KEY=your_composio_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=your_azure_endpoint
```

3. Install dependencies and run:
```bash
npm install
npm run dev
```

## Usage

1. Open [http://localhost:3000](http://localhost:3000)
2. Sign up or log in with your account
3. Connect your Google Calendar through Composio
4. Use the AI assistant to manage your calendar through natural language

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and integrations
- `/src/app/dashboard` - Main dashboard with calendar features
- `/src/app/api/calendar` - Calendar API endpoints

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
