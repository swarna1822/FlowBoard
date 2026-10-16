import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import { RouteNames } from "../../Utils/Routing";

export const SIDE_BAR_ITEMS = [
  {
    id: "1",
    label: "Projects",
    key: "projects",
    link: RouteNames.projects,
    icon: FolderOutlinedIcon,
  },
  {
    id: "2",
    label: "Board",
    key: "board",
    link: RouteNames.board,
    icon: ViewKanbanOutlinedIcon,
  },
  {
    id: "3",
    label: "Backlog",
    key: "back_log",
    link: RouteNames.backlog,
    icon: Inventory2OutlinedIcon,
  },
  {
    id: "4",
    label: "Daily check in",
    key: "daily_check_in",
    link: RouteNames.checkIn,
    icon: TodayOutlinedIcon,
  },
  {
    id: "5",
    label: "Reports",
    key: "reports",
    link: RouteNames.reports,
    icon: BarChartOutlinedIcon,
    adminOnly: true,
  },
  {
    id: "6",
    label: "Settings",
    key: "settings",
    link: RouteNames.settings,
    icon: SettingsOutlinedIcon,
  },
];
