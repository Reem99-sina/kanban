import { useAlertStore } from "@/store/alert";
import { Snackbar, Alert } from "@mui/material";


export const GlobalAlert = () => {
  const { open, message, severity, closeAlert } = useAlertStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={closeAlert}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={closeAlert} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};