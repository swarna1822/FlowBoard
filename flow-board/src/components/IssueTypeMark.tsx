import { Box } from "@mui/material";
import { ISSUE_TYPES } from "../data/seed";
import type { IssueType } from "../types";

const IssueTypeMark = ({ type }: { type: IssueType }) => {
  const meta = ISSUE_TYPES[type];
  return (
    <Box
      sx={{
        width: 16,
        height: 16,
        borderRadius: "3px",
        bgcolor: meta.color,
        color: "#fff",
        fontSize: 10,
        display: "grid",
        placeItems: "center",
        flex: "none",
      }}
    >
      {meta.mark}
    </Box>
  );
};

export default IssueTypeMark;
