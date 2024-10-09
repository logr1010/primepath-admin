import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { patch } from '../services/api-services'
import { Button } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({

    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function ConfirmStatus(props) {
    const handleClose = () => {
        props?.setOpenConfimation(false);
        props?.setStudentId("")
    };
    const handleStatus = async () => {
            const res = await patch(`users/${props?.studentId}`, { "status": !props?.studentStatus, id: props?.studentId})
            if (res?.statusCode === 200) {
                props?.delayStudent(props?.search,props?.paginationModel);
                props?.setSnackbar({
                    openSnackbar: true,
                    message: "Student's status updated successfully",
                    severity: "success",
                  });
            }
        handleClose()
        }
    return (
        <React.Fragment>
            <BootstrapDialog
            fullWidth
                // onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={props?.openConfimation}>
                <DialogTitle sx={{ m: 0}} id="customized-dialog-title" >Confirm</DialogTitle>
                <DialogContent>Are you sure you want to {props?.studentStatus ? "deactivate" : "activate"} the user?
                </DialogContent>
                <DialogActions >
                    
                        <Button
                            onClick={handleClose}
                          variant='outlined'>
                            Cancel
                        </Button>
                        <Button variant="contained"
                            onClick={handleStatus}
                            className=' disabled:50'>
                            Confirm
                        </Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment >
    );
}