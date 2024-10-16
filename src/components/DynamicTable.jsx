import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button, CircularProgress, Skeleton, ToggleButton } from '@mui/material';
import { AntSwitch } from './AntSwitch';

export default function DynamicTable({
    height,
    rows = [],
    columns,
    loading,
    rowColorCondition,
    onRowClick = () => { },
    onAccept = () => { },
    onAction = () => { },
    onReject = () => { }
}) {
    height = height - 56 // SUBTRACTED BY PAGINATOR HEIGHT - SET STATIC HEIGHT
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
            {(!loading && !rows?.length) && <p className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>No Data Found!</p>}
            <TableContainer sx={{ maxHeight: height, minHeight: height }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    <p className='font-semibold text-[14px] text-[#757575]'>{column.label}</p>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => {
                            const rowColor = rowColorCondition ? rowColorCondition(row) : 'inherit'; // Condition for row color
                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.code}
                                    onClick={() => onRowClick(row)}
                                    sx={{
                                        bgcolor: `#${rowColor}`,
                                        '&:hover': {
                                            cursor: 'pointer'
                                        }
                                    }}>
                                    {columns.map((column) => {
                                        const value = (column.nested ? row?.[column.id]?.[column.nested] : row[column.id]) || '--'
                                        const _key = column.nested ? column.nested + column.id : column.id
                                        return (
                                            <TableCell key={_key} align={column.align}>
                                                {loading ?
                                                    <Skeleton variant='text' width={100} /> :
                                                    <RenderCell
                                                        column={column}
                                                        value={value}
                                                        type={column.type}
                                                        action={column.action}
                                                        onAction={() => onAction(row)}
                                                        accept={column?.l1}
                                                        reject={column?.l2}
                                                        onAccept={() => onAccept(row)}
                                                        onReject={() => onReject(row)}
                                                    />
                                                }
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                className='h-14'
                rowsPerPageOptions={[50, 100, 500]}
                component="div"
                count={rows?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

const RenderCell = ({ type, column, value, action, onAction, accept, reject, onAccept, onReject }) => {
    switch (type) {
        case 'action':
            return <Action action={action} onAction={onAction} />;
        case 'actionMulti':
            return <MulipleAction accept={accept} reject={reject} onAccept={onAccept} onReject={onReject} />;
        case 'toggle':
            return <Toggle />;
        default:
            return <Text column={column} value={value} />;
    }
};

const Text = ({ column, value }) => (
    column.format && typeof value === 'number'
        ? column.format(value)
        : value
)

const Action = ({ action, onAction }) => (
    <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={onAction}>
        {action}
    </Button>
)

const Toggle = () => (
    <AntSwitch />
)

const MulipleAction = ({ accept, reject, onAccept, onReject }) => {
    return (
        <div className='flex gap-4 items-center justify-center'>
            <Button
                variant="contained"
                color="success"
                size="small"
                onClick={onAccept}
                sx={{ textTransform: 'capitalize' }}>
                {accept}
            </Button>
            <Button
                variant="outlined"
                color="error"
                size="small"
                onmClick={onReject}
                sx={{ textTransform: 'capitalize' }}>
                {reject}
            </Button>
        </div>
    )
}