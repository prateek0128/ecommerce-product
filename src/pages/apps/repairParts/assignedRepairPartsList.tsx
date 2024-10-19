import { useMemo, useState, Fragment, MouseEvent, useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import capitalize from '@mui/utils/capitalize';

// third-party
import { NumericFormat } from 'react-number-format';
import {
  ColumnDef,
  HeaderGroup,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  useReactTable,
  SortingState,
  FilterFn,
  ColumnFiltersState
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

// project-import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import ProductView from 'sections/apps/e-commerce/product-list/ProductView';
import {
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from 'components/third-party/react-table';

import { APP_DEFAULT_PATH } from 'config';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// types
import { Products } from 'types/e-commerce';
import { LabelKeyObject } from 'react-csv/lib/core';

// assets
import { Add, Edit, Eye, Trash } from 'iconsax-react';

import { getAllProducts, deleteProduct } from 'apiServices/products';
import { addCategory, getAllCategories, getAssignedRepairParts } from 'apiServices/repairParts';
import AlertProductDelete from 'sections/apps/e-commerce/product-list/AlertProductDelete';
import CategoryModal from 'sections/apps/repairParts/CategoryModal';
import SubcategoryModal from 'sections/apps/subcategory/SubcategoryModal';
import CategoryView from 'sections/apps/repairParts/CategoryView';
import CircularProgress from '@mui/material/CircularProgress';
import { assignedPartsData } from './assignRepairPartsData';
import AssignedRepairPartsView from '../../../sections/apps/repairParts/assignedRepairPartsView';
interface CategoryData {
  data: any;
  message: any;
}
interface AssignedData {
  data: any;
  message: any;
}
type RowData = {
  pending: string;
  complaintId: number;
  technicianName: string;
  itemName: string;
  status: string;
  date: string;
  // Add other fields that your rows contain
};

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, modalToggler, loading }: any) {
  const theme = useTheme();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isAnyPending, setIsAnyPending] = useState('no');
  const handlePendingStatusChange = (status: string) => {
    setIsAnyPending(status);
  };
  const table = useReactTable<RowData>({
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
  return (
    <MainCard content={false}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${data.length} records...`}
        />
        <Stack direction="row" spacing={1} alignItems="center">
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
          <Button variant="contained" startIcon={<Add />} onClick={modalToggler} size="large">
            Add Category
          </Button>
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
                  {table.getRowModel().rows.map((row) => (
                    <Fragment key={row.id}>
                      <TableRow
                        sx={{
                          backgroundColor: row.original.pending == 'yes' ? 'rgba(255, 0, 0, 0.5)' : 'inherit'
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                      {row.getIsExpanded() && (
                        <TableRow sx={{ '&:hover': { bgcolor: `${backColor} !important` } }}>
                          <TableCell colSpan={row.getVisibleCells().length}>
                            <AssignedRepairPartsView data={row.original} onPendingStatusChange={handlePendingStatusChange} />
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))}
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
                  getPageCount: table.getPageCount,
                  initialPageSize: 10
                }}
              />
            </Box>
          </>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| PRODUCT LIST ||============================== //

export default function AssignedRepairPartsList() {
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [productDeleteId, setProductDeleteId] = useState<any>('');
  const [allCategoriesData, setAllCategoriesData] = useState<any>([]);
  const [allAssingedData, setAllAssingedData] = useState<any>([]);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openSubcategoryModal, setOpenSubcategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCategoryModal = () => {
    setOpenCategoryModal((prev) => !prev);
  };
  const handleSubcategoryModal = () => {
    setOpenSubcategoryModal((prev) => !prev);
  };
  const allCategories =
    allCategoriesData &&
    allCategoriesData.map((category: any, index: any) => {
      return {
        id: category.Category_Id,
        categoryName: category.Category_Name,
        isActive: category.IsEnabled
      };
    });
  const getAllCategoriesAPI = () => {
    //setLoading(true);
    getAllCategories()
      .then((response) => {
        setLoading(false);
        const categoryData = response.data as CategoryData;
        setAllCategoriesData(categoryData.data.categories || []);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const allAssingedRepairParts =
    allAssingedData &&
    allAssingedData.map((data: any, index: number) => {
      const date = new Date(data?.Assigned_Time);
      const formattedDate = date.toISOString().split('T')[0];
      return {
        assignmentId: data.Assignment_Id,
        complaintId: data.Complaint_Id,
        technicianId: data.Technician_Id,
        technicianName: data.Technician_Name,
        itemName: data.Category,
        date: formattedDate,
        pending: data.pending
      };
    });
  const handleClose = () => {
    setDeleteModal(!deleteModal);
  };

  const fetchAssignedRepairParts = () => {
    getAssignedRepairParts()
      .then((response) => {
        const assignedData = response.data as AssignedData;
        setAllAssingedData(assignedData.data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  useEffect(() => {
    // getAllCategoriesAPI();
    fetchAssignedRepairParts();
  }, []);
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
        header: 'Assignment Id',
        accessorKey: 'assignmentId',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Complaint Id',
        accessorKey: 'complaintId',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Technicain Name',
        accessorKey: 'technicianName',
        cell: ({ row, getValue }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack spacing={0}>
              <Typography variant="subtitle1">{row.original.technicianName}</Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Item Name',
        accessorKey: 'itemName',
        cell: ({ row, getValue }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack spacing={0}>
              <Typography variant="subtitle1">{row.original.itemName}</Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Date',
        accessorKey: 'date',
        cell: ({ row, getValue }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack spacing={0}>
              <Typography variant="subtitle1">{row.original.date}</Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Pending',
        accessorKey: 'pending',
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <Chip color={status === 'yes' ? 'success' : 'error'} label={status === 'yes' ? 'Yes' : 'No'} size="small" variant="light" />
          );
        }
      },
      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        cell: ({ row }) => {
          const collapseIcon = row.getCanExpand() && row.getIsExpanded() ? <Add style={{ transform: 'rotate(45deg)' }} /> : <Eye />;

          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="View Repair Parts">
                <IconButton color={row.getIsExpanded() ? 'error' : 'secondary'} onClick={row.getToggleExpandedHandler()}>
                  {collapseIcon}
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    //navigate('/apps/e-commerce/edit-product', { state: { productData: row.original } }); // Pass the data array in state
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
                    setProductDeleteId(Number(row.original.id));
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
    []
  );
  // let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Product List' }];
  return (
    <>
      {/* <Breadcrumbs custom heading="Product List" links={breadcrumbLinks} /> */}
      <ReactTable
        data={allAssingedRepairParts}
        columns={columns}
        modalToggler={() => {
          setOpenCategoryModal(true);
        }}
        loading={loading}
      />
      {/* <AlertProductDelete id={Number(productDeleteId)} title={productDeleteId} open={deleteModal} handleClose={handleClose} /> */}
      <CategoryModal open={openCategoryModal} modalToggler={setOpenCategoryModal} />
      {/* <SubcategoryModal open={openSubcategoryModal} modalToggler={setOpenSubcategoryModal} /> */}
    </>
  );
}
