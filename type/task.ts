export type Status = "low" | "medium" | "high";
export type Column = "backlog" | "in-progress" | "review" | "done";

export interface Task {
  id?: number|string;
  title: string;
  description: string;
  column: Column;
  status: Status;
};

export type showAlert=(msg: string, sev?: "success" | "error" | "info" | "warning") => void