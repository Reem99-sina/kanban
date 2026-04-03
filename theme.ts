
import { createTheme } from "@mui/material";
import { Column, Status } from "./type/task";
import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    status: Record<Status, { bg: string; text: string }>;
    column: Record<Column, string>;
  }
  interface PaletteOptions {
    status?: Record<Status, { bg: string; text: string }>;
    column?: Record<Column, string>;
  }
}

export const columnColors: Record<Column, string> = {
  backlog: "#1976d2", // blue
  "in-progress": "#f57c00", // orange
  review: "#9c27b0", // purple
  done: "#388e3c", // green
};

export const statusColors: Record<Status, { bg: string; text: string }> = {
  low: { bg: "#80808091", text: "#808080" }, // light green background, dark green text
  medium: { bg: "#fff3e0", text: "#f57c00" }, // light orange background, orange text
  high: { bg: "#ffebee", text: "#d32f2f" }, // light red background, red text
};

const theme = createTheme({
  palette: {
    primary: { main: "#80808078" },
    secondary: { main: "#9c27b0" },
    status: statusColors,
    column: columnColors,
  },
});

export default theme;
