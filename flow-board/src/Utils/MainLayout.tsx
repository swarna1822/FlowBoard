import Box from "@mui/material/Box";
import { Outlet } from "react-router";
import SideBar from "../Pages/Home/SideBar";
import TopBar from "../Pages/Home/TopBar";
import IssueModal from "../Pages/Board/IssueModal";
import CreateIssueDialog from "../Pages/Board/CreateIssueDialog";
import CreateProjectDialog from "../Pages/Projects/CreateProjectDialog";

const MainLayout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f7f8f9" }}>
      <Box sx={{ width: 230, flex: "none" }}>
        <SideBar />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <TopBar />
        <Box component="main" sx={{ p: 2.5, flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
      <IssueModal />
      <CreateIssueDialog />
      <CreateProjectDialog />
    </Box>
  );
};

export default MainLayout;
