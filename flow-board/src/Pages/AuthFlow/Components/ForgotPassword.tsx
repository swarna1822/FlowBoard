import { Box, Button, Card, Link, TextField, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FlowBoardLogo from "./Logo";
import { RouteNames } from "../../../Utils/Routing";
import { useState } from "react";

const ForgotPassword = () => {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top left, #e5e7ee 0%, #cfd9e2 45%, #f5f3ff 100%)",
      }}
    >
      <Card
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: 300,
          p: { xs: 3, sm: 5 },
          border: "1px solid #e2e8f0",
          borderRadius: 4,
        }}
      >
        <Box sx={{ mb: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <FlowBoardLogo />
          <Typography variant="body2" color="text.secondary">
            Reset your password
          </Typography>
        </Box>
        {sent ? (
          <Typography variant="body2">
            If an account exists for {email}, a reset link is on its way.
          </Typography>
        ) : (
          <>
            <TextField
              label="Work email"
              size="small"
              fullWidth
              sx={{ mb: 2 }}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={() => email && setSent(true)}
              sx={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", boxShadow: "none" }}
            >
              Send reset link
            </Button>
          </>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          <Link component={RouterLink} to={RouteNames.login} sx={{ color: "#6366f1" }}>
            Back to login
          </Link>
        </Typography>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
