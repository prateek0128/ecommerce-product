import { useMemo, useState, Fragment, MouseEvent, useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

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

// project-import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

//import ComplaintModal from 'sections/apps/complaint/ComplaintModal';
import AlertComplaintDelete from 'sections/apps/complaint/AlertComplaintDelete';
import ComplaintView from 'sections/apps/complaint/ComplaintView';
import EmptyReactTable from 'pages/tables/react-table/empty';

import {
  CSVExport,
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from 'components/third-party/react-table';

import complaintData from './complaintData';

// types
//import { CustomerList } from 'types/customer';
import { ComplaintList } from 'types/complaint';
import capitalize from '@mui/utils/capitalize';
// assets
import { Add, Edit, Eye, Trash } from 'iconsax-react';
import { LabelKeyObject } from 'react-csv/lib/core';
import { getAllComplaints } from 'apiServices/complaint';
import { APP_DEFAULT_PATH } from 'config';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import CircularProgress from '@mui/material/CircularProgress';
// interface Props {
//   columns: ColumnDef<CustomerList>[];
//   data: CustomerList[];
//   // modalToggler: () => void;
// }
interface ComplaintsData {
  message: string;
  Complaints: any;
}
// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, loading }: any) {
  const theme = useTheme();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

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

  const backColor = alpha(theme.palette.primary.lighter, 0.1);

  // let headers: LabelKeyObject[] = [];
  // columns.map(
  //   (columns) =>
  //     columns.accessorKey &&
  //     headers.push({
  //       label: typeof columns.header === 'string' ? columns.header : '#',
  //       key: columns.accessorKey
  //     })
  // );
  let headers: LabelKeyObject[] = [];
  columns.forEach((column: ColumnDef<any>) => {
    if ('accessorKey' in column) {
      headers.push({
        label: typeof column.header === 'string' ? column.header : '#',
        key: column.accessorKey as string
      });
    } else if ('accessorFn' in column) {
      headers.push({
        label: typeof column.header === 'string' ? column.header : '#',
        key: column.id as string
      });
    }
  });
  const history = useNavigate();

  const handleRaiseCompaint = () => {
    history('/apps/complaint/raise-complaint');
  };
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
          <Button variant="contained" startIcon={<Add />} onClick={handleRaiseCompaint} size="large">
            Raise Complaint
          </Button>
          <CSVExport
            {...{ data: table.getSelectedRowModel().flatRows.map((row) => row.original), headers, filename: 'complaint-list.csv' }}
          />
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
                            style={{ whiteSpace: 'nowrap' }}
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
                              <ComplaintView data={row.original} />
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

// ==============================|| COMPLAINT LIST ||============================== //

export default function ComplaintListPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const history = useNavigate();
  const lists = complaintData;
  const [complaintModal, setComplaintModal] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<ComplaintList | null>(null);
  const [complaintDeleteId, setComplaintDeleteId] = useState<any>('');
  const [allComplaintsData, setAllComplaintsData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const allComplaints =
    allComplaintsData &&
    allComplaintsData.map((complaint: any, index: any) => {
      return {
        id: complaint.Complaint_Id,
        name: complaint.Customer_Name,
        description: complaint.Description,
        warranty: complaint.Warranty,
        item: complaint.Item,
        status: complaint.Status,
        itemImage: complaint.Item_Image,
        billImage: complaint.Bill_Image,
        customerId: complaint.customer_id
      };
    });
  const handleClose = () => {
    setComplaintModal(!complaintModal);
  };
  const getAllComplaintsAPI = () => {
    setLoading(true);
    getAllComplaints()
      .then((response) => {
        setLoading(false);
        const complaintsData = response.data as ComplaintsData;
        setAllComplaintsData(complaintsData.Complaints || []);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getAllComplaintsAPI();
  }, []);
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'Row Selection',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
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
            <Avatar alt="Avatar" size="sm" src={`/path/to/avatars/avatar-${!row.original.avatar ? 1 : row.original.avatar}.png`} />
            <Stack spacing={0}>
              <Typography variant="subtitle1">{capitalize(getValue() as string)}</Typography>
              {/* <Typography color="text.secondary">{row.original.email as string}</Typography> */}
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Item',
        accessorKey: 'item',
        cell: ({ row, getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{capitalize(getValue() as string)}</Typography>
          </Stack>
        )
      },
      {
        header: 'Description',
        accessorKey: 'description',
        cell: ({ getValue }) => <Typography>{getValue() as string}</Typography>
      },
      {
        header: 'In-Warranty',
        accessorKey: 'warranty',
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <Chip
              color={status === 'Yes' || 'yes' ? 'success' : 'error'}
              label={status === 'Yes' || 'yes' ? 'Yes' : 'No'}
              size="small"
              variant="light"
            />
          );
        }
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <Chip
              color={status === 'Completed' ? 'success' : 'info'}
              label={status === 'Completed' ? 'Completed' : 'Pending'}
              size="small"
              variant="light"
            />
          );
        }
      },
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
                    navigate('/apps/complaint/edit-complaint', { state: { complaintData: row.original } }); // Pass the data array in state
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    handleClose();
                    setComplaintDeleteId(Number(row.original.id));
                  }}
                >
                  <Trash />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    [theme]
  );
  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Complaint List' }];
  return (
    <>
      <Breadcrumbs custom heading="Complaint List" links={breadcrumbLinks} />
      <ReactTable data={allComplaints || []} columns={columns} loading={loading} />
      <AlertComplaintDelete id={Number(complaintDeleteId)} title={complaintDeleteId} open={complaintModal} handleClose={handleClose} />
    </>
  );
}
