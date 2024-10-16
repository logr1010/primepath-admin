import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Button, Skeleton, Typography } from '@mui/material';
import Search from '../../components/Search';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { IconButton, CircularProgress, Box } from '@mui/material';
import UsersDialog from '../../dialogs/UsersDialog';
import Delete from '../../dialogs/Delete';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { get } from '../../services/api-services';
import CustomSnackbar from '../../modules/CustomSnackbar';
import debounce from 'lodash/debounce';
import DynamicTable from '../../components/DynamicTable';

const columns = [
	{
		id: 'name',
		label: 'Name',
		minWidth: 170
	},
	{
		id: 'mobile',
		label: 'Mobile',
		minWidth: 100
	},
	{
		id: 'email',
		label: 'Email',
		minWidth: 170,
		format: (value) => value.toLocaleString('en-US'),
	},
	{
		id: 'gender',
		label: 'Gender',
		minWidth: 170,
		format: (value) => value.toLocaleString('en-US'),
	},
	{
		id: 'active',
		label: 'Status',
		minWidth: 170,
		// align: 'right',
		type: 'toogle'
		// format: (value) => value.toFixed(2),
	},
];

export default function Users() {
	document.title = "Users"
	const [course, setCourse] = useState({ name: '' });
	const [courseId, setCourseId] = useState('');
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [open, setOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const containerRef = useRef(null);
	const [snackbar, setSnackbar] = React.useState({
		openSnackbar: false,
		message: "",
		severity: "",
	});
	const navigate = useNavigate()
	const onEditUser = async (value) => {
		setCourse({ name: value?.name });
		setCourseId(value?.id)
		setOpen(true);
	};
	const onDeleteUser = async (value) => {
		setCourseId(value?.id)
		setDeleteOpen(true);
	};
	const getUsers = async (search) => {
		setLoading(true)
		const filter = search ? JSON.stringify({
			where: {
				"name": { "like": `${search}`, "options": "i" }
			},
			order: "created DESC" // sort by createdAt in descending order
		}) : JSON.stringify({ order: "created DESC" })
		const res = await get(`Customers?filter=${filter}`);
		if (res?.statusCode === 200) {
			setUsers(res?.data)
		}
		setLoading(false)
	}
	const handleSearch = (event) => {
		setSearch(event.target.value);
	};
	const delay = useCallback(debounce(getUsers, 300), []);
	useEffect(() => {
		delay(search)
	}, [search])
	return (
		<div className='flex-1  flex flex-col gap-4 px-4 py-6'>
			<div className='flex flex-col static gap-4 md:justify-between md:flex-row '>
				<Typography variant='h1'> Users</Typography>
				<div className='flex gap-2 justify-end'>
					<Search handleSearch={handleSearch} name='users' />
				</div>
			</div>
			<Box className='flex flex-col flex-1 shadow-md overflow-hidden' ref={containerRef} sx={{ maxHeight: containerRef?.current?.offsetHeight, overflow: 'auto' }}>
				<DynamicTable
					height={containerRef?.current?.offsetHeight}
					loading={loading}
					columns={columns}
					rows={users}
				/>
			</Box>
			<UsersDialog open={open} setOpen={setOpen} courseId={courseId} setCourseId={setCourseId} getUsers={getUsers} course={course} setCourse={setCourse} snackbar={snackbar} setSnackbar={setSnackbar} />
			<Delete name="User" deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen} id={courseId} setCourseId={setCourseId} getUsers={getUsers} endPoint='courses' snackbar={snackbar} setSnackbar={setSnackbar} />
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
