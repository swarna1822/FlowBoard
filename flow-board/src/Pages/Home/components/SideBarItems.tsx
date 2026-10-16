import type { SvgIconComponent } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

interface SideBarItem {
  id: string;
  label: string;
  key: string;
  link: string;
  icon: SvgIconComponent;
}

interface Props {
  item: SideBarItem;
}

const SideBarItems = ({ item }: Props) => {
  const Icon = item.icon;

  return (
    <NavLink to={item.link} style={{ textDecoration: "none", color: "inherit" }}>
      {({ isActive }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            cursor: "pointer",
            bgcolor: isActive ? "#EEF2FF" : "transparent",
            color: isActive ? "#6366F1" : "text.primary",
            fontWeight: isActive ? 600 : 500,
            "&:hover": {
              bgcolor: "#EEF2FF",
              color: "#6366F1",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Icon fontSize="small" />
          </Box>
          <Typography variant="body2" fontWeight={isActive ? 700 : 500}>
            {item.label}
          </Typography>
        </Box>
      )}
    </NavLink>
  );
};

export default SideBarItems;
