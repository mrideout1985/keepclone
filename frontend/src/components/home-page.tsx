import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SignOut } from "@phosphor-icons/react";
import { Brand } from "@/components/ui/brand";
import { useLogout, useUser } from "@/lib/auth";
import { AuthScreen } from "@/features/auth/components/auth-screen";

export function HomePage() {
  const { data: user, isPending } = useUser();

  if (isPending) {
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <SignedInPlaceholder name={user.name} />;
}

function SignedInPlaceholder({ name }: { name: string }) {
  const logout = useLogout();
  return (
    <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
      <Stack spacing={3} sx={{ alignItems: "center" }}>
        <Brand />
        <Typography variant="h5">Welcome, {name.split(" ")[0]}</Typography>
        <Typography color="text.secondary">
          Your notes will appear here.
        </Typography>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<SignOut size={16} />}
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          Sign out
        </Button>
      </Stack>
    </Box>
  );
}
