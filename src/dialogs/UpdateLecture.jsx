import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { patch} from '../services/api-services';
import { lectureNameRegex, urlRegex } from '../regex/regex';

export default function UpdateLecture(props) {
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in "yyyy-mm-dd" format
  // eslint-disable-next-line
  const [maxDate, setMaxDate] = React.useState(currentDate);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    props?.setUpdateOpen(false);
    const today = new Date();
    const yyyy = today?.getFullYear();
    const mm = String(today?.getMonth() + 1).padStart(2, '0'); // Months start at 0
    const dd = String(today?.getDate()).padStart(2, '0');
    props?.setLecture({ name: '', thumbnail: '', url: '', date: `${yyyy}-${mm}-${dd}`, subjectId: props?.subjectId })
  };

  const onUpdateLecture = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await patch(`lectures/${props?.lectureId}`, props?.lecture);
    if (res?.statusCode === 200) {
      props?.setSnackbar({
        openSnackbar: true,
        message: "Lecture updated successfully",
        severity: "success",
      });
      props?.delayLecture(props?.search, props?.paginationModel, props?.dateFilter)
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
  return (
    <React.Fragment>
      <Dialog
        open={props?.updateOpen}
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            onUpdateLecture(event)
          },
        }}
      >
        <DialogTitle>Edit lecture</DialogTitle>
        <DialogContent>
          {/* TITLE URL COMPONENT */}
          <div className='flex flex-col gap-4 mt-2'>
            <div className='flex flex-col sm:flex-row gap-4 w-full '>
              <TextField id="outlined-basic" className='sm:w-3/5' autoFocus={true}
                size='small' required label="Title" variant="outlined"
                value={props?.lecture?.name}
                onChange={(e) =>
                  props?.setLecture((prevState) => ({
                    ...prevState,
                    name: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && props?.lecture.name && props?.lecture.url && props?.lecture.date) onUpdateLecture(e);
                }}
                error={
                  props?.lecture.name?.length > 0 &&
                  !lectureNameRegex?.test(props?.lecture.name)
                }
                helperText={
                  props?.lecture.name?.length > 0 &&
                    !lectureNameRegex?.test(props?.lecture.name)
                    ? "Please enter a valid title. The lecture name should be 2 to 64 characters long and can contain letters, numbers, spaces, and periods only."
                    : ""
                }
              />
              <TextField type='date' required size='small' className='sm:w-2/5' label='Date' InputLabelProps={{ shrink: true }}
                value={props?.lecture?.date}
                InputProps={{
                  inputProps: {
                    format: 'dd/MM/yyyy', // Modify the date format here
                    max: maxDate,
                  },
                }}
                color='primary'
                onChange={(e) =>
                  props?.setLecture((prevState) => ({
                    ...prevState,
                    date: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && props?.lecture.name && props?.lecture.url && props?.lecture.date) onUpdateLecture(e);
                }}
              />
            </div>
            <div className='flex flex-col gap-4 w-full sm:flex-row'>
              <TextField id="outlined-basic" required size='small' label="Url" variant="outlined" value={props?.lecture.url} fullWidth
                onChange={(e) =>
                  props?.setLecture((prevState) => ({
                    ...prevState,
                    url: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && props?.lecture.name && props?.lecture.url && props?.lecture.date) onUpdateLecture(e);
                }}
                error={
                  props?.lecture.url?.length > 0 &&
                  !urlRegex?.test(props?.lecture.url)
                }
                helperText={
                  props?.lecture.url?.length > 0 &&
                    !urlRegex?.test(props?.lecture.url)
                    ? "Please enter a valid url."
                    : ""
                }
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions >
          <Button onClick={handleClose} variant='outlined'>Cancel</Button>
          <Button type="submit" disabled={!loading && props?.lecture?.name && props?.lecture?.url && props?.lecture?.date &&
          urlRegex?.test(props?.lecture.url) && lectureNameRegex?.test(props?.lecture.name) ? false : true} variant='contained'> Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
