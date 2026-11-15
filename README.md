# NEXA AI — Next-Generation Conversational AI System

> **A premium, futuristic conversational intelligence interface inspired by modern AI aesthetics: combining deep obsidian backgrounds, glowing neon purple orbs, glassmorphism, responsive navigation, and real-time streaming intelligence.**

---

## 🌟 Visual & Design Highlights

* **Deep Obsidian & Midnight Navy Atmosphere:** `#070813` deep mesh background with subtle purple and violet ambient lighting.
* **Futuristic Animated AI Orb:** Multi-layered glowing orb with SVG radial gradients, orbital ring animations, and starlight particles.
* **Glassmorphism:** Modern backdrop blur (`backdrop-blur-xl`), delicate translucent borders (`rgba(168, 85, 247, 0.15)`), and neon card shadows.
* **Purple Gradient Accents:** Vibrant violet, lavender, and fuchsia gradients (`#9333ea` to `#4f46e5`).
* **Clean Fixed Sidebar:**
  * Original Nexa AI logo with glowing gradient mark
  * "+ New Chat" button with rich purple gradient
  * Quick links: Home, Search (Ctrl+K), Saved Chats, Settings, Help
  * Grouped conversation history (Today, Yesterday, Previous) with inline rename, star, and delete
  * User profile card with avatar and status badge
* **Spacious Welcome Stage:**
  * Shimmering "Hello, I'm Nexa AI" title
  * "Your ideas, questions and curiosity start here"
  * 4 interactive suggestion cards: *Explain Something*, *Write Something*, *Learn Something New*, *Solve a Problem*
* **Modern Chat Input:**
  * Auto-expanding textarea with placeholder "Ask Nexa AI anything..."
  * Glowing purple circular send button
  * File attachment with image and document chip preview
  * Web Speech API microphone voice dictation
  * Clear button and Enter-to-send support
* **Rich Conversational Responses:**
  * Full GitHub Flavored Markdown support with headers, bullet points, and tables
  * Multi-language code syntax blocks with dedicated one-click "Copy Code" button
  * Text-To-Speech (audio read aloud)
  * Thumbs up/down feedback
  * Regenerate response & copy response
  * Real-time Server-Sent Events (SSE) token streaming

---

## 🏗️ Architecture & Tech Stack

```
nexa-ai/
├── client/                     # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Sidebar, WelcomeOrb, SuggestionCards, ChatInput, ChatMessage, Modals
│   │   ├── services/api.js     # SSE Streaming & REST client
│   │   ├── App.jsx             # Main state coordinator
│   │   └── index.css           # Custom neon animations, scrollbar & glassmorphism
│   ├── package.json
│   └── vite.config.js          # Builds directly into server/public
│
├── server/                     # Backend (Node.js + Express)
│   ├── server.js               # Express application & SSE streaming route
│   ├── geminiService.js        # Google Gemini API connector + intelligent fallback engine
│   ├── chatStorage.js          # Persistent JSON conversation storage
│   ├── data/chats.json         # Persisted conversations
│   ├── public/                 # Built production frontend
│   └── .env                    # GEMINI_API_KEY, PORT configuration
│
└── start.bat                   # 1-Click Windows startup launcher
```

---

## 🚀 How to Run

### Method 1: One-Click Launcher (Windows)
Double-click `start.bat` in the project root. It will launch the Express server and serve the React interface at:
👉 **`http://localhost:5000`**

### Method 2: Command Line
```bash
# Add portable Node to PATH (if not globally installed)
set PATH=C:\Users\Lenovo\.gemini\antigravity\scratch\node\node-v20.18.0-win-x64;%PATH%

# Start the server
cd server
node server.js
```
Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## 🔑 Google Gemini API Configuration

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. You can either:
   * **In the UI:** Open **Settings** (gear icon in sidebar), paste your key into the **Google Gemini API Key** field, and click **Save**.
   * **In `.env`:** Add `GEMINI_API_KEY=AIzaSy...` inside `server/.env`.
3. If no key is entered, **NEXA AI runs seamlessly in Autonomous Demo Mode**, generating complete structured answers, code solutions, explanations, and creative writing!

---

## 🎓 College Project Demonstration Guide

When demonstrating this project:
1. **Show the Welcome Screen & Glowing Orb:** Highlight the custom CSS floating keyframe animations, orbital rotation, and glowing ambient drop shadows.
2. **Interactive Suggestion Cards:** Click *Explain Something* or *Solve a Problem* to demonstrate instant prompt dispatch and real-time SSE token streaming.
3. **Markdown & Code Highlighting:** Show how code blocks feature clean syntax formatting with dedicated "Copy Code" action buttons.
4. **Theme Toggle:** Open Settings or click the Sun/Moon icon in the sidebar to toggle between Dark Mode and Light Mode.
5. **Chat History Management:** Rename a conversation title inline, star it to appear in "Saved Chats", search via `Ctrl+K`, and delete conversations.
6. **Voice Input & Audio Read-Aloud:** Click the microphone icon to speak a prompt, and click the audio speaker icon on any AI response to hear it read aloud via Web Speech Synthesis.
