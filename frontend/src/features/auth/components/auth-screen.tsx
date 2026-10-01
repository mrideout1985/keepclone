import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Bell, CheckSquare, Square } from "@phosphor-icons/react";
import { useState } from "react";
import { Brand } from "@/components/ui/brand";
import { AuthForm, type AuthMode } from "./auth-form";

export function AuthScreen() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mode, setMode] = useState<AuthMode>("login");

  const form = <AuthForm key={mode} mode={mode} onModeChange={setMode} />;

  if (!isDesktop) {
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: "40px 24px 32px",
        }}
      >
        <Stack spacing={3.5} sx={{ width: "100%", maxWidth: 360 }}>
          <Brand />
          {form}
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex" }}>
      <Hero />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 6,
        }}
      >
        {form}
      </Box>
    </Box>
  );
}

function Hero() {
  return (
    <Box
      sx={{
        flex: 1.1,
        position: "relative",
        overflow: "hidden",
        p: 7,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "radial-gradient(ellipse 70% 60% at 15% 25%, rgba(255,11,85,.16), transparent 70%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(207,15,71,.12), transparent 70%), #000",
      }}
    >
      <Brand />
      <Stack spacing={3.5} sx={{ maxWidth: 440 }}>
        <Typography
          component="p"
          sx={{
            fontSize: 44,
            lineHeight: 1.08,
            fontWeight: 500,
            letterSpacing: "-.025em",
          }}
        >
          Everything you meant to remember.
        </Typography>
        <Typography sx={{ fontSize: 16, lineHeight: 1.5, color: "#c9a9ae" }}>
          Notes, checklists and reminders, synced between your phone and your
          desk.
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
          <HeroCard
            sx={{
              background: "#3a0a1b",
              borderColor: "#5a1a30",
              transform: "rotate(-2deg)",
            }}
          >
            <Typography sx={{ fontWeight: 500 }}>Groceries</Typography>
            <ChecklistRow done>Oat milk</ChecklistRow>
            <ChecklistRow>Sourdough</ChecklistRow>
            <ChecklistRow>Lemons</ChecklistRow>
          </HeroCard>
          <HeroCard
            sx={{
              background: "#121a2e",
              borderColor: "#26314f",
              transform: "rotate(2deg) translateY(18px)",
            }}
          >
            <Typography sx={{ fontWeight: 500 }}>Flight to Lisbon</Typography>
            <Typography sx={{ color: "#d9c3c6", lineHeight: 1.45 }}>
              Gate B12 · boards 07:40
            </Typography>
            <Box
              sx={{
                display: "inline-flex",
                gap: 0.75,
                alignItems: "center",
                alignSelf: "flex-start",
                px: 1,
                py: 0.5,
                borderRadius: 1.5,
                fontSize: 11,
                bgcolor: "#3d0718",
                color: "#FFDEDE",
              }}
            >
              <Bell size={12} />
              Fri, 06:00
            </Box>
          </HeroCard>
        </Box>
      </Stack>
      <Typography sx={{ fontSize: 12, color: "#8a6a70" }}>
        © 2026 keepclone
      </Typography>
    </Box>
  );
}

function HeroCard({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: object;
}) {
  return (
    <Box
      sx={{
        width: 190,
        border: "1px solid",
        borderRadius: 1,
        p: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function ChecklistRow({
  children,
  done,
}: {
  children: React.ReactNode;
  done?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        color: done ? "#c9a9ae" : "inherit",
      }}
    >
      {done ? <CheckSquare weight="fill" color="#FF0B55" /> : <Square />}
      <span style={{ textDecoration: done ? "line-through" : "none" }}>
        {children}
      </span>
    </Box>
  );
}
