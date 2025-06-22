# Meet AI

![Meet AI Project Screenshot](https://i.ibb.co/TD5W20w9/screencapture-meet-ai-eta-vercel-app-meetings-2025-06-22-23-43-14.png)

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://meet-ai-eta.vercel.app/)

Meet AI is a modern, AI-powered meeting management and video conferencing web application. It offers seamless meeting scheduling, live video calls, AI-generated meeting summaries, searchable transcripts, and interactive AI chat — all designed to enhance productivity and collaboration.

---

## 🚀 Live Demo

Try the app live here: [https://meet-ai-eta.vercel.app/](https://meet-ai-eta.vercel.app/)

---

## 🌟 Features

- User authentication with email/password and OAuth (Google, GitHub)
- Role-based agents dashboard with create, edit, delete functionality
- Full meetings dashboard with filtering, pagination, and detailed views
- Video call integration with lobby, live call, and call-ended screens
- AI-powered automated meeting transcript summarization
- Searchable and highlightable meeting transcripts
- AI chat interface integrated within meeting details for assistant interaction
- Subscription upgrade and billing management
- Responsive UI with desktop and mobile support
- Type-safe API communication using tRPC
- Global toast notifications for real-time feedback
- Webhook integration for Stream Video events
- Server-side data prefetching for optimized performance

---

## 🛠️ Technology Stack

- **Frontend:** React, Next.js, Tailwind CSS, Shadcn UI, React Query, tRPC
- **Backend:** Next.js API routes, PostgreSQL, Drizzle ORM, Neon serverless database
- **Authentication:** NextAuth.js with email/password and OAuth providers
- **Video Calls:** Stream Video SDK
- **AI Features:** Custom backend AI processing for transcript summarization and chat
- **Deployment:** Vercel

---

## 📦 Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/meet-ai.git
   cd meet-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:

   Create a `.env.local` file and add necessary environment variables such as:
   ```env
   DATABASE_URL=your_postgres_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   STREAM_API_KEY=your_stream_video_api_key
   STREAM_API_SECRET=your_stream_video_api_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

4. Run database migrations:
   ```bash
   npm run migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage

- Register or sign in via email or social login.
- Manage agents and meetings from the dashboard.
- Join meetings via video calls with live AI-powered features.
- View completed meetings with transcript, recording, and AI chat.
- Upgrade subscription plans and manage billing in your profile.

---


---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Contact

For questions or support, please contact [farukgb1999@gmail.com].

---

**Meet AI** © 2025
