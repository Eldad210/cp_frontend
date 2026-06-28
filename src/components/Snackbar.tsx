import React from "react";
import { Alert, Snackbar } from "@mui/material";
import { useTranslation } from "@/i18n/LanguageProvider";

export const SnackbarContent: React.FC<{
  isSnackbarOpen: boolean;
  setIsSnackbarOpen: (open: boolean) => void;
  ifcLoadingErrorMessage: string | undefined;
}> = (props) => {
  const { t } = useTranslation();
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
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
            {t('viewer.loadingError')}
          </Alert>
        ) : (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {t('viewer.loadingSuccess')}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};
