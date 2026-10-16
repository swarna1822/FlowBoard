import type { AuthUser, BoardFilters, Issue, Project, ProjectRole } from "../types";
import type { BoardState } from "./boardReducer";

export const login = (payload: AuthUser) => ({ type: "LOGIN" as const, payload });

export const logout = () => ({ type: "LOGOUT" as const });

export const setProject = (key: string) => ({ type: "SET_PROJECT" as const, key });

export const createProject = (project: Project, columns: string[]) => ({
  type: "CREATE_PROJECT" as const,
  project,
  columns,
});

export const updateProject = (key: string, name: string, lead: string) => ({
  type: "UPDATE_PROJECT" as const,
  key,
  name,
  lead,
});

export const addColumn = () => ({ type: "ADD_COLUMN" as const });

export const deleteColumn = (index: number) => ({
  type: "DELETE_COLUMN" as const,
  index,
});

export const renameColumn = (index: number, name: string) => ({
  type: "RENAME_COLUMN" as const,
  index,
  name,
});

export const createIssue = (issue: Omit<Issue, "number" | "columnIndex">) => ({
  type: "CREATE_ISSUE" as const,
  issue,
});

export const moveIssue = (number: number, columnIndex: number) => ({
  type: "MOVE_ISSUE" as const,
  number,
  columnIndex,
});

export const updateIssue = (number: number, patch: Partial<Issue>) => ({
  type: "UPDATE_ISSUE" as const,
  number,
  patch,
});

export const addComment = (number: number, authorId: string, text: string) => ({
  type: "ADD_COMMENT" as const,
  number,
  authorId,
  text,
});

export const setMemberRole = (personId: string, role: ProjectRole) => ({
  type: "SET_MEMBER_ROLE" as const,
  personId,
  role,
});

export const addMember = (personId: string) => ({
  type: "ADD_MEMBER" as const,
  personId,
});

export const removeMember = (personId: string) => ({
  type: "REMOVE_MEMBER" as const,
  personId,
});

export const setFilters = (filters: Partial<BoardFilters>) => ({
  type: "SET_FILTERS" as const,
  filters,
});

export const clearFilters = () => ({ type: "CLEAR_FILTERS" as const });

export const toggleAssigneeFilter = (personId: string) => ({
  type: "TOGGLE_ASSIGNEE_FILTER" as const,
  personId,
});

export const openIssue = (number: number) => ({
  type: "OPEN_ISSUE" as const,
  number,
});

export const closeIssue = () => ({ type: "CLOSE_ISSUE" as const });

export const setCreateIssue = (open: boolean) => ({
  type: "SET_CREATE_ISSUE" as const,
  open,
});

export const setCreateProject = (open: boolean) => ({
  type: "SET_CREATE_PROJECT" as const,
  open,
});

export const setSettingsTab = (tab: BoardState["settingsTab"]) => ({
  type: "SET_SETTINGS_TAB" as const,
  tab,
});

export const submitCheckin = (
  personId: string,
  yesterday: string,
  today: string,
  blockers: string
) => ({
  type: "SUBMIT_CHECKIN" as const,
  personId,
  yesterday,
  today,
  blockers,
});
