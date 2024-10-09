import { Button, Skeleton, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState,useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Search from '../../components/Search';
import Breadcrumb from '../../components/Breadcrumb';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { IconButton, CircularProgress, Box } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Delete from '../../dialogs/Delete';
import SubjectDialog from '../../dialogs/SubjectDialog';
import { get } from '../../services/api-services';
import CustomSnackbar from '../../modules/CustomSnackbar';
import debounce from 'lodash/debounce';

export default function Subject() {
  document.title="Subjects"
  const location = useLocation()
  const data = location.state;
  const [subject, setSubject] = useState({ name: '', courseId: data?.courseId});
  const [subjectId, setSubjectId] = useState('');
  const [courseId, setCourseId] = useState(data?.courseId);
  const [allSubject, setAllSubject] = useState([]);
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    openSnackbar: false,
    message: "",
    severity: "",
  });
  function breadCrumbClick(event) {
    event.preventDefault();
    navigate("/admin/users");
  }
  const breadcrumbs = [
    <Link
      className="cursor-pointer  hover:underline"
      underline="hover"
      key="1"
      onClick={breadCrumbClick}>
      <Typography variant='h2'  key="2">Users</Typography>
    </Link>,
    <Typography variant='h1' key="3">Subjects</Typography>
  ];
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };
  const onEditSubject = async (value) => {
    setSubject({ name: value?.name });
    setSubjectId(value?.id)
    setOpen(true);
  };
  const getSubjects = async (search) => {
    setLoading(true);
    const filter = search ? JSON.stringify({
      where: {
        name: {
          like: `${search}`,
          options: "i" // Assuming you want a case-insensitive search
        },
      },
      order: "created DESC" // Ensure the field name matches your schema
    }) : JSON.stringify({ order: "created DESC" });
    const res = await get(`courses/${courseId}/subjects?filter=${filter}`);
    if (res?.statusCode === 200) {
      setAllSubject(res?.data)
    }
    setLoading(false)
  }

  const onDeleteSubject = async (value) => {
    setSubjectId(value?.id)
    setDeleteOpen(true);
  };
  const delay =useCallback(debounce(getSubjects, 300), []);
  useEffect(() => {
    delay(search)
  }, [search])
  return (
    <div className='flex-1 flex flex-col gap-4 '>
      <div className='flex flex-col gap-4 justify-between md:flex-row'>
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <div className='flex  justify-between'>
        <div className='w-1/2 sm:w-2/3' >
          <Search handleSearch={handleSearch} name="subject" /></div>
          <Button variant='contained'
            className='h-[40px]'
            onClick={() => { setOpen(true) }}
          >Add Subject</Button>
        </div>
      </div>
      <Box className='flex flex-col flex-1' ref={containerRef} sx={{ maxHeight: containerRef?.current?.offsetHeight, overflow: 'auto' }}>
     {loading 
     ?    <div className='flex-1 flex flex-col justify-between'>
     <div className='flex gap-2 md:justify-between'>
     <Skeleton  width={300} height={40} animation="wave" />
     <Skeleton  height={40} width={115} animation="wave" />
     </div>
     <div className='flex gap-2 md:justify-between'>
     <Skeleton  width={300} height={40} animation="wave" />
     <Skeleton  height={40} width={115} animation="wave" />
     </div>
     <div className='flex gap-2 md:justify-between'>
     <Skeleton  width={300} height={40} animation="wave" />
     <Skeleton  height={40} width={115} animation="wave" />
     </div>
     <div className='flex gap-2 md:justify-between'>
     <Skeleton  width={300} height={40} animation="wave" />
     <Skeleton  height={40} width={115} animation="wave" />
     </div>
     <div className='flex gap-2 md:justify-between'>
     <Skeleton  width={300} height={40} animation="wave" />
     <Skeleton  height={40} width={115} animation="wave" />
     </div>
     <div className='flex gap-2 md:justify-between'>
     <Skeleton  width={300} height={40} animation="wave" />
     <Skeleton  height={40} width={115} animation="wave" />
     </div>
     <div className='flex gap-2 md:justify-between'>
     <Skeleton  width={300} height={40} animation="wave" />
     <Skeleton  height={40} width={115} animation="wave" />
     </div>
     <div className='flex gap-2 md:justify-between'>
     <Skeleton  width={300} height={40} animation="wave" />
     <Skeleton  height={40} width={115} animation="wave" />
     </div>
     <div className='flex gap-2 md:justify-between'>
     <Skeleton  width={300} height={40} animation="wave" />
     <Skeleton  height={40} width={115} animation="wave" />
     </div>
     <div className='flex gap-2 md:justify-between'>
     <Skeleton  width={300} height={40} animation="wave" />
     <Skeleton  height={40} width={115} animation="wave" />
     </div>
     <div className='flex gap-2 md:justify-between'>
     <Skeleton  width={300} height={40} animation="wave" />
     <Skeleton  height={40} width={115} animation="wave" />
     </div>
     <div className='flex gap-2 md:justify-between'>
     <Skeleton  width={300} height={40} animation="wave" />
     <Skeleton  height={40} width={115} animation="wave" />
     </div>
     <div className='flex gap-2 md:justify-between'>
     <Skeleton  width={300} height={40} animation="wave" />
     <Skeleton  height={40} width={115} animation="wave" />
     </div>
       </div>
      :allSubject?.length>0?
      <List>
        {allSubject?.map((value) => {
          const labelId = `checkbox-list-secondary-label-${value?.id}`;
          return (
            <ListItem
            style={{padding:0}}
              onClick={(params) => { navigate('lecture',{ state: { subjectId: value?.id ,courseId:courseId} }) }}

              key={value?.id}
              secondaryAction={
                <div className='flex items-center gap-2'>
                  <IconButton onClick={(e) => { onEditSubject(value); e.stopPropagation() }} className=' size-0 md:size-1/2'
                    sx={(theme) => ({
                      ':hover': {
                        color: theme.palette.action.hoverEdit,
                      },
                    })}
                    >
                    <DriveFileRenameOutlineOutlinedIcon  />
                  </IconButton>
                  <IconButton onClick={(e) => { onDeleteSubject(value); e.stopPropagation() }} className=' size-0 md:size-1/2'
                     sx={(theme) => ({
                      ':hover': {
                        color: theme.palette.action.hoverDelete,
                      },
                    })}
                    >

                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </div>
              }
              disablePadding
            >
              <ListItemButton>

                <ListItemText id={labelId} className="capitalize overflow-hidden text-ellipsis whitespace-normal break-words" primary={`${value?.name}`} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    :<Box className='flex justify-center items-center flex-1'><Typography variant='body2'>No subject yet</Typography>   </Box>
    }
    </Box>
      <SubjectDialog open={open} setOpen={setOpen} courseId={data?.courseId} subject={subject} setSubjectId={setSubjectId} setSubject={setSubject} subjectId={subjectId} getSubjects={getSubjects} snackbar={snackbar} setSnackbar={setSnackbar} />
      <Delete name="Subject" deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen} endPoint='subjects' getSubjects={getSubjects} id={subjectId} setSubjectId={setSubjectId} snackbar={snackbar} setSnackbar={setSnackbar} search={search}/>
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
