# Impeccable Design Brief: Reusable Modal Component

`IMPECCABLE_PREFLIGHT: context=pass product=pass command_reference=pass shape=pass image_gate=skipped:plan-mode mutation=open`

## 1. Feature Summary
A highly reusable, modular Modal component that serves as the foundation for all overlays in Deezcord (e.g., confirmations, forms, settings). It consolidates disparate modal logic into a single, robust, and accessible "Unified Glass" surface.

## 2. Primary User Action
Focus entirely on the presented task (e.g., confirming an action, filling a form) without losing the context of the underlying application, and either complete or dismiss it effortlessly.

## 3. Design Direction
- **Color Strategy:** Restrained. Neutral glass backgrounds with the brand's Electric Blue (`#3b82f6`) reserved strictly for primary actions.
- **Theme via Scene:** A user focused on a critical interruption, viewing a sharp, elevated glass panel that softly blurs out the chat behind it, maintaining spatial awareness while enforcing focus.
- **Anchor References:** Apple visionOS glass overlays, Linear's command menus.

## 4. Scope
- **Fidelity:** Production-ready shipped component.
- **Breadth:** A core UI primitive replacing `CreateRoomModal` and `UserProfileModal`, and acting as the base for future alerts.
- **Interactivity:** Smooth entry/exit animations, keyboard accessibility (Escape to close, focus trapping), and async loading states.

## 5. Layout Strategy
- **Container:** Centered on screen, constrained max-width (`max-w-md` to `max-w-2xl` depending on variant), large border radius (`rounded-[2.5rem]` or `rounded-3xl` matching DESIGN.md).
- **Structure:** 
  - **Header:** Sticky top, contains title, optional subtitle, and a circular close button.
  - **Body:** Scrollable (`overflow-y-auto`) area for dynamic content.
  - **Footer:** Sticky bottom, right-aligned action buttons (Cancel, Confirm) with a subtle contrasting background (`bg-slate-50/30 dark:bg-black/10`).

## 6. Key States
- **Entry:** Backdrop fades in (`animate-fade-in`), modal slides up and scales in (`animate-fade-in-up`).
- **Loading:** Action buttons disable, primary button shows an animated spinner; backdrop clicks and Escape key are ignored.
- **Edge Cases:** Content exceeding viewport height triggers internal scrolling without moving the header or footer.

## 7. Interaction Model
- Click outside the modal container to dismiss (if not loading/dirty).
- Press `Escape` to dismiss.
- Focus is trapped within the modal while open.
- Primary button provides hover scale and shadow (`hover:-translate-y-[2px] hover:shadow-[...]`) as defined in DESIGN.md.

## 8. Content Requirements (Props API)
- `isOpen` (boolean): Controls visibility.
- `onClose` (function): Dismiss handler.
- `title` (string): Primary heading.
- `description` (string, optional): Secondary context.
- `children` (ReactNode): The main content payload.
- `footer` (ReactNode, optional): Custom actions, defaults to none if omitted.
- `maxWidth` (string, optional): Tailwind max-width class (e.g., `max-w-md`, `max-w-lg`).
- `isLoading` (boolean, optional): Disables closing mechanisms during async operations.

## 9. Recommended References
- `reference/spatial-design.md` (for z-index and elevation).
- `reference/motion-design.md` (for the entry/exit easing curves).

## 10. Migration Plan
0. Copy this design brief to overwrite the `plan.md` in the root of the project directory.
1. Implement `src/components/Modal.tsx`.
2. Refactor `CreateRoomModal.tsx` to use the new `<Modal>` wrapper.
3. Refactor `UserProfileModal.tsx` to use the new `<Modal>` wrapper.
4. Verify all animations, scroll behaviors, and responsive constraints across both refactored modals.