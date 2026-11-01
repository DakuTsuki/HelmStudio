# Helm Studio 🌌⚔️
### The Cinematic Anime Community Platform & Real-Time Debate Arena

> **Helm Studio** is a full-stack anime community platform featuring AniList GraphQL data integration, licensed streaming guides, an interactive 16-character single-elimination tournament bracket, real-time live debate rooms, community polls, figure giveaways, a role-based moderation system, and Three.js 3D hero graphics.

---

## 🚀 Key Highlights & Features

### 🎨 Brand & Design System
- **Cinematic Dark Theme**: Deep navy/black base (`#070913`) paired with Electric Violet (`#8b5cf6`) and Crimson (`#f43f5e`) accents.
- **Three.js 3D Interactive Hero Canvas**: Dynamic particles, floating mana ring (torus knot), and mouse parallax physics.
- **Mobile-First & Responsive**: Top desktop navigation + bottom tab bar for mobile (`Home`, `Browse`, `Schedule`, `Events`, `Profile`).
- **Smooth Polish**: Skeleton loaders, glassmorphism blur panels, half-star review visualizers, and canvas confetti animations.
- **Theme Switcher**: Instant Dark / Light mode toggle.

### ⛩️ Data Sources & Legal Compliance
- **AniList GraphQL API Integration**: Free, keyless live catalog querying trending, popular, seasonal, and weekly airing anime with fallback resiliency.
- **Trailers**: Embedded responsive YouTube trailer players.
- **Strictly Legal**: "Where to Watch" licensed direct platform buttons (Crunchyroll, Netflix, Hulu, Prime Video, etc.). **Zero pirated video streams hosted or embedded.**
- **Helm News**: Curated RSS feed integration based on Anime Corner (`animecorner.me`) and official X wires with source attributions.

### ⚔️ Debates & Events (Signature Feature)
- **Live Debate Room**: Real-time two-sided stance selector (e.g. *Team Gojo* vs *Team Sukuna*), live ratio bars, argument submission with upvoting, pinned moderator arguments, and report triggers.
- **16-Character Tournament Bracket**: Interactive single-elimination tournament with Round of 16, Quarterfinals, Semifinals, and Grand Final. Live participant voting and auto-advance round simulation.
- **Shareable Tournament Result Card**: Instant modal to copy and share bracket standings.
- **Community Polls**: Anime of the Week episode showdown with live percentage bars.
- **Figure Giveaways**: Licensed GoodSmile scale figure giveaway with an animated random winner selector wheel and celebration confetti.
- **Debater Leaderboard**: Weekly and All-Time rankings, Arena Points, win counts, and tiers (*Grandmaster*, *Diamond*, *Platinum*, *Gold*).
- **Pro Tier Event Hosting**: Paid users and moderators can launch their own community debates, brackets, and polls with a built-in Stripe Sandbox modal.

### 🛡️ Role-Based Access & Admin HQ (`/admin`)
- **5 Roles Supported**: `user`, `premium`, `pro`, `moderator`, `admin`.
- **Role Sandbox Toolbar**: Floating test bar allowing 1-click role switching to evaluate all role-gated capabilities.
- **Ad Suppression**: Sponsored banners automatically hidden for Premium and Pro tiers.
- **Moderation Queue**: Real-time queue of flagged comments and threads with *Dismiss*, *Delete*, and *Warn User* actions.
- **Push Notification Composer**: Multi-audience targeting (`All Members`, `Watching Solo Leveling`, `Premium Only`) with live notification bell delivery.
- **User Management**: Search members, ban/unban, and promote roles.
- **Analytics Dashboard**: Daily Active Users (DAU), episode retention curves, and episode drop-off metrics.

---

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4
- **3D Graphics**: Three.js
- **Icons**: Lucide React
- **Celebrations**: Canvas-Confetti
- **Backend / Realtime**: Supabase client ready (configured with local persistence & demo accounts out of the box)
- **API**: AniList GraphQL API

---

## 📦 Getting Started

### 1. Open the Project
Open the project directory in your terminal or IDE:
```bash
cd C:\Users\HP\.gemini\antigravity\scratch\helm-studio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🧪 Testing Roles in Sandbox Mode
Use the floating **Role Sandbox** pill at the bottom of the screen to switch between:
1. **User**: Standard experience with sponsored banners and voting.
2. **Premium**: Ad-free experience with gold badge and priority reviews.
3. **Pro**: Unlock the "Host New Event" button to launch custom tournaments and debates.
4. **Moderator**: Access `/admin` moderation queue, pin debate arguments, write editorial recaps.
5. **Admin**: Full access to all dashboards, user directory, push notifications, and monetization settings.
