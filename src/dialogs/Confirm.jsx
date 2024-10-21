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
        padding: theme.spacing(3),
        maxWidth: '400px',
    },
}));

export default function Confirm({
    open,
    onClose,
    message,
    title,
    onSuccess,
    onReject
}) {
    return (
        <React.Fragment>
            <BootstrapDialog
                onClose={onClose}
                aria-labelledby="customized-dialog-title"
                open={open}>
                <DialogTitle sx={{ m: 0 }} id="customized-dialog-title" >{title}</DialogTitle>
                <DialogContent>
                    {message}
                </DialogContent>
                <DialogActions >
                    <Button
                        color='error'
                        className='!font-semibold'
                        onClick={onReject}
                        variant='text'>
                        NO
                    </Button>
                    <Button
                        color='primary'
                        className='!font-semibold'
                        variant="contained"
                        onClick={onSuccess}>
                        YES
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment >
    );
}