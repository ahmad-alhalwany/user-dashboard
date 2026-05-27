# User Dashboard — Angular User Management App

A modern **User Management Dashboard** built with **Angular 19** and **Angular Material**. Browse paginated users, search across the full dataset with live suggestions, and drill into individual profiles — with HTTP caching, loading states, and smooth route transitions.

[![Angular](https://img.shields.io/badge/Angular-19.2-red?logo=angular)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Material](https://img.shields.io/badge/Material-19.2-blue?logo=angular)](https://material.angular.io/)
[![RxJS](https://img.shields.io/badge/RxJS-7.8-purple?logo=reactivex)](https://rxjs.dev)

---

## Overview

This project demonstrates production-oriented frontend patterns in a clean, standalone Angular architecture. It connects to the public [ReqRes API](https://reqres.in) and implements a complete user-management flow: list → search → detail — without a backend of its own.

**Why this project matters:** It goes beyond a basic CRUD tutorial by combining pagination, cross-page search, HTTP caching, global loading UX, keyboard-accessible autocomplete, and route animations in one cohesive dashboard.

---

## Architecture

```text
┌─────────────────────┐         HTTP (REST)
│   Angular Frontend  │ ◄──────────────────────────────►  ReqRes API
│   localhost:4200    │         GET /api/users?page={n}
└─────────────────────┘         GET /api/users/{id}
        │
        ├── UserService      → API calls + page cache
        ├── LoadingInterceptor → global progress bar
        └── Router           → list ↔ detail with fade animation
```

### Message / Data flow

| Action | Component | Service method | API endpoint |
|--------|-----------|----------------|--------------|
| Load page | `UserListComponent` | `getUsers(page)` | `GET /api/users?page={n}` |
| View user | `UserDetailsComponent` | `getUserById(id)` | `GET /api/users/{id}` |
| Search | `HeaderComponent` | `searchUsers(query)` | Fetches all pages → filters locally |
| Loading | All HTTP calls | `loadingInterceptor` | Shows/hides global progress bar |

---

## Features

- **Paginated user grid** — Angular Material Paginator with 6 users per page
- **User detail view** — profile card with avatar, name, email, and back navigation
- **Smart global search** — debounced (300ms) autocomplete in the header toolbar
- **Cross-page search** — searches all API pages via `forkJoin`, not just the current page
- **Keyboard navigation** — ↑ ↓ to select, Enter to open, Escape to clear
- **HTTP page cache** — `Map` + `shareReplay` avoids redundant API calls
- **Global loading bar** — functional HTTP interceptor on every request
- **Route animations** — fade transitions between list and detail pages
- **Custom hover directive** — subtle scale effect on user cards
- **Responsive layout** — mobile-friendly header and content area

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Angular 19 (Standalone Components) |
| UI | Angular Material 19, Angular CDK |
| Language | TypeScript 5.7 |
| Reactive | RxJS 7.8 |
| HTTP | Angular HttpClient + Functional Interceptors |
| API | [ReqRes.in](https://reqres.in/api/users) |
| Testing | Jasmine + Karma |

---

## Prerequisites

Before running the project, make sure you have:

| Tool | Version | Check |
|------|---------|-------|
| **Node.js** | 18+ (LTS recommended) | `node -v` |
| **npm** | 9+ | `npm -v` |

> No database, backend, or `.env` file required — the app uses the public ReqRes mock API.

---

## How to Run

The app is a **single Angular frontend** — no separate backend server needed.

### Step 1 — Clone the repository

```bash
git clone https://github.com/ahmad-alhalwany/user-dashboard.git
cd user-dashboard
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Start the development server

```bash
npm start
```

Or with Angular CLI directly:

```bash
ng serve
```

You should see:

```text
✔ Browser application bundle generation complete.
** Angular Live Development Server is listening on localhost:4200 **
```

### Step 4 — Open the app

1. Go to [http://localhost:4200](http://localhost:4200)
2. Browse the paginated user list
3. Click any user card to open their detail page
4. Use the search bar in the header to find users by name or ID

---

## Production Build

```bash
npm run build
```

Output directory: `dist/user-dashboard/`

To serve the production build locally:

```bash
# Install a static server (once)
npm install -g serve

# Serve the build
serve -s dist/user-dashboard
```

---

## Project Structure

```text
user-dashboard/
├── src/
│   ├── app/
│   │   ├── header/              # Global search bar + autocomplete
│   │   │   ├── header.component.ts
│   │   │   ├── header.component.html
│   │   │   └── header.component.css
│   │   ├── user-list/           # Paginated user grid
│   │   │   ├── user-list.component.ts
│   │   │   ├── user-list.component.html
│   │   │   └── user-list.component.css
│   │   ├── user-details/        # Single user profile view
│   │   │   ├── user-details.component.ts
│   │   │   ├── user-details.component.html
│   │   │   └── user-details.component.css
│   │   ├── services/
│   │   │   ├── user.service.ts  # API calls, caching, cross-page search
│   │   │   └── loading.service.ts
│   │   ├── interceptors/
│   │   │   └── loading.interceptor.ts
│   │   ├── directives/
│   │   │   └── hover.directive.ts
│   │   ├── models/
│   │   │   └── user.model.ts
│   │   ├── animations.ts        # Route fade transitions
│   │   ├── app.routes.ts
│   │   ├── app.config.ts
│   │   ├── app.component.ts
│   │   └── app.component.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
└── tsconfig.json
```

---

## Service Layer Details

### `UserService`

- **`getUsers(page)`** — fetches paginated users; caches each page in a `Map` with `shareReplay(1)`
- **`getUserById(id)`** — fetches a single user profile
- **`searchUsers(query)`** — loads all pages via `forkJoin`, then filters by first name, last name, or ID

### `LoadingInterceptor`

- Functional HTTP interceptor (`HttpInterceptorFn`)
- Calls `LoadingService.show()` on request start
- Calls `LoadingService.hide()` in `finalize()` when request completes

### Routes

| Path | Component | Animation |
|------|-----------|-----------|
| `/` | `UserListComponent` | `list` |
| `/user/:id` | `UserDetailsComponent` | `details` |
| `/**` | Redirect to `/` | — |

---

## Frontend Details (Angular)

- **Standalone components** — no NgModules; tree-shakable and aligned with modern Angular
- **`HeaderComponent`** — reactive search with `FormControl`, `debounceTime(300)`, `distinctUntilChanged`, `switchMap`
- **`UserListComponent`** — Material Paginator, `trackByUserId` for performance, `HoverDirective` on cards
- **`UserDetailsComponent`** — reads `:id` from route, displays Material Card, back button via `Location.back()`
- **`fadeAnimation`** — route-level opacity transition (300ms ease)

---

## API Reference

This app consumes the free [ReqRes](https://reqres.in) mock API:

| Endpoint | Method | Usage |
|----------|--------|-------|
| `/api/users?page={n}` | GET | Paginated user list |
| `/api/users/{id}` | GET | Single user details |

No API key required. Public rate limits apply.

### User model

```typescript
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| User list empty / loading forever | Check internet connection — app needs access to `reqres.in` |
| Search returns no results | ReqRes has limited users (~12 total across 2 pages); try names like "George" or "Janet" |
| Port 4200 already in use | Run `ng serve --port 4201` and open `:4201` |
| `ng: command not found` | Use `npm start` instead, or install Angular CLI: `npm install -g @angular/cli` |
| Build fails on Node version | Upgrade to Node.js 18+ LTS |
| Animations not working | Ensure `provideAnimations()` is in `app.config.ts` |

---

## Screenshots

| User List | Search | User Details |
|-----------|--------|--------------|
| _Add screenshot_ | _Add screenshot_ | _Add screenshot_ |

---

## Roadmap

- [ ] Deploy to GitHub Pages / Netlify
- [ ] Add unit tests for `UserService` cache and search logic
- [ ] Dark mode toggle
- [ ] Error states for failed API calls
- [ ] Replace ReqRes with a custom backend

---

## Author

**Ahmad Alhalwany**

- GitHub: [@ahmad-alhalwany](https://github.com/ahmad-alhalwany)
- Repository: [user-dashboard](https://github.com/ahmad-alhalwany/user-dashboard)

---

## License

MIT — free to use for learning and reference.
