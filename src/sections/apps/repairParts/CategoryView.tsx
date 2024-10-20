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
import { addCategory, getAllCategories, getAllSubcategories } from 'apiServices/repairParts';
import AlertProductDelete from 'sections/apps/e-commerce/product-list/AlertProductDelete';
import CategoryModal from 'sections/apps/repairParts/CategoryModal';
import SubcategoryModal from 'sections/apps/subcategory/SubcategoryModal';
import CircularProgress from '@mui/material/CircularProgress';
interface CategoryData {
  data: any;
  message: any;
}
// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, modalToggler, loading }: any) {
  const theme = useTheme();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
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
      <ScrollX>
        <Stack>
          <RowSelection selected={Object.keys(rowSelection).length} />
          {loading == false ? (
            <TableContainer>
              <Table>
                {/* <TableHead>
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
              </TableHead> */}
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <Fragment key={row.id}>
                      <TableRow>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                      {/* {row.getIsExpanded() && (
                      <TableRow sx={{ '&:hover': { bgcolor: `${backColor} !important` } }}>
                        <TableCell colSpan={row.getVisibleCells().length}>
                          <CategoryView data={row.original} />
                        </TableCell>
                      </TableRow>
                    )} */}
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
            {/* <Divider />
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
            </Box> */}
          </>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| PRODUCT LIST ||============================== //

export default function CategoryView({ data }: any) {
  //const products = useLoaderData() as Products[];
  const navigate = useNavigate();
  const history = useNavigate();
  //const [selectedCustomer, setSelectedCustomer] = useState<Products | null>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [productDeleteId, setProductDeleteId] = useState<any>('');
  const [allSubcategoriesData, setAllSubcategoriesData] = useState<any>([]);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openSubcategoryModal, setOpenSubcategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleCategoryModal = () => {
    setOpenCategoryModal((prev) => !prev);
  };
  const handleSubcategoryModal = () => {
    setOpenSubcategoryModal((prev) => !prev);
  };
  const allSubcategories =
    allSubcategoriesData &&
    allSubcategoriesData.map((subcategory: any, index: any) => {
      return {
        id: subcategory.Sub_Category_Id,
        subcategoryName: subcategory.Sub_Category_Name,
        isActive: subcategory.IsEnabled
      };
    });
  const handleClose = () => {
    setDeleteModal(!deleteModal);
  };
  const getAllSubcategoriesAPI = () => {
    setLoading(true);
    getAllSubcategories(data.id)
      .then((response) => {
        setLoading(false);
        setAllSubcategoriesData(response.data || []);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getAllSubcategoriesAPI();
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
        header: 'Category Name',
        accessorKey: 'subcategoryName',
        cell: ({ row, getValue }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* <Avatar
              variant="rounded"
              alt={getValue() as string}
              color="secondary"
              size="sm"
              src={getImageUrl(`thumbs/${!row.original.image ? 'prod-11.png' : row.original.image}`, ImagePath.ECOMMERCE)}
            /> */}
            <Stack spacing={0}>
              <Typography variant="subtitle1">{row.original.subcategoryName}</Typography>
              {/* <Typography variant="caption" color="text.secondary">
                {row.original.description.charAt(0).toUpperCase() + row.original.description.slice(1).toLowerCase()}
              </Typography> */}
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Status',
        accessorKey: 'isActive',
        cell: (cell) => {
          switch (cell.getValue()) {
            case 1:
              return <Chip color="success" label="Active" size="small" variant="light" />;
            case 0:
              return <Chip color="error" label="Inactive" size="small" variant="light" />;
          }
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
              {/* <Tooltip title="View">
                <IconButton color={row.getIsExpanded() ? 'error' : 'secondary'} onClick={row.getToggleExpandedHandler()}>
                  {collapseIcon}
                </IconButton>
              </Tooltip> */}
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
              <Tooltip title="Delete">
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
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    []
  );
  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Product List' }];
  return (
    <>
      {/* <Breadcrumbs custom heading="Product List" links={breadcrumbLinks} /> */}
      <ReactTable
        data={allSubcategories}
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
