import { useEffect, useMemo, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';

// project-imports
import FormTechnicianAdd from './FormTechicianAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
//import { handlerCustomerDialog, useGetCustomer, useGetCustomerMaster } from 'api/customer';
import { handlerCustomerDialog, useGetCustomer, useGetCustomerMaster } from 'api/technician';

// types
import { TechnicianList } from 'types/technician';

// ==============================|| CUSTOMER - ADD / EDIT ||============================== //

export default function AddTechnician() {
  // const { customerMasterLoading, customerMaster } = useGetCustomerMaster();
  // const { customersLoading: loading, customers } = useGetCustomer();
  //const isModal = customerMaster?.modal;

  const [list, setList] = useState<TechnicianList | null>(null);

  // useEffect(() => {
  //   if (customerMaster?.modal && typeof customerMaster.modal === 'number') {
  //     const newList = customers.filter((info) => info.id === isModal && info)[0];
  //     setList(newList);
  //   } else {
  //     setList(null);
  //   }
  //   // eslint-disable-next-line
  // }, [customerMaster]);

  const closeModal = () => handlerCustomerDialog(false);

  // eslint-disable-next-line
  const technicianForm = useMemo(() => <FormTechnicianAdd technician={list} closeModal={closeModal} />, [list]);

  return (
    <>
      {/* {isModal && ( */}
      <Modal
        open={true}
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
          <SimpleBar
            sx={{
              maxHeight: `calc(100vh - 48px)`,
              '& .simplebar-content': { display: 'flex', flexDirection: 'column' }
            }}
          >
            {technicianForm}
          </SimpleBar>
        </MainCard>
      </Modal>
      {/* )} */}
    </>
  );
}
