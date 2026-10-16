import { isOverdue } from "../data/seed";
import type { ProjectRole } from "../types";
import type { RootState } from "./store";

export const currentColumns = (state: RootState) =>
  state.board.columns[state.board.currentProject] ?? [];

export const projectRole = (state: RootState): ProjectRole | "No access" => {
  const personId = state.auth.user?.personId ?? "AK";
  const role = state.board.members[state.board.currentProject]?.[personId];
  return role ?? "No access";
};

export const canManage = (state: RootState) => {
  const role = state.auth.user?.role;
  const mine = projectRole(state);
  return role === "Admin" || mine === "Admin" || mine === "Manager";
};

export const canEdit = (state: RootState) => {
  const mine = projectRole(state);
  return mine !== "Viewer" && mine !== "No access";
};

export const currentIssues = (state: RootState) =>
  state.board.issues.filter((issue) => issue.projectKey === state.board.currentProject);

export const filteredIssues = (state: RootState) => {
  const { query, epic, due, assigneeId } = state.board.filters;
  const cols = currentColumns(state);
  const q = query.toLowerCase();
  return currentIssues(state).filter((issue) => {
    if (assigneeId && issue.assigneeId !== assigneeId) return false;
    if (epic && issue.epic !== epic) return false;
    if (q && !issue.summary.toLowerCase().includes(q) && !`${issue.projectKey}-${issue.number}`.toLowerCase().includes(q))
      return false;
    if (due === "o" && !isOverdue(issue, cols.length - 1)) return false;
    if (due === "w" && !(issue.dueOffsetDays >= 0 && issue.dueOffsetDays <= 7)) return false;
    return true;
  });
};
