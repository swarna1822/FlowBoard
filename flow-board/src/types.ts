export type GlobalRole = "Admin" | "Manager" | "Employee";
export type ProjectRole = "Admin" | "Manager" | "Developer" | "Viewer";
export type IssueType = "S" | "T" | "B";
export type Priority = 0 | 1 | 2;

export type Person = {
  id: string;
  name: string;
  color: string;
};

export type Project = {
  key: string;
  name: string;
  color: string;
  lead: string;
};

export type Comment = {
  authorId: string;
  text: string;
  when: string;
};

export type Issue = {
  projectKey: string;
  number: number;
  summary: string;
  type: IssueType;
  columnIndex: number;
  priority: Priority;
  assigneeId: string;
  points: number;
  epic: string;
  dueOffsetDays: number;
  description: string;
  comments: Comment[];
};

export type CheckIn = {
  personId: string;
  yesterday: string;
  today: string;
  blockers: string;
  status: "on_track" | "blocked" | "missing";
};

export type AuthUser = {
  email: string;
  name: string;
  initials: string;
  personId: string;
  role: GlobalRole;
};

export type BoardFilters = {
  query: string;
  epic: string;
  due: "" | "o" | "w";
  assigneeId: string;
};

export type NotificationItem = {
  id: string;
  kind: "blocked" | "overdue" | "mention";
  title: string;
  detail: string;
  time: string;
};
