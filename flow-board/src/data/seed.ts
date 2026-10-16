import type {
  CheckIn,
  Issue,
  NotificationItem,
  Person,
  Project,
  ProjectRole,
} from "../types";

export const PEOPLE: Record<string, Person> = {
  AK: { id: "AK", name: "Asha", color: "#7c3aed" },
  RM: { id: "RM", name: "Ravi", color: "#0891b2" },
  SN: { id: "SN", name: "Sneha", color: "#db2777" },
  DP: { id: "DP", name: "Dev", color: "#ea580c" },
};

export const ISSUE_TYPES: Record<
  Issue["type"],
  { color: string; mark: string; label: string }
> = {
  S: { color: "#22a06b", mark: "S", label: "Story" },
  B: { color: "#c9372c", mark: "●", label: "Bug" },
  T: { color: "#0c66e4", mark: "✓", label: "Task" },
};

export const PRIORITIES: { mark: string; color: string; label: string }[] = [
  { mark: "▲", color: "#c9372c", label: "High" },
  { mark: "=", color: "#e56910", label: "Medium" },
  { mark: "▼", color: "#0c66e4", label: "Low" },
];

const desc =
  "As a user, I want this to work end to end so the team can track it. Acceptance criteria are listed in the linked spec.";

const issue = (
  projectKey: string,
  number: number,
  summary: string,
  type: Issue["type"],
  columnIndex: number,
  priority: Issue["priority"],
  assigneeId: string,
  points: number,
  epic: string,
  dueOffsetDays: number,
  comments: Issue["comments"] = []
): Issue => ({
  projectKey,
  number,
  summary,
  type,
  columnIndex,
  priority,
  assigneeId,
  points,
  epic,
  dueOffsetDays,
  description: desc,
  comments,
});

export const INITIAL_PROJECTS: Record<string, Project> = {
  FB: { key: "FB", name: "FlowBoard Dev", color: "#6e5dc6", lead: "Asha" },
  MA: { key: "MA", name: "Mobile App", color: "#22a06b", lead: "Ravi" },
  WS: { key: "WS", name: "Website Redesign", color: "#e56910", lead: "Sneha" },
};

export const INITIAL_COLUMNS: Record<string, string[]> = {
  FB: ["To Do", "In Progress", "In Review", "Done"],
  MA: ["To Do", "In Progress", "In Review", "Done"],
  WS: ["To Do", "In Progress", "In Review", "Done"],
};

export const INITIAL_MEMBERS: Record<string, Record<string, ProjectRole>> = {
  FB: { AK: "Admin", RM: "Developer", SN: "Developer", DP: "Viewer" },
  MA: { AK: "Developer", RM: "Admin", SN: "Developer", DP: "Developer" },
  WS: { AK: "Viewer", SN: "Admin", DP: "Developer" },
};

export const INITIAL_ISSUES: Issue[] = [
  issue("FB", 101, "Design onboarding flow", "S", 0, 1, "SN", 3, "Auth", 3),
  issue("FB", 102, "Set up CI pipeline", "T", 0, 2, "DP", 2, "", 5),
  issue("FB", 103, "Build login API", "S", 1, 0, "RM", 5, "Auth", 2, [
    { authorId: "RM", text: "API is ready, please test it.", when: "1 day ago" },
  ]),
  issue("FB", 104, "Dashboard charts not loading", "B", 1, 0, "AK", 3, "Dashboard", -1),
  issue("FB", 105, "Integrate payment gateway", "S", 1, 0, "DP", 8, "Payments", -4),
  issue("FB", 106, "Profile page", "S", 2, 1, "AK", 3, "Dashboard", 1),
  issue("FB", 107, "Email templates", "T", 2, 2, "SN", 2, "", -3),
  issue("FB", 108, "Database schema", "T", 3, 1, "RM", 3, "Auth", -8),
  issue("MA", 201, "Push notification setup", "S", 1, 0, "RM", 5, "Alerts", 2),
  issue("MA", 202, "App crashes on login", "B", 0, 0, "DP", 3, "Auth", -2),
  issue("MA", 203, "Dark mode support", "T", 2, 2, "SN", 2, "UI", 4),
  issue("MA", 204, "Splash screen", "T", 3, 2, "SN", 1, "UI", -6),
  issue("WS", 301, "New landing page", "S", 1, 1, "SN", 5, "Marketing", 3),
  issue("WS", 302, "Fix broken footer links", "B", 0, 1, "AK", 1, "SEO", 1),
  issue("WS", 303, "Blog template", "S", 0, 2, "AK", 3, "Marketing", 6),
  issue("WS", 304, "Optimize images", "T", 2, 1, "DP", 2, "SEO", -1),
];

export const INITIAL_CHECKINS: CheckIn[] = [
  {
    personId: "AK",
    yesterday: "Finished profile page UI.",
    today: "Work on dashboard charts.",
    blockers: "",
    status: "on_track",
  },
  {
    personId: "RM",
    yesterday: "Shipped login API.",
    today: "Help with payment integration.",
    blockers: "",
    status: "on_track",
  },
  {
    personId: "DP",
    yesterday: "Started payment gateway.",
    today: "Blocked on credentials.",
    blockers: "Waiting for API keys",
    status: "blocked",
  },
  {
    personId: "SN",
    yesterday: "",
    today: "",
    blockers: "",
    status: "missing",
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    kind: "blocked",
    title: "Blocked",
    detail: "FB-105 needs API keys",
    time: "2h",
  },
  {
    id: "2",
    kind: "overdue",
    title: "Overdue",
    detail: "FB-104 was due yesterday",
    time: "5h",
  },
  {
    id: "3",
    kind: "mention",
    title: "Mention",
    detail: "Ravi mentioned you on FB-103",
    time: "1d",
  },
];

export const WEEKLY_COMPLETED = [5, 8, 6, 11, 9, 14];

export const issueKey = (issue: Pick<Issue, "projectKey" | "number">) =>
  `${issue.projectKey}-${issue.number}`;

export const isOverdue = (issue: Issue, doneIndex: number) =>
  issue.dueOffsetDays < 0 && issue.columnIndex < doneIndex;
