import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {  post } from '../services/api-services'
import { Button } from "@mui/material";
import CustomSnackbar from '../modules/CustomSnackbar';
import { adminAuthState } from "../services/RecoilService";
import { useRecoilState } from "recoil";
import { useNavigate } from 'react-router-dom';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({

    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function Confirmlogout(props) {
    const navigate = useNavigate();

    const [authState, setAuthState] = useRecoilState(adminAuthState);    
    const [snackbar, setSnackbar] = React.useState({
        openSnackbar: false,
        message: "",
        severity: "",
    });
    const handleClose = () => {
        localStorage.removeItem("pp_admin") ;
        props?.setOpenConfimation(false);
        window.location.replace("/");

    };
    const handleStatus = async () => {
        const res = await post('users/logout?access_token=' + authState?.id);
        if (res?.statusCode === 204) {
            handleClose();
            
           
        }else{
            setSnackbar({
                openSnackbar: true,
                message: "Something went wrong try again!",
                severity: "error",
            });
        }
        }
    return (
        <React.Fragment>
            <BootstrapDialog
            fullWidth
                aria-labelledby="customized-dialog-title"
                open={props?.openConfimation}>
                <DialogTitle sx={{ m: 0}} id="customized-dialog-title" >
                    Confirmation
                </DialogTitle>
                <DialogContent>
                    Are you sure you want to logout?
                    
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
            <CustomSnackbar
                openSnackbar={snackbar.openSnackbar}
                closeSnackbar={() =>
                    setSnackbar({
                        openSnackbar: false,
                        message: "",
                        severity: "",
                    })
                }
                severity={snackbar.severity}
                message={snackbar.message}
            />

        </React.Fragment >
    );
}