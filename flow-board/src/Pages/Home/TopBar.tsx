import { useState } from "react";
import {
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import NotificationsNoneOutlined from "@mui/icons-material/NotificationsNoneOutlined";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import {
  closeIssue,
  logout,
  openIssue,
  setCreateIssue,
  setProject,
} from "../../Redux/actions";
import { canEdit } from "../../Redux/selectors";
import { issueKey } from "../../data/seed";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../Utils/Routing";
import type { Issue } from "../../types";

const kindColor: Record<string, string> = {
  blocked: "#c9372c",
  overdue: "#e56910",
  mention: "#0c66e4",
};

const matchesQuery = (issue: Issue, query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return (
    issue.summary.toLowerCase().includes(q) ||
    issueKey(issue).toLowerCase().includes(q) ||
    issue.description.toLowerCase().includes(q)
  );
};

const TopBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const board = useSelector((state: RootState) => state.board);
  const editable = useSelector(canEdit);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifEl, setNotifEl] = useState<HTMLElement | null>(null);
  const [userEl, setUserEl] = useState<HTMLElement | null>(null);

  const onLogout = () => {
    localStorage.removeItem("is_loggedIn");
    dispatch(logout());
    navigate(RouteNames.login);
  };

  const openFoundIssue = (issue: Issue) => {
    setSearch("");
    setSearchOpen(false);
    if (issue.projectKey !== board.currentProject) {
      dispatch(setProject(issue.projectKey));
    }
    dispatch(openIssue(issue.number));
    navigate(RouteNames.board);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 1,
        borderBottom: "1px solid #e2e8f0",
        bgcolor: "#fff",
        position: "relative",
      }}
    >
      <Autocomplete
        size="small"
        sx={{ width: 280 }}
        options={board.issues}
        value={null}
        inputValue={search}
        forcePopupIcon={false}
        clearOnBlur={false}
        open={searchOpen && search.trim().length > 0}
        onOpen={() => setSearchOpen(true)}
        onClose={(_, reason) => {
          if (reason === "blur" || reason === "escape" || reason === "selectOption") {
            setSearchOpen(false);
          }
        }}
        slotProps={{
          popper: { sx: { zIndex: 20 } },
        }}
        filterOptions={(options, state) =>
          options.filter((issue) => matchesQuery(issue, state.inputValue)).slice(0, 8)
        }
        getOptionLabel={(issue) => `${issueKey(issue)} ${issue.summary}`}
        isOptionEqualToValue={(option, value) =>
          option.projectKey === value.projectKey && option.number === value.number
        }
        onInputChange={(_, value, reason) => {
          if (reason === "reset") return;
          setSearch(value);
          setSearchOpen(value.trim().length > 0);
        }}
        onChange={(_, issue) => {
          if (issue) openFoundIssue(issue);
        }}
        noOptionsText={search.trim() ? "No issues found" : "Type to search issues"}
        renderOption={(props, issue) => {
          const { key, ...optionProps } = props;
          return (
            <Box component="li" key={key} {...optionProps}>
              <Typography variant="body2">
                {issueKey(issue)} · {issue.summary}
              </Typography>
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField {...params} placeholder="Search issues" />
        )}
      />
      <Button
        variant="contained"
        disabled={!editable}
        onClick={() => dispatch(setCreateIssue(true))}
        sx={{
          background: "linear-gradient(135deg, #6366f1, #7c3aed)",
          boxShadow: "none",
        }}
      >
        + Create
      </Button>
      <Box sx={{ flex: 1 }} />
      <IconButton onClick={(event) => setNotifEl(event.currentTarget)}>
        <Badge badgeContent={board.notifications.length} color="error">
          <NotificationsNoneOutlined />
        </Badge>
      </IconButton>
      <Avatar
        sx={{ width: 30, height: 30, bgcolor: "#7c3aed", fontSize: 12, cursor: "pointer" }}
        onClick={(event) => setUserEl(event.currentTarget)}
      >
        {user?.initials ?? "AK"}
      </Avatar>

      <Menu anchorEl={notifEl} open={Boolean(notifEl)} onClose={() => setNotifEl(null)}>
        {board.notifications.map((item) => (
          <MenuItem key={item.id} onClick={() => setNotifEl(null)}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: kindColor[item.kind] }}>
                {item.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.detail} · {item.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      <Menu anchorEl={userEl} open={Boolean(userEl)} onClose={() => setUserEl(null)}>
        <MenuItem disabled>
          {user?.name} · {user?.role}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setUserEl(null);
            dispatch(closeIssue());
            onLogout();
          }}
        >
          Log out
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TopBar;
