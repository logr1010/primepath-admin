import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Button, Skeleton, Typography } from '@mui/material';
import Search from '../../components/Search';
import { IconButton, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { get } from '../../services/api-services';
import CustomSnackbar from '../../modules/CustomSnackbar';
import debounce from 'lodash/debounce';
import DynamicTable from '../../components/DynamicTable';
import Confirm from '../../dialogs/Confirm';
import { set } from 'lodash';

const columns = [
    {
        id: 'partner',
        nested: 'firstName',
        label: 'Patner Name',
        minWidth: 80
    },
    {
        id: 'partner',
        nested: 'mobile',
        label: 'Partner Mobile',
        minWidth: 100
    },
    {
        id: 'partner',
        nested: 'vCash',
        label: 'Wallet Balance',
        minWidth: 60
    },
    {
        id: 'amount',
        label: 'Amount',
        minWidth: 60,
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'status',
        label: 'Status',
        minWidth: 170,
        // align: 'right',
        // toggle: true,
        // format: (value) => value.toFixed(2),
    },
    {
        id: 'action',
        label: 'Action',
        minWidth: 170,
        type: 'actionMulti',
        l1: 'Approve',
        l2: 'Reject',
        align: 'center',
        // toggle: true,
        // format: (value) => value.toFixed(2),
    },
];

export default function Payouts() {
    document.title = "Payout Requests"
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const containerRef = useRef(null);
    const [snackbar, setSnackbar] = React.useState({
        openSnackbar: false,
        message: "",
        severity: "",
    });

    const [confirmMessage, setConfirmMessage] = React.useState({
        open: false,
        message: "",
    });

    const navigate = useNavigate()

    const getPayoutRequests = async (search) => {
        setLoading(true)
        const include = { include: ["partner"] }
        const filter = search ? JSON.stringify({
            where: {
                "name": { "like": `${search}`, "options": "i" }
            },
            ...include,
            order: "createdAt DESC" // sort by createdAt in descending order
        }) : JSON.stringify({ order: "createdAt DESC", ...include })
        const res = await get(`Payouts?filter=${filter}`);
        if (res?.statusCode === 200) {
            setPayouts(res?.data)
        }
        setLoading(false)
    }
    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const delay = useCallback(debounce(getPayoutRequests, 300), []);
    useEffect(() => {
        delay(search)
    }, [search])


    const onAcceptOpen = (amount) => {
        setConfirmMessage({ open: true, message: `Do you want to accept this payout request of ${amount}?` })
    }

    const onRejectOpen = (amount) => {
        setConfirmMessage({ open: true, message: `Do you want to reject this payout request of ${amount}?` })
    }

    return (
        <div className='flex-1 flex flex-col gap-4 px-4 py-6'>
            <div className='flex flex-col static gap-4 md:justify-between md:flex-row '>
                <Typography variant='h1'>Payout Requests</Typography>
                <div className='flex gap-2 justify-end'>
                    <Search handleSearch={handleSearch} name='pickupAgents' />
                </div>
            </div>
            <Box className='flex flex-col flex-1 shadow-md overflow-hidden' ref={containerRef} sx={{ maxHeight: containerRef?.current?.offsetHeight, overflow: 'auto' }}>
                <DynamicTable
                    noClick
                    height={containerRef?.current?.offsetHeight}
                    loading={loading}
                    columns={columns}
                    rows={payouts}
                    onAccept={(req) => onAcceptOpen(req?.amount)}
                    onReject={(req) => onRejectOpen(req?.amount)}
                // onRowClick={(partner) => navigate(`/admin/pickup-agents/${partner?.id}`)}
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
            <Confirm
                open={confirmMessage?.open}
                onClose={() => setConfirmMessage({ ...confirmMessage, open: false })}
                onSuccess={() => setConfirmMessage({ ...confirmMessage, open: false })}
                onReject={() => setConfirmMessage({ ...confirmMessage, open: false })}
                message={confirmMessage?.message}
            />
        </div>
    )
}
