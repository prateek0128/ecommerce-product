import { Gender } from 'config';

// ==============================|| TYPES - CUSTOMER  ||============================== //

export interface SubcategoryProps {
  modal: boolean;
}

export interface SubcategoryList {
  subcategoryName: string;
  categoryName: string;
  subcategoryId?: number;
  categoryId?: number;
  isActive: number;
}
