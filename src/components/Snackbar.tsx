import React from "react";
import { Alert, Snackbar } from "@mui/material";

export const SnackbarContent: React.FC<{
  isSnackbarOpen: boolean;
  setIsSnackbarOpen: (open: boolean) => void;
  ifcLoadingErrorMessage: string | undefined;
}> = (props) => {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    props.setIsSnackbarOpen(false);
  };

  return (
    <>
      <Snackbar
        open={props.isSnackbarOpen}
        autoHideDuration={5000} // Close after 5 seconds
        onClose={handleClose}
      >
        {props.ifcLoadingErrorMessage ? (
          <Alert
            onClose={handleClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            Error loading the IFC File. Check the console for more information.
          </Alert>
        ) : (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            IFC File loaded successfully!
          </Alert>
        )}
      </Snackbar>
    </>
  );
};
