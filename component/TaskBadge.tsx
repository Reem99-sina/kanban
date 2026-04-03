
import { statusColors } from "@/theme";
import { Status } from "@/type/task";
import { Box } from "@mui/material";


type TaskBadgeProps = {
  status: Status;
};

export const TaskBadge = ({ status }: TaskBadgeProps) => {
  const { bg, text } = statusColors[status];

  return (
    <Box
      sx={{
        bgcolor: bg,
        color: text,
        px: 1,
        py: 0.5,
        borderRadius: 1,
        fontWeight: 500,
        display: "inline-block",
        textTransform: "capitalize",
      }}
      fontSize={12}
    >
      {status}
    </Box>
  );
};