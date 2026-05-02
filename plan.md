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
- [x] **Enhance Room Experience**
  - [x] Modify `rooms` schema to include `room_profile` (database column).
  - [x] Create a private Supabase Storage bucket for room profiles.
  - [x] Implement a custom, high-quality Room Creation Modal (replacing the browser prompt).
  - [x] Wire up `CreateRoomModal` to backend with file upload support.
  - [x] Update `roomService`, `useRooms`, and `Home` to handle multipart/form-data.
  - [x] Ensure `Sidebar` displays the room profile picture correctly.
- [x] **Create chat page / Real-time messaging**
  - [x] Implement message history fetching (`GET /rooms/:roomId/messages`).
  - [x] Integrate Socket.io for real-time message broadcasting.
  - [x] Build the chat interface within the content tray (`MessageList`, `MessageInput`).
  - [x] Implement optimistic updates for better UX.
  - [x] Add typing indicators (`typing_start`, `typing_stop`).
  - [x] Implement real-time presence tracking (Online/Offline status).
- [x] **Room Management & Settings**
  - [x] Create `RoomSettings` component for owners.
  - [x] Implement room name and profile picture updates.
  - [x] Add member management (adding users by email, kicking members).
  - [x] Implement "Leave Room" functionality for members.

## Phase 4: Refinement & Advanced Features
- [ ] **Real-time Discovery Updates**
  - Broadcast `room_created` events via Socket.io so the Sidebar/Discovery view updates in real-time for all users.
- [ ] **Advanced Moderation**
  - Implement profanity filtering on the server.
  - Add message deletion and editing.
- [ ] **User Profiles**
  - Allow users to update their own profiles (username, avatar).
- [ ] **Security Hardening**
  - Implement Email Verification flow.
  - Add Multi-Factor Authentication (MFA) support.
- [ ] **UI/UX Polish**
  - Add lazy-loading for message history (pagination).
  - Implement rich text or markdown support for messages.
  - Add sound notifications for new messages.