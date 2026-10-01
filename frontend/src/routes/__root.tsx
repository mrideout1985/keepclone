import Box from "@mui/material/Box";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({ component: RootLayout });

function RootLayout() {
  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <Outlet />
    </Box>
  );
}
