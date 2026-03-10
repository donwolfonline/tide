# Tide + Tmail Ecosystem

A premium, ecosystem-driven experience featuring a high-fidelity search engine landing page (**Tide**) and a modern, glassmorphic email client (**Tmail**). This project demonstrates seamless cross-application synchronization, deep linking, and state-of-the-art UI/UX design.

---

## 🌊 Tide (Search Engine)

**Tide** is a beautifully designed, premium search engine landing page built with **Next.js** and **React**. It elevates the minimalist search experience with Apple-level aesthetics and smooth interactions.

### Key Features

- **Dynamic Header Sync**: Automatically detects the Tmail authentication state and displays the user's profile avatar and initials in the top right corner.
- **Glassmorphic Navigation**: Minimalist and modern navigation bar for Tmail, Images, News, and Maps.
- **Micro-Animations**: Subtle hover effects and smooth transitions that create a high-end feel.
- **Responsive Layout**: Designed to look stunning on mobile, tablet, and desktop.

---

## 📨 Tmail (Modern Email App)

**Tmail** is a next-generation email experience built with **Expo/React Native Web**. It breaks away from traditional layouts with a bold, "Creative Floating Dock" design.

### Key Features

- **Creative Floating Dock**: A detached, glassmorphic navigation bar that centralizes all primary app actions.
- **Menu Island**: An interactive, rounded trigger that expands the dock into a full navigation suite with smooth label expansions.
- **Floating Prism**: A high-action compose button integrated into the glass dock.
- **Unified Auth Flow**: Seamless sign-in and sign-up states synchronized with the landing page.
- **Gmail-Inspired Inbox**: A clean, modern inbox view featuring color-coded avatars and a focused reading experience.

---

## 🔗 Technical Architecture (Heartbeat Sync)

The core of this ecosystem is the zero-latency synchronization between the Next.js landing page (Port 3000) and the Expo app (Port 8081).

### How it Works

1. **Shared Session Cookie**: Tmail manages a cross-port session cookie (`tmail_session_v1`) scoped to the root of `localhost`.
2. **Heartbeat Logic**: The Tide landing page uses a client-side heartbeat to scan for session updates every **2 seconds**, as well as on window focus and visibility changes.
3. **Deep Linking Configuration**: React Navigation linking allows the landing page to route users directly to specific Tmail screens (like `/SignIn`) with no loading overhead.

---

## 🚀 Setup and Installation

### Launch Tide (Next.js)

```bash
# Install dependencies
npm install
# Start development server
npm run dev
# Accessible at http://localhost:3000
```

### Launch Tmail (Expo Web)

```bash
# Navigate to tmail directory
cd tmail
# Install dependencies
npm install
# Start Expo for Web
npx expo start --web
# Accessible at http://localhost:8081
```

---

## 📦 Deployment

### Deploying Tide (Next.js)

Deploy directly to [Vercel](https://vercel.com) by connecting your GitHub repository. Vercel automatically handles the build and optimization process.

### Deploying Tmail (Expo Web)

Build the static web production bundle and deploy to any hosting provider (Vercel, Netlify, etc.):

```bash
cd tmail
npx expo export --platform web
```

---

## 🎨 Design Philosophy

This project is built on the pillars of **Visual Excellence** and **Interactive Delight**:

- **Glassmorphism**: Utilizing heavy background blurs and thin borders for depth.
- **Vibrant Palettes**: Using curated HSL colors for a warm, premium feel.
- **Fluid Layouts**: Ensuring that every element feels like part of a cohesive living ecosystem.

---

Developed by Frederick Dineen.
