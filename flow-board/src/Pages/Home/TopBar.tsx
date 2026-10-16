import { useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import NotificationsNoneOutlined from "@mui/icons-material/NotificationsNoneOutlined";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import { closeIssue, logout, openIssue, setCreateIssue } from "../../Redux/actions";
import { canEdit } from "../../Redux/selectors";
import { issueKey } from "../../data/seed";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../Utils/Routing";

const kindColor: Record<string, string> = {
  blocked: "#c9372c",
  overdue: "#e56910",
  mention: "#0c66e4",
};

const TopBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const board = useSelector((state: RootState) => state.board);
  const editable = useSelector(canEdit);
  const [search, setSearch] = useState("");
  const [notifEl, setNotifEl] = useState<HTMLElement | null>(null);
  const [userEl, setUserEl] = useState<HTMLElement | null>(null);

  const hits = search.trim()
    ? board.issues
        .filter(
          (issue) =>
            issue.summary.toLowerCase().includes(search.toLowerCase()) ||
            issueKey(issue).toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const onLogout = () => {
    localStorage.removeItem("is_loggedIn");
    dispatch(logout());
    navigate(RouteNames.login);
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
      <TextField
        size="small"
        placeholder="Search issues"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        sx={{ width: 240 }}
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

      {hits.length > 0 && (
        <Paper
          sx={{
            position: "absolute",
            left: 16,
            top: 52,
            width: 360,
            zIndex: 8,
            p: 0.5,
          }}
        >
          {hits.map((issue) => (
            <MenuItem
              key={issueKey(issue)}
              onClick={() => {
                setSearch("");
                dispatch(openIssue(issue.number));
              }}
            >
              <Typography variant="body2">
                {issueKey(issue)} · {issue.summary}
              </Typography>
            </MenuItem>
          ))}
        </Paper>
      )}

      <Menu anchorEl={notifEl} open={Boolean(notifEl)} onClose={() => setNotifEl(null)}>
        {board.notifications.map((item) => (
          <MenuItem key={item.id} onClick={() => setNotifEl(null)}>
            <Box>
              <Typography variant="body2" fontWeight={700} sx={{ color: kindColor[item.kind] }}>
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
