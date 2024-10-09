import React, { useState, useCallback, useEffect, useRef } from 'react'
import Breadcrumb from '../../components/Breadcrumb'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Typography, Avatar, Box, Divider, IconButton, CircularProgress } from '@mui/material';
import Search from '../../components/Search';
import ContentFilter from './ContentFilter';
import { baseUrl, get, post } from '../../services/api-services';
import debounce from 'lodash/debounce';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FormatDate } from '../../modules/FormatDate';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import LectureDialog from '../../dialogs/LectureDialog';
import Tooltip from '@mui/material/Tooltip';
import TablePagination from '@mui/material/TablePagination';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Skeleton from '@mui/material/Skeleton';
import DateDialog from '../../dialogs/DateDialog';
export default function Studentsdetail() {
  document.title = "Student-Details"
  const [assignOpen, setAssignOpen] = useState(false);
  const location = useLocation();
  const [openFilter, setOpenFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentDetail, setStudentDetail] = useState({});
  const [allCourse, setAllCourse] = useState([]);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [searchCourse, setSearchCourse] = useState("");
  const [searchLecture, setSearchLecture] = useState("");
  const data = location.state;
  const [subCount, setSubCount] = useState(0);
  const [studentId, setStudentId] = useState(data?.studentId);
  const [assign, setAssign] = useState([{ userId: '', subjectId: '' }]);
  const [assignedDel, setAssignedDel] = useState([{ userId: '', subjectId: '' }]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [viewedLec, setViewedLec] = useState([]);
  const [openLecture, setOpenLecture] = useState(false);
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
  const today = new Date();
  const yyyy = today?.getFullYear();
  const mm = String(today?.getMonth() + 1).padStart(2, '0'); // Months start at 0
  const dd = String(today?.getDate()).padStart(2, '0');
  const [video, setVideo] = useState({ name: '', thumbnail: '', url: '', date: `${yyyy}-${mm}-${dd}` })
  const [count, setCount] = useState(0);
  const containerRef = useRef(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);
  const [viewLoading, setViewLoading] = useState(true);
  const [assigedCourseIds, setAssignesCourseIds] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const handleChangePage = (event, newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setPaginationModel((prev) => ({ ...prev, pageSize: parseInt(event.target.value, 10) }));
  };
  const navigate = useNavigate();
  function ClickStudent(event) {
    event.preventDefault();
    navigate("/admin/students");
  }
  const breadcrumbs = [
    <Link
      className="cursor-pointer  hover:underline"
      underline="hover"
      key="1"
      onClick={ClickStudent}>
      <Typography variant='h2'>Students</Typography>

    </Link>,

    <Typography variant='h1' key="2">
      Students Profile
    </Typography>,
  ];
  const courseSearch = (event) => {
    setSearchCourse(event.target.value);
  };
  const handleSearch = (event) => {
    setSearchLecture(event.target.value);
  };
  const onSetVideo = async (value) => {
    setOpenLecture(true);
    setVideo({
      name: value?.lectureDetailName, url: value?.url, date: FormatDate(value?.date)
    })
  };
  const getStudent = async (search) => {
    setDetailLoading(true);
    const res = await get(`users/${studentId}`);
    if (res?.statusCode === 200) {
      setStudentDetail(res?.data)
    }
    setDetailLoading(false)
  }

  const getSubjects = async () => {
    let temp = [];
    let assigntemp = [];
    let assigntempDelete = [];
    let subjectIds = [];
    let assigenedCourseIds = [];
    let res = await get(`users/${studentId}?filter=${encodeURIComponent(JSON.stringify({ include: [{ relation: 'subjects', scope: { include: [{ relation: 'courses' }, { relation: 'usersubjects', scope: { where: { "userId": studentId }, fields: ["subjectId", "userId", "id"] } }] } }] }))}`);
    let transformedData = Object.values(
      res?.data?.subjects?.reduce((acc, subject) => {
        const courseId = subject.courseId;

        // If the course is not already in the accumulator, add it
        if (!acc[courseId]) {
          assigenedCourseIds.push(courseId)
          acc[courseId] = {
            id: subject.courses.id,
            name: subject.courses.name,
            created: subject.courses.created,
            modified: subject.courses.modified,
            subjects: []
          };
        }
        subjectIds.push(subject.id);
        assigntemp.push({ userId: studentId, subjectId: subject.id });
        assigntempDelete.push(subject.usersubjects[0])
        // Add the subject to the course's subjects array
        acc[courseId].subjects.push({
          id: subject.id,
          name: subject.name,
          created: subject.created,
          modified: subject.modified
        });
        return acc;
      }, {})
    );
    temp = [...res?.data?.subjects]
    setAssignedSubjects(transformedData);
    setSelectedSubjects(subjectIds);
    setAssign(assigntemp);
    setAssignedDel(assigntempDelete);
    setSubCount(subjectIds?.length);
    setAssignesCourseIds(assigenedCourseIds)
  }
  const getCourses = async (searchCourse) => {
    setContentLoading(true);
    const filter = {
      include: { relation: "subjects" },
      where: {
        name: { like: searchCourse, options: "i" }
      }
    };

    const res = await get(`courses?filter=${encodeURIComponent(JSON.stringify(filter))}`);
    if (res?.statusCode === 200) {
      const result = res?.data.filter(course => course.subjects && course.subjects.length > 0);
      setAllCourse(result)
    }
    setContentLoading(false)
  }
  const getViews = async (searchLecture, paginationModel, dateFilter) => {
    setViewLoading(true);
    const res = await post(`users/getViewsByUserId`, { userId: studentId, text: searchLecture, page: paginationModel, dateFilter: dateFilter });
    if (res?.statusCode === 200) {
      setViewedLec(res?.data?.[0]?.data);
      setCount(res?.data?.[0]?.metadata[0]?.total)
    }
    setViewLoading(false);
  }
  const delayStudent = useCallback(debounce(getStudent, 300), []);
  const delayCourse = useCallback(debounce(getCourses, 300), []);
  const delayViews = useCallback(debounce(getViews, 300), []);

  useEffect(() => {
    delayStudent();
    getSubjects();
  }, [])
  useEffect(() => {
    delayCourse(searchCourse);
  }, [searchCourse])
  useEffect(() => {
    setPaginationModel({
      pageSize: paginationModel.pageSize,
      page: 0
    })
    delayViews(searchLecture,
      {
        pageSize: paginationModel.pageSize,
        page: 0,
      }, dateFilter)
  }, [searchLecture])
  useEffect(() => {
    delayViews(searchLecture, paginationModel, dateFilter)
  }, [paginationModel])
  // useEffect(() => {
  //   delayViews(searchLecture, paginationModel,dateFilter);
  // }, [searchLecture, paginationModel])
  return (
    <div className='flex-1  max-h-screen flex flex-col gap-10 overflow-hidden'>
      <div className='flex flex-col gap-4 justify-between  md:flex-row'>
        <Breadcrumb breadcrumbs={breadcrumbs} />
      </div>
      {detailLoading ?
        <div className='flex gap-5 items-center'>
          <Skeleton variant="circular" width={80} height={80} />
          <Skeleton variant="rectangular" width={210} height={60} />

        </div>
        :
        <div className='flex gap-10 items-center  '>
          <div>  {studentDetail?.profile ? <Avatar src={`${baseUrl}container/images/download/${studentDetail?.profile}`} sx={{ width: 80, height: 80 }} /> :
            <Avatar sx={{ width: 80, height: 80 }}>
              {studentDetail?.name?.[0]?.toUpperCase() || ''}
            </Avatar>}  </div>
          <div className='flex flex-col  '>
            <div className='flex gap-3 md:items-center flex-col md:flex-row'>
              <Typography variant='h1'>{studentDetail?.name}</Typography>
              <hr className="bg-[#2E2E2E] h-4 mt-1 w-1 border-0 hidden md:block" />
              {/* <Divider /> */}
              <Typography variant='body1'>{`91${studentDetail?.mobile}`}</Typography>
            </div>
            <Typography variant='subtitle2'>{`${FormatDate(studentDetail?.created)}`}</Typography>
          </div>
        </div>
      }
      <Divider />
      <div className='flex flex-col gap-6 flex-1 overflow-auto p-3' ref={containerRef} style={{ maxHeight: containerRef?.current?.offsetHeight }}>
        {/* CONTENT CONTAINER SECTION */}
        {contentLoading ?
          <div >
             <Skeleton    sx={{
                width: { xs: '100%', sm: '50%' },
            }} animation="wave" />
            <Skeleton     sx={{
                width: { xs: '100%', sm: '50%' },
            }}animation="wave" />
            <Skeleton     sx={{
                width: { xs: '100%', sm: '50%' },
            }}animation="wave" />
            <Skeleton     sx={{
                width: { xs: '100%', sm: '50%' },
            }}animation="wave" />
            <Skeleton     sx={{
                width: { xs: '100%', sm: '50%' },
            }}animation="wave" />
            <Skeleton     sx={{
                width: { xs: '100%', sm: '50%' },
            }}animation="wave" />
            <Skeleton     sx={{
                width: { xs: '100%', sm: '50%' },
            }}animation="wave" />
            <Skeleton     sx={{
                width: { xs: '100%', sm: '50%' },
            }}animation="wave" />

          </div>
          :
            <div className='flex flex-col gap-4'>
              <div className='flex justify-between'>
              <Typography variant='h5'>Content</Typography>
              <ContentFilter assignOpen={assignOpen} setAssignOpen={setAssignOpen} allCourse={allCourse} studentId={studentId} assign={assign} setAssign={setAssign} selectedSubjects={selectedSubjects}
              subCount={subCount} getSubjects={getSubjects} courseSearch={courseSearch}
              setSelectedSubjects={setSelectedSubjects} assigedCourseIds={assigedCourseIds} setAssignesCourseIds={setAssignesCourseIds} assignedDel={assignedDel} setAssignedDel={setAssignedDel} />
              </div>
              {assignedSubjects?.map((data, index) => (<div key={index}>
                <Typography variant='body1'>{data?.name}</Typography>
                {data?.subjects.map((data, index) => (
                  <div key={index} className='flex items-center gap-1'><CheckOutlinedIcon color='primary' />   <Typography variant='body2'>{data?.name}</Typography>  </div>
                ))}
              </div>
              ))}
            </div>
         }

        <Divider />
        {/* WATCH CONTAINER SECTION */}
        {viewLoading ?
             <div >
             <Skeleton    sx={{
                width: { xs: '100%', sm: '50%' },
            }} animation="wave" />
           <Skeleton    sx={{
                width: { xs: '100%', sm: '50%' },
            }} animation="wave" />
           <Skeleton    sx={{
                width: { xs: '100%', sm: '50%' },
            }} animation="wave" />
           <Skeleton    sx={{
                width: { xs: '100%', sm: '50%' },
            }} animation="wave" />
           <Skeleton    sx={{
                width: { xs: '100%', sm: '50%' },
            }} animation="wave" />
           <Skeleton    sx={{
                width: { xs: '100%', sm: '50%' },
            }} animation="wave" />
           <Skeleton    sx={{
                width: { xs: '100%', sm: '50%' },
            }} animation="wave" />
           <Skeleton    sx={{
                width: { xs: '100%', sm: '50%' },
            }} animation="wave" />
          </div>
          :
          <div className='flex flex-1 flex-col min-h-[60vh]'>
            <div className='flex justify-between md:items-center flex-col md:flex-row'>
              <Typography variant='h5'>Watch History </Typography>
              <div className='flex  gap-2 justify-between items-center'>
                <Search handleSearch={handleSearch} name="history" />
                <IconButton onClick={() => { setOpenFilter(true) }} >  <FilterAltOutlinedIcon /></IconButton>
              </div>
            </div>
            {loading ? <Box className='flex justify-center items-center flex-1'>
              <CircularProgress />
            </Box>
              : viewedLec?.length > 0 ?
                <div className='min-h-[50vh]'>
                  <List className='min-h-[50vh]'>
                    {viewedLec?.map((value) => {
                      return (
                        <Tooltip key={value?._id} arrow title={value?.courseName + " / " + value?.subjectName} slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: 'offset',
                                options: {
                                  offset: [0, -24],
                                },
                              },
                            ],
                          },
                        }}>
                          <ListItem
                            onClick={() => { onSetVideo(value) }}
                            disablePadding
                          >
                            <ListItemButton>
                              <ListItemText
                                primary={value?.lectureDetailName}
                                secondary={
                                  <React.Fragment>
                                    {FormatDate(value?.created)}
                                  </React.Fragment>
                                }
                              />

                            </ListItemButton>

                          </ListItem>
                        </Tooltip>
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
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                </div>
                :
                <Box className='flex-1 flex justify-center items-center'><Typography variant='body2'>No lectures yet.</Typography>   </Box>
            }
          </div>}
      </div>
      <LectureDialog openLecture={openLecture} setOpenLecture={setOpenLecture} video={video} setVideo={setVideo} />
      <DateDialog name='lecHisStudent' openFilter={openFilter} setOpenFilter={setOpenFilter} delayViews={delayViews} dateFilter={dateFilter} setDateFilter={setDateFilter} search={searchLecture} paginationModel={paginationModel} setPaginationModel={setPaginationModel} />
    </div>
  )
}
