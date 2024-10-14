import React from "react";
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';

const ImageDialog = styled(Dialog)(({ theme }) => ({
    padding: 0,
}));

const ImageViewer = (props) => {
    const [open, setOpen] = React.useState(false);

    const onClose = () => {
        setOpen(false);
    };

    const onClick = () => {
        setOpen(true);
    };

    return (
        <>
            <ImageDialog
                onClose={onClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                {/* Override the props styles with custom inline styles */}
                <img
                    src={props?.src}
                />
            </ImageDialog>

            {/* Display thumbnail image that triggers dialog */}
            <img
                {...props}
                onClick={onClick}
                style={{
                    cursor: 'pointer', 
                    objectFit: 'cover',
                }}
            />
        </>
    );
};

export default ImageViewer;
