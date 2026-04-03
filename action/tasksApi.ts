
import { showAlert, Task } from "@/type/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API = "http://localhost:4000/tasks";

export const fetchTasks = async () => {
  const { data } = await axios.get(API);
  return data;
};

export const createTask = async (task: Task) => {
  const { data } = await axios.post(API, task, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

export const updateTask = async (task: Task) => {
  const { data } = await axios.put(`${API}/${task.id}`, task);
  return data;
};

export const deleteTask = async (id: number | string) => {
  await axios.delete(`${API}/${id}`);
};

// ---------- hooks with alerts ----------

export const useGetTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
};

export const useCreateTask = (showAlert: (msg: string, sev?: "success" | "error") => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Task) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showAlert("Task created successfully!", "success");
    },
    onError: (err) => {
      showAlert(`Failed to create task: ${err.message}`, "error");
    },
  });
};

export const useEditTask = (showAlert: showAlert) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Task) => updateTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showAlert("Task updated successfully!", "success");
    },
    onError: (err) => {
      showAlert(`Failed to update task: ${err.message}`, "error");
    },
  });
};

export const useDeleteTask = (showAlert: showAlert) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showAlert("Task deleted successfully!", "success");
    },
    onError: (err) => {
      showAlert(`Failed to delete task: ${err.message}`, "error");
    },
  });
};