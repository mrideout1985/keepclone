import { createTheme } from "@mui/material/styles";

// Central MUI theme. Extend palette/typography here as the app grows.
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#fbbc04" },
    background: { default: "#fffef7" },
  },
  shape: { borderRadius: 8 },
});
