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

export default function LocalPickups() {
	document.title = "Local Pickups"
	const [course, setCourse] = useState({ name: '' });
	const [courseId, setCourseId] = useState('');
	const [pickups, setPickups] = useState([]);
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
	const handleSearch = (event) => {
		setSearch(event.target.value);
	};
	const delay = useCallback(debounce(getPickups, 300), []);
	useEffect(() => {
		delay(search)
	}, [search])
	return (
		<div className='h-full' ref={containerRef}>
			<Box className='flex flex-col flex-1 shadow-md overflow-hidden' sx={{ maxHeight: containerRef?.current?.offsetHeight, overflow: 'auto' }}>
				<DynamicTable
					height={containerRef?.current?.offsetHeight}
					loading={loading}
					columns={columns}
					rows={pickups}
					rowColorCondition={(partner) => partner?.reject ? 'FFCDD2' : partner?.onBoarding?.toUpperCase() == 'DL' && 'FFE6A5'}
					onRowClick={(partner) => navigate(`/admin/pickup-agents/${partner?.id}`)}
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