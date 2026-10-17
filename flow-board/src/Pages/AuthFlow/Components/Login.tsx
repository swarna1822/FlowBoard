import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import FlowBoardLogo from "./Logo";
import { RouteNames } from "../../../Utils/Routing";
import { useDispatch } from "react-redux";
import { login } from "../../../Redux/actions";
import { userFromAuth } from "../../../Utils/userFromAuth";

type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Demo only. Replace this with your authentication API.
    localStorage.setItem("is_loggedIn", "true");
    dispatch(login(userFromAuth(data.email)));
    navigate(RouteNames.home);
  };

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
          maxWidth: 350,
          minHeight: 350,
          maxHeight: "500px",
          gap: 10,
          p: { xs: 3, sm: 5 },
          border: "1px solid #e2e8f0",
          borderRadius: 4,
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.07)",
        }}
      >
        {/* Brand */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FlowBoardLogo />
            <Typography variant="body2" color="text.secondary">
              Move work forward.
            </Typography>
          </Box>
        </Box>

        <Box
          component="form"
          sx={{ gap: 2 }}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Box>
            <TextField
              sx={{ marginBottom: "1.5rem" }}
              label="Email address"
              placeholder="you@example.com"
              fullWidth
              size="small"
              autoComplete="email"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
          </Box>
          <Box>
            <TextField
              label="Password"
              sx={{ marginBottom: "1.5rem" }}
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              fullWidth
              size="small"
              autoComplete="current-password"
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() => setShowPassword((previous) => !previous)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={<Checkbox />}
              label={
                <Typography variant="body2" color="text.secondary">
                  Remember me
                </Typography>
              }
              sx={{ alignSelf: "flex-start", mt: 1 }}
            />
            <Typography variant="body2">
              <Link
                component={RouterLink}
                to={RouteNames.forgot}
                underline="hover"
                sx={{ color: "#6366f1"}}
              >
                Forgotpassword?
              </Link>
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="small"
            disabled={isSubmitting}
            endIcon={<ArrowForwardRounded />}
            sx={{
              py: 0.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              fontSize: 15,
              background: "linear-gradient(135deg, #6366f1, #7c3aed)",
              boxShadow: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #4f46e5, #6d28d9)",
                boxShadow: "0 6px 18px rgba(99, 102, 241, 0.25)",
              },
            }}
          >
            Login
          </Button>

          <Box sx={{ marginTop: "2rem" }}>
            <Typography variant="body2">
              New to flowboard?{" "}
              <Link
                component={RouterLink}
                to={RouteNames.signup}
                underline="hover"
                sx={{ color: "#6366f1", fontWeight: 700 }}
              >
                Create account
              </Link>
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;
