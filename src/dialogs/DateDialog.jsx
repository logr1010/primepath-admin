
import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function DateDialog(props) {
  const handleClose = () => {
    props?.setOpenFilter(false);
  };
  const onReset = () => {
    props?.setDateFilter({ from: '', to: '' });
    if (props?.name === 'lecture') {
      props?.delayLecture(props?.search, props?.paginationModel, { from: '', to: '' });
    }
    if (props?.name === 'lecHisStudent') {
      props?.delayViews(props?.search, props?.paginationModel, { from: '', to: '' })
    }
  }
  const [loading, setLoading] = useState(false)
  return (
    <React.Fragment>
      <Dialog
        fullWidth
        // onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={props?.openFilter}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            if (props?.name === 'lecture') {
              setLoading(true);
              props?.setPaginationModel({ pageSize: props?.paginationModel?.pageSize,page: 0})
              props?.delayLecture(props?.search, { pageSize: props?.paginationModel.pageSize,page: 0}, props?.dateFilter);
              setLoading(false);
            }
            if (props?.name === 'lecHisStudent') {
              setLoading(true);
              props?.setPaginationModel({ pageSize: props?.paginationModel?.pageSize,page: 0})
              props?.delayViews(props?.search, { pageSize: props?.paginationModel.pageSize,page: 0}, props?.dateFilter);
              setLoading(false);
            }
            handleClose()
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Filter By Date
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent className='flex  items-center'>
            <TextField type='date' value={props?.dateFilter?.from} label="From" fullWidth size='small' InputLabelProps={{ shrink: true }}
              onChange={(e) =>
                props?.setDateFilter((prevState) => ({
                  ...prevState,
                  from: e.target.value,
                }))
              }
              InputProps={{
                inputProps: {
                  format: 'dd/MM/yyyy', // Modify the date format here
                  max: props?.dateFilter?.to,
                },
              }}
            />
            <span>-</span>
            <TextField type='date' value={props?.dateFilter?.to} label="To" fullWidth size='small' InputLabelProps={{ shrink: true }}
              onChange={(e) =>
                props?.setDateFilter((prevState) => ({
                  ...prevState,
                  to: e.target.value,
                }))
              }
              InputProps={{
                inputProps: {
                  format: 'dd/MM/yyyy', // Modify the date format here
                  min: props?.dateFilter?.from,
                },
              }}
            />

        </DialogContent>
        <DialogActions>
          <Button onClick={onReset} variant='outlined'>Reset</Button>
          <Button type="submit" disabled={loading} variant='contained'>Apply</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
