# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Artifacts

### Barbearia Rocky Amaral (`artifacts/rocky-amaral`)
- React + Vite frontend, single-page app, preview at `/`
- Portuguese (pt-BR) language throughout
- Black & white theme with Playfair Display + Inter typography
- Sections: Hero, Services, Gallery (4 work photos), Booking Form, Footer
- Booking generates WhatsApp link to owner: +5527988995055

### API Server (`artifacts/api-server`)
- Express 5 backend
- Routes: `/api/services`, `/api/appointments`, `/api/appointments/available-times`

## Database Schema
- `services` — Barber services (name, description, price, durationMinutes)
- `appointments` — Customer bookings (clientName, clientPhone, serviceId, date, time, notes, status)

## Seeded Data
- 4 services: Corte Simples (R$25), Corte + Barba (R$45), Navalhado (R$35), Degradê (R$35)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
