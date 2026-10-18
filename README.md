# ◈ FlowBoard

**A Jira-style project and work-status tracker.** Teams manage multiple projects, track issues on drag-and-drop Kanban boards, run daily check-ins and see who is working on what, with role-based access per project.

**Live demo:** https://flow-board-tau-snowy.vercel.app

> **Status:** Frontend project. Authentication and data are simulated in the browser. A Node.js + PostgreSQL backend is planned.

![FlowBoard board view](./docs/screenshots/board.png)

## Features

**Authentication**
- Login, signup and forgot-password pages with form validation (React Hook Form)
- Password strength meter and terms checkbox on signup
- Protected routes for the app and public-only routes for the auth pages, with redirect after login

**Projects**
- Projects page with progress bar, done count and overdue count for each project
- Create a project with a name, key and template (Scrum or Kanban)
- Per-project boards, issues, columns, members and roles

**Board and issues**
- Kanban board with drag and drop between columns
- Filters: search, assignee, epic and due date (overdue or due this week)
- Issue cards with type (story, task, bug), priority, story points, epic and assignee
- Issue detail modal with description, comments and status change
- Create issue dialog
- Backlog list view
- Global issue search in the top bar

**Team**
- Daily check-in form (yesterday, today, blockers) with a team stand-up status list
- Notifications menu with blocked, overdue and mention alerts
- Reports page with a weekly completion chart and an overdue issues list

**Roles and settings**
- Per-project roles: Admin, Manager, Developer, Viewer
- Viewers get a read-only board (no create, drag or status change)
- Project settings: rename project, change lead, add, rename and remove board columns, manage members and roles
- Settings are editable only by Admin and Manager roles

## Tech stack

| Area | Tools |
|---|---|
| Framework | React 19, TypeScript, Vite |
| UI | Material UI (MUI) with a custom theme |
| State | Redux (react-redux) with reducers, actions and selectors |
| Routing | React Router with lazy-loaded pages |
| Forms | React Hook Form |
| Code quality | ESLint |
| Hosting | Vercel |

## Getting started

### Prerequisites
- Node.js 18 or later
- npm

### Install and run

The app lives in the `flow-board` folder.

```bash
git clone https://github.com/swarna1822/FlowBoard.git
cd FlowBoard/flow-board
npm install
npm start
```

Open http://localhost:3000.

### Scripts

| Command | Description |
|---|---|
| `npm start` | Start the dev server on port 3000 |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Demo login

Authentication is simulated in this version. On the login page, enter any valid email address and a password with at least 8 characters. You can also create an account on the signup page.

The sample data has three projects, and the signed-in user has a different role in each one:

| Project | Your role | What you can do |
|---|---|---|
| FlowBoard Dev | Admin | Everything, including settings |
| Mobile App | Developer | Create, edit and move issues |
| Website Redesign | Viewer | Read only |

Use the project switcher or the Projects page to see how the interface changes with each role.

## Project structure

```
flow-board/
├─ public/             favicon and static icons
└─ src/
   ├─ Pages/
   │  ├─ AuthFlow/     Login, Signup, ForgotPassword
   │  ├─ Home/         TopBar, SideBar, navigation items
   │  ├─ Projects/     Projects list, CreateProjectDialog
   │  ├─ Board/        Board, IssueModal, CreateIssueDialog
   │  ├─ Backlog/
   │  ├─ CheckIn/
   │  ├─ Reports/
   │  └─ Settings/     Details, Columns, Members and roles
   ├─ Redux/           store, auth and board reducers, actions, selectors
   ├─ Utils/           routing, layout, loading and not-found pages
   ├─ components/      shared components (avatar, issue type mark)
   ├─ data/            seed data for projects, issues and check-ins
   ├─ assets/          logo images
   ├─ theme.ts         Material UI theme
   └─ types.ts         shared TypeScript types
```

## How it works

- **State:** Redux holds the logged-in user and the board data (projects, columns, issues, members, filters and UI state). Selectors such as `filteredIssues`, `canEdit` and `canManage` decide what each screen shows.
- **Persistence:** board changes are saved to the browser's localStorage, so they survive a refresh. Clearing site data resets the app to the sample data.
- **Permissions:** the UI checks the user's role in the current project before allowing edits. These checks are for the interface only and are not secure.

## Deployment (Vercel)

1. Import the repository in Vercel.
2. Set the **Root Directory** to `flow-board`.
3. Use the Vite preset with build command `npm run build` and output directory `dist`.
4. Keep the `vercel.json` file in `flow-board/` so direct links such as `/board` work with React Router:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Every push to `main` deploys automatically.

## Known limitations

- Login and signup are simulated, so there are no real accounts.
- The signed-in user is always mapped to the sample user "Asha" for roles and comments.
- Data is stored per browser, so it is not shared between users or devices.
- Attachments, time tracking and weekly report numbers use sample data.
- The interface is light mode only.

## Roadmap

- [ ] Node.js + PostgreSQL backend with real authentication and server-side role checks
- [ ] Light and dark theme toggle
- [ ] Real time tracking, file attachments and report data from the database
- [ ] Sprint planning view
- [ ] Unit and end-to-end tests
- [ ] Switch to Redux Toolkit

## Author

**Swarna Kumar Koppala** · [GitHub](https://github.com/swarna1822) · [LinkedIn](https://linkedin.com/in/koppala-swarna-kumar-131919195)
