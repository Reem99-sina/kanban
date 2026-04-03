import {create} from "zustand";

type Severity = "success" | "error" | "info" | "warning";

interface AlertState {
  open: boolean;
  message: string;
  severity: Severity;
  showAlert: (msg: string, severity?: Severity) => void;
  closeAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  open: false,
  message: "",
  severity: "success",
  showAlert: (msg, sev = "success") =>
    set({ message: msg, severity: sev, open: true }),
  closeAlert: () => set({ open: false }),
}));