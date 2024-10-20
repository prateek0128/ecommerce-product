import { useMemo, useState, Fragment, MouseEvent, useEffect } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { PatternFormat } from 'react-number-format';
import {
  ColumnDef,
  HeaderGroup,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState
} from '@tanstack/react-table';
import { LabelKeyObject } from 'react-csv/lib/core';

// project-import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

import CustomerModal from 'sections/apps/customer/CustomerModal';
import AlertCustomerDelete from 'sections/apps/customer/AlertCustomerDelete';
import CustomerView from 'sections/apps/customer/CustomerView';

import {
  CSVExport,
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from 'components/third-party/react-table';

import { useGetCustomer } from 'api/customer';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// types
import { CustomerList } from 'types/customer';

// assets
import { Add, Edit, Eye, Trash } from 'iconsax-react';

//api imoorts
import { getAllCustomers, deleteCustomer } from 'apiServices/customer';
import { customersData } from './customersData';
import CircularProgress from '@mui/material/CircularProgress';
interface Props {
  // columns: ColumnDef<CustomerList>[];
  // data: CustomerList[];
  // modalToggler: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
interface CustomersData {
  message: string;
  Customers: any;
}
// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, modalToggler, loading }: any) {
  const theme = useTheme();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageInput, setPageInput] = useState<string | number>('');

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true
  });
  const [pageLimitTable, setPageLimitTable] = useState<any>(table.getState().pagination.pageSize);
  const [pageIndexTable, setPageIndexTable] = useState<any>(table.getState().pagination.pageIndex);
  const backColor = alpha(theme.palette.primary.lighter, 0.1);
  let headers: LabelKeyObject[] = [];
  columns.map(
    (columns: { accessorKey: any; header: string }) =>
      // @ts-ignore
      columns.accessorKey &&
      headers.push({
        label: typeof columns.header === 'string' ? columns.header : '#',
        // @ts-ignore
        key: columns.accessorKey
      })
  );
  return (
    <MainCard content={false}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${data.length} records...`}
        />
        <Stack direction="row" alignItems="center" spacing={2}>
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
          <Button variant="contained" startIcon={<Add />} onClick={modalToggler} size="large">
            Add Customer
          </Button>
          {/* <CSVExport
            {...{ data: table.getSelectedRowModel().flatRows.map((row) => row.original), headers, filename: 'customer-list.csv' }}
          /> */}
        </Stack>
      </Stack>
      <ScrollX>
        <Stack>
          <RowSelection selected={Object.keys(rowSelection).length} />
          {loading == false ? (
            <TableContainer>
              <Table>
                <TableHead>
                  {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                          Object.assign(header.column.columnDef.meta, {
                            className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                          });
                        }
                        return (
                          <TableCell
                            key={header.id}
                            {...header.column.columnDef.meta}
                            onClick={header.column.getToggleSortingHandler()}
                            {...(header.column.getCanSort() &&
                              header.column.columnDef.meta === undefined && {
                                className: 'cursor-pointer prevent-select'
                              })}
                          >
                            {header.isPlaceholder ? null : (
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                                {header.column.getCanSort() && <HeaderSort column={header.column} />}
                              </Stack>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody>
                  {data.length != 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <Fragment key={row.id}>
                        <TableRow>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                        {row.getIsExpanded() && (
                          <TableRow sx={{ bgcolor: backColor, '&:hover': { bgcolor: `${backColor} !important` }, overflow: 'hidden' }}>
                            <TableCell colSpan={row.getVisibleCells().length} sx={{ p: 2.5, overflow: 'hidden' }}>
                              <CustomerView data={row.original} />
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell>{'Data not found'}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <>
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%', // Take full viewport height
                  p: 2
                }}
              >
                <CircularProgress size={40} />
              </Box>
            </>
          )}
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <TablePagination
                {...{
                  setPageSize: table.setPageSize,
                  setPageIndex: table.setPageIndex,
                  pageIndex: pageIndexTable,
                  getState: table.getState,
                  getPageCount: table.getPageCount
                }}
              />
            </Box>
          </>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}
// ==============================|| CUSTOMER LIST ||============================== //

export default function CustomerListPage() {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [customerModal, setCustomerModal] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerList | null>(null);
  const [customerDeleteId, setCustomerDeleteId] = useState<any>('');
  const [allCustomersData, setAllCustomersData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const allCustomers =
    allCustomersData &&
    allCustomersData.map((customer: any, index: any) => {
      const fullName = customer.First_Name + ' ' + customer.Last_Name;
      return {
        id: customer.Id,
        name: fullName,
        email: customer.Email,
        contact: customer.Contact,
        age: customer.age,
        location: customer.Location,
        gender: customer.Gender,
        firstName: customer.First_Name,
        lastName: customer.Last_Name,
        profileImage: customer.Profile_Picture
      };
    });
  const handleClose = () => {
    setOpen(!open);
  };
  const getAllCustomersAPI = () => {
    setLoading(true);
    getAllCustomers()
      .then((response) => {
        setLoading(false);
        const customersData = response.data as CustomersData;
        setAllCustomersData(customersData.Customers || []);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getAllCustomersAPI();
  }, []);
  const columns = useMemo<ColumnDef<CustomerList>[]>(
    () => [
      // {
      //   id: 'Row Selection',
      //   header: ({ table }) => (
      //     <IndeterminateCheckbox
      //       {...{
      //         checked: table.getIsAllRowsSelected(),
      //         indeterminate: table.getIsSomeRowsSelected(),
      //         onChange: table.getToggleAllRowsSelectedHandler()
      //       }}
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <IndeterminateCheckbox
      //       {...{
      //         checked: row.getIsSelected(),
      //         disabled: !row.getCanSelect(),
      //         indeterminate: row.getIsSomeSelected(),
      //         onChange: row.getToggleSelectedHandler()
      //       }}
      //     />
      //   )
      // },
      {
        header: '#',
        accessorKey: 'id',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Customer Name',
        accessorKey: 'name',
        cell: ({ row, getValue }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              alt="Avatar"
              size="sm"
              src={
                row.original.profilePicture
                  ? row.original.profilePicture
                  : getImageUrl(`avatar-${!row.original.profilePicture ? 1 : row.original.profilePicture}.png`, ImagePath.USERS)
              }
            />
            <Stack spacing={0}>
              <Typography variant="subtitle1">{getValue() as string}</Typography>
              <Typography color="text.secondary">{row.original.email as string}</Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Contact',
        accessorKey: 'contact',
        cell: ({ getValue }) => <PatternFormat displayType="text" format="+91##########" mask="" defaultValue={getValue() as number} />
      },
      {
        header: 'Age',
        accessorKey: 'age',
        meta: {
          className: 'cell-right'
        }
      },
      {
        header: 'Location',
        accessorKey: 'location'
      },
      // {
      //   header: 'Status',
      //   accessorKey: 'status',
      //   cell: (cell) => {
      //     switch (cell.getValue()) {
      //       case 3:
      //         return <Chip color="error" label="Rejected" size="small" variant="light" />;
      //       case 1:
      //         return <Chip color="success" label="Verified" size="small" variant="light" />;
      //       case 2:
      //       default:
      //         return <Chip color="info" label="Pending" size="small" variant="light" />;
      //     }
      //   }
      // },
      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          const collapseIcon =
            row.getCanExpand() && row.getIsExpanded() ? (
              <Add style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} />
            ) : (
              <Eye />
            );
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="View">
                <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
                  {collapseIcon}
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setSelectedCustomer(row.original);
                    setCustomerModal(true);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              {/* <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    handleClose();
                    setCustomerDeleteId(Number(row.original.id));
                  }}
                >
                  <Trash />
                </IconButton>
              </Tooltip> */}
            </Stack>
          );
        }
      }
    ],
    // eslint-disable-next-line
    [theme]
  );
  //if (loading) return <EmptyReactTable />;

  return (
    <>
      <ReactTable
        data={allCustomers || []}
        columns={columns}
        modalToggler={() => {
          setCustomerModal(true);
          setSelectedCustomer(null);
        }}
        loading={loading}
      />
      <AlertCustomerDelete id={Number(customerDeleteId)} title={customerDeleteId} open={open} handleClose={handleClose} />
      <CustomerModal open={customerModal} modalToggler={setCustomerModal} customer={selectedCustomer} />
    </>
  );
}
