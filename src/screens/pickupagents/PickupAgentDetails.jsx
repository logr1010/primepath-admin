import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Button, Skeleton, Typography } from '@mui/material';
import { IconButton, CircularProgress, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { containers, get, patch } from '../../services/api-services';
import CustomSnackbar from '../../modules/CustomSnackbar';
import debounce from 'lodash/debounce';
import { ArrowBackRounded, CancelRounded } from '@mui/icons-material';
import Confirm from '../../dialogs/Confirm';
import ImageViewer from '../../components/ImageViewer';

export default function PickupAgentDetails() {
    const { id } = useParams();
    document.title = "Pickup Agents Details"
    const [pickupAgent, setPickupAgent] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    const [action, setAction] = useState({
        open: false,
        title: '',
        message: '',
        success: false
    })

    const [snackbar, setSnackbar] = React.useState({
        openSnackbar: false,
        message: "",
        severity: "",
    });
    const navigate = useNavigate()

    useEffect(() => {
        getPickupAgent()
    }, [])


    const getPickupAgent = async (search) => {
        setLoading(true)
        const res = await get(`Partners/${id}`);
        if (res?.statusCode === 200) {
            setPickupAgent(res?.data)
        }
        setLoading(false)
    }

    const onActionClose = () => {
        setAction({
            ...action,
            open: false,
            // title: '',
            // message: '',
        })
    }

    const onAction = async (success) => {
        try {
            const body = {
                onBoarding: success ? 'VERIFIED' : 'DL',
                status: false
            }
            if (!success) {
                body.reject = true;
                body.rejectedAt = new Date()
            }
            const res = await patch(`Partners/${id}/`, body);
            if (res?.statusCode === 200) {
                setPickupAgent(res?.data)
                onActionClose()
                setSnackbar({
                    openSnackbar: true,
                    message: `${pickupAgent?.firstName} ${pickupAgent?.lastName} is ${success ? 'now verified' : 'rejected'} as a partner.`,
                    severity: "success"
                })
            }
            else {
                setSnackbar({
                    openSnackbar: true,
                    message: `Failed to ${success ? 'accept' : 'reject'} as a partner!`,
                    severity: "error"
                })
            }
        }
        catch (e) {
            setSnackbar({
                openSnackbar: true,
                message: `Something went wrong`,
                severity: "error"
            })
            console.log(`ERROR WHILE ACCEPTING `, e)
        }
    }


    // const delay = useCallback(debounce(getPickupAgent, 300), []);

    return (
        <div className='flex-1 flex flex-col gap-4 px-4 py-6 h-full overflow-auto'>
            <div className='flex gap-4 items-center'>
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackRounded />
                </IconButton>
                <>
                    <ImageViewer
                        src={pickupAgent?.profileImg ? containers.image + pickupAgent?.profileImg : "https://via.placeholder.com/150"}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full border border-gray-300"
                    />
                    {pickupAgent ? <Typography variant='h1'>{pickupAgent?.firstName} {pickupAgent?.lastName}</Typography> : <Skeleton variant='text' width={300} height={50} />}
                </>
                <div className='flex-1'></div>
                {(pickupAgent?.onBoarding == 'DL' && !pickupAgent?.reject) ? <div className='flex gap-4 items-center justify-end'>
                    <Button
                        className='!font-semibold'
                        variant='contained'
                        color='success'
                        onClick={() => setAction({
                            open: true,
                            title: 'Are you sure you want to accept as a pickup agent?',
                            message: 'Ensure to verify pattner identity and documents before accepting!',
                            success: true
                        })}>
                        ACCEPT
                    </Button>
                    <Button
                        className='!font-semibold'
                        color='error'
                        onClick={() => setAction({
                            open: true,
                            title: 'Are you sure you want to reject as a pickup agent?',
                            message: 'This action cannot be undone!',
                            success: false
                        })}>
                        REJECT
                    </Button>
                </div>
                    : pickupAgent?.reject && <Button
                        className='!font-semibold'
                        disabled
                        color='error'
                        variant='contained'
                        startIcon={<CancelRounded />}>
                        REJECTED
                    </Button>
                }
            </div>
            <Box className='flex flex-col md:flex-row flex-1 gap-4 py-2'>
                <div className='flex-1 bg-white rounded shadow'>
                    <div className='px-4 py-2 border-b border-gray-200'>
                        <p className='text-lg text-black font-semibold'>Basic Details</p>
                    </div>
                    <div className='px-4 py-2'>
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-2/3">
                                <div className="grid grid-cols-2 gap-4">
                                    <p className="font-normal text-slate-600">Name</p>
                                    <p className='font-medium'>
                                        {pickupAgent?.firstName} {pickupAgent?.lastName}
                                    </p>
                                    <p className="font-normal text-slate-600">Mobile Number</p>
                                    <p className='font-medium'>+91 - {pickupAgent?.mobile}</p>
                                    <p className="font-normal text-slate-600">Email Address</p>
                                    <p className='font-medium'>{pickupAgent?.email}</p>
                                    <p className="font-normal text-slate-600">Gender</p>
                                    <p className='font-medium'>{pickupAgent?.gender}</p>
                                    <p className="font-normal text-slate-600">Registered on</p>
                                    <p className='font-medium'>5 Oct 2024</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ADRESS DETAILS */}
                    <div className='px-4 py-2 border-b border-t border-gray-200 my-2'>
                        <p className='text-lg text-black font-semibold'>Address Details</p>
                    </div>
                    <div className='px-4 py-2'>
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-2/3">
                                <div className="grid grid-cols-2 gap-4">
                                    <p className="font-normal text-slate-600">Saved Address</p>
                                    <p className='font-medium'>
                                        {pickupAgent?._address}
                                    </p>
                                    <p className="font-normal text-slate-600">Saved Pincode</p>
                                    <p className='font-medium'>{pickupAgent?.pinCode}</p>
                                    <p className="font-normal text-slate-600">Lat & Lng</p>
                                    <p className='font-medium'>{pickupAgent?.location?.coordinates[0] + ', ' + pickupAgent?.location?.coordinates[1]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* KYC DETAILS */}
                    <div className='px-4 py-2 border-b border-t border-gray-200 my-2'>
                        <p className='text-lg text-black font-semibold'>KYC & Vehicle Details</p>
                    </div>
                    <div className='px-4 py-2'>
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-2/3">
                                <div className="grid grid-cols-2 gap-4">
                                    <p className="font-normal text-slate-600">Aadhaar Number</p>
                                    <p className='font-medium'>
                                        {pickupAgent?.AadharNumber}
                                    </p>
                                    <p className="font-normal text-slate-600">Aadhaar Images</p>
                                    <div className='flex gap-4'>
                                        <ImageViewer
                                            src={pickupAgent?.frontSideAadhar ? `${containers.image}${pickupAgent?.frontSideAadhar}` : "https://via.placeholder.com/150"}
                                            alt="Avatar"
                                            className="w-16 h-16 rounded border"
                                        />
                                        <ImageViewer
                                            src={pickupAgent?.backSideAadhar ? `${containers.image}${pickupAgent?.backSideAadhar}` : "https://via.placeholder.com/150"}
                                            alt="Avatar"
                                            className="w-16 h-16 rounded border"
                                        />
                                    </div>
                                    <p className="font-normal text-slate-600">Vehicle Number</p>
                                    <p className='font-medium'>{pickupAgent?.vehicleNumber}</p>
                                    <p className="font-normal text-slate-600">DL Number</p>
                                    <p className='font-medium'>{pickupAgent?.dlNumber}</p>
                                    <p className="font-normal text-slate-600">Name on DL</p>
                                    <p className='font-medium'>{pickupAgent?.nameOnDL}</p>
                                    <p className="font-normal text-slate-600">DL Images</p>
                                    <div className='flex gap-4'>
                                        <ImageViewer
                                            src={pickupAgent?.frontSideDL ? `${containers.image}${pickupAgent?.frontSideDL}` : "https://via.placeholder.com/150"}
                                            alt="Avatar"
                                            className="w-16 h-16 rounded border"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='px-4 py-2 border-b border-t border-gray-200 my-2'>
                        <p className='text-lg text-black font-semibold'>Bank Details</p>
                    </div>
                    <div className='px-4 py-2'>
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-2/3">
                                <div className="grid grid-cols-2 gap-4">
                                    <p className="font-normal text-slate-600">Bank Name</p>
                                    <p className='font-medium'>
                                        {pickupAgent?.bankName || '--'}
                                    </p>
                                    <p className="font-normal text-slate-600">Bank Account Number</p>
                                    <p className='font-medium'>{pickupAgent?.accountNumber || '--'}</p>
                                    <p className="font-normal text-slate-600">Account Holder Name</p>
                                    <p className='font-medium'>{pickupAgent?.accountHolderName || '--'}</p>
                                    <p className="font-normal text-slate-600">IFSC</p>
                                    <p className='font-medium'>{pickupAgent?.IFSC || '--'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex-1 bg-white rounded shadow'>

                </div>
            </Box>
            <Confirm
                open={action.open}
                title={action.title}
                message={action.message}
                onClose={onActionClose}
                onSuccess={() => onAction(action.success)}
                onReject={() => onActionClose()}
            />
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
