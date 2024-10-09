import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomSnackbar(props) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return props?.closeSnackbar();
    }
    props?.closeSnackbar();
  };

  return (
    <Stack spacing={2} >
      <Snackbar
        open={props?.openSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={props?.severity}
          sx={{ width: "100%" }}
        >
          {props?.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
