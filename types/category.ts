import type { Department } from "./product";

export interface Category {
  name: string;
  slug: string;
  department: Department;
  image: string;
}

export interface DepartmentInfo {
  slug: Department;
  name: string;
  heading: string;
  description: string;
  categories: Category[];
}
