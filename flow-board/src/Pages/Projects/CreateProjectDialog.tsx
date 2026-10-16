import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import { createProject, setCreateProject } from "../../Redux/actions";
import { PEOPLE } from "../../data/seed";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../Utils/Routing";

const COLORS = ["#0c66e4", "#c9372c", "#8270db", "#22a06b"];

const CreateProjectDialog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const board = useSelector((state: RootState) => state.board);
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [template, setTemplate] = useState("scrum");
  const [lead, setLead] = useState("Asha");
  const [error, setError] = useState("");

  const close = () => {
    dispatch(setCreateProject(false));
    setError("");
  };

  const submit = () => {
    const trimmed = name.trim();
    const projectKey = key.trim().toUpperCase();
    if (!trimmed || !projectKey) {
      setError("Enter a name and a key.");
      return;
    }
    if (board.projects[projectKey]) {
      setError("That key is already used.");
      return;
    }
    dispatch(
      createProject(
        {
          key: projectKey,
          name: trimmed,
          color: COLORS[Object.keys(board.projects).length % COLORS.length],
          lead,
        },
        template === "scrum"
          ? ["To Do", "In Progress", "In Review", "Done"]
          : ["To Do", "In Progress", "Done"]
      )
    );
    navigate(RouteNames.board);
  };

  return (
    <Dialog open={board.createProjectOpen} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>Create project</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          placeholder="e.g. Customer Portal"
          fullWidth
          margin="dense"
          value={name}
          onChange={(event) => {
            const next = event.target.value;
            setName(next);
            setKey(
              next
                .replace(/[^a-zA-Z ]/g, "")
                .split(" ")
                .filter(Boolean)
                .map((word) => word[0])
                .join("")
                .toUpperCase()
                .slice(0, 4)
            );
          }}
        />
        <TextField
          label="Key"
          placeholder="CP"
          fullWidth
          margin="dense"
          slotProps={{ htmlInput: { maxLength: 4 } }}
          value={key}
          onChange={(event) => setKey(event.target.value.toUpperCase())}
        />
        <TextField
          select
          label="Template"
          fullWidth
          margin="dense"
          value={template}
          onChange={(event) => setTemplate(event.target.value)}
        >
          <MenuItem value="kanban">Kanban (To Do, In Progress, Done)</MenuItem>
          <MenuItem value="scrum">Scrum (To Do, In Progress, In Review, Done)</MenuItem>
        </TextField>
        <TextField
          select
          label="Project lead"
          fullWidth
          margin="dense"
          value={lead}
          onChange={(event) => setLead(event.target.value)}
        >
          {Object.values(PEOPLE).map((person) => (
            <MenuItem key={person.id} value={person.name}>
              {person.name}
            </MenuItem>
          ))}
        </TextField>
        {error && (
          <Typography color="error" variant="caption">
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button variant="contained" onClick={submit}>
          Create project
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectDialog;
