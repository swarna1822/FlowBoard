import { Box, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import FlowBoardLogo from "../AuthFlow/Components/Logo";
import { SIDE_BAR_ITEMS } from "./constants";
import SideBarItems from "./components/SideBarItems";
import type { RootState } from "../../Redux/store";
import { setProject } from "../../Redux/actions";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../Utils/Routing";

const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const board = useSelector((state: RootState) => state.board);
  const project = board.projects[board.currentProject];

  const items = SIDE_BAR_ITEMS;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: "10px",
        height: "100%",
        borderRight: "1px solid #e2e8f0",
        bgcolor: "#fff",
      }}
    >
      <Box>
        <FlowBoardLogo />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 0.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: project?.color ?? "#6e5dc6",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            flex: "none",
          }}
        >
          {project?.name?.[0] ?? "F"}
        </Box>
        <Select
          size="small"
          fullWidth
          value={board.currentProject}
          onChange={(event) => {
            dispatch(setProject(event.target.value));
            navigate(RouteNames.board);
          }}
          sx={{ fontWeight: 700, "& fieldset": { border: "none" } }}
        >
          {Object.values(board.projects).map((item) => (
            <MenuItem key={item.key} value={item.key}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        {items.map((item) => (
          <SideBarItems key={item.id} item={item} />
        ))}
      </Box>
    </Box>
  );
};

export default SideBar;
