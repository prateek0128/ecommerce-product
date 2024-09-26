import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
import FormSubcategoryAdd from './FormSubcategoryAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { useGetCustomer } from 'api/customer';

// types
import { CategoryList } from 'types/category';
import { SubcategoryList } from 'types/subcategory';

interface Props {
  open: boolean;
  modalToggler: (state: boolean) => void;
  subcategory?: SubcategoryList | null;
}

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export default function SubcategoryModal({ open, modalToggler, subcategory }: Props) {
  //const { customersLoading: loading } = useGetCustomer();

  const closeModal = () => modalToggler(false);

  const subcategoryForm = useMemo(
    () => <FormSubcategoryAdd subcategory={subcategory || null} closeModal={closeModal} />,
    // eslint-disable-next-line
    [subcategory]
  );

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
            sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 500, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar sx={{ maxHeight: `calc(100vh - 48px)`, '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
              {subcategoryForm}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
