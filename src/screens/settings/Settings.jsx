import React, { useEffect } from 'react'
import { Typography, TextField, IconButton, Skeleton } from '@mui/material';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { get, patch, post } from '../../services/api-services';
import { numberRegex } from '../../regex/regex';
import DoneIcon from '@mui/icons-material/Done';
import CustomSnackbar from '../../modules/CustomSnackbar';
import { HomeInfo, PayoutComponent, ReadBeforeYouBook, Timings } from '../../components/SettingsComponents';
export default function Settings() {
	document.title = "Settings"
	const [editable, setEditable] = React.useState(false)
	const [settingsData, setSettingsData] = React.useState([]);
	const [settings, setSettings] = React.useState({ count: "" });
	const [loading, setLoading] = React.useState(true)
	const [snackbar, setSnackbar] = React.useState({
		openSnackbar: false,
		message: '',
		severity: ''
	});

	const getSettings = async () => {
		setLoading(true)
		const res = await get("Settings")
		if (res?.statusCode === 200) {
			if (res?.data?.length > 0) {
				const obj = {}
				for (let i = 0; i < res?.data?.length; i++) {
					const _settings = res?.data[i]
					obj[_settings.type] = _settings
				}
				setSettings(obj)
			}
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
			else if (res?.statusCode === 422) {
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
		<div className='flex-1 flex flex-col gap-10 overflow-auto px-4 py-6'>
			<div className='flex flex-col gap-4 justify-between md:flex-row'>
				<Typography variant='h1'>
					Settings
				</Typography>
			</div>
			<div className='flex md:flex-row flex-col gap-10'>
				<PayoutComponent
					min={settings?.payout?.data?.minamount}
					max={settings?.payout?.data?.maxamount}
					onSumbit={(data) => console.log(data)}
				/>
				<HomeInfo
					data={settings?.homeInfo?.data}
					onSumbit={(data) => console.log(data)}
				/>
				<Timings
					data={settings?.timings?.data}
					onSumbit={(data) => console.log(data)}
				/>
			</div>
			<div>
				<ReadBeforeYouBook
					data={settings?.readBeforeBook?.data}
					onSumbit={(data) => console.log(data)}
				/>
			</div>
		</div>
	)
}
