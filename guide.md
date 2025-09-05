# TEAM Role Frontend Guide

This guide explains what the `team` role can and cannot do in the SI3 backend, so the frontend can gate UI accordingly.

## Overview
- TEAM is a read-only, elevated viewer for admin data.
- TEAM can read admin dashboards and user data via specific GET endpoints.
- TEAM is read-only for comments (cannot create, edit, delete, or react) unless the user also holds another content-allowed role (guide/scholar/partner) or is admin.
- TEAM has no elevated permissions in RSVP APIs (owner or admin only for protected operations).
- Admin APIs should always return fresh data. No server-side caching is used for admin controllers.

## How the backend enforces this
- Middleware
  - `middleware/protectMiddleware.ts`:
    - `protect` authenticates users and populates `req.user`.
    - `requireAdminOrTeam` authorizes both ADMIN and TEAM for read-only admin endpoints.
    - `requireAdmin` restricts mutations to ADMIN only.
  - `middleware/commentPermissionMiddleware.ts`:
    - `checkContentAccess` allows TEAM to view comments for allowed content types.
    - `checkCommentPermission` blocks TEAM from creating comments (unless they also have another allowed role or are ADMIN).
    - `checkCommentOwnership` blocks TEAM from editing/deleting even their own comments (unless ADMIN).
    - `checkReactionPermission` blocks TEAM from reacting unless also another allowed role or ADMIN.
- Models
  - `models/commentsModel.ts`: `CONTENT_ACCESS_MAP` includes TEAM for read access on content types.
- Admin controllers
  - `controllers/adminController.ts`: explicitly avoids Redis caching; all responses are fresh DB reads.

## Capability Matrix (TEAM)
- Admin API
  - GET `/api/admin/users` → ALLOWED (via `requireAdminOrTeam`)
  - GET `/api/admin/users/stats` → ALLOWED
  - GET `/api/admin/users/:userId` → ALLOWED
  - POST `/api/admin/users` → BLOCKED (ADMIN only)
  - PATCH `/api/admin/users/:userId/status` → BLOCKED (ADMIN only)
  - PATCH `/api/admin/users/:userId/role` → BLOCKED (ADMIN only)
  - PATCH `/api/admin/users/:userId/reactivate` → BLOCKED (ADMIN only)
  - DELETE `/api/admin/users/:userId` → BLOCKED (ADMIN only)
  - DELETE `/api/admin/users/:userId/hard-delete` → BLOCKED (ADMIN only)

- Comments API
  - GET `/api/comments/content` → ALLOWED (with `contentType` the user has access to)
  - GET `/api/comments/content/threaded` → ALLOWED
  - GET `/api/comments/content/stats` → ALLOWED
  - GET `/api/comments/:commentId` → ALLOWED
  - GET `/api/comments/:commentId/replies` → ALLOWED
  - GET `/api/comments/:commentId/reactions` → ALLOWED
  - GET `/api/comments/:commentId/my-reaction` → ALLOWED (read)
  - POST `/api/comments` (create) → BLOCKED unless user also has non-TEAM allowed content role or is ADMIN
  - PUT `/api/comments/:commentId` (update) → BLOCKED (TEAM is read-only)
  - DELETE `/api/comments/:commentId` (delete) → BLOCKED (TEAM is read-only)
  - POST `/api/comments/:commentId/react` (like/dislike) → BLOCKED unless user also has non-TEAM allowed content role or is ADMIN
  - DELETE `/api/comments/:commentId/react` → same as above

- RSVP API (selected)
  - Viewing a specific RSVP that the user owns → ALLOWED (owner)
  - Elevated access (view/delete/resend emails/download calendar) for RSVPs not owned → BLOCKED for TEAM (ADMIN or OWNER only where applicable)
  - Bulk admin actions (e.g., reminders) → ADMIN only

## Status codes the frontend should expect
- 200/201 → Success
- 400 → Validation/Bad request
- 401 → Not authenticated
- 403 → Authenticated but not authorized (e.g., TEAM trying to mutate admin/users or comments)
- 404 → Not found

## UI Guidance
- Admin UI
  - Show admin dashboards and user list/details to TEAM.
  - Hide or disable all mutation controls (create user, change roles, verify/reactivate, delete) for TEAM.
- Comments UI
  - Show threads and stats to TEAM.
  - Hide comment composer, edit/delete controls, and reaction buttons for TEAM unless user also has an allowed content role or is ADMIN.
- RSVP UI
  - Do not expose elevated admin actions to TEAM. Only show owner actions for their own RSVP.

## Role Detection on the Frontend
- The backend returns `user.roles` after authentication.
- Treat a user as TEAM if `roles` contains `"team"`.
- For comment create/react/edit/delete, require one of: `admin`, or a non-TEAM role permitted by the content type (`guide`, `scholar`, `partner`) based on your feature context.

## Notes on Caching
- Admin controllers do not use Redis caching. You always get fresh data.
- Comments read endpoints use Redis caching internally for performance; write operations invalidate caches to ensure freshness.

## File references
- `routes/adminRoutes.ts` – where `requireAdminOrTeam` and `requireAdmin` are applied.
- `controllers/adminController.ts` – no caching and DB-driven responses.
- `middleware/protectMiddleware.ts` – authZ helpers (`requireAdminOrTeam`, `requireAdmin`).
- `middleware/commentPermissionMiddleware.ts` – TEAM read-only enforcement.
- `models/commentsModel.ts` – `CONTENT_ACCESS_MAP` includes TEAM for read access.

## Example: gating UI with roles
```ts
const roles = currentUser.roles; // e.g., ["team"]
const isAdmin = roles.includes('admin');
const isTeam = roles.includes('team');
const canAdminRead = isAdmin || isTeam; // Gate admin dashboards
const canAdminMutate = isAdmin;         // Gate admin mutations

// Comments permissions for a given content type
const hasNonTeamAllowedRole = roles.some(r => ['guide','scholar','partner','admin'].includes(r));
const canCreateComment = isAdmin || hasNonTeamAllowedRole;
const canEditOrDeleteComment = isAdmin; // Team is read-only
const canReact = isAdmin || hasNonTeamAllowedRole;
```

If you need this guide embedded in the frontend repo as well, let me know the preferred path and I’ll sync it there.
