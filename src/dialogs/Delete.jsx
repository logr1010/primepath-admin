import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { deletethis } from '../services/api-services';

export default function Delete(props) {
  const handleClose = () => {
    props?.setDeleteOpen(false);
    reset();
  };
  const [loading, setLoading] = useState(false)
  const onConfirm = async () => {
    setLoading(true);
    const res = await deletethis(`${props?.endPoint}/${props?.id}`);
    if (res?.statusCode == 200) {
      props?.setSnackbar({
        openSnackbar: true,
        message: `${props?.name} deleted successfully`,
        severity: "success",
      });
      if(props?.name==='User'){props?.getUsers()}
      else if(props?.name==='Subject'){props?.getSubjects(props?.search)}
      else if(props?.name==='Lecture'){props?.delayLecture(props?.search,props?.paginationModel,props?.dateFilter)}
      else if(props?.name==='Student'){props?.delayStudent(props?.search,props?.paginationModel)}
      
      reset();

    } else {
      props?.setSnackbar({
        openSnackbar: true,
        message: "Something went wrong",
        severity: "error",
      })
    }
    setLoading(false);
    handleClose();

  }
  const reset=()=>{
    // props?.setCourse({ name: '' });
    if(props?.name==='User'){props?.setCourseId("")}
    else if(props?.name==='Subject'){props?.setSubjectId("")}
    else if(props?.name==='Lecture'){props?.setLectureId("")}
      else if(props?.name==='Student'){props?.setStudentId('')}
    
  }
  return (
    <React.Fragment>
      <Dialog
        open={props?.deleteOpen}
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            onConfirm();
            handleClose();
          },
        }}
      >
        <DialogTitle>{`Delete ${props?.name}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure, you want to delete this ${props?.name}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions >
          <Button onClick={handleClose} variant='outlined'>Cancel</Button>
          <Button type="submit" variant='contained' disabled={loading}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
