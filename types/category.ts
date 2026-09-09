import type { Department } from "./product";

export interface Category {
  id?: string;
  name: string;
  slug: string;
  department: Department;
  image: string;
  sortOrder?: number;
}

export interface DepartmentInfo {
  slug: Department;
  name: string;
  heading: string;
  description: string;
  categories: Category[];
}

export interface CategoryInput {
  name: string;
  slug: string;
  department: Department;
  image: string;
  sortOrder?: number;
}
