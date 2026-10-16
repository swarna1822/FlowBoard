import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { currentColumns, currentIssues } from "../../Redux/selectors";
import { WEEKLY_COMPLETED, isOverdue, issueKey } from "../../data/seed";
import { openIssue } from "../../Redux/actions";

const Reports = () => {
  const dispatch = useDispatch();
  const columns = useSelector(currentColumns);
  const issues = useSelector(currentIssues);
  const overdue = issues.filter((issue) => isOverdue(issue, columns.length - 1));

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Reports
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 1.5,
        }}
      >
        <Box sx={{ border: "1px solid #dcdfe4", borderRadius: 1.5, p: 2, bgcolor: "#fff" }}>
          <Typography sx={{ mb: 1, fontWeight: 700 }}>
            Issues completed per week
          </Typography>
          <svg viewBox="0 0 300 150" width="100%">
            {WEEKLY_COMPLETED.map((value, index) => (
              <g key={index}>
                <rect
                  x={index * 48 + 14}
                  y={130 - value * 8}
                  width={30}
                  height={value * 8}
                  rx={3}
                  fill="#6366f1"
                />
                <text x={index * 48 + 29} y={145} textAnchor="middle" fontSize="10" fill="#626f86">
                  W{index + 1}
                </text>
                <text
                  x={index * 48 + 29}
                  y={125 - value * 8}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#172b4d"
                >
                  {value}
                </text>
              </g>
            ))}
          </svg>
        </Box>
        <Box sx={{ border: "1px solid #dcdfe4", borderRadius: 1.5, bgcolor: "#fff" }}>
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>Overdue issues</Typography>
          </Box>
          {overdue.length === 0 && (
            <Box sx={{ px: 2, py: 1.5, color: "text.secondary" }}>No overdue issues</Box>
          )}
          {overdue.map((issue) => (
            <Box
              key={issueKey(issue)}
              onClick={() => dispatch(openIssue(issue.number))}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                px: 2,
                py: 1.1,
                borderTop: "1px solid #dcdfe4",
                cursor: "pointer",
                "&:hover": { bgcolor: "#f8fafc" },
              }}
            >
              <Typography sx={{ fontWeight: 500 }}>
                {issueKey(issue)} {issue.summary}
              </Typography>
              <Box
                sx={{
                  bgcolor: "#f8714333",
                  color: "#c9372c",
                  fontWeight: 700,
                  fontSize: 11,
                  px: 0.75,
                  borderRadius: 0.5,
                }}
              >
                {-issue.dueOffsetDays} day(s)
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Reports;
