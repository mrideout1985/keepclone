import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#FF0B55", light: "#ff8fae", dark: "#CF0F47" },
    background: { default: "#000000", paper: "#110b0d" },
    divider: "#33202a",
    text: { primary: "#fff1f1", secondary: "#b8979d" },
    error: { main: "#FF0B55" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily:
      '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    fontWeightMedium: 500,
    button: { textTransform: "none", fontWeight: 500 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});

export const NOTE_COLORS = {
  default: "#0b0708",
  rose: "#3a0a1b",
  crimson: "#2c0712",
  coral: "#3a1510",
  amber: "#2f2210",
  moss: "#172412",
  teal: "#0e2323",
  ink: "#121a2e",
  violet: "#1f1433",
  mauve: "#2c1328",
} as const;

export type NoteColor = keyof typeof NOTE_COLORS;

export const NOTE_COLOR_ORDER: { key: NoteColor; label: string }[] = [
  { key: "default", label: "Default" },
  { key: "rose", label: "Rose" },
  { key: "crimson", label: "Crimson" },
  { key: "coral", label: "Coral" },
  { key: "amber", label: "Amber" },
  { key: "moss", label: "Moss" },
  { key: "teal", label: "Teal" },
  { key: "ink", label: "Ink" },
  { key: "violet", label: "Violet" },
  { key: "mauve", label: "Mauve" },
];
