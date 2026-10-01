import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Lightbulb } from "@phosphor-icons/react";

type BrandProps = {
  size?: number;
};

export function Brand({ size = 34 }: BrandProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
      <Box
        sx={{
          width: size,
          height: size,
          border: "1px solid",
          borderColor: "primary.main",
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "primary.main",
          boxShadow: "0 0 22px rgba(255,11,85,.35)",
          flex: "none",
        }}
      >
        <Lightbulb size={size * 0.56} />
      </Box>
      <Typography
        component="span"
        sx={{ fontSize: 18, fontWeight: 500, letterSpacing: "-.01em" }}
      >
        keepclone
      </Typography>
    </Box>
  );
}
