import React, { useEffect } from 'react'
import { Typography, TextField, IconButton, Skeleton } from '@mui/material';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { get, patch, post } from '../../services/api-services';
import { numberRegex } from '../../regex/regex';
import DoneIcon from '@mui/icons-material/Done';
import CustomSnackbar from '../../modules/CustomSnackbar';
export default function Settings() {
  document.title="Settings"
  const [editable, setEditable] = React.useState(false)
  const [settingsData, setSettingsData] = React.useState([]);
  const [settings, setSettings] = React.useState({count: ""});
  const [loading,setLoading] = React.useState(true)
  const [snackbar, setSnackbar] = React.useState({
    openSnackbar: false,
    message: '',
    severity: ''
  });
  const getSettings = async () => {
    setLoading(true)
    const res = await get("settings")
    if (res?.statusCode === 200) {
      setSettings(res?.data[0])
      setSettingsData(res?.data)
    }
    setLoading(false)
  }
  const patchSettings = async () => {
    if (settingsData?.length > 0) {
      const res = await patch(`settings/${settings?.id}`, { count: settings?.count })
      if (res?.statusCode === 200) {
        setSnackbar({
          openSnackbar: true,
          message: 'Count edited successfully',
          severity: 'success'
        })
      }
    }
    else {
      const res = await post("settings", settings)
      if (res?.statusCode === 200) {
        setSnackbar({
          openSnackbar: true,
          message: 'Count added successfully',
          severity: 'success'
        })
      }
      else if(res?.statusCode === 422){
        setSnackbar({
          openSnackbar: true,
          message: "Count can't be blank",
          severity: 'error'
        })
      }
    }
    setEditable(false)
    getSettings()
  }
  useEffect(() => {
    getSettings()
  }, [])
  return (
    <div className='flex-1 flex flex-col gap-10 '>
      <div className='flex flex-col gap-4 justify-between md:flex-row'>
        <Typography variant='h5'>
          Settings
        </Typography>
      </div>
    
        <div className='md:w-1/3 flex flex-col gap-4'>

          <Typography variant='h6'>Views Count</Typography>
       {loading?
         <Skeleton height={80}  animation="wave" />
       :   
          <div className='flex gap-2'>
          <TextField
            autoFocus
            required
            id="name"
            name="Write views count"
            label="Write views count"
            type="text"
            fullWidth
            variant="standard"
            size='small'
            value={settings?.count}
            disabled={editable ? false : true}
            onChange={(e) => setSettings({ ...settings, count: e.target.value })}
            error={
              settings?.count?.length > 0 &&
              !numberRegex?.test(settings?.count)
            }
            helperText={
              settings?.count?.length > 0 &&
                !numberRegex?.test(settings?.count)
                ? "Enter valid count"
                : ""
            }
          />
          <div className='pt-5'>
          {editable ?
                  <IconButton onClick={patchSettings} disabled={numberRegex?.test(settings?.count)?false:true}>  <DoneIcon/></IconButton>

                    :
                    <IconButton  onClick={(e) => { e.stopPropagation(); setEditable(true) }}> 
                    <DriveFileRenameOutlineOutlinedIcon /></IconButton>
                  }
          </div>
        </div>}

      </div>
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
    </div>
  )
}
