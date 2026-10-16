import {
  INITIAL_CHECKINS,
  INITIAL_COLUMNS,
  INITIAL_ISSUES,
  INITIAL_MEMBERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROJECTS,
} from "../data/seed";
import type {
  BoardFilters,
  CheckIn,
  Issue,
  NotificationItem,
  Project,
  ProjectRole,
} from "../types";

const STORAGE_KEY = "flowboard_board";

export type BoardState = {
  currentProject: string;
  projects: Record<string, Project>;
  columns: Record<string, string[]>;
  members: Record<string, Record<string, ProjectRole>>;
  issues: Issue[];
  checkins: CheckIn[];
  notifications: NotificationItem[];
  filters: BoardFilters;
  selectedIssue: number | null;
  createIssueOpen: boolean;
  createProjectOpen: boolean;
  settingsTab: "d" | "c" | "m";
};

const emptyFilters: BoardFilters = {
  query: "",
  epic: "",
  due: "",
  assigneeId: "",
};

const defaults: BoardState = {
  currentProject: "FB",
  projects: INITIAL_PROJECTS,
  columns: INITIAL_COLUMNS,
  members: INITIAL_MEMBERS,
  issues: INITIAL_ISSUES,
  checkins: INITIAL_CHECKINS,
  notifications: INITIAL_NOTIFICATIONS,
  filters: emptyFilters,
  selectedIssue: null,
  createIssueOpen: false,
  createProjectOpen: false,
  settingsTab: "d",
};

const load = (): BoardState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw), filters: emptyFilters };
  } catch {
    return defaults;
  }
};

const persist = (state: BoardState) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      currentProject: state.currentProject,
      projects: state.projects,
      columns: state.columns,
      members: state.members,
      issues: state.issues,
      checkins: state.checkins,
      notifications: state.notifications,
      settingsTab: state.settingsTab,
    })
  );
};

export type BoardAction =
  | { type: "SET_PROJECT"; key: string }
  | {
      type: "CREATE_PROJECT";
      project: Project;
      columns: string[];
    }
  | { type: "UPDATE_PROJECT"; key: string; name: string; lead: string }
  | { type: "ADD_COLUMN" }
  | { type: "DELETE_COLUMN"; index: number }
  | { type: "RENAME_COLUMN"; index: number; name: string }
  | { type: "CREATE_ISSUE"; issue: Omit<Issue, "number" | "columnIndex"> }
  | { type: "MOVE_ISSUE"; number: number; columnIndex: number }
  | { type: "UPDATE_ISSUE"; number: number; patch: Partial<Issue> }
  | { type: "ADD_COMMENT"; number: number; authorId: string; text: string }
  | { type: "SET_MEMBER_ROLE"; personId: string; role: ProjectRole }
  | { type: "ADD_MEMBER"; personId: string }
  | { type: "REMOVE_MEMBER"; personId: string }
  | { type: "SET_FILTERS"; filters: Partial<BoardFilters> }
  | { type: "CLEAR_FILTERS" }
  | { type: "TOGGLE_ASSIGNEE_FILTER"; personId: string }
  | { type: "OPEN_ISSUE"; number: number }
  | { type: "CLOSE_ISSUE" }
  | { type: "SET_CREATE_ISSUE"; open: boolean }
  | { type: "SET_CREATE_PROJECT"; open: boolean }
  | { type: "SET_SETTINGS_TAB"; tab: BoardState["settingsTab"] }
  | { type: "SUBMIT_CHECKIN"; personId: string; yesterday: string; today: string; blockers: string };

const nextState = (state: BoardState, action: BoardAction): BoardState => {
  const key = state.currentProject;

  switch (action.type) {
    case "SET_PROJECT":
      return { ...state, currentProject: action.key, filters: emptyFilters };
    case "CREATE_PROJECT":
      return {
        ...state,
        projects: { ...state.projects, [action.project.key]: action.project },
        columns: { ...state.columns, [action.project.key]: action.columns },
        members: { ...state.members, [action.project.key]: { AK: "Admin" } },
        currentProject: action.project.key,
        createProjectOpen: false,
      };
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: {
          ...state.projects,
          [action.key]: {
            ...state.projects[action.key],
            name: action.name,
            lead: action.lead,
          },
        },
      };
    case "ADD_COLUMN": {
      const cols = [...(state.columns[key] ?? [])];
      const last = cols.length - 1;
      cols.splice(last, 0, "New column");
      return {
        ...state,
        columns: { ...state.columns, [key]: cols },
        issues: state.issues.map((issue) =>
          issue.projectKey === key && issue.columnIndex === last
            ? { ...issue, columnIndex: last + 1 }
            : issue
        ),
      };
    }
    case "DELETE_COLUMN": {
      const cols = [...(state.columns[key] ?? [])];
      if (cols.length <= 2) return state;
      const i = action.index;
      cols.splice(i, 1);
      return {
        ...state,
        columns: { ...state.columns, [key]: cols },
        issues: state.issues.map((issue) => {
          if (issue.projectKey !== key) return issue;
          if (issue.columnIndex === i)
            return { ...issue, columnIndex: Math.max(0, i - 1) };
          if (issue.columnIndex > i)
            return { ...issue, columnIndex: issue.columnIndex - 1 };
          return issue;
        }),
      };
    }
    case "RENAME_COLUMN": {
      const cols = [...(state.columns[key] ?? [])];
      cols[action.index] = action.name;
      return { ...state, columns: { ...state.columns, [key]: cols } };
    }
    case "CREATE_ISSUE": {
      const nums = state.issues
        .filter((issue) => issue.projectKey === key)
        .map((issue) => issue.number);
      const number = (nums.length ? Math.max(...nums) : 100) + 1;
      return {
        ...state,
        issues: [
          ...state.issues,
          { ...action.issue, projectKey: key, number, columnIndex: 0 },
        ],
        createIssueOpen: false,
      };
    }
    case "MOVE_ISSUE":
      return {
        ...state,
        issues: state.issues.map((issue) =>
          issue.number === action.number
            ? { ...issue, columnIndex: action.columnIndex }
            : issue
        ),
      };
    case "UPDATE_ISSUE":
      return {
        ...state,
        issues: state.issues.map((issue) =>
          issue.number === action.number ? { ...issue, ...action.patch } : issue
        ),
      };
    case "ADD_COMMENT":
      return {
        ...state,
        issues: state.issues.map((issue) =>
          issue.number === action.number
            ? {
                ...issue,
                comments: [
                  ...issue.comments,
                  { authorId: action.authorId, text: action.text, when: "just now" },
                ],
              }
            : issue
        ),
      };
    case "SET_MEMBER_ROLE":
      return {
        ...state,
        members: {
          ...state.members,
          [key]: { ...state.members[key], [action.personId]: action.role },
        },
      };
    case "ADD_MEMBER":
      return {
        ...state,
        members: {
          ...state.members,
          [key]: { ...state.members[key], [action.personId]: "Developer" },
        },
      };
    case "REMOVE_MEMBER": {
      const next = { ...state.members[key] };
      delete next[action.personId];
      return { ...state, members: { ...state.members, [key]: next } };
    }
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.filters } };
    case "CLEAR_FILTERS":
      return { ...state, filters: emptyFilters };
    case "TOGGLE_ASSIGNEE_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          assigneeId:
            state.filters.assigneeId === action.personId ? "" : action.personId,
        },
      };
    case "OPEN_ISSUE":
      return { ...state, selectedIssue: action.number };
    case "CLOSE_ISSUE":
      return { ...state, selectedIssue: null };
    case "SET_CREATE_ISSUE":
      return { ...state, createIssueOpen: action.open };
    case "SET_CREATE_PROJECT":
      return { ...state, createProjectOpen: action.open };
    case "SET_SETTINGS_TAB":
      return { ...state, settingsTab: action.tab };
    case "SUBMIT_CHECKIN":
      return {
        ...state,
        checkins: state.checkins.map((item) =>
          item.personId === action.personId
            ? {
                ...item,
                yesterday: action.yesterday,
                today: action.today,
                blockers: action.blockers,
                status: action.blockers.trim() ? "blocked" : "on_track",
              }
            : item
        ),
      };
    default:
      return state;
  }
};

export const boardReducer = (
  state: BoardState = load(),
  action: BoardAction | { type: string }
): BoardState => {
  const next = nextState(state, action);
  if (next !== state) persist(next);
  return next;
};
