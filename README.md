# BMS Frontend - Business Management System

## Overview

BMS Frontend is the user interface for a Business Management System / accounting-manager web application. It provides an Arabic RTL experience for managing core business data and connects to a separate Django REST Framework backend for authentication, dashboard metrics, and module data.

This repository currently focuses on the frontend foundation and a set of core demo-ready business screens. It is intended to work alongside the backend API rather than as a standalone system.

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS and custom CSS styling
- REST API integration with a Django backend

## Current Features

- Login page with token-based authentication flow
- Authentication context for session state management
- Protected routes for authenticated areas
- Main application shell and sidebar navigation
- Dashboard screen
- Customers management screen
- Products management screen
- Suppliers management screen
- Shared reusable CRUD-oriented UI components
- Arabic RTL layout and interface styling

## Project Status

The frontend foundation is working and includes the main authentication flow, application shell, and several core business modules.

The project is not fully complete yet. Several advanced business areas still require final UI implementation or integration, including purchases, invoices, payments, employees, settings, and treasury.

## Backend Connection

This frontend depends on a separate Django REST Framework backend. The backend API must be running for login, authentication checks, dashboard data, and CRUD operations to function correctly.

Configure the API base URL with:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

You can place this value in `.env` or `.env.local`.

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

The application usually runs at:

```text
http://localhost:5173/
```

If port `5173` is already in use, Vite may start on another available port.

## Available Scripts

- `npm run dev`  
  Starts the Vite development server.

- `npm run build`  
  Runs the TypeScript build step and creates a production build.

- `npm run preview`  
  Serves the production build locally for preview.

- `npm run lint`  
  Runs ESLint on the repository.

## Repository Structure

- `src/app`  
  Application-level routing setup.

- `src/components`  
  Shared UI, layout, and module-oriented components.

- `src/context`  
  React context providers, including authentication state.

- `src/hooks`  
  Custom React hooks.

- `src/pages`  
  Route-level pages such as login, dashboard, and module screens.

- `src/services`  
  API communication layer and backend module service functions.

- `src/types`  
  Shared TypeScript types for API payloads and domain models.

- `src/lib`  
  Utility helpers and access-control related logic.

## Notes for Reviewers

- The backend must be running for API-driven screens to load real data.
- Login and authentication depend on backend endpoints.
- Some routes intentionally display placeholder screens because those modules are not finished yet.
- The main demo-ready areas in the current frontend are dashboard, customers, products, and suppliers.

## Pending Work

- Complete the remaining business modules.
- Improve frontend authorization consistency across all modules.
- Add automated tests.
- Add final UI polish and end-to-end integration checks.
