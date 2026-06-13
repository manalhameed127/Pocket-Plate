# 🍽️ Pocket Plate

An AI-powered budget-friendly food ordering app built for students and budget-conscious users. Built as part of the Software Design & Architecture (SDA) course at FAST NUCES.

## Features

- **AI Meal Recommendations** — Powered by Groq (LLaMA 3.1), suggests meal combos within your budget based on preferences and order history
- **Cross-Restaurant Combos** — AI optimizes orders across multiple restaurants for maximum variety within budget
- **Budget Mode** — Set a monthly food budget and track remaining spend
- **End-of-Month Mode** — Activates tighter filtering to surface only the cheapest options when funds are low
- **Group Ordering** — Real-time collaborative ordering with automatic bill splitting via Socket.IO
- **Voucher System** — Student discounts, card cashback, and loyalty rewards
- **Admin Dashboard** — Restaurant and menu management panel
- **Personalized Recommendations** — Suggestions adapt based on your past orders and dietary preferences

## Tech Stack

**Frontend:** React (TypeScript), Vite, Tailwind CSS, shadcn/ui, React Router, Recharts, Socket.IO client

**Backend:** Node.js, Express.js, MongoDB (Mongoose), Socket.IO, JWT Authentication, bcrypt

**AI:** Groq API (LLaMA 3.1 8B) with local algorithmic fallback when API is unavailable

## SDA Concepts Applied

- **Observer Pattern** — Socket.IO real-time event system for live group order updates
- **Strategy Pattern** — Recommendation engine switches between AI strategy (Groq) and local algorithm strategy based on API availability
- **Context API / Facade Pattern** — `AppContext` provides a unified interface over cart, auth, budget, voucher, and order subsystems
- **Separation of Concerns** — Clean MVC-style split: routes → controllers → models
- **SOLID Principles** — Single responsibility across controllers; open/closed via pluggable recommendation strategies
- **UML Diagrams** — Sequence, activity, swimlane, and state diagrams included in `/Documents`

## Project Structure
├── backend/

│   ├── controllers/       # Business logic

│   ├── models/            # Mongoose schemas

│   ├── routes/            # Express API routes

│   └── middleware/        # Auth & error handling

├── frontend/

│   └── src/

│       ├── pages/         # Full page components

│       ├── components/    # Reusable UI components

│       └── context/       # Global app state

└── Documents/             # UML diagrams & project proposal
