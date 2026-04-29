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
- [ ] **Turn current sidebar into sidebar component**
  - Extract the sidebar logic/UI from existing pages (likely Home) into `client/src/layouts/Sidebar.tsx`.
  - Apply the sidebar layout to the app structure.

## Phase 3: Core Features
- [ ] **Create rooms page**
  - Add `client/src/pages/Rooms.tsx` to browse and select chat rooms.
  - Implement routing to individual chat rooms.
- [ ] **Create chat page**
  - Add `client/src/pages/Chat.tsx` to handle the real-time messaging view.
  - Integrate WebSocket communication and message rendering.