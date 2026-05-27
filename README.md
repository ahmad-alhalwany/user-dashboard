# User Dashboard

A modern **User Management Dashboard** built with **Angular 19** and **Angular Material**. Browse paginated users, search across the full dataset with live suggestions, and drill into individual profiles — with caching, loading states, and smooth route transitions.

[![Angular](https://img.shields.io/badge/Angular-19.2-red?logo=angular)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Material](https://img.shields.io/badge/Material-19.2-blue?logo=angular)](https://material.angular.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)

---

## Overview

This project demonstrates production-oriented frontend patterns in a clean, standalone Angular architecture. It connects to the public [ReqRes API](https://reqres.in) and implements a complete user-management flow: list → search → detail — without a backend of its own.

**Why this project matters:** It goes beyond a basic CRUD tutorial by combining pagination, cross-page search, HTTP caching, global loading UX, keyboard-accessible autocomplete, and route animations in one cohesive dashboard.

---

## Live Demo

> Add your deployed URL here (e.g. Vercel, Netlify, GitHub Pages).

---

## Features

### User listing & navigation
- Paginated user grid with **Angular Material Paginator**
- Click any card to open the **user detail** view
- **Back navigation** from detail to list
- **Fade route animations** between list and detail pages

### Smart global search
- Debounced search (300ms) in the header toolbar
- **Live autocomplete** with avatar, name, and email
- Search across **all pages** of the API (not just the current page)
- Match by first name, last name, or user ID
- **Keyboard support:** ↑ ↓ to navigate, Enter to select, Escape to clear
- Loading spinner while searching

### Performance & data layer
- **Page-level HTTP cache** (`Map` + `shareReplay`) — avoids redundant API calls when revisiting pages
- **RxJS operators:** `debounceTime`, `distinctUntilChanged`, `switchMap`, `forkJoin`, `catchError`
- Typed models (`User`, `UserListResponse`) for API responses

### UX polish
- **Global HTTP loading interceptor** — progress bar on every request
- Custom **`appHover` directive** — subtle scale effect on user cards
- Responsive layout (mobile-friendly header and content)
- Material Design components: Toolbar, Input, Icons, Cards, Buttons, Spinner

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

## Architecture
