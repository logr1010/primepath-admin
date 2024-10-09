import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ReactPlayer from 'react-player'
export default function LectureDialog(props) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('lg');

  const handleClose = () => {
    props?.setOpenLecture(false);
    const today = new Date();
    const yyyy = today?.getFullYear();
    const mm = String(today?.getMonth() + 1).padStart(2, '0'); // Months start at 0
    const dd = String(today?.getDate()).padStart(2, '0');
    props?.setVideo({ name: '', thumbnail: '', url: '', date: `${yyyy}-${mm}-${dd}`, subjectId: props?.subjectId })
  };
  return (
    <React.Fragment>
      <Dialog
          //  fullScreen
           fullWidth={fullWidth}
           maxWidth={maxWidth}
           open={props?.openLecture}
          //  onClose={handleClose}
         >
           <DialogTitle>{props?.video?.name}</DialogTitle>
           <DialogContent>
            
             <Box
               noValidate
               component="form"
               sx={{
                 display: 'flex',
                 flexDirection: 'column',
                //  height:'100%'
               }}
             >
              <ReactPlayer controls url={props?.video?.url}  width="100%"  height="auto" playing={true}
                    />
             </Box>
           </DialogContent>
           <DialogActions>
             <Button onClick={handleClose} variant='outlined'>Close</Button>
           </DialogActions>
         </Dialog>
    </React.Fragment>
  );
}
