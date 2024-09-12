import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
import FormTechicianAdd from './FormTechicianAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { useGetCustomer } from 'api/technician';

// types
import { TechnicianList } from 'types/technician';

interface Props {
  open: boolean;
  modalToggler: (state: boolean) => void;
  technician?: TechnicianList | null;
}

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export default function TechnicianModal({ open, modalToggler, technician }: Props) {
  const { customersLoading: loading } = useGetCustomer();

  const closeModal = () => modalToggler(false);

  const customerForm = useMemo(
    () => !loading && <FormTechicianAdd technician={technician || null} closeModal={closeModal} />,
    // eslint-disable-next-line
    [technician, loading]
  );

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-technician-add-label"
          aria-describedby="modal-technician-add-description"
          sx={{ '& .MuiPaper-root:focus': { outline: 'none' } }}
        >
          <MainCard
            sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 880, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar sx={{ maxHeight: `calc(100vh - 48px)`, '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
              {loading ? (
                <Box sx={{ p: 5 }}>
                  <Stack direction="row" justifyContent="center">
                    <CircularWithPath />
                  </Stack>
                </Box>
              ) : (
                customerForm
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
