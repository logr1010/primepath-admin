import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { patch, post } from '../services/api-services';
import { SubjectNameRegex } from '../regex/regex';

export default function SubjectDialog(props) {
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    props?.setOpen(false);
    reset();
  };
  const onAddSubject = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await post('subjects', props?.subject);
    if (res?.statusCode === 200) {
      props?.setSnackbar({
        openSnackbar: true,
        message: "Subject added successfully",
        severity: "success",
      });
      reset();
      props?.getSubjects()
      handleClose();

    }
    else if(res?.statusCode === 409){
      props?.setSnackbar({
        openSnackbar: true,
        message: "Subject already exist",
        severity: "error",
      })
    }
    else {
      props?.setSnackbar({
        openSnackbar: true,
        message: "Something went wrong",
        severity: "error",
      })
    }
    setLoading(false);
  }
  const onUpdateSubject = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await patch(`subjects/${props?.subjectId }`, props?.subject);
    if (res?.statusCode === 200) {
      props?.setSnackbar({
        openSnackbar: true,
        message: "Subject updated successfully",
        severity: "success",
      });
      reset();
      props?.getSubjects()
      handleClose();

    } else {
      props?.setSnackbar({
        openSnackbar: true,
        message: "Something went wrong",
        severity: "error",
      })
    }
    setLoading(false);
  }
  const reset=()=>{
    props?.setSubject({ name: '',courseId:props?.courseId })
    props?.setSubjectId("")
  }
  return (
    <React.Fragment>
      <Dialog
        open={props?.open}
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            { props?.subjectId ? onUpdateSubject(event) : onAddSubject(event) }
          },
        }}
      >
        <DialogTitle >{props?.subjectId ? 'Update Subject': 'Add Subject'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus={true}
            required
            margin="dense"
            id="name"
            name="Title"
            label="Title"
            type="name"
            fullWidth
            variant="standard"
            value={props?.subject?.name}
            onChange={(e) =>
              props?.setSubject((prevState) => ({
                ...prevState,
                name: e.target.value,
              }))
            }
            error={
              props?.subject?.name?.length > 0 &&
              !SubjectNameRegex?.test(props?.subject?.name)
            }
            helperText={
              props?.subject?.name?.length > 0 &&
                !SubjectNameRegex?.test(props?.subject?.name)
                ? "Please enter a valid subject name. The subject name should be 2 to 64 characters long and can contain letters, numbers, spaces, and periods only."
                : ""
            }
          />
        </DialogContent>
        <DialogActions >
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
          <Button type="submit" disabled={loading || !props?.subject?.name ? true : false} variant='contained'>{props?.subjectId ? 'Update':'Add'}</Button>
        </DialogActions>
      </Dialog>
     
    </React.Fragment>
  );
}
