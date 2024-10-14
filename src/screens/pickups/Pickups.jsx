import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Button, Skeleton, Typography } from '@mui/material';
import Search from '../../components/Search';
import { IconButton, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { get } from '../../services/api-services';
import CustomSnackbar from '../../modules/CustomSnackbar';
import debounce from 'lodash/debounce';
import DynamicTable from '../../components/DynamicTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LocalPickups from './Local';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            className='h-full'
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box className='h-full'>{children}</Box>}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const columns = [
    {
        id: 'firstName',
        label: 'First Name',
        minWidth: 80
    },
    {
        id: 'lastName',
        label: 'Last Name',
        minWidth: 80
    },
    {
        id: 'mobile',
        label: 'Mobile',
        minWidth: 100
    },
    {
        id: 'email',
        label: 'Email',
        minWidth: 120,
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'gender',
        label: 'Gender',
        minWidth: 60,
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'active',
        label: 'Status',
        minWidth: 170,
        // align: 'right',
        toggle: true,
        // format: (value) => value.toFixed(2),
    },
];

export default function Pickups() {
    document.title = "Pickups"
    const [course, setCourse] = useState({ name: '' });
    const [courseId, setCourseId] = useState('');
    const [pickups, setPickups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const containerRef = useRef(null);

    const [tab, setTab] = React.useState(0);

    const [snackbar, setSnackbar] = React.useState({
        openSnackbar: false,
        message: "",
        severity: "",
    });
    const navigate = useNavigate()

    const getPickups = async (search) => {
        setLoading(true)
        const filter = search ? JSON.stringify({
            where: {
                "name": { "like": `${search}`, "options": "i" }
            },
            order: "createdAt DESC" // sort by createdAt in descending order
        }) : JSON.stringify({ order: "createdAt DESC" })
        const res = await get(`Partners?filter=${filter}`);
        if (res?.statusCode === 200) {
            setPickups(res?.data)
        }
        setLoading(false)
    }

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
      };
    

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };
    const delay = useCallback(debounce(getPickups, 300), []);
    useEffect(() => {
        delay(search)
    }, [search])
    return (
        <div className='flex-1 flex flex-col gap-4 px-4 py-6'>
            <div className='flex flex-col static gap-4 md:justify-between md:flex-row '>
                <Typography variant='h1'>Pickups</Typography>
                <div className='flex gap-2 justify-end'>
                    <Search handleSearch={handleSearch} name='pickupAgents' />
                </div>
            </div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="Local" {...a11yProps(0)} />
                    <Tab label="Domestic" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={tab} index={0}>
                <LocalPickups/>
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={1}>
                Domestic
            </CustomTabPanel>
            {/* <Box className='flex flex-col flex-1 shadow-md overflow-hidden' ref={containerRef} sx={{ maxHeight: containerRef?.current?.offsetHeight, overflow: 'auto' }}>
                <DynamicTable
                    height={containerRef?.current?.offsetHeight}
                    loading={loading}
                    columns={columns}
                    rows={pickups}
                    rowColorCondition={(partner) => partner?.reject ? 'FFCDD2' : partner?.onBoarding?.toUpperCase() == 'DL' && 'FFE6A5'}
                    onRowClick={(partner) => navigate(`/admin/pickup-agents/${partner?.id}`)}
                />
            </Box> */}
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
