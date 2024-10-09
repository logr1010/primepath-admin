import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Button, Skeleton, Typography } from '@mui/material';
import Search from '../../components/Search';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { IconButton, CircularProgress, Box } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Delete from '../../dialogs/Delete';
import { useNavigate } from 'react-router-dom';
import StudentDialog from '../../dialogs/StudentDialog';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { AntSwitch } from '../../components/AntSwitch';
import { baseUrl, post } from '../../services/api-services';
import debounce from 'lodash/debounce';
import CustomSnackbar from '../../modules/CustomSnackbar';
import { FormatDate } from '../../modules/FormatDate';
import ConfirmStatus from '../../dialogs/ConfirmStatus';
import TablePagination from '@mui/material/TablePagination';
export default function Students() {
  document.title = "Students"
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allStudent, setAllStudent] = useState([]);
  const [openConfimation, setOpenConfimation] = useState(false);
  const [student, setStudent] = useState({ name: '', mobile: '', profile: '', password: 'Eulogik#123', role: 'student', status: true });
  const [studentStatus, setStudentStatuse] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(0);
  const containerRef = useRef(null);
  const [snackbar, setSnackbar] = React.useState({
    openSnackbar: false,
    message: "",
    severity: "",
  });
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const handleChangePage = (event, newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setPaginationModel((prev) => ({ ...prev, pageSize: parseInt(event.target.value, 10) }));
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };
  const navigate = useNavigate();
  const confirmOpen = (value) => {
    setOpenConfimation(true);
    setStudentId(value?._id)
    setStudentStatuse(value?.status);
  }
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };
  const onEditStudent = async (value) => {
    setOpen(true);
    setStudentId(value?._id);
    setStudent({ name: value?.name, mobile: value?.mobile, profile: value?.profile, status: value?.status });
  };
  const onDeleteStudent = async (value) => {
    setStudentId(value?._id)
    setDeleteOpen(true);
  };
  const getStudents = async (search, paginationModel) => {
    setLoading(true)
    const res = await post(`users/getStudent`, { text: search, page: paginationModel });
    if (res?.statusCode === 200) {
      setAllStudent(res?.data?.data);
      setCount(res?.data?.filterCount)
    }
    setLoading(false)
  }
  const delayStudent = useCallback(debounce(getStudents, 300), []);
  useEffect(() => {
    setPaginationModel({
      pageSize: 10,
      page: 0
    })
    delayStudent(search,
      {
        pageSize: 10,
        page: 0,
      })
  }, [search])


  useEffect(() => {
    delayStudent(search, paginationModel)
  }, [paginationModel])
  return (
    <div className='flex-1 flex flex-col gap-4'>
      <div className='flex flex-col gap-4 justify-between md:flex-row'>
        <Typography variant='h1'>Students</Typography>
        <div className='flex justify-between' >
          <div className='w-1/2 sm:w-2/3' >
            <Search handleSearch={handleSearch} name="student" />
          </div>

          <Button
            variant='contained'
            onClick={() => { setOpen(true) }}
            className='h-[40px]'
          >Add Student</Button>
        </div>
      </div>
      <Box className='flex flex-col flex-1' ref={containerRef} sx={{ maxHeight: containerRef?.current?.offsetHeight, overflow: 'auto' }}>
        {loading ?
          <div className='flex-1 flex flex-col justify-between'>
            <div className='flex gap-2 md:justify-between items-center'>
              <div className='flex gap-5 items-center'>
              <Skeleton variant="circular" width={40} height={40} animation="wave" />
              <div className='flex flex-col gap-2'>
              <Skeleton variant="rectangular"  width={150} height={20} animation="wave" />
              <Skeleton variant="rectangular"  width={300} height={20} animation="wave" />
              </div>
              </div>
              <Skeleton variant="rectangular" height={40} width={115} animation="wave" />
            </div>
            <div className='flex gap-2 md:justify-between items-center'>
              <div className='flex gap-5 items-center'>
              <Skeleton variant="circular" width={40} height={40} animation="wave" />
              <div className='flex flex-col gap-2'>
              <Skeleton variant="rectangular"  width={150} height={20} animation="wave" />
              <Skeleton variant="rectangular"  width={300} height={20} animation="wave" />
              </div>
              </div>
              <Skeleton variant="rectangular" height={40} width={115} animation="wave" />
            </div>
            <div className='flex gap-2 md:justify-between items-center'>
              <div className='flex gap-5 items-center'>
              <Skeleton variant="circular" width={40} height={40} animation="wave" />
              <div className='flex flex-col gap-2'>
              <Skeleton variant="rectangular"  width={150} height={20} animation="wave" />
              <Skeleton variant="rectangular"  width={300} height={20} animation="wave" />
              </div>
              </div>
              <Skeleton variant="rectangular" height={40} width={115} animation="wave" />
            </div>
            <div className='flex gap-2 md:justify-between items-center'>
              <div className='flex gap-5 items-center'>
              <Skeleton variant="circular" width={40} height={40} animation="wave" />
              <div className='flex flex-col gap-2'>
              <Skeleton variant="rectangular"  width={150} height={20} animation="wave" />
              <Skeleton variant="rectangular"  width={300} height={20} animation="wave" />
              </div>
              </div>
              <Skeleton variant="rectangular" height={40} width={115} animation="wave" />
            </div>
            <div className='flex gap-2 md:justify-between items-center'>
              <div className='flex gap-5 items-center'>
              <Skeleton variant="circular" width={40} height={40} animation="wave" />
              <div className='flex flex-col gap-2'>
              <Skeleton variant="rectangular"  width={150} height={20} animation="wave" />
              <Skeleton variant="rectangular"  width={300} height={20} animation="wave" />
              </div>
              </div>
              <Skeleton variant="rectangular" height={40} width={115} animation="wave" />
            </div>
            <div className='flex gap-2 md:justify-between items-center'>
              <div className='flex gap-5 items-center'>
              <Skeleton variant="circular" width={40} height={40} animation="wave" />
              <div className='flex flex-col gap-2'>
              <Skeleton variant="rectangular"  width={150} height={20} animation="wave" />
              <Skeleton variant="rectangular"  width={300} height={20} animation="wave" />
              </div>
              </div>
              <Skeleton variant="rectangular" height={40} width={115} animation="wave" />
            </div>
            <div className='flex gap-2 md:justify-between items-center'>
              <div className='flex gap-5 items-center'>
              <Skeleton variant="circular" width={40} height={40} animation="wave" />
              <div className='flex flex-col gap-2'>
              <Skeleton variant="rectangular"  width={150} height={20} animation="wave" />
              <Skeleton variant="rectangular"  width={300} height={20} animation="wave" />
              </div>
              </div>
              <Skeleton variant="rectangular" height={40} width={115} animation="wave" />
            </div>

          </div>
          : allStudent?.length > 0 && !loading &&
          <Box className='flex flex-col flex-1'>
            <List disablePadding className='flex-1' >
              {allStudent?.map((value) => {
                // const labelId = `checkbox-list-secondary-label-${value}`;
                return (
                  <ListItem
                    style={{ padding: 0, opacity: value?.status ? 1 : 0.5 }}
                    onClick={(params) => { navigate('profile', { state: { studentId: value?._id } }) }}
                    key={value}
                    secondaryAction={
                      <div className='flex  items-center gap-3'>
                        <IconButton onClick={(e) => { e.stopPropagation(); confirmOpen(value); }} className=' size-0 md:size-fix'>
                          <AntSwitch checked={value?.status} size="small" /></IconButton>
                        <IconButton onClick={(e) => { onEditStudent(value); e.stopPropagation() }} className=' size-px md:size-fix'
                          sx={(theme) => ({
                            ':hover': {
                              color: theme.palette.action.hoverEdit,
                            },
                          })}>
                          <DriveFileRenameOutlineOutlinedIcon color="iconColor" />
                        </IconButton>
                        <IconButton onClick={(e) => { onDeleteStudent(value); e.stopPropagation() }} className=' size-px md:size-fix'
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
                  >
                    <ListItemButton>
                      <ListItemAvatar>
                        {value?.profile ? <Avatar alt="student" src={`${baseUrl}container/images/download/${value?.profile}`} /> : <Avatar>{value?.name[0]?.toUpperCase()}</Avatar>}
                      </ListItemAvatar>
                      <ListItemText
                        primary={value?.name}
                        secondary={
                          <React.Fragment >
                            <Box
                              component="span"
                              sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'flex-start', sm: 'center' },
                              }}
                            >
                              <Box component="span" sx={{ marginRight: { sm: 1, xs: 0 }, }}>
                                {value?.mobile}
                              </Box>
                              <Box component="span" sx={{ marginRight: { sm: 1, xs: 0 }, display: { xs: "none", sm: "block" }, }}>
                                |
                              </Box>

                              <Box component="span">
                                {FormatDate(value?.created)}
                              </Box>
                            </Box>
                          </React.Fragment>
                        }
                      />

                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
            <TablePagination
              component="div"
              count={count}
              page={paginationModel?.page}
              onPageChange={handleChangePage}
              rowsPerPage={paginationModel?.pageSize}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        }
      </Box>
      {allStudent?.length < 0 && !loading && <Box className='flex justify-center flex-1'><Typography variant='body2'>No students yet.</Typography>   </Box>}
      <StudentDialog open={open} setOpen={setOpen} studentId={studentId} setStudentId={setStudentId} student={student} setStudent={setStudent} snackbar={snackbar} setSnackbar={setSnackbar} delayStudent={delayStudent} search={search} paginationModel={paginationModel} />
      <Delete name="Student" deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen} snackbar={snackbar} setSnackbar={setSnackbar} id={studentId} setStudentId={setStudentId} delayStudent={delayStudent} endPoint='users' search={search} paginationModel={paginationModel} />
      <ConfirmStatus openConfimation={openConfimation} setOpenConfimation={setOpenConfimation} studentStatus={studentStatus} studentId={studentId} setStudentId={setStudentId} delayStudent={delayStudent} search={search} paginationModel={paginationModel} snackbar={snackbar} setSnackbar={setSnackbar}/>
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
