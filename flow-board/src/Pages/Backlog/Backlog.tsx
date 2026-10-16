import { Box, Chip, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import { currentColumns, currentIssues } from "../../Redux/selectors";
import { openIssue } from "../../Redux/actions";
import { PRIORITIES, issueKey } from "../../data/seed";
import IssueTypeMark from "../../components/IssueTypeMark";
import PersonAvatar from "../../components/PersonAvatar";

const Backlog = () => {
  const dispatch = useDispatch();
  const board = useSelector((state: RootState) => state.board);
  const columns = useSelector(currentColumns);
  const issues = useSelector(currentIssues);
  const project = board.projects[board.currentProject];

  return (
    <Box>
      <Typography color="text.secondary" variant="caption">
        Projects / {project?.name}
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Backlog
      </Typography>
      <Box sx={{ border: "1px solid #dcdfe4", borderRadius: 1.5, bgcolor: "#fff" }}>
        {issues.map((issue, index) => {
          const priority = PRIORITIES[issue.priority];
          return (
            <Box
              key={issueKey(issue)}
              onClick={() => dispatch(openIssue(issue.number))}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                px: 1.5,
                py: 1.1,
                borderBottom: index === issues.length - 1 ? 0 : "1px solid #dcdfe4",
                cursor: "pointer",
                "&:hover": { bgcolor: "#f8fafc" },
              }}
            >
              <IssueTypeMark type={issue.type} />
              <Typography color="text.secondary" variant="body2">
                {issueKey(issue)}
              </Typography>
              <Typography sx={{ flex: 1, fontWeight: 500 }}>
                {issue.summary}
              </Typography>
              {issue.epic && (
                <Chip
                  size="small"
                  label={issue.epic}
                  sx={{ bgcolor: "#9f8fef33", color: "#6e5dc6", fontWeight: 700, height: 20 }}
                />
              )}
              <Chip size="small" color="primary" variant="outlined" label={columns[issue.columnIndex]} />
              <Box sx={{ bgcolor: "#dcdfe4", borderRadius: 8, px: 0.75, fontSize: 11 }}>
                {issue.points}
              </Box>
              <Box component="b" sx={{ color: priority.color }}>
                {priority.mark}
              </Box>
              <PersonAvatar personId={issue.assigneeId} size={22} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Backlog;
