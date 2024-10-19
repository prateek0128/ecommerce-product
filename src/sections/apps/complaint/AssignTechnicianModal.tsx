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
  Button
} from '@mui/material';
import { Close } from '@mui/icons-material'; // Import Close icon
import { useGetCustomer } from 'api/customer';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { CustomerList } from 'types/customer';
import { TechnicianList } from 'types/technician';
import { getAllTechnicians } from 'apiServices/technician';
import { assignTechnician } from 'apiServices/complaint';
import { SnackbarProps } from 'types/snackbar';
import { openSnackbar } from 'api/snackbar';
interface Props {
  open: boolean;
  modalToggler: (state: boolean) => void;
  complaintId: number;
  customerId: number;
}

// Sample data
const sampleData = [
  { name: 'John Doe', contact: '123-456-7890', email: 'john@example.com', role: 'Technician', availability: 'Available' },
  { name: 'Jane Smith', contact: '987-654-3210', email: 'jane@example.com', role: 'Technician', availability: 'Not Available' },
  { name: 'Mike Johnson', contact: '555-123-4567', email: 'mike@example.com', role: 'Lead Technician', availability: 'Available' },
  { name: 'Emily Davis', contact: '444-555-6666', email: 'emily@example.com', role: 'Technician', availability: 'Not Available' },
  { name: 'Chris Brown', contact: '333-444-5555', email: 'chris@example.com', role: 'Senior Technician', availability: 'Available' },
  { name: 'Sarah Wilson', contact: '222-333-4444', email: 'sarah@example.com', role: 'Technician', availability: 'Not Available' },
  { name: 'David Lee', contact: '111-222-3333', email: 'david@example.com', role: 'Technician', availability: 'Available' },
  { name: 'Sophia Martinez', contact: '666-777-8888', email: 'sophia@example.com', role: 'Technician', availability: 'Available' },
  { name: 'Daniel Moore', contact: '999-000-1111', email: 'daniel@example.com', role: 'Technician', availability: 'Not Available' },
  { name: 'Laura Jackson', contact: '888-999-0000', email: 'laura@example.com', role: 'Technician', availability: 'Available' }
];
interface ErrorData {
  response: any;
}
interface TechniciansData {
  message: string;
  data: any;
}
// HeaderSort component for sorting indicators
const HeaderSort = ({ column }: { column: any }) => {
  const sortDirection = column.getIsSorted();
  return <Box sx={{ ml: 1 }}>{sortDirection ? (sortDirection === 'desc' ? '▼' : '▲') : null}</Box>;
};

export default function AssignTechnicianModal({ open, modalToggler, complaintId, customerId }: Props) {
  const closeModal = () => modalToggler(false);
  const [allTechniciansData, setAllTechniciansData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  // Memoize the derived allTechnicians to avoid recalculation on each render
  const allTechnicians = useMemo(
    () =>
      allTechniciansData.map((technician: any) => ({
        id: technician.Id,
        name: `${technician.First_Name} ${technician.Last_Name}`,
        email: technician.Email,
        contact: technician.Contact,
        techRole: technician.Tech_Role,
        availability: technician.Is_Available
      })),
    [allTechniciansData]
  );
  useEffect(() => {
    const fetchTechnicians = async () => {
      setLoading(true);
      try {
        const response = await getAllTechnicians();
        setLoading(false);
        const techniciansData = response.data as TechniciansData;
        setAllTechniciansData(techniciansData.data.Technicians || []);
      } catch (error) {
        console.error('Error fetching technicians:', error);
      }
    };
    if (allTechniciansData.length == 0) {
      fetchTechnicians();
    }
  }, [allTechniciansData.length]);
  const assignTechnicianAPI = (techId: any) => {
    const assignTechnicianData = { customerId: Number(customerId), technicianId: Number(techId), complaintId: Number(complaintId) };
    assignTechnician(assignTechnicianData)
      .then((response) => {
        closeModal();
        openSnackbar({
          open: true,
          message: 'Technician assigned successfully.',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        } as SnackbarProps);
      })
      .catch((error) => {
        console.error('Error assigning technician:', error);
        const errorData = error as ErrorData;
        openSnackbar({
          open: true,
          message: errorData.response.data.error,
          variant: 'alert',
          alert: {
            color: 'error'
          }
        } as SnackbarProps);
      });
  };
  // Define columns
  const columns: ColumnDef<any>[] = [
    {
      header: '#',
      accessorKey: 'id',
      meta: {
        className: 'cell-center'
      }
    },
    { header: 'Technician Name', accessorKey: 'name' },
    { header: 'Contact', accessorKey: 'contact' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Role', accessorKey: 'techRole' },
    {
      header: 'Availability',
      accessorKey: 'availability',
      cell: ({ row }) =>
        row.original.availability == 1 ? (
          <Button
            type="button"
            variant="contained"
            onClick={(event) => {
              event.stopPropagation();
              assignTechnicianAPI(row.original.id);
            }}
          >
            Assign
          </Button>
        ) : (
          'Not Available'
        )
    }
  ];

  // Table setup
  const table = useReactTable({
    data: allTechnicians,
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
                        Available Technicians
                      </Typography>
                      <IconButton onClick={closeModal}>
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
                                  <TableCell key={cell.id}>
                                    {cell.column.id === 'availability' ? (
                                      // Only for the 'availability' column where the Button is rendered
                                      row.original.availability == 1 ? (
                                        <Button
                                          type="button"
                                          variant="contained"
                                          onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation(); // Prevent row click
                                            assignTechnicianAPI(row.original.id);
                                          }}
                                        >
                                          Assign
                                        </Button>
                                      ) : (
                                        'Not Available'
                                      )
                                    ) : (
                                      flexRender(cell.column.columnDef.cell, cell.getContext())
                                    )}
                                  </TableCell>
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
