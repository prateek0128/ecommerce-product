import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import { useTheme, PaletteColor } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';

// third-party
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
  FilterFn,
  ColumnFiltersState
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import { LabelKeyObject } from 'react-csv/lib/core';

// project-import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import InvoiceCard from 'components/cards/invoice/InvoiceCard';
import InvoiceChart from 'components/cards/invoice/InvoiceChart';

import UpdateInvoiceStatusPopup from 'sections/apps/invoice/UpdateInvoiceStatusPopup';

import { APP_DEFAULT_PATH } from 'config';
import { openSnackbar } from 'api/snackbar';
import { handlerDelete, deleteInvoice, useGetInvoice, useGetInvoiceMaster } from 'api/invoice';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import PaymentIcon from '@mui/icons-material/Payment';
import {
  CSVExport,
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from 'components/third-party/react-table';
import DownloadIcon from '@mui/icons-material/Download';
// types
import { SnackbarProps } from 'types/snackbar';
import { InvoiceList } from 'types/invoice';

// assets
import { Edit, Eye, InfoCircle, ProfileTick, Trash } from 'iconsax-react';
import { getAllInvoices, getInvoicePDF } from 'apiServices/invoice';

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // store the ranking info
  addMeta(itemRank);

  // return if the item should be filtered in/out
  return itemRank.passed;
};

interface InvoiceWidgets {
  title: string;
  count: string;
  percentage: number;
  isLoss: boolean;
  invoice: string;
  color: PaletteColor;
  chartData: number[];
}

interface Props {
  data: any;
  columns: ColumnDef<any>[];
}
interface PDFData {
  url: string;
}
interface InvoiceData {
  message: string;
  Invoices: any;
}
// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns }: Props) {
  // const groups = ['All', ...new Set(data.map((item: any) => item.status))];
  const groups = ['All', 'Paid', 'Partial Paid', 'Overdue', 'Cancelled'];
  const countGroup = data.map((item: any) => item.status);
  const counts = countGroup.reduce(
    (acc: any, value: any) => ({
      ...acc,
      [value]: (acc[value] || 0) + 1
    }),
    {}
  );
  const [activeTab, setActiveTab] = useState(groups[0]);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'customerName', desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  //@ts-ignore
  const exactTextFilter = (row: Row<any>, columnId: string, filterValue: string) => {
    const cellValue = row.getValue(columnId);
    return cellValue === filterValue;
  };
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
    globalFilterFn: fuzzyFilter,
    //@ts-ignore
    filterFn: exactTextFilter,
    debugTable: true
  });

  let headers: LabelKeyObject[] = [];
  columns.map(
    (columns) =>
      // @ts-ignore
      columns.accessorKey &&
      headers.push({
        label: typeof columns.header === 'string' ? columns.header : '#',
        // @ts-ignore
        key: columns.accessorKey
      })
  );

  useEffect(() => {
    setColumnFilters(
      activeTab === 'All'
        ? []
        : [
            {
              id: 'status',
              value: activeTab.toLowerCase(),
              //@ts-ignore
              exact: true
            }
          ] // Use exact matching
    );
  }, [activeTab]);

  return (
    <MainCard content={false}>
      <Box sx={{ p: 2.5, pb: 0, width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={(e: ChangeEvent<{}>, value: string) => setActiveTab(value)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {groups.map((status: string, index: number) => (
            <Tab
              key={index}
              label={status}
              value={status}
              icon={
                <Chip
                  label={
                    status === 'All'
                      ? data.length
                      : status === 'Paid'
                        ? counts.Paid || 0
                        : status === 'PartialPaid'
                          ? counts.PartialPaid || 0
                          : status === 'Overdue'
                            ? counts.Overdue || 0
                            : counts.Cancelled || 0
                  }
                  color={
                    status === 'All'
                      ? 'primary'
                      : status === 'Paid'
                        ? 'success'
                        : status === 'PartialPaid'
                          ? 'info'
                          : status === 'Unpaid'
                            ? 'warning'
                            : 'error'
                  }
                  variant="light"
                  size="small"
                />
              }
              iconPosition="end"
            />
          ))}
        </Tabs>
      </Box>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 2.5 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${activeTab == 'All' ? data.length : activeTab == 'Paid' ? counts.Paid : activeTab == 'Overdue' ? counts.Overdue : counts.Cancelled} records...`}
        />
        <Stack direction="row" alignItems="center" spacing={2}>
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
          {/* <CSVExport
            {...{ data: table.getSelectedRowModel().flatRows.map((row) => row.original), headers, filename: 'customer-list.csv' }}
          /> */}
        </Stack>
      </Stack>
      <ScrollX>
        <Stack>
          <RowSelection selected={Object.keys(rowSelection).length} />
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
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <TablePagination
                {...{
                  setPageSize: table.setPageSize,
                  setPageIndex: table.setPageIndex,
                  getState: table.getState,
                  getPageCount: table.getPageCount,
                  initialPageSize: 5
                }}
              />
            </Box>
          </>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| INVOICE - LIST ||============================== //

export default function List() {
  const [invoiceId, setInvoiceId] = useState(0);
  const [invoiceData, setInvoiceData] = useState();
  const [allInvoices, setAllInvoices] = useState([]);
  const [updateStatusPopup, setUpdateStatusPopup] = useState(false);
  const navigation = useNavigate();
  const allInvoicesData =
    allInvoices &&
    allInvoices.map((invoice: any, index) => {
      const date = new Date(invoice?.Date);
      const formattedDate = date.toISOString().split('T')[0];
      return {
        invoiceId: invoice.Invoice_Id,
        customerName: invoice.Customer_Name,
        customerEmail: invoice.Customer_Email,
        date: formattedDate,
        status: invoice.Status == 'Unpaid' ? 'Overdue' : invoice.Status,
        totalAmount: invoice.Total_Amount
      };
    });
  const fetchAllInvoices = () => {
    getAllInvoices()
      .then((response) => {
        const invoiceData = response.data as InvoiceData;
        const invoices = invoiceData.Invoices;
        setAllInvoices(invoices);
      })
      .catch((error) => {
        console.log('errorInvoice', error);
      });
  };
  useEffect(() => {
    fetchAllInvoices();
  }, []);
  const handlePDFUrl = (id: number) => {
    getInvoicePDF(id)
      .then((response) => {
        const pdfData = response.data as PDFData;
        if (pdfData.url) {
          window.open(pdfData.url, '_blank');
        }
      })
      .catch((error) => {
        console.log('errorPDF', error);
      });
  };
  const handleClose = (status: boolean) => {
    // if (status) {
    //   deleteInvoice(invoiceId);
    //   openSnackbar({
    //     open: true,
    //     message: 'Column deleted successfully',
    //     anchorOrigin: { vertical: 'top', horizontal: 'right' },
    //     variant: 'alert',
    //     alert: { color: 'success' }
    //   } as SnackbarProps);
    // }
    // handlerDelete(false);
    setUpdateStatusPopup(false);
  };
  const handlerUpdateStatus = () => {
    setUpdateStatusPopup(true);
  };
  const columns = useMemo<ColumnDef<any>[]>(
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
        header: 'Invoice Id',
        accessorKey: 'invoiceId',
        meta: { className: 'cell-center' }
      },
      {
        header: 'User Info',
        accessorKey: 'customerName',
        cell: ({ row, getValue }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              alt="Avatar"
              size="sm"
              src={getImageUrl(`avatar-${!row.original.avatar ? 1 : row.original.avatar}.png`, ImagePath.USERS)}
            />
            <Stack spacing={0}>
              <Typography variant="subtitle1">{row.original.customerName as string}</Typography>
              <Typography color="text.secondary">{row.original.customerEmail as string}</Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Create Date',
        accessorKey: 'date'
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (cell) => {
          switch (cell.getValue()) {
            case 'Cancelled':
              return <Chip color="error" label="Cancelled" size="small" variant="light" />;
            case 'Paid':
              return <Chip color="success" label="Paid" size="small" variant="light" />;
            case 'Overdue':
              return <Chip color="warning" label="Overdue" size="small" variant="light" />;
          }
        }
      },
      {
        header: 'Actions',
        meta: { className: 'cell-center' },
        disableSortBy: true,
        cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="Download PDF">
                <IconButton
                  color="info"
                  onClick={(e: any) => {
                    //e.stopPropagation();
                    // navigation(`/apps/invoice/details/${row?.original?.id}`);
                    handlePDFUrl(row?.original?.invoiceId);
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    navigation(`/apps/invoice/edit/${row?.original?.invoiceId}`);
                  }}
                  disabled={row?.original?.status == 'Paid'}
                >
                  <Edit />
                </IconButton>
              </Tooltip>

              <Tooltip title="Update Status">
                <IconButton
                  color="error"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    setInvoiceId(row?.original?.invoiceId);
                    setInvoiceData(row?.original);
                    handlerUpdateStatus();
                  }}
                  disabled={row?.original?.status == 'Paid'}
                >
                  <PaymentIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Invoice', to: '/apps/invoice/dashboard' }, { title: 'List' }];

  return (
    <>
      <Breadcrumbs custom heading="Invoice List" links={breadcrumbLinks} />
      <Grid container direction={matchDownSM ? 'column' : 'row'} spacing={2} sx={{ pb: 2 }}>
        <Grid item xs={12}>
          <ReactTable data={allInvoicesData || []} columns={columns} />
        </Grid>
      </Grid>
      <UpdateInvoiceStatusPopup invoiceId={invoiceId} open={updateStatusPopup} handleClose={handleClose} invoiceData={invoiceData} />
    </>
  );
}
