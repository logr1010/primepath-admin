import React, { useState,useRef,useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { patch, post } from '../services/api-services';
import { classNameRegex } from '../regex/regex';

export default function UsersDialog(props) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    props?.setOpen(false);
    reset();
  };
 
  const onAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await post('courses', props?.course);
    if (res?.statusCode === 200) {
      props?.setSnackbar({
        openSnackbar: true,
        message: "User added successfully",
        severity: "success",
      });
      props?.setCourse({ name: '' })
      props?.getUsers()
      handleClose();

    }
    else if(res?.statusCode === 409){
      props?.setSnackbar({
        openSnackbar: true,
        message: "User already exist",
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
  const onUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await patch(`courses/${props?.courseId }`, props?.course);
    if (res?.statusCode === 200) {
      props?.setSnackbar({
        openSnackbar: true,
        message: "User Updated successfully",
        severity: "success",
      });
      props?.setCourse({ name: '' })
      props?.getUsers()
      handleClose();

    }
    else if(res?.statusCode === 409){
      props?.setSnackbar({
        openSnackbar: true,
        message: "User already exist",
        severity: "error",
      })
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
    props?.setCourse({ name: '' });
    props?.setCourseId("")
  }
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [props?.open]); // Dependency on inputRef to ensure it runs when the ref is assigned

  return (
    <React.Fragment>
      <Dialog
        open={props?.open}
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            { props?.courseId ? onUpdateUser(event) : onAddUser(event) }
          },
        }}
      >
        <DialogTitle>{props?.courseId ? 'Update User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            // inputRef={inputRef}
            autoFocus
            required
            margin="dense"
            id="outlined-basic"
            name="Title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            value={props?.course?.name}
            onChange={(e) =>
              props?.setCourse((prevState) => ({
                ...prevState,
                name: e.target.value,
              }))
            }
            error={
              props?.course?.name?.length > 0 &&
              !classNameRegex?.test(props?.course?.name)
            }
            helperText={
              props?.course?.name?.length > 0 &&
                !classNameRegex?.test(props?.course?.name)
                ? "Please enter a valid users name. The users name should be 2 to 32 characters long and can contain letters, numbers, spaces, and periods only."
                : ""
            }
          />
        </DialogContent>
        <DialogActions >
          <Button onClick={handleClose} variant='outlined'>Cancel</Button>
          <Button type="submit" disabled={loading || !props?.course?.name ? true : false} variant='contained'>{props?.courseId ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
