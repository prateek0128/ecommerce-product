import { Gender } from 'config';

// ==============================|| TYPES - CUSTOMER  ||============================== //

export interface CategoryProps {
  modal: boolean;
}

export interface CategoryList {
  subcategoryName: string;
  categoryName: string;
  subcategoryId?: number;
  categoryId?: number;
  // isActive: number;
}
