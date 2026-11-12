# Autoservis – online rezervace

Minimal booking system for a small car repair shop: 1 branch, 3 mechanics,
open Monday–Friday 8:00–17:00. A customer picks a service (tyre change,
STK inspection, service), a day and a free time.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173. The API runs on port 3001 and Vite proxies `/api`
to it. Bookings are kept in memory, so a restart clears them.

```bash
npm test          # unit tests (Vitest)
npm run typecheck
```

## Structure

| Path                  | What it does                                      |
| --------------------- | ------------------------------------------------- |
| `server/config.ts`    | Opening hours, services, mechanics                |
| `server/schedule.ts`  | Which times are still free                        |
| `server/time.ts`      | Date and time helpers                             |
| `server/index.ts`     | HTTP API (Hono) with in-memory storage            |
| `src/components/`     | Booking form and the shop's day overview          |
| `src/components/ui/`  | shadcn/ui components                              |

Stack: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Hono.
