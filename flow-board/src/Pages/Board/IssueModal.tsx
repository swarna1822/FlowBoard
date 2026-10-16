import { useState, type ReactNode } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import { addComment, closeIssue, moveIssue } from "../../Redux/actions";
import { canEdit, currentColumns } from "../../Redux/selectors";
import { ISSUE_TYPES, PEOPLE, PRIORITIES, issueKey } from "../../data/seed";
import IssueTypeMark from "../../components/IssueTypeMark";
import PersonAvatar from "../../components/PersonAvatar";

const IssueModal = () => {
  const dispatch = useDispatch();
  const board = useSelector((state: RootState) => state.board);
  const columns = useSelector(currentColumns);
  const editable = useSelector(canEdit);
  const user = useSelector((state: RootState) => state.auth.user);
  const issue = board.issues.find((item) => item.number === board.selectedIssue);
  const [text, setText] = useState("");

  if (!issue) return null;

  const person = PEOPLE[issue.assigneeId];
  const priority = PRIORITIES[issue.priority];

  return (
    <Dialog
      open
      onClose={() => dispatch(closeIssue())}
      maxWidth="md"
      fullWidth
    >
      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <IssueTypeMark type={issue.type} />
          <Typography color="text.secondary">{issueKey(issue)}</Typography>
          <Box sx={{ flex: 1 }} />
          <Button onClick={() => dispatch(closeIssue())}>✕</Button>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 250px" },
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {issue.summary}
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>Description</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {issue.description}
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>Attachments</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              📎 wireframe-v2.png · 📎 api-spec.pdf
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>Comments</Typography>
            {issue.comments.map((comment, index) => (
              <Box key={index} sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                <PersonAvatar personId={comment.authorId} />
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>
                    {PEOPLE[comment.authorId]?.name}{" "}
                    <Typography component="span" color="text.secondary" sx={{ fontWeight: 400 }}>
                      {comment.when}
                    </Typography>
                  </Typography>
                  <Typography>{comment.text}</Typography>
                </Box>
              </Box>
            ))}
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <PersonAvatar personId={user?.personId ?? "AK"} />
              <TextField
                fullWidth
                multiline
                minRows={2}
                placeholder="Add a comment…"
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && text.trim()) {
                    event.preventDefault();
                    dispatch(addComment(issue.number, user?.personId ?? "AK", text.trim()));
                    setText("");
                  }
                }}
              />
            </Box>
          </Box>
          <Box>
            <TextField
              select
              fullWidth
              value={issue.columnIndex}
              disabled={!editable}
              onChange={(event) =>
                dispatch(moveIssue(issue.number, Number(event.target.value)))
              }
              sx={{ mb: 2, fontWeight: 700 }}
            >
              {columns.map((column, index) => (
                <MenuItem key={column} value={index}>
                  {column}
                </MenuItem>
              ))}
            </TextField>
            <Box sx={{ border: "1px solid #dcdfe4", borderRadius: 1, p: 1.5 }}>
              <Typography sx={{ mb: 1, fontWeight: 700 }}>
                Details
              </Typography>
              <Detail label="Assignee">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonAvatar personId={issue.assigneeId} size={22} />
                  {person?.name}
                </Box>
              </Detail>
              <Detail label="Reporter">Asha</Detail>
              <Detail label="Priority">
                <Box component="span" sx={{ color: priority.color, fontWeight: 700 }}>
                  {priority.mark} {priority.label}
                </Box>
              </Detail>
              <Detail label="Epic">{issue.epic || "None"}</Detail>
              <Detail label="Story points">{issue.points}</Detail>
              <Detail label="Time tracking">6h 30m / 10h</Detail>
              <Detail label="Due">
                {issue.dueOffsetDays < 0
                  ? `${Math.abs(issue.dueOffsetDays)}d overdue`
                  : `in ${issue.dueOffsetDays}d`}
              </Detail>
              <Detail label="Type">{ISSUE_TYPES[issue.type].label}</Detail>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const Detail = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.75, gap: 1 }}>
    <Typography color="text.secondary" variant="body2">
      {label}
    </Typography>
    <Typography variant="body2">{children}</Typography>
  </Box>
);

export default IssueModal;
