import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useReactTable, ColumnDef, flexRender, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table';
import {
  Modal,
  Box,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  useTheme,
  Chip
} from '@mui/material';
import { Close } from '@mui/icons-material'; // Import Close icon
import { useGetCustomer } from 'api/customer';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { CustomerList } from 'types/customer';
import { TechnicianList } from 'types/technician';
import { getAllTechnicians, getAssignedComplaints } from 'apiServices/technician';
import { assignTechnician } from 'apiServices/complaint';
import { SnackbarProps } from 'types/snackbar';
import { openSnackbar } from 'api/snackbar';
import Avatar from 'components/@extended/Avatar';
import capitalize from '@mui/utils/capitalize';
interface Props {
  open: boolean;
  modalToggler: (state: boolean) => void;
  complaintId: number;
}
interface ErrorData {
  response: any;
}
interface TechniciansData {
  message: string;
  data: any;
}
interface AssignedData {
  TechnicianComplaints: any;
  message: string;
}
// HeaderSort component for sorting indicators
const HeaderSort = ({ column }: { column: any }) => {
  const sortDirection = column.getIsSorted();
  return <Box sx={{ ml: 1 }}>{sortDirection ? (sortDirection === 'desc' ? '▼' : '▲') : null}</Box>;
};

export default function AssingedComplaintsModal({ open, modalToggler, complaintId }: Props) {
  const theme = useTheme();
  const closeModal = () => modalToggler(false);
  const [allTechniciansData, setAllTechniciansData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [allComplaintsData, setAllComplaintsData] = useState<any>([]);
  const allComplaints =
    allComplaintsData &&
    allComplaintsData.map((complaint: any, index: any) => {
      return {
        id: complaint.Complaint_Id,
        name: complaint.Customer_Name,
        description: complaint.Description,
        warranty: complaint.Warranty,
        item: complaint.Item_Type,
        status: complaint.Status,
        itemImage: complaint.Item_Image,
        billImage: complaint.Bill_Image,
        customerId: complaint.customer_id
      };
    });
  const fetchAssignedComplaints = () => {
    getAssignedComplaints(complaintId)
      .then((response) => {
        const assignedData = response.data as AssignedData;
        const complaintDetils = assignedData.TechnicianComplaints;
        const messageData = assignedData.message;
        setAllComplaintsData(complaintDetils);
      })
      .catch((error) => {
        console.log('assignedResponse', error);
      });
  };
  useEffect(() => {
    fetchAssignedComplaints();
  }, []);
  // Define columns
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
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
            <Stack spacing={0}>
              <Typography variant="subtitle1">{row.original.name}</Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Item',
        accessorKey: 'item',
        cell: ({ row, getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{row.original.item}</Typography>
          </Stack>
        )
      },
      {
        header: 'Description',
        accessorKey: 'description',
        cell: ({ row, getValue }) => <Typography>{row.original.description}</Typography>
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
              color={status === 'Completed' ? 'success' : status === 'InProgress' ? 'info' : status === 'pending' ? 'warning' : 'error'}
              label={
                status === 'Completed'
                  ? 'Completed'
                  : status === 'InProgress'
                    ? 'In Progress'
                    : status === 'pending'
                      ? 'Pending'
                      : 'Cancelled'
              }
              size="small"
              variant="light"
            />
          );
        }
      }
    ],
    [theme]
  );

  // Table setup
  const table = useReactTable({
    data: allComplaints,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: []
    }
  });

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-customer-add-label"
          aria-describedby="modal-customer-add-description"
          sx={{ '& .MuiPaper-root:focus': { outline: 'none' } }}
        >
          <MainCard
            sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 880, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar sx={{ maxHeight: `calc(100vh - 48px)`, '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
              <Box sx={{ position: 'relative' }}></Box>
              {
                <>
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        Assigned Complaints
                      </Typography>
                      <IconButton onClick={closeModal} color="error">
                        <Close />
                      </IconButton>
                    </Box>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                              {headerGroup.headers.map((header) => (
                                <TableCell
                                  key={header.id}
                                  onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                  sx={{
                                    cursor: header.column.getCanSort() ? 'pointer' : 'default'
                                  }}
                                >
                                  {header.isPlaceholder ? null : (
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                                      {header.column.getCanSort() && <HeaderSort column={header.column} />}
                                    </Stack>
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableHead>
                        <TableBody>
                          {table.getRowModel().rows.map((row) => (
                            <Fragment key={row.id}>
                              <TableRow hover>
                                {row.getVisibleCells().map((cell) => (
                                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                ))}
                              </TableRow>
                            </Fragment>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </>
              }
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
