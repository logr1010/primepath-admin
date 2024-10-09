import React, { useCallback, useEffect, useRef, useState } from 'react'
import Search from '../../components/Search'
import Breadcrumb from '../../components/Breadcrumb'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { IconButton, Skeleton } from '@mui/material';
import Delete from '../../dialogs/Delete';
import { Button, Typography, CircularProgress } from '@mui/material';
import { TextField } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import DateDialog from '../../dialogs/DateDialog';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import debounce from 'lodash/debounce';
import { get, post } from '../../services/api-services';
import LectureDialog from '../../dialogs/LectureDialog';
import UpdateLecture from '../../dialogs/UpdateLecture';
import CustomSnackbar from '../../modules/CustomSnackbar';
import { FormatDate } from '../../modules/FormatDate';
import TablePagination from '@mui/material/TablePagination';
import { lectureNameRegex, urlRegex } from '../../regex/regex';

export default function Lecture() {
  document.title = "Lectures"
  const location = useLocation()
  const data = location.state;
  const [open, setOpen] = useState(false);
  const [openLecture, setOpenLecture] = useState(false);
  const [allLectures, setAllLectures] = useState([]);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [lectureId, setLectureId] = useState('');
  const [subjectId, setSubjectId] = useState(data?.subjectId);
  const [courseId, setCourseId] = useState(data?.courseId);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
  const [openFilter, setOpenFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sliderOpen, setSliderOpen] = useState(false);
  const [count, setCount] = useState(0);
  const usernameRef = useRef(null);
  const containerRef = useRef(null);
  const today = new Date();
  const yyyy = today?.getFullYear();
  const mm = String(today?.getMonth() + 1).padStart(2, '0'); // Months start at 0
  const dd = String(today?.getDate()).padStart(2, '0');
  const [lecture, setLecture] = useState({ name: '', thumbnail: '', url: '', date: `${yyyy}-${mm}-${dd}`, subjectId: subjectId });
  const [video, setVideo] = useState({ name: '', thumbnail: '', url: '', date: `${yyyy}-${mm}-${dd}`, subjectId: subjectId });
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in "yyyy-mm-dd" format
  // eslint-disable-next-line
  const [maxDate, setMaxDate] = React.useState(currentDate);
  const [snackbar, setSnackbar] = useState({
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
  };
  const handleChange = () => {
    setSliderOpen((prev) => !prev);
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
    setLecture({ name: '', thumbnail: '', url: '', date: `${yyyy}-${mm}-${dd}`, subjectId: subjectId })
  };
  const navigate = useNavigate();
  function ClickUsers(event) {
    event.preventDefault();
    navigate("/admin/users");
  }
  function ClickSubjects(event) {
    event.preventDefault();
    navigate("/admin/users/subjects", { state: { courseId: courseId } });
  }
  const breadcrumbs = [
    <Link
      className="cursor-pointer  hover:underline"
      underline="hover"
      key="1"
      onClick={ClickUsers}>
      <Typography variant='h2'>Users</Typography>
    </Link>,
    <Link
      className="cursor-pointer  hover:underline"
      underline="hover"
      key="2"
      onClick={ClickSubjects}>
      <Typography variant='h2'>Subjects</Typography>

    </Link>,
    <Typography variant='h1' key="3">
      Lecture
    </Typography>,
  ];

  const onEditLecture = async (value) => {
    setSliderOpen(false)
    setLectureId(value._id)
    setLecture({ name: value.name, thumbnail: value?.thumbnail, url: value?.url, date: value?.date?.split("T")[0], subjectId: data?.subjectId })
    setUpdateOpen(true);
  };
  const onDeleteLecture = async (value) => {
    setLectureId(value?._id)
    setDeleteOpen(true);
  };
  const onSetVideo = async (value) => {
    setOpenLecture(true);
    setVideo({
      name: value?.name, url: value?.url, date: FormatDate(value?.date)
    })
  };
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };
  const onAddLecture = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await post('lectures', lecture);
    setLecture({ name: '', thumbnail: '', url: '', date: `${yyyy}-${mm}-${dd}`, subjectId: data?.subjectId })
    if (res?.statusCode == 200) {
      setLoading(false);
      setSnackbar({
        openSnackbar: true,
        message: "Lecture added successfully",
        severity: "success",
      });
      delayLecture(search, paginationModel, dateFilter);
      if (usernameRef.current) {
        usernameRef.current.focus();
      }
    } else if (res?.statusCode == 409) {
      setSnackbar({
        openSnackbar: true,
        message: "Lecture already exist",
        severity: "error",
      })
    }

    else {
      setSnackbar({
        openSnackbar: true,
        message: "Something went wrong",
        severity: "error",
      })
    }
  }

  const getLectures = async (search, paginationModel, dateFilter) => {
    setLoading(true);
    const res = await post('subjects/getLectures', { subjectId: data?.subjectId, text: search, page: paginationModel, dateFilter: dateFilter })
    if (res?.statusCode === 200) {
      setAllLectures(res?.data[0]?.data);
      setCount(res?.data[0]?.metadata[0]?.total)
    }
    setLoading(false);
  }
  const delayLecture = useCallback(debounce(getLectures, 300), []);

  useEffect(() => {
    setPaginationModel({
      pageSize: 10,
      page: 0
    })
    delayLecture(search,
      {
        pageSize: 10,
        page: 0,
      }, dateFilter)
  }, [search])
  useEffect(() => {
    delayLecture(search, paginationModel, dateFilter)
  }, [paginationModel])
  return (
    <div className='flex-1 flex flex-col gap-4'>
      <div className='flex  flex-col gap-4 justify-between md:flex-row'>
        <div className='flex items-center'>
          <Breadcrumb breadcrumbs={breadcrumbs} />
          {sliderOpen ? <Tooltip >
            <IconButton onClick={() => handleChange()}>
              <RemoveCircleOutlineRoundedIcon />
            </IconButton>
          </Tooltip>
            : <Tooltip title='Add lecture'>
              <IconButton onClick={handleChange}>
                <AddCircleOutlineTwoToneIcon />
              </IconButton>
            </Tooltip>}
        </div>

        <div className='flex  gap-2 justify-between items-center'>
          <Search handleSearch={handleSearch} name='lecture' />
          <IconButton onClick={() => { setSliderOpen(false); setOpenFilter(true) }} >  <FilterAltOutlinedIcon /></IconButton>
        </div>
      </div>
      {/* TITLE URL COMPONENT */}
      {sliderOpen &&
        <div className='flex flex-col gap-4 shadow-lg p-7  lg:w-3/4 xl:w-2/3 2xl:w-1/2'>

          <div className='flex flex-col gap-4 w-full sm:flex-row'>
            <TextField id="outlined-basic" size='small'
              inputRef={usernameRef}
              autoFocus={true}
              required label="Title" variant="outlined" className='sm:w-4/5'
              value={lecture.name}
              onChange={(e) =>
                setLecture((prevState) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && lecture.name && lecture.url && lecture.date) onAddLecture(e);
              }}
              error={
                lecture.name?.length > 0 &&
                !lectureNameRegex?.test(lecture.name)
              }
              helperText={
                lecture.name?.length > 0 &&
                  !lectureNameRegex?.test(lecture.name)
                  ? "Please enter a valid title. The lecture name should be 2 to 64 characters long and can contain letters, numbers, spaces, and periods only."
                  : ""
              }
            />
            <TextField type='date' required size='small' className='sm:w-1/5' label='Date'
              InputLabelProps={{ shrink: true }}
              InputProps={{
                inputProps: {
                  format: 'dd/MM/yyyy', // Modify the date format here
                  max: maxDate,
                },
              }}
              color='primary'
              value={lecture.date}
              onChange={(e) =>
                setLecture((prevState) => ({
                  ...prevState,
                  date: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && lecture.name && lecture.url && lecture.date) onAddLecture(e);
              }}
            />
          </div>
          <div className='flex flex-col gap-4 w-full sm:flex-row'>
            <TextField id="outlined-basic" required size='small' label="Url" variant="outlined" value={lecture.url} className='sm:w-4/5 h-[39.99px]'
              onChange={(e) =>
                setLecture((prevState) => ({
                  ...prevState,
                  url: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && lecture.name && lecture.url && lecture.date) onAddLecture(e);
              }}
              error={
                lecture.url?.length > 0 &&
                !urlRegex?.test(lecture.url)
              }
              helperText={
                lecture.url?.length > 0 &&
                  !urlRegex?.test(lecture.url)
                  ? "Please enter a valid url."
                  : ""
              }
            />
            <Button variant='contained'
              size='small'
              className='sm:w-1/5'
              disabled={lecture?.name && lecture?.url && lecture?.date &&
                urlRegex?.test(lecture.url) && lectureNameRegex?.test(lecture.name) ? false : true}
              onClick={onAddLecture}>
              {loading ? <div className='flex gap-2'> <p className='text-[#FFFFFF]'>Adding</p> <CircularProgress size={24} sx={{ color: '#FFFFFF' }} /></div> : 'Add'}
            </Button>

          </div>
        </div>

      }
      {/* TABLE FOR ALL LECTURE */}
      <Box className='flex flex-col flex-1' ref={containerRef} sx={{ maxHeight: containerRef?.current?.offsetHeight, overflow: 'auto' }}>
        {loading ?
          <div className='flex-1 flex flex-col justify-between'>
            <div className='flex gap-2 md:justify-between items-center'>
              <div className='flex gap-5 items-center'>
                <Skeleton variant="rectangular" width={100} height={56} animation="wave" />
                <div className='flex flex-col gap-2'>
                  <Skeleton variant="rectangular" width={150} height={20} animation="wave" />
                  <Skeleton variant="rectangular" width={130} height={20} animation="wave" />
                </div>
              </div>
              <Skeleton variant="rectangular" height={40} width={115} animation="wave" />
            </div>
            <div className='flex gap-2 md:justify-between items-center'>
              <div className='flex gap-5 items-center'>
                <Skeleton variant="rectangular" width={100} height={56} animation="wave" />
                <div className='flex flex-col gap-2'>
                  <Skeleton variant="rectangular" width={150} height={20} animation="wave" />
                  <Skeleton variant="rectangular" width={130} height={20} animation="wave" />
                </div>
              </div>
              <Skeleton variant="rectangular" height={40} width={115} animation="wave" />
            </div>
            <div className='flex gap-2 md:justify-between items-center'>
              <div className='flex gap-5 items-center'>
                <Skeleton variant="rectangular" width={100} height={56} animation="wave" />
                <div className='flex flex-col gap-2'>
                  <Skeleton variant="rectangular" width={150} height={20} animation="wave" />
                  <Skeleton variant="rectangular" width={130} height={20} animation="wave" />
                </div>
              </div>
              <Skeleton variant="rectangular" height={40} width={115} animation="wave" />
            </div>
            <div className='flex gap-2 md:justify-between items-center'>
              <div className='flex gap-5 items-center'>
                <Skeleton variant="rectangular" width={100} height={56} animation="wave" />
                <div className='flex flex-col gap-2'>
                  <Skeleton variant="rectangular" width={150} height={20} animation="wave" />
                  <Skeleton variant="rectangular" width={130} height={20} animation="wave" />
                </div>
              </div>
              <Skeleton variant="rectangular" height={40} width={115} animation="wave" />
            </div>
            <div className='flex gap-2 md:justify-between items-center'>
              <div className='flex gap-5 items-center'>
                <Skeleton variant="rectangular" width={100} height={56} animation="wave" />
                <div className='flex flex-col gap-2'>
                  <Skeleton variant="rectangular" width={150} height={20} animation="wave" />
                  <Skeleton variant="rectangular" width={130} height={20} animation="wave" />
                </div>
              </div>
              <Skeleton variant="rectangular" height={40} width={115} animation="wave" />
            </div>
            <div className='flex gap-2 md:justify-between items-center'>
              <div className='flex gap-5 items-center'>
                <Skeleton variant="rectangular" width={100} height={56} animation="wave" />
                <div className='flex flex-col gap-2'>
                  <Skeleton variant="rectangular" width={150} height={20} animation="wave" />
                  <Skeleton variant="rectangular" width={130} height={20} animation="wave" />
                </div>
              </div>
              <Skeleton variant="rectangular" height={40} width={115} animation="wave" />
            </div>
            <div className='flex gap-2 md:justify-between items-center'>
              <div className='flex gap-5 items-center'>
                <Skeleton variant="rectangular" width={100} height={56} animation="wave" />
                <div className='flex flex-col gap-2'>
                  <Skeleton variant="rectangular" width={150} height={20} animation="wave" />
                  <Skeleton variant="rectangular" width={130} height={20} animation="wave" />
                </div>
              </div>
              <Skeleton variant="rectangular" height={40} width={115} animation="wave" />
            </div>

          </div>
          : allLectures?.length > 0 ?
            <div className='flex-1 flex flex-col'>
              <List className='flex-1'>
                {allLectures?.map((value) => {
                  return (
                    <ListItem
                      onClick={() => { onSetVideo(value) }}
                      key={value?._id}
                      secondaryAction={
                        <div className='flex justify-end gap-2 md:gap-0'>
                          <IconButton onClick={(e) => { onEditLecture(value); e.stopPropagation() }} sx={(theme) => ({
                            ':hover': {
                              color: theme.palette.action.hoverEdit,
                            },
                          })} className=' size-0 md:size-1/2'>
                            <DriveFileRenameOutlineOutlinedIcon color="iconColor" />
                          </IconButton>
                          <IconButton onClick={(e) => { onDeleteLecture(value); e.stopPropagation() }} sx={(theme) => ({
                            ':hover': {
                              color: theme.palette.action.hoverDelete,
                            },
                          })} className=' size-0 md:size-1/2'>

                            <DeleteOutlineOutlinedIcon />
                          </IconButton>
                        </div>
                      }
                      disablePadding
                    >
                      <ListItemButton className="gap-2 truncate">
                        <ListItemAvatar className="flex-shrink-0">
                          <img
                            width={100}
                            alt="thumbnail"
                            src={value?.thumbnail}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          className="capitalize " // Ensure the container doesn't expand unnecessarily
                          primary={
                            <Tooltip title={value?.name}>
                              <div className="flex flex-1 mr-10 md:mr-16 truncate whitespace-nowrap overflow-hidden">
                                <p className="truncate text-ellipsis">
                                  {value?.name}
                                </p>
                              </div>

                            </Tooltip>
                          }
                          secondary={
                            <React.Fragment>
                              {FormatDate(value?.date)}
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
            </div>
            : <Box className='flex justify-center items-center flex-1'><Typography variant='body2'>No lectures yet.</Typography>   </Box>
        }
      </Box>
      <UpdateLecture lecture={lecture} setLecture={setLecture} updateOpen={updateOpen} setUpdateOpen={setUpdateOpen} lectureId={lectureId} delayLecture={delayLecture} snackbar={snackbar} setSnackbar={setSnackbar} subjectId={subjectId} search={search} paginationModel={paginationModel} dateFilter={dateFilter} />
      <Delete deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen} name="Lecture" id={lectureId} setLectureId={setLectureId} delayLecture={delayLecture} endPoint='lectures' snackbar={snackbar} setSnackbar={setSnackbar} search={search} paginationModel={paginationModel} dateFilter={dateFilter} />
      <DateDialog name='lecture' openFilter={openFilter} setOpenFilter={setOpenFilter} delayLecture={delayLecture} dateFilter={dateFilter} setDateFilter={setDateFilter} search={search} paginationModel={paginationModel} setPaginationModel={setPaginationModel} />
      <LectureDialog openLecture={openLecture} setOpenLecture={setOpenLecture} video={video} setVideo={setVideo} subjectId={subjectId} />
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
