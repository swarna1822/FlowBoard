import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import { createIssue, setCreateIssue } from "../../Redux/actions";
import { PEOPLE } from "../../data/seed";
import type { IssueType, Priority } from "../../types";

const CreateIssueDialog = () => {
  const dispatch = useDispatch();
  const board = useSelector((state: RootState) => state.board);
  const project = board.projects[board.currentProject];
  const [type, setType] = useState<IssueType>("S");
  const [summary, setSummary] = useState("");
  const [assigneeId, setAssigneeId] = useState("AK");
  const [priority, setPriority] = useState<Priority>(1);

  const close = () => {
    dispatch(setCreateIssue(false));
    setSummary("");
  };

  const submit = () => {
    if (!summary.trim()) return;
    dispatch(
      createIssue({
        projectKey: board.currentProject,
        summary: summary.trim(),
        type,
        priority,
        assigneeId,
        points: 1,
        epic: "",
        dueOffsetDays: 7,
        description:
          "As a user, I want this to work end to end so the team can track it.",
        comments: [],
      })
    );
    setSummary("");
  };

  return (
    <Dialog open={board.createIssueOpen} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>Create issue</DialogTitle>
      <DialogContent>
        <TextField
          label="Project"
          value={`${project?.name} (${board.currentProject})`}
          fullWidth
          disabled
          margin="dense"
        />
        <TextField
          select
          label="Issue type"
          value={type}
          onChange={(event) => setType(event.target.value as IssueType)}
          fullWidth
          margin="dense"
        >
          <MenuItem value="S">Story</MenuItem>
          <MenuItem value="T">Task</MenuItem>
          <MenuItem value="B">Bug</MenuItem>
        </TextField>
        <TextField
          label="Summary"
          placeholder="What needs to be done?"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          select
          label="Assignee"
          value={assigneeId}
          onChange={(event) => setAssigneeId(event.target.value)}
          fullWidth
          margin="dense"
        >
          {Object.values(PEOPLE).map((person) => (
            <MenuItem key={person.id} value={person.id}>
              {person.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Priority"
          value={priority}
          onChange={(event) => setPriority(Number(event.target.value) as Priority)}
          fullWidth
          margin="dense"
        >
          <MenuItem value={0}>High</MenuItem>
          <MenuItem value={1}>Medium</MenuItem>
          <MenuItem value={2}>Low</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={!summary.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateIssueDialog;
