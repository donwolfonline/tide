# Tide + Tmail Ecosystem

A premium, ecosystem-driven experience featuring a high-fidelity search engine landing page (**Tide**) and a modern, glassmorphic email client (**Tmail**). This project demonstrates seamless cross-application synchronization and state-of-the-art UI/UX design.

---

## 🌊 Tide (Search Engine)

**Tide** is a beautifully designed, premium search engine landing page built with **Next.js** and **React**. It mimics a familiar minimalist layout but elevates it with Apple-level aesthetics.

### Key Features

- **Dynamic Header Sync**: Automatically detects if a user is signed into Tmail and displays their profile avatar and initials in the top right corner.
- **Glassmorphic Navigation**: Minimalist links for Tmail, Images, News, and Maps.
- **Micro-Animations**: Subtle hover effects and smooth transitions for a premium feel.
- **Responsive Design**: Flawlessly adapts to all screen sizes.

---

## 📨 Tmail (Modern Email App)

**Tmail** is a next-generation email experience built with **Expo/React Native Web**. It features a "Creative Floating Dock" design and Gmail-inspired workflow.

### Key Features

- **Creative Floating Dock**: A detached, glassmorphic navigation bar that holds the primary app actions.
- **Menu Island**: A magical, interactive trigger that expands the dock into a full-featured navigation menu with label expansions.
- **Floating Prism**: A high-action compose button integrated into the dock structure.
- **Seamless Auth Flow**: Simplified sign-in and sign-up with integrated cross-app session synchronization.
- **Gmail-Level Inbox**: Redesigned inbox list with beautiful avatars, color-coded initials, and a clean reading thread view.

---

## 🔗 Cross-App Integration (The Heartbeat Sync)

The most advanced feature of this ecosystem is the zero-backend synchronization between the Next.js landing page (Port 3000) and the Expo app (Port 8081).

### Technical Details

1. **Shared Localhost Cookie**: Tmail manages a cross-port session cookie (`tmail_session_v1`) scoped to the root path of `localhost`.
2. **Heartbeat Logic**: The Tide landing page runs a client-side heartbeat that scans for session changes every **2 seconds** and on window focus/visibility changes.
3. **Deep Linking**: Integrated React Navigation linking allows Tide to route users directly to specific Tmail screens (like `/SignIn`) seamlessly.

---

## 🛠 Setup and Installation

### Prerequisites

- Node.js (v18+)
- npm or yarn

### 1. Launch Tide (Next.js)

```bash
# Navigate to root
npm install
npm run dev
# Running on http://localhost:3000
```

### 2. Launch Tmail (Expo Web)

```bash
# Navigate to tmail directory
cd tmail
npm install
npx expo start --web
# Running on http://localhost:8081
```

---

## 🚀 Deployment

### 1. Deploying Tide (Next.js)

The easiest way to deploy **Tide** is via [Vercel](https://vercel.com):

- Push your code to GitHub.
- Import the repository into Vercel.
- Vercel will automatically detect Next.js and deploy.
- **Note**: Ensure your `NEXT_PUBLIC_TMAIL_URL` environment variable points to your deployed Tmail instance.

### 2. Deploying Tmail (Expo Web)

For the web version of Tmail, you can deploy to **Vercel**, **Netlify**, or **GitHub Pages**:

```bash
# Build the production web bundle
cd tmail
npx expo export --platform web
```

- This generates a `dist` (or `web-build`) folder.
- Upload this folder to your static hosting provider of choice.

### ⚠️ Production Cookie Sync Note

When moving from `localhost` to production domains (e.g., `tide.com` and `tmail.com`):

1. Both apps must be on the same parent domain (e.g., `app.tide.com` and `mail.tide.com`).
2. Update the `syncCookie` helper in `authStore.ts` to include `domain=.yourdomain.com; Secure; SameSite=None`.
3. Update the `checkCookie` heartbeat in `page.tsx` to ensure it looks for the correctly scoped cookie.

---

## 🎨 Design Philosophy

This project prioritizes **Visual Excellence**.

- **Typography**: Utilizing clean, modern sans-serif fonts.
- **Glassmorphism**: High background-blur values and subtle border highlights.
- **Color Palette**: Harmonious gradients and curated shades of blue and red.
- **Interaction**: Micro-animations that provide instant feedback, making the interface feel alive.

---

## 👨‍💻 Author

Developed by the Antigravity Team.
