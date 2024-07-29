import React, { createContext, useState, useContext } from "react";
import CustomSnackbar from "./Snackbar";

const SnackbarContext = createContext();

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    type: "text",
    alert: false,
    action: null,
  });

  const snackbar = {
    success: (message) => {
      setSnackbarState({ open: true, message, type: "success", alert: true });
    },
    error: (message) => {
      setSnackbarState({ open: true, message, type: "error", alert: true });
    },
    text: (message, action = null) => {
      setSnackbarState({
        open: true,
        message,
        type: "text",
        alert: false,
        action,
      });
    },
    close: () => {
      setSnackbarState({ ...snackbarState, open: false });
    },
  };

  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    snackbar.close();
  };

  return (
    <SnackbarContext.Provider value={snackbar}>
      {children}
      <CustomSnackbar
        open={snackbarState.open}
        message={snackbarState.message}
        type={snackbarState.type}
        alert={snackbarState.alert}
        action={snackbarState.action}
        onClose={closeSnackbar}
      />
    </SnackbarContext.Provider>
  );
};

