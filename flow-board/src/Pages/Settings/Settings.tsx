import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import { canManage, currentColumns } from "../../Redux/selectors";
import {
  addColumn,
  addMember,
  deleteColumn,
  removeMember,
  renameColumn,
  setMemberRole,
  setSettingsTab,
  updateProject,
} from "../../Redux/actions";
import { PEOPLE } from "../../data/seed";
import PersonAvatar from "../../components/PersonAvatar";
import { useEffect, useState } from "react";
import type { ProjectRole } from "../../types";

const ROLES: ProjectRole[] = ["Admin", "Manager", "Developer", "Viewer"];

const Settings = () => {
  const dispatch = useDispatch();
  const board = useSelector((state: RootState) => state.board);
  const columns = useSelector(currentColumns);
  const manage = useSelector(canManage);
  const project = board.projects[board.currentProject];
  const members = board.members[board.currentProject] ?? {};
  const [name, setName] = useState(project?.name ?? "");
  const [lead, setLead] = useState(project?.lead ?? "Asha");
  const [newMember, setNewMember] = useState("");
  const tab = board.settingsTab;

  useEffect(() => {
    setName(project?.name ?? "");
    setLead(project?.lead ?? "Asha");
  }, [project?.name, project?.lead, board.currentProject]);

  const available = Object.keys(PEOPLE).filter((id) => !members[id]);

  return (
    <Box>
      <Typography color="text.secondary" variant="caption">
        Projects / {project?.name}
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Project settings
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        {(
          [
            ["d", "Details"],
            ["c", "Columns"],
            ["m", "Members & roles"],
          ] as const
        ).map(([key, label]) => (
          <Button
            key={key}
            variant={tab === key ? "contained" : "text"}
            onClick={() => dispatch(setSettingsTab(key))}
          >
            {label}
          </Button>
        ))}
      </Box>
      {!manage ? (
        <Box sx={{ border: "1px solid #dcdfe4", borderRadius: 1.5, p: 2, color: "text.secondary" }}>
          You need Admin or Manager access in this project to change settings.
        </Box>
      ) : tab === "d" ? (
        <Box sx={{ border: "1px solid #dcdfe4", borderRadius: 1.5, p: 2, maxWidth: 480, bgcolor: "#fff" }}>
          <TextField
            label="Project name"
            fullWidth
            margin="dense"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField label="Project key" fullWidth margin="dense" value={board.currentProject} disabled />
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
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            onClick={() =>
              dispatch(updateProject(board.currentProject, name || project.name, lead))
            }
          >
            Save changes
          </Button>
        </Box>
      ) : tab === "c" ? (
        <Box sx={{ border: "1px solid #dcdfe4", borderRadius: 1.5, p: 2, maxWidth: 480, bgcolor: "#fff" }}>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Board columns, left to right. The last column counts as Done.
          </Typography>
          {columns.map((column, index) => (
            <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={column}
                onChange={(event) => dispatch(renameColumn(index, event.target.value))}
              />
              <Button onClick={() => dispatch(deleteColumn(index))}>✕</Button>
            </Box>
          ))}
          <Button onClick={() => dispatch(addColumn())}>+ Add column</Button>
        </Box>
      ) : (
        <Box>
          <Box sx={{ border: "1px solid #dcdfe4", borderRadius: 1.5, bgcolor: "#fff" }}>
            {Object.entries(members).map(([id, role]) => (
              <Box
                key={id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  px: 1.5,
                  py: 1,
                  borderBottom: "1px solid #dcdfe4",
                }}
              >
                <PersonAvatar personId={id} />
                <Typography sx={{ flex: 1, fontWeight: 500 }}>
                  {PEOPLE[id].name}
                </Typography>
                <TextField
                  select
                  size="small"
                  value={role}
                  onChange={(event) =>
                    dispatch(setMemberRole(id, event.target.value as ProjectRole))
                  }
                  sx={{ width: 140 }}
                >
                  {ROLES.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
                <Button onClick={() => dispatch(removeMember(id))}>Remove</Button>
              </Box>
            ))}
            <Box sx={{ display: "flex", gap: 1, px: 1.5, py: 1.25 }}>
              <TextField
                select
                size="small"
                value={newMember}
                onChange={(event) => setNewMember(event.target.value)}
                sx={{ flex: 1 }}
              >
                {available.length === 0 ? (
                  <MenuItem value="">Everyone added</MenuItem>
                ) : (
                  available.map((id) => (
                    <MenuItem key={id} value={id}>
                      {PEOPLE[id].name}
                    </MenuItem>
                  ))
                )}
              </TextField>
              <Button
                variant="contained"
                onClick={() => {
                  if (!newMember) return;
                  dispatch(addMember(newMember));
                  setNewMember("");
                }}
              >
                + Add member
              </Button>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Admin: everything · Manager: settings and members · Developer: create and move issues ·
            Viewer: read only
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Settings;
