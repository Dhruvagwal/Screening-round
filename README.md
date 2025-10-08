This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Modular Architecture**: Clean, maintainable components organized by feature
- **Google Calendar Integration**: Powered by Composio for seamless OAuth authentication
- **Form Utilities**: Reusable form components with React Hook Form + Zod validation
- **Dashboard System**: Comprehensive dashboard with real-time updates
- **TypeScript**: Full type safety throughout the application

## Google Calendar Integration

This project uses [Composio](https://composio.dev) for Google Calendar integration, providing:

- **Simplified OAuth**: Composio handles the complex OAuth 2.0 flow
- **Unified API**: Single interface for multiple calendar providers
- **Built-in Security**: Enterprise-grade security and token management
- **Easy Scaling**: Add more integrations (Outlook, Apple Calendar) with minimal code changes

### Setup Composio

1. Create a Composio account at [https://app.composio.dev/](https://app.composio.dev/)
2. Get your API key from the dashboard
3. Add it to your `.env.local` file:

```bash
COMPOSIO_API_KEY=your_composio_api_key_here
```

### API Endpoints

- `GET /api/auth/google` - Initiate Google Calendar authentication
- `GET /api/auth/google/callback` - Handle OAuth callback
- `GET /api/calendar?userId=<user_id>` - Fetch calendar events

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
