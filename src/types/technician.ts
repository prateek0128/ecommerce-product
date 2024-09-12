import { Gender } from 'config';

// ==============================|| TYPES - CUSTOMER  ||============================== //

export interface TechnicianProps {
  modal: boolean;
}

export interface TechnicianList {
  firstName: string;
  lastName: string;
  id?: number;
  profilePicture: string;
  // name: string;
  // fatherName: string;
  email: string;
  age: number;
  gender: Gender;
  techRole: string;
  contact: string;
  location: string;
}
