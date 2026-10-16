import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import FlowBoardLogo from "./Logo";
import { RouteNames } from "../../../Utils/Routing";
import { useDispatch } from "react-redux";
import { login } from "../../../Redux/actions";
import { userFromAuth } from "../../../Utils/userFromAuth";
import type { GlobalRole } from "../../../types";

type SignupForm = {
  name: string;
  email: string;
  company: string;
  password: string;
  role: GlobalRole;
  terms: boolean;
};

const strength = (value: string) => {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^\w]/.test(value)) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  return score;
};

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [terms, setTerms] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    defaultValues: {
      name: "",
      email: "",
      company: "",
      password: "",
      role: "Employee",
    },
  });

  const password = watch("password");
  const score = useMemo(() => strength(password || ""), [password]);
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];

  const onSubmit = (data: SignupForm) => {
    if (!terms) return;
    localStorage.setItem("is_loggedIn", "true");
    dispatch(login(userFromAuth(data.email, data.name, data.role)));
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
          maxWidth: 360,
          p: { xs: 3, sm: 5 },
          border: "1px solid #e2e8f0",
          borderRadius: 4,
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.07)",
        }}
      >
        <Box sx={{ mb: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <FlowBoardLogo />
          <Typography variant="body2" color="text.secondary">
            Sign up to start tracking work
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Full name"
            placeholder="Asha Kumar"
            fullWidth
            size="small"
            sx={{ mb: 1.5 }}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            {...register("name", { required: "Enter your full name." })}
          />
          <TextField
            label="Work email"
            placeholder="you@company.com"
            fullWidth
            size="small"
            sx={{ mb: 1.5 }}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register("email", {
              required: "Enter a valid work email.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid work email.",
              },
            })}
          />
          <TextField
            label="Company / team name"
            placeholder="Acme Inc"
            fullWidth
            size="small"
            sx={{ mb: 1.5 }}
            {...register("company")}
          />
          <TextField
            label="Password"
            type="password"
            placeholder="Min 8 characters"
            fullWidth
            size="small"
            sx={{ mb: 0.5 }}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            {...register("password", {
              required: "Password must be at least 8 characters.",
              minLength: { value: 8, message: "Password must be at least 8 characters." },
            })}
          />
          <LinearProgress
            variant="determinate"
            value={password ? score * 25 : 0}
            sx={{ mb: 0.5, height: 4, borderRadius: 1 }}
            color={score < 2 ? "error" : score < 3 ? "warning" : "success"}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
            {password ? labels[score] : "Use 8+ characters with numbers and symbols"}
          </Typography>
          <TextField
            select
            label="I am joining as"
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            defaultValue="Employee"
            {...register("role")}
          >
            <MenuItem value="Employee">Employee</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
          <FormControlLabel
            control={<Checkbox checked={terms} onChange={(event) => setTerms(event.target.checked)} />}
            label={
              <Typography variant="body2" color="text.secondary">
                I agree to the Terms and Privacy Policy
              </Typography>
            }
          />
          {!terms && (
            <Typography variant="caption" color="error" sx={{ display: "block", mb: 1 }}>
              Please accept the Terms to continue.
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="small"
            disabled={isSubmitting || !terms}
            endIcon={<ArrowForwardRounded />}
            sx={{
              py: 0.5,
              borderRadius: 2,
              fontWeight: 700,
              background: "linear-gradient(135deg, #6366f1, #7c3aed)",
              boxShadow: "none",
            }}
          >
            Create account
          </Button>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link component={RouterLink} to={RouteNames.login} sx={{ color: "#6366f1", fontWeight: 700 }}>
              Log in
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Signup;
