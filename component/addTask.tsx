"use client";

import { useCreateTask, useEditTask, useGetTasks } from "@/action/tasksApi";
import { useAlertStore } from "@/store/alert";
import { Column, Status, Task } from "@/type/task";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useMemo, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  column: Column;
  task?: Task | null;
};

export function AddTaskModal({ open, onClose, column, task }: Props) {
  const [title, setTitle] = useState<string>(task?.title || "");
  const { data } = useGetTasks();
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<"low" | "medium" | "high">("low");
  const showAlert=useAlertStore((state)=>state.showAlert)
  const { mutateAsync } = useCreateTask(showAlert);
  const { mutateAsync: mutateAsyncEdit } = useEditTask(showAlert);

  const isEdit = useMemo(() => {
    return Boolean(task);
  }, [task]);


  const handleSubmit = async () => {
    try {
      const payload = { title, description, column, status };

      if (isEdit && task) {
        await mutateAsyncEdit({ ...task, ...payload });
      } else {
        const newId = Math.max(...(data?.map((t:Task) => Number(t.id)) || [0])) + 1;
        await mutateAsync({ id: newId, ...payload });
      }

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Box
        sx={{
          width: 400,
          bgcolor: "white",
          p: 3,
          borderRadius: 2,
          mx: "auto",
          mt: "10%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="black">
          {task ? "Edit Task" : "Add Task"} ({column})
        </Typography>

        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Description"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </TextField>
        <Button variant="contained" onClick={handleSubmit}>
          {task ? "Save Changes" : "Add"}
        </Button>
      </Box>
    </Modal>
  );
}
