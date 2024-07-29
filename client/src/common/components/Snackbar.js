import React from "react";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} {...props} />;
});

const CustomSnackbar = (props) => {
  const { open, message, type, onClose, alert, action } = props;

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
    >
      {alert ? (
        <Alert severity={type} onClose={onClose} sx={{ width: "100%" }}>
          {message}
        </Alert>
      ) : (
        <SnackbarContent
          message={message}
          action={
            action ? (
              <>{action}</>
            ) : (
              <IconButton size="small" color="inherit" onClick={onClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )
          }
        />
      )}
    </Snackbar>
  );
};

export default CustomSnackbar;
