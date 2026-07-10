# Forge

A developer-centric issue tracker — a lightweight Linear/Jira-style tool for managing workspaces, projects, and issues, with role-based access control and full activity tracking.

**Live app:** https://forge-nine-pied.vercel.app
**API base URL:** https://forge-api-s87b.onrender.com
**API docs (Swagger):** https://forge-api-s87b.onrender.com/api/docs/

> Note: the backend is hosted on a free tier that spins down after inactivity. The first request after a period of idle time may take 15–30 seconds to respond while the server cold-starts. Subsequent requests are fast.

---

## Overview

Forge lets a user create a workspace, add teammates to it by username, organize work into projects, and track issues through to completion — with every meaningful change (status, priority, assignee, due date, labels) recorded in a per-issue activity timeline.

Workspace membership is the access boundary: anyone added to a workspace can see and be assigned work across every project within it. There is no separate per-project membership layer — this is a deliberate scope decision, not an oversight.

## Tech Stack

**Backend**
- Django + Django REST Framework
- PostgreSQL
- SimpleJWT (JWT authentication with refresh-token rotation)
- django-filter (server-side filtering)
- drf-spectacular (OpenAPI / Swagger docs)
- Deployed on Render

**Frontend**
- React (Vite)
- Tailwind CSS v4
- shadcn/ui
- React Router
- Axios (with automatic access-token refresh via interceptors)
- Recharts (dashboard analytics)
- react-markdown (issue description rendering)
- Deployed on Vercel

## Features

**Authentication**
- JWT-based signup/login with automatic access-token refresh and request queueing during refresh
- Protected routes with redirect-to-login for unauthenticated access

**Workspaces & Access Control**
- Create a workspace (creator is automatically made Admin)
- Add existing users to a workspace by username (Admin-only action)
- Switch between multiple workspaces; all views scope data to the active workspace

**Projects**
- Create, archive, and unarchive projects within a workspace

**Issues**
- Full CRUD with title, markdown-rendered description, status, priority, assignee, due date, and labels
- Server-side filtering (project, status, priority, assignee), search, sorting (including true priority-severity ordering, not alphabetical), and pagination
- Assignee and label pickers scoped to the current workspace's membership

**Activity Tracking**
- Every issue creation, status change, priority change, reassignment, due-date change, label change, and comment is logged with before/after values and rendered as a readable timeline (e.g. "changed priority from Low to High")

**Comments**
- Threaded per-issue comments with live UI updates

**Dashboard**
- Per-workspace stats (active projects, total issues, overdue issues)
- Issues-by-status and issues-by-priority charts
- Recent issues, recent activity, and issues assigned to the current user

**Resilience & UX**
- Skeleton loading states matched to each view's real layout (no layout shift on load)
- A global error boundary that catches render-time crashes with a recovery action, instead of a blank page
- Inline, retryable error banners on every data fetch and mutation, with error messages normalized across DRF's different error response shapes
- A dedicated 404 page for unmatched routes
- Dark mode

## Architecture

```
┌─────────────────┐         HTTPS / JWT            ┌──────────────────────┐
│   React (Vite)  │ ────────────────────────────▶ │ Django REST Framework │
│   Vercel        │ ◀──────────────────────────── │ Render                │
└─────────────────┘                                └──────────┬───────────┘
                                                              │
                                                              ▼
                                                     ┌──────────────────┐
                                                     │   PostgreSQL     │
                                                     └──────────────────┘
```

**Request flow:** the React app holds a short-lived access token and a longer-lived refresh token. An Axios request interceptor attaches the access token to every outgoing call; a response interceptor catches `401`s, silently refreshes the token once, queues any requests that arrived mid-refresh, and retries them — so a token expiring mid-session never surfaces as a user-visible error.

**Backend layering:**

```
Request → URLConf → ViewSet (permissions, filtering, pagination)
                        │
                        ▼
                  Serializer (validation, shape)
                        │
                        ▼
                  Service layer (business rules)
                        │
                        ▼
                     Model / ORM
```

- **Service layer pattern.** Business logic that shouldn't live in a view or serializer — workspace creation + auto-admin assignment, membership validation, assignee validation, dashboard stat aggregation — lives in dedicated `services.py` modules per Django app (`WorkspaceService`, `IssueService`, `DashboardService`). Views stay thin; they orchestrate, they don't decide.
- **Split read/write serializer fields.** Nested relations that need to be both human-readable on GET and simply-writable on PATCH/POST (assignee, labels) use paired fields — e.g. a read-only `assignee` (full user object) alongside a write-only `assignee_id` (primary key) — rather than one field trying to do both jobs.
- **Diff-based activity logging.** Updates to an issue compare old vs. new field values inside the view's `perform_update`, emitting one `ActivityLog` entry per changed field (status, assignee, priority, due date, labels) rather than a single vague "issue updated" record.
- **Explicit mixins over `ModelViewSet` where the full CRUD surface isn't wanted.** E.g. workspace membership only needs list + create, so `WorkspaceMemberViewSet` composes `ListModelMixin` + `CreateModelMixin` on a `GenericViewSet` rather than exposing update/delete endpoints that don't do anything meaningful.
- **Resilience by default on the frontend.** Every data-fetching effect and every mutation follows the same shape: set loading → try the call → on failure, normalize the error via a shared `getErrorMessage()` utility and show a retryable inline banner → always clear the loading state. A top-level `ErrorBoundary` (necessarily a class component — React error boundaries have no hook equivalent) catches anything that still slips through as a render-time crash.

## Project Structure

```
forge/
├── project/
│   ├── backend/
│   │   ├── core/              # TimeStampedModel, shared choices/enums
│   │   ├── users/              # Custom User model, auth serializers
│   │   ├── workspaces/         # Workspace, WorkspaceMember, WorkspaceService, DashboardService
│   │   ├── projects/           # Project model, archive/unarchive actions
│   │   ├── issues/             # Issue, Label, Comment, ActivityLog, IssueService, filters
│   │   └── forge_backend/      # settings, root URLConf
│   └── frontend/
│       └── src/
│           ├── components/     # Reusable UI: modals, skeletons, ErrorBanner, ErrorBoundary, Navbar
│           ├── pages/           # Route-level views: Dashboard, Issues, IssueDetail, Login, Signup, 404
│           ├── contexts/        # AuthContext, WorkspaceContext, ThemeContext
│           ├── services/        # Axios instance + one service module per API resource
│           └── utils/           # errorMessage extractor, token storage
└── README.md
```

## Data Model

```
User ──< WorkspaceMember >── Workspace ──< Project ──< Issue >── Label
                                                          │
                                                          ├──< Comment
                                                          └──< ActivityLog
```

- A `Workspace` has many `WorkspaceMember` rows (through-table to `User`, carrying an Admin/Member `role`); the creator is auto-assigned Admin.
- A `Project` belongs to exactly one `Workspace`.
- An `Issue` belongs to exactly one `Project`, optionally has one `assignee` (must be a member of the issue's workspace, enforced in `IssueService`), and has a many-to-many relationship with `Label`.
- `Comment` and `ActivityLog` both belong to exactly one `Issue`, cascade-deleted with it.

## Local Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate   # Windows Git Bash
pip install -r requirements.txt
```

Create a `.env` file in `backend/` with your database and secret key configuration (see `.env.example` if present, or `settings.py` for required variables).

```bash
python manage.py migrate
python manage.py seed_db     # optional: creates demo users, workspaces, projects, and issues
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` with:
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

```bash
npm run dev
```

The app will be available at `http://localhost:5173`, with the API expected at `http://127.0.0.1:8000`.

## API Documentation

Full interactive API documentation (all endpoints, request/response schemas, auth requirements) is available via Swagger at:

**https://forge-api-s87b.onrender.com/api/docs/**

## Known Limitations and Design Decisions

These are intentional scope boundaries for a portfolio project.

- **JWT stored in `localStorage`, not httpOnly cookies.** The standard trade-off is reduced XSS resistance compared to httpOnly cookies. A cookie-based migration (SimpleJWT cookie settings, CSRF handling, `axios withCredentials`) is a natural next step.
- **No email/invite-based workspace onboarding.** An admin adds an existing user to a workspace directly by username; there is no invitation, pending-approval, or email step. This mirrors how many internal, org-managed tools work.
- **Free-tier hosting cold starts.** The backend (Render free tier) spins down after inactivity, causing a delay on the first request after idle time.