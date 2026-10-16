import {
  Box,
  Button,
  Chip,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import {
  canEdit,
  currentColumns,
  filteredIssues,
  projectRole,
} from "../../Redux/selectors";
import {
  clearFilters,
  moveIssue,
  openIssue,
  setFilters,
  toggleAssigneeFilter,
} from "../../Redux/actions";
import { PEOPLE, PRIORITIES, isOverdue, issueKey } from "../../data/seed";
import PersonAvatar from "../../components/PersonAvatar";
import IssueTypeMark from "../../components/IssueTypeMark";
import type { Issue } from "../../types";

const Board = () => {
  const dispatch = useDispatch();
  const board = useSelector((state: RootState) => state.board);
  const columns = useSelector(currentColumns);
  const issues = useSelector(filteredIssues);
  const editable = useSelector(canEdit);
  const role = useSelector(projectRole);
  const project = board.projects[board.currentProject];
  const epics = [
    ...new Set(
      board.issues
        .filter((issue) => issue.projectKey === board.currentProject && issue.epic)
        .map((issue) => issue.epic)
    ),
  ];

  return (
    <Box>
      <Typography color="text.secondary" variant="caption">
        Projects / {project?.name}
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {project?.name} · Sprint 14{" "}
        <Chip size="small" label={`Your role: ${role}`} color="primary" variant="outlined" />
      </Typography>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search board"
          value={board.filters.query}
          onChange={(event) => dispatch(setFilters({ query: event.target.value }))}
        />
        <Box sx={{ display: "flex" }}>
          {Object.keys(PEOPLE).map((id) => (
            <Box key={id} sx={{ ml: "-4px" }}>
              <PersonAvatar
                personId={id}
                selected={board.filters.assigneeId === id}
                onClick={() => dispatch(toggleAssigneeFilter(id))}
              />
            </Box>
          ))}
        </Box>
        <TextField
          select
          size="small"
          value={board.filters.epic}
          onChange={(event) => dispatch(setFilters({ epic: event.target.value }))}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">Epic</MenuItem>
          {epics.map((epic) => (
            <MenuItem key={epic} value={epic}>
              {epic}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          value={board.filters.due}
          onChange={(event) =>
            dispatch(setFilters({ due: event.target.value as "" | "o" | "w" }))
          }
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">Due date</MenuItem>
          <MenuItem value="o">Overdue</MenuItem>
          <MenuItem value="w">Due this week</MenuItem>
        </TextField>
        <Button onClick={() => dispatch(clearFilters())}>Clear</Button>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns.length}, minmax(240px, 1fr))`,
          gap: 1.25,
          overflowX: "auto",
        }}
      >
        {columns.map((column, index) => {
          const colIssues = issues.filter((issue) => issue.columnIndex === index);
          return (
            <Box
              key={column + index}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                const number = Number(sessionStorage.getItem("dragIssue") ?? "");
                if (editable && number) dispatch(moveIssue(number, index));
              }}
              sx={{ bgcolor: "#f1f2f4", borderRadius: 1.5, p: 1, minHeight: 140 }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", px: 1, fontWeight: 700 }}
              >
                {column} {colIssues.length}
              </Typography>
              {colIssues.map((issue) => (
                <IssueCard
                  key={issueKey(issue)}
                  issue={issue}
                  doneIndex={columns.length - 1}
                  draggable={editable}
                  onOpen={() => dispatch(openIssue(issue.number))}
                />
              ))}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

const IssueCard = ({
  issue,
  doneIndex,
  draggable,
  onOpen,
}: {
  issue: Issue;
  doneIndex: number;
  draggable: boolean;
  onOpen: () => void;
}) => {
  const priority = PRIORITIES[issue.priority];
  return (
    <Box
      draggable={draggable}
      onDragStart={() => sessionStorage.setItem("dragIssue", String(issue.number))}
      onClick={onOpen}
      sx={{
        bgcolor: "#fff",
        borderRadius: 1,
        p: 1.25,
        my: 0.75,
        boxShadow: "0 1px 1px #091e4240",
        cursor: "pointer",
        "&:hover": { bgcolor: "#f8fafc" },
      }}
    >
      {issue.epic && (
        <Chip
          size="small"
          label={issue.epic}
          sx={{ mb: 0.75, bgcolor: "#9f8fef33", color: "#6e5dc6", fontWeight: 700, height: 20 }}
        />
      )}
      <Typography sx={{ mb: 1 }}>{issue.summary}</Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 12, color: "text.secondary" }}>
        <IssueTypeMark type={issue.type} />
        <span>{issueKey(issue)}</span>
        {isOverdue(issue, doneIndex) && (
          <Chip size="small" label="Overdue" sx={{ bgcolor: "#f8714333", color: "#c9372c", height: 20 }} />
        )}
        <Box sx={{ flex: 1 }} />
        <Box sx={{ bgcolor: "#dcdfe4", borderRadius: 8, px: 0.75, fontSize: 11 }}>{issue.points}</Box>
        <Box component="b" sx={{ color: priority.color }} title={priority.label}>
          {priority.mark}
        </Box>
        <PersonAvatar personId={issue.assigneeId} size={22} />
      </Box>
    </Box>
  );
};

export default Board;
