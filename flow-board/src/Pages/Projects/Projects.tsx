import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../Redux/store";
import { setCreateProject, setProject } from "../../Redux/actions";
import { RouteNames } from "../../Utils/Routing";
import { isOverdue } from "../../data/seed";

const Projects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const board = useSelector((state: RootState) => state.board);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Projects
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 1.5,
        }}
      >
        {Object.values(board.projects).map((project) => {
          const cols = board.columns[project.key] ?? [];
          const tasks = board.issues.filter((issue) => issue.projectKey === project.key);
          const done = tasks.filter((issue) => issue.columnIndex === cols.length - 1).length;
          const overdue = tasks.filter((issue) => isOverdue(issue, cols.length - 1)).length;
          const open = () => {
            dispatch(setProject(project.key));
            navigate(RouteNames.board);
          };
          return (
            <Box
              key={project.key}
              onClick={open}
              sx={{
                border: "1px solid #dcdfe4",
                borderRadius: 1.5,
                p: 2,
                bgcolor: "#fff",
                cursor: "pointer",
                "&:hover": { bgcolor: "#f8fafc" },
              }}
            >
              <Box sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    bgcolor: project.color,
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 700,
                  }}
                >
                  {project.name[0]}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{project.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Key: {project.key} · Lead: {project.lead}
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={tasks.length ? (done / tasks.length) * 100 : 0}
                sx={{ my: 1.5, height: 6, borderRadius: 8 }}
                color="success"
              />
              <Typography variant="body2" color="text.secondary">
                {done}/{tasks.length} done · {overdue} overdue
              </Typography>
              <Button variant="contained" sx={{ mt: 1.5 }} onClick={open}>
                Open board
              </Button>
            </Box>
          );
        })}
        <Box
          onClick={() => dispatch(setCreateProject(true))}
          sx={{
            border: "1px dashed #dcdfe4",
            borderRadius: 1.5,
            p: 2,
            minHeight: 150,
            display: "grid",
            placeItems: "center",
            color: "text.secondary",
            cursor: "pointer",
            bgcolor: "#fff",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>+ Create project</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Projects;
