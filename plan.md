# Plan: Implement Discord-like Channel Architecture (COMPLETED)

## Background & Motivation
Currently, messages in Deezcord are tied directly to a `room` (which acts like a Discord server/guild). To match Discord's functionality, we need to allow multiple text channels within a single room so users can categorize their conversations (e.g., `#general`, `#announcements`, `#random`).

## Scope & Impact
- **Documentation:** The first step of implementation will be copying this plan into `plan.md` and the database migration plan into `migration_plan.md` in the project root directory.
- **Database:** Supabase schema updates as detailed in `migration_plan.md`.
- **Backend (`server/`):** New REST endpoints for channel management, updated message endpoints, and revised Socket.io logic.
- **Frontend (`client/`):** UI updates to the Sidebar to display channels, Chat area updates to fetch/send messages by channel.

## Proposed Solution

### 0. Documentation Update
- **Update `plan.md`**: Copy this approved plan into the project root's `plan.md`.
- **Update `migration_plan.md`**: Copy the database migration details into the project root's `migration_plan.md`.

### 1. Database Schema Changes
Execute the SQL detailed in `migration_plan.md`:
- Create `channels` table with RLS policies.
- Backfill `channels` with a `#general` channel for each existing room.
- Add `channel_id` to `messages` and backfill existing messages.

### 2. Backend Updates (`server/`)
- **REST API (`routes/roomRoutes.ts`)**:
  - `GET /rooms/:roomId/channels`
  - `POST /rooms/:roomId/channels`
  - Update `GET /rooms/:roomId/messages` to `GET /channels/:channelId/messages`.
- **WebSockets (`index.ts`)**:
  - Update `join_room` to use `channel:${channelId}` instead of `room:${roomId}`.
  - Route `send_message` to the appropriate channel.

### 3. Frontend Updates (`client/`)
- **Types (`client/src/types/`)**:
  - Add `Channel` interface. Update `Message` and `SendMessagePayload` to use `channel_id`.
- **UI Components**:
  - `Sidebar.tsx`: Show channels.
  - `MessageList.tsx` & `MessageInput.tsx`: Tie logic to `channel_id`.

## Verification
- Create a new room; verify it automatically gets a `#general` channel.
- Create a new channel in the room.
- Send messages in `#general` and the new channel; verify they do not overlap.
- Reload the app and verify message history is fetched correctly per channel.

---

# Plan: Real-time Room & Channel Creation Updates

## Background & Motivation
Currently, users must manually refresh to see newly created rooms in the Discovery tab, or newly created channels in their current room. We need to push these updates in real-time via Socket.io to ensure a seamless, "live" feel to the application that matches the Unified Glass aesthetic.

## Scope & Impact
- **Backend (`server/`)**: Expose the Socket.io instance to Express routes. Emit `room_created` on new room creation and `channel_created` on new channel creation.
- **Frontend (`client/`)**: Update socket hooks to listen for these events. Update local state for `discoverRooms` and `channels` to react to these events. Introduce "Impeccable" UI micro-animations for incoming items.

## Proposed Solution

### 1. Backend Updates (`server/`)
- **`server/index.ts`**: Attach the Socket.io `io` instance to the Express app using `app.set('io', io)`.
- **`server/routes/roomRoutes.ts`**:
  - In `POST /rooms` (create room): Retrieve `req.app.get('io')` and emit a global `room_created` event with the new room data.
  - In `POST /rooms/:roomId/channels` (create channel): Retrieve `req.app.get('io')` and emit a `channel_created` event specifically to the users currently viewing the room using `io.to(roomId).emit(...)`.

### 2. Frontend Updates (`client/`) - "Impeccable UI"
- **`client/src/hooks/useSocket.ts`**: Add typed event listeners for `room_created` and `channel_created`.
- **`client/src/hooks/useRooms.ts`**: Subscribe to `room_created`. If the newly created room is not authored by the current user, insert it into the `discoverRooms` state dynamically.
- **`client/src/pages/Home.tsx`**: Subscribe to `channel_created`. If the `channel.room_id` matches the active `currentRoom.id`, append it to the `channels` list.
- **Micro-Interactions (Impeccable Skill)**:
  - **Sidebar Channels**: Wrap the channel list in an animation presence handler (or use simple CSS transitions). When a new channel appears, it should expand its height from 0 to full and fade in (`animate-fade-in-up`), avoiding jarring layout shifts. We can add a brief subtle highlight (e.g., a faint indigo flash) to draw the user's eye to the new channel.
  - **Discovery Rooms**: Similar grid entry animations. When a new room card is added to the discovery grid, it should pop in smoothly rather than instantly appearing.

## Verification
- User A creates a new room. User B (on the Discovery tab) sees the room appear instantly with a smooth animation.
- User A creates a new channel in "Room X". User B (currently viewing "Room X") sees the new channel smoothly slide into their sidebar.
- Ensure the server correctly targets only the users in "Room X" when emitting the channel creation event.