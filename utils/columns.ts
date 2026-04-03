import { Column, Task } from "@/type/task";

export const groupTasksByColumn = (tasks: Task[]): Record<Column, Task[]> => {
  return tasks.reduce(
    (acc, task) => {
      if (!acc[task.column]) acc[task.column] = [];
      acc[task.column].push(task);
      return acc;
    },
    {} as Record<Column, Task[]>,
  );
};
