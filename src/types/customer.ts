import { Gender } from 'config';

// ==============================|| TYPES - CUSTOMER  ||============================== //

export interface CustomerProps {
  modal: boolean;
}

export interface CustomerList {
  firstName: string;
  lastName: string;
  id?: number;
  profilePicture: string;
  //name: string;
  //fatherName: string;
  email: string;
  age: number;
  gender: Gender;
  techRole: string;
  // orders: number;
  // progress: number;
  // status: number;
  // orderStatus: string;
  contact: string;
  // country: string;
  location: string;
  // about: string;
  // skills: string[];
  // time: string[];
  // date: Date | string | number;
}
