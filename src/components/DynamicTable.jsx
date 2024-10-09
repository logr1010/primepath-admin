import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { CircularProgress, Skeleton, ToggleButton } from '@mui/material';
import { AntSwitch } from './AntSwitch';

export default function DynamicTable({ height, rows = [], columns, loading }) {
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
            {(!loading && !rows?.length) &&  <p className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>No Data Found!</p>}
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
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {loading ?
                                                        <Skeleton variant='text' width={100} /> :
                                                        column.toggle ? (
                                                            <AntSwitch/>
                                                        ) : column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
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
