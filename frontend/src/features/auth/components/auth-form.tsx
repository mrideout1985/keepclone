import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  ArrowLeft,
  CircleNotch,
  EnvelopeSimple,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useForgotPassword, useLogin, useRegister } from "@/lib/auth";

export type AuthMode = "login" | "register" | "forgot";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

function makeSchema(mode: AuthMode) {
  return z
    .object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
      confirm: z.string(),
    })
    .superRefine((v, ctx) => {
      if (mode === "register" && !v.name.trim()) {
        ctx.addIssue({
          path: ["name"],
          code: "custom",
          message: "Enter your name",
        });
      }
      if (!EMAIL.test(v.email.trim())) {
        ctx.addIssue({
          path: ["email"],
          code: "custom",
          message: v.email ? "Enter a valid email address" : "Enter your email",
        });
      }
      if (mode !== "forgot") {
        if (!v.password) {
          ctx.addIssue({
            path: ["password"],
            code: "custom",
            message: "Enter your password",
          });
        } else if (mode === "register" && v.password.length < 8) {
          ctx.addIssue({
            path: ["password"],
            code: "custom",
            message: "Use 8 or more characters",
          });
        }
      }
      if (mode === "register" && v.password && v.confirm !== v.password) {
        ctx.addIssue({
          path: ["confirm"],
          code: "custom",
          message: "Passwords don’t match",
        });
      }
    });
}

const HEADINGS: Record<AuthMode, { title: string; subtitle: string }> = {
  login: { title: "Welcome back", subtitle: "Sign in to see your notes." },
  register: {
    title: "Create your account",
    subtitle: "Free, and your notes follow you everywhere.",
  },
  forgot: {
    title: "Reset your password",
    subtitle: "We’ll email you a link to choose a new one.",
  },
};

type AuthFormProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
};

export function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const [showPw, setShowPw] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const resolver = useMemo(() => zodResolver(makeSchema(mode)), [mode]);

  const login = useLogin();
  const register = useRegister();
  const forgot = useForgotPassword();
  const busy = login.isPending || register.isPending || forgot.isPending;

  const {
    handleSubmit,
    register: field,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    resolver,
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const email = values.email.trim();
    try {
      if (mode === "login") {
        await login.mutateAsync({ email, password: values.password });
      } else if (mode === "register") {
        await register.mutateAsync({
          name: values.name.trim(),
          email,
          password: values.password,
        });
      } else {
        await forgot.mutateAsync(email);
        setSentTo(email);
      }
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  });

  const heading = HEADINGS[mode];

  if (mode === "forgot" && sentTo) {
    return (
      <Stack spacing={3.5} sx={{ width: "100%", maxWidth: 360 }}>
        <Heading title={heading.title} subtitle={heading.subtitle} />
        <Alert
          icon={<EnvelopeSimple size={20} />}
          severity="info"
          sx={{ alignItems: "flex-start" }}
        >
          If an account exists for <strong>{sentTo}</strong>, a reset link is on
          its way.
        </Alert>
        <Button
          variant="outlined"
          color="inherit"
          fullWidth
          onClick={() => onModeChange("login")}
        >
          Back to sign in
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={3.5} sx={{ width: "100%", maxWidth: 360 }}>
      <Heading title={heading.title} subtitle={heading.subtitle} />

      <Box component="form" onSubmit={onSubmit} noValidate>
        <Stack spacing={1.75}>
          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

          {mode === "register" && (
            <TextField
              label="Name"
              placeholder="Ava Lin"
              autoComplete="name"
              error={!!errors.name}
              helperText={errors.name?.message}
              {...field("name")}
            />
          )}

          <TextField
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...field("email")}
          />

          {mode !== "forgot" && (
            <TextField
              label="Password"
              type={showPw ? "text" : "password"}
              placeholder={
                mode === "register" ? "8+ characters" : "Your password"
              }
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPw ? "Hide password" : "Show password"}
                        onClick={() => setShowPw((v) => !v)}
                        edge="end"
                        size="small"
                      >
                        {showPw ? <EyeSlash size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              {...field("password")}
            />
          )}

          {mode === "register" && (
            <TextField
              label="Confirm password"
              type={showPw ? "text" : "password"}
              placeholder="Repeat password"
              autoComplete="new-password"
              error={!!errors.confirm}
              helperText={errors.confirm?.message}
              {...field("confirm")}
            />
          )}

          {mode === "login" && (
            <Box sx={{ mt: -0.5 }}>
              <Link
                component="button"
                type="button"
                variant="body2"
                underline="hover"
                onClick={() => onModeChange("forgot")}
              >
                Forgot password?
              </Link>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={busy}
            startIcon={
              busy ? <CircleNotch size={16} className="spin" /> : undefined
            }
            sx={{ height: 46, mt: 0.5 }}
          >
            {busy
              ? "One moment…"
              : mode === "login"
                ? "Sign in"
                : mode === "register"
                  ? "Create account"
                  : "Send reset link"}
          </Button>
        </Stack>
      </Box>

      <Stack spacing={1.25}>
        {mode === "login" && (
          <>
            <Typography variant="body2" color="text.secondary">
              New to keepclone?{" "}
              <Link
                component="button"
                type="button"
                underline="hover"
                onClick={() => onModeChange("register")}
              >
                Create an account
              </Link>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Demo: demo@keepclone.app · password123
            </Typography>
          </>
        )}
        {mode === "register" && (
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link
              component="button"
              type="button"
              underline="hover"
              onClick={() => onModeChange("login")}
            >
              Sign in
            </Link>
          </Typography>
        )}
        {mode === "forgot" && (
          <Link
            component="button"
            type="button"
            variant="body2"
            underline="hover"
            onClick={() => onModeChange("login")}
            sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}
          >
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        )}
      </Stack>
    </Stack>
  );
}

function Heading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Stack spacing={0.75}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: 500, letterSpacing: "-.02em" }}
      >
        {title}
      </Typography>
      <Typography color="text.secondary">{subtitle}</Typography>
    </Stack>
  );
}
