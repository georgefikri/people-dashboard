# Team Management Application

A modern team management application built with Next.js 14, featuring team creation, member management, and real-time updates.

## 🚀 Features

- **Team Management** - Create, edit, and delete teams
- **Member Management** - Add, remove, and update team members
- **Role-based Access** - Admin and member roles with different permissions
- **Search & Pagination** - Find teams and members with advanced filtering
- **Dark/Light Mode** - Beautiful theme switching
- **Responsive Design** - Works perfectly on all devices
- **Real-time Updates** - Instant UI updates with server actions

## 🛠️ Tech Stack

### **Frontend**

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components
- **Lucide React** - Modern icon library

### **State Management & Data**

- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API requests
- **Server Actions** - Next.js server-side data mutations

### **Development & Testing**

- **ESLint** - Code linting and formatting
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing

### **Styling & Animation**

- **Framer Motion** - Smooth animations and transitions
- **CSS Modules** - Scoped styling
- **PostCSS** - CSS processing

## 🏗️ Architecture

```
Client Components → API Functions → Server Actions → Mock Data/Real API
```

- **Mock Data Mode** - Fast development with in-memory data
- **Real API Mode** - Production-ready with external API integration
- **Environment-based Switching** - Seamless transition between modes

## 🚀 Getting Started

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

## 📁 Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # Reusable UI components
├── actions/       # Server actions for data mutations
├── api/          # Client-side API functions
├── stores/       # Zustand state management
├── types/        # TypeScript type definitions
├── constants/    # Mock data and constants
└── tests/        # Unit tests
```

## 🔧 Configuration

### Environment Variables

**Development (Mock Data):**

```bash
NEXT_PUBLIC_USE_MOCK_DATA=true
```

**Production (Real API):**

```bash
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_URL=https://api.yourbackend.com
```

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
