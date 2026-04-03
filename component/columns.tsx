"use client";

import { useDeleteTask, useEditTask, useGetTasks } from "@/action/tasksApi";
import { groupTasksByColumn } from "@/utils/columns";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { TaskCard } from "./TaskCard";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect, useMemo } from "react";
import { AddTaskModal } from "./addTask";
import { Column, Task } from "@/type/task";

import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
  arrayMove,
  SortableContext,
} from "@dnd-kit/sortable";
import { useTaskStore } from "@/store/task";
import { useAlertStore } from "@/store/alert";

export function ColumnsTasks() {
  const { data } = useGetTasks();
  const { palette } = useTheme();
  const { showAlert } = useAlertStore((state)=>state);
  const { mutateAsync: deleteTask } = useDeleteTask(showAlert);
  const { mutateAsync: editTask } = useEditTask(showAlert);
  const { search } = useTaskStore();

  const [open, setOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<Column>("backlog");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [tasksByColumn, setTasksByColumn] = useState(() =>
    groupTasksByColumn(data || []),
  );
  const filteredTasks = useMemo(() => {
    return (data || []).filter(
      (task: Task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  useEffect(() => {
    setTasksByColumn(groupTasksByColumn(filteredTasks || []));
  }, [data, search, filteredTasks]);

  const columnOrder: Array<keyof typeof tasksByColumn> = [
    "backlog",
    "in-progress",
    "review",
    "done",
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function ColumnZone({
    column,
    children,
  }: {
    column: Column;
    children: React.ReactNode;
  }) {
    const { setNodeRef, isOver } = useDroppable({ id: `column-${column}` });
    return (
      <Box
        ref={setNodeRef}
        flex={1}
        p={1}
        border="1px solid #ddd"
        borderRadius={1}
        bgcolor={isOver ? "#e0f7ff" : "#a9a9a947"}
        height="80vh"
        overflow="auto"
      >
        {children}
      </Box>
    );
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    const id = String(active.id).replace("task-", "");
    const task = data?.find((t: Task) => t.id == id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeId = String(active.id).replace("task-", "");
    const overId = String(over.id);

    const activeTask = data?.find((t: Task) => t.id == activeId);
    if (!activeTask) return;

    if (overId.startsWith("task-")) {
      const overTaskId = overId.replace("task-", "");
      const overTask = data?.find((t: Task) => t.id == overTaskId);
      if (!overTask || overTask.column != activeTask.column) return;
      const column = activeTask.column as Column;
      const colTasks = tasksByColumn[column];
      const oldIndex = colTasks.findIndex((t: Task) => t.id == activeId);
      const newIndex = colTasks.findIndex((t: Task) => t.id == overTaskId);
      if (oldIndex == newIndex || oldIndex == -1 || newIndex == -1) return;

      setTasksByColumn((prev) => ({
        ...prev,
        [column]: arrayMove(prev[column], oldIndex, newIndex),
      }));
    }
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = String(active.id).replace("task-", "");
    const overId = String(over.id);

    const activeTask = data?.find((t: Task) => t.id == activeId);
    if (!activeTask) {
      setActiveTask(null);
      return;
    }

    let destinationColumn: Column | undefined;

    if (overId.startsWith("column-")) {
      destinationColumn = overId.replace("column-", "") as Column;
    } else if (overId.startsWith("task-")) {
      const overTaskId = overId.replace("task-", "");
      const overTask = data?.find((t: Task) => t.id == overTaskId);
      destinationColumn = overTask?.column;
    }

    if (!destinationColumn) {
      setActiveTask(null);
      return;
    }

    if (activeTask.column != destinationColumn) {
      setTasksByColumn((prev) => {
        const newState = { ...prev };
        const column = activeTask.column as Column;
        newState[column] = newState[column].filter(
          (t: Task) => t.id != activeId,
        );

        newState[destinationColumn] = [
          activeTask,
          ...(newState[destinationColumn] || []),
        ];
        return newState;
      });

      try {
        await editTask({ ...activeTask, column: destinationColumn });
      } catch {
        setTasksByColumn(groupTasksByColumn(data || []));
      }
    }

    setActiveTask(null);
  };

  const handleDelete = async (id?: number | string) => {
    if (id) {
      await deleteTask(id);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        display="grid"
        gap={2}
        sx={{
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
            xl: "repeat(5, 1fr)",
          },
        }}
      >
        {columnOrder.map((column) => (
          <ColumnZone key={column} column={column}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: palette.column?.[column] || "gray",
                }}
              />
              <Typography
                variant="h6"
                fontWeight={600}
                textTransform="uppercase"
                color="black"
                fontSize={16}
              >
                {column.replace("-", " ")}
              </Typography>
            </Box>

            <SortableContext
              items={tasksByColumn[column]?.map((t) => `task-${t.id}`) || []}
            >
              {tasksByColumn[column]?.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  id={`task-${task.id}`}
                  onEdit={() => {
                    setSelectedTask(task);
                    setSelectedColumn(column);
                    setOpen(true);
                  }}
                  onDelete={() => handleDelete(task.id)}
                />
              ))}
            </SortableContext>

            <Button
              startIcon={<AddIcon />}
              variant="text"
              sx={{
                mt: 1,
                justifyContent: "center",
                border: `1px solid gray`,
                textTransform: "none",
                fontWeight: 500,
                width: "100%",
                color: "gray",
                "&:hover": { bgcolor: "#ffffff" },
              }}
              onClick={() => {
                setSelectedTask(null);
                setSelectedColumn(column);
                setOpen(true);
              }}
            >
              Add Task
            </Button>

            <AddTaskModal
              open={open}
              onClose={() => setOpen(false)}
              column={selectedColumn}
              task={selectedTask}
            />
          </ColumnZone>
        ))}
      </Box>

      <DragOverlay>
        {activeTask && (
          <TaskCard
            task={activeTask}
            id={`task-${activeTask.id}`}
            onEdit={() => {
              setSelectedTask(activeTask);
              setSelectedColumn(activeTask.column);
              setOpen(true);
            }}
            onDelete={() => handleDelete(activeTask.id)}
          />
        )}
      </DragOverlay>
      {/* {AlertComponent} */}
    </DndContext>
  );
}
