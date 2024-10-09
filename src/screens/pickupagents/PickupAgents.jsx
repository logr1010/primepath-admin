import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Button, Skeleton, Typography } from '@mui/material';
import Search from '../../components/Search';
import { IconButton, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
		toggle: true,
		// format: (value) => value.toFixed(2),
	},
];

export default function PickupAgents() {
	document.title = "PickupAgents"
	const [course, setCourse] = useState({ name: '' });
	const [courseId, setCourseId] = useState('');
	const [pickupAgents, setPickupAgents] = useState([]);
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
	const getPickupAgents = async (search) => {
		setLoading(true)
		const filter = search ? JSON.stringify({
			where: {
				"name": { "like": `${search}`, "options": "i" }
			},
			order: "created DESC" // sort by createdAt in descending order
		}) : JSON.stringify({ order: "created DESC" })
		const res = await get(`Partners?filter=${filter}`);
		if (res?.statusCode === 200) {
			setPickupAgents(res?.data)
		}
		setLoading(false)
	}
	const handleSearch = (event) => {
		setSearch(event.target.value);
	};
	const delay = useCallback(debounce(getPickupAgents, 300), []);
	useEffect(() => {
		delay(search)
	}, [search])
	return (
		<div className='flex-1  flex flex-col gap-4 '>
			<div className='flex flex-col static gap-4 md:justify-between md:flex-row '>
				<Typography variant='h1'> PickupAgents</Typography>
				<div className='flex gap-2 justify-end'>
					<Search handleSearch={handleSearch} name='pickupAgents' />
				</div>
			</div>
			<Box className='flex flex-col flex-1 shadow-md overflow-hidden' ref={containerRef} sx={{ maxHeight: containerRef?.current?.offsetHeight, overflow: 'auto' }}>
				<DynamicTable
					height={containerRef?.current?.offsetHeight}
					loading={loading}
					columns={columns}
					rows={pickupAgents}
				/>
			</Box>
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
