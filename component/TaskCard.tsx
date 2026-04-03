import { Task } from "@/type/task";
import { Box, IconButton, Typography } from "@mui/material";
import { TaskBadge } from "./TaskBadge";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSortable } from "@dnd-kit/sortable";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

type TaskCardProps = {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  id: string;
};

export const TaskCard = ({ task, onDelete, onEdit, id }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: id,
    });

  return (
    <Box
      ref={setNodeRef}
      mb={1}
      p={1}
      borderRadius={2}
      bgcolor={"white"}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"flex-start"}
      gap={1}
      padding={2}
      sx={{
        position: "relative",
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        "&:active": { cursor: "grabbing" },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          display: "flex",
          gap: 0.5,
          zIndex: 100,
        }}
      >
        <IconButton
          size="small"
          {...listeners}
          {...attributes}
          sx={{ cursor: "grab" }}
        >
          <DragIndicatorIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onEdit?.(task)}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete?.(task)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography
        variant="subtitle2"
        color="black"
        fontWeight={400}
        fontSize={16}
      >
        {task.title}
      </Typography>
      <Typography variant="body2" color="gray" fontSize={12}>
        {task.description}
      </Typography>
      <TaskBadge status={task.status} />
    </Box>
  );
};
