# Deezcord Frontend Implementation Plan

This document tracks the progress of tasks outlined in `client/memory.md`.

## Phase 1: Authentication & Routing
- [x] **Connect login page to auth service**
  - Implement a `login` function in `client/src/services/authService.ts` that supports both email and username for login.
  - Update `client/src/pages/Login.tsx` to use `client/src/services/authService.ts`.
  - Handle success/error states utilizing `AsyncButton` and `useToast`.
- [x] **Setup protected routes**
  - Create a `ProtectedRoute` component inline in `client/src/App.tsx`.
  - Update `client/src/App.tsx` to wrap authenticated routes (e.g., Home, Rooms, Chat) with the `ProtectedRoute`.
- [ ] **Create email verification page**
  - Add `client/src/pages/EmailVerification.tsx`.
  - Add the route to `client/src/App.tsx`.
- [ ] **Create MFA modal**
  - Create `client/src/components/MFAModal.tsx`.
  - Integrate it into the login/auth flow.

## Phase 2: Layout & Navigation
- [x] **Turn current sidebar into sidebar component**
  - Extracted sidebar logic into `client/src/components/Sidebar.tsx`.
  - Implemented collapsible desktop view and mobile off-canvas drawer.
  - Applied the "Tray" layout with glassmorphic shell.

## Phase 3: Core Features
- [x] **Integrate rooms with backend**
  - Created `client/src/services/roomService.ts`.
  - Connected Sidebar to `GET /rooms` and `POST /rooms`.
  - Implemented room selection state in `Home.tsx`.
- [ ] **Enhance Room Experience**
  - Modify `rooms` schema to include `profile_picture_url`.
  - Create a private Supabase Storage bucket for room profiles.
  - Implement a custom, high-quality Room Creation Modal (replacing the browser prompt).
- [ ] **Create chat page / Real-time messaging**
  - Implement message history fetching (`GET /rooms/:roomId/messages`).
  - Integrate Socket.io for real-time message broadcasting.
  - Build the chat interface within the content tray.