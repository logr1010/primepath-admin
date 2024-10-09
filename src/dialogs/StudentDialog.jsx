import React, { useRef, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import frame from '../assets/frame.png';
import { baseUrl, patch, post } from '../services/api-services';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { phoneNumberRegex, StringWithSpace, SubjectNameRegex } from '../regex/regex';
export default function StudentDialog(props) {
  const [profileTemp, setProfileTemp] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletedprofileTemp, setDeletedprofileTemp] = useState("")
  const studentImg = useRef(null);
  const handleClose = () => {
    props?.setOpen(false);
    reset();
    
  };
  const onAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    let profile=''
    let formData = new FormData()
    formData.append('file', profileTemp);
    if(profileTemp){

      const imgRes = await post(`container/images/upload`, formData)
      if (imgRes?.statusCode === 200) {
      profile = imgRes?.data?.result?.files?.file[0].name;
      }
    }
    const res = await post('users', {...props?.student,profile});
    if (res?.statusCode === 200) {
      props?.setSnackbar({
        openSnackbar: true,
        message: "Student added successfully",
        severity: "success",
      });
      reset();
      setProfileTemp('')
      props?.delayStudent(props?.search,props?.paginationModel);
      handleClose();

    }
    else if(res?.statusCode ===422){
      props?.setSnackbar({
        openSnackbar: true,
        message: "Mobile already exist",
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
  const onUpdateStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await patch(`users/${props?.studentId }`, props?.student);
    if (res?.statusCode === 200) {
      props?.setSnackbar({
        openSnackbar: true,
        message: "Student updated successfully",
        severity: "success",
      });
      reset();
      props?.delayStudent(props?.search,props?.paginationModel);
      handleClose();

    } else if(res?.statusCode ===422){
      props?.setSnackbar({
        openSnackbar: true,
        message: "Mobile already exist",
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
  const delStudentImg = async () => {
    setProfileTemp('')
    props?.setStudent({ ...props?.student, profile: "" })
    if (props?.studentId && props?.student?.profile) {
      setDeletedprofileTemp(props?.student?.profile)
    }
  }
  const uploadStudentPic = async (e, text) => {
    // let formData = new FormData()
    // formData.append('file', e.target.files[0])
    let temp = e?.target?.files[0]?.type?.split("/")[0]
    let ImgSubType = e?.target?.files[0]?.type?.split("/")[1]
    if (temp !== 'image' || ImgSubType === 'gif') {
      return props?.setSnackbar({
        openSnackbar: true,
        message: 'Input type should be Image',
        severity: 'error'
      })
    }
    setProfileTemp(e.target.files[0]);
  }
  const reset=()=>{
    setProfileTemp("");
    props?.setStudentId("")
    props?.setStudent({ name: '', mobile: '', profile: '',password:'Eulogik#123',role:'student',status:true });
  }
  const inputRef = useRef(null);

  useEffect(() => {
    if (props.open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [props.open]);
  return (
    <React.Fragment>
      <Dialog
        open={props?.open}
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            { props?.studentId ? onUpdateStudent(event) : onAddStudent(event) }
          },
        }}
      >

        <DialogTitle>{props?.studentId ? 'Update Student' : 'Add Student'}</DialogTitle>
        <DialogContent>
          <div className='flex flex-col gap-5 md:flex-row'>
            <div className='flex'>
              <div className={props?.student?.profile ? "border border-[grey] w-48 h-48  overflow-hidden" : "border border-[grey] p-1 w-48 h-48  overflow-hidden bg-[#D9D9D930] "} >
                {(profileTemp || props?.student?.profile) ? (
                  <div className='flex   gap-5 relative h-full' dir="rtl">
                    <div className='absolute   top-0 start-0 cursor-pointer bg-[rgba(255,255,255,0.5)]'>
                      <CloseOutlinedIcon onClick={()=>delStudentImg()} />
                    </div>
                    <img
                      src={props?.studentId && props?.student?.profile 
                        ? `${baseUrl}container/images/download/${props?.student?.profile}` 
                        : profileTemp ? URL.createObjectURL(profileTemp) : ''}
                      className="w-full h-full object-cover"
                      alt="expertImage"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full cursor-pointer">
                    <img src={frame} alt='frame' onClick={() => {
                      studentImg.current.click();
                    }} />
                  </div>
                )}
                <input
                  type="file"
                  hidden
                    onChange={(e) => { uploadStudentPic(e) }}
                  ref={studentImg}
                />
              </div>
            </div>
            <div className='flex-1 flex flex-col gap-8'>
              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="Name"
                label="Name"
                type="text"
                inputRef={inputRef}
                fullWidth
                variant="standard"
                size='small'
                value={props?.student?.name}
                onChange={(e) =>
                  props?.setStudent((prevState) => ({
                    ...prevState,
                    name: e.target.value,
                  }))
                }
                error={
                  props?.student?.name?.length > 0 &&
                  !StringWithSpace?.test(props?.student?.name)
                }
                helperText={
                  props?.student?.name?.length > 0 &&
                    !StringWithSpace?.test(props?.student?.name)
                    ? "Enter valid name"
                    : ""
                }
              />
              <TextField
                required
                margin="dense"
                id="phone"
                name="Phone Number"
                label="Phone Number"
                type="text"
                fullWidth
                variant="standard"
                size='small'
                value={props?.student?.mobile}
                onChange={(e) =>
                  props?.setStudent((prevState) => ({
                    ...prevState,
                    mobile: e.target.value,
                  }))
                }
                error={
                  props?.student?.mobile?.length > 0 &&
                  !phoneNumberRegex?.test(props?.student?.mobile)
                }
                helperText={
                  props?.student?.mobile?.length > 0 &&
                    !phoneNumberRegex?.test(props?.student?.mobile)
                    ? "Enter valid phone number"
                    : ""
                }
              />
            </div>
          </div>

        </DialogContent>
        <DialogActions >
          <Button onClick={handleClose} variant='outlined'>Cancel</Button>
          <Button type="submit" disabled={props?.student?.mobile && props?.student?.name && phoneNumberRegex?.test(props?.student?.mobile) && StringWithSpace?.test(props?.student?.name) && !loading?false :true} variant='contained'>{props?.studentId ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
