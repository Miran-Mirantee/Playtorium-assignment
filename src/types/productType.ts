// Define an enum for product categories
export enum ProductCategory {
  Clothing = "Clothing",
  Accessories = "Accessories",
  Electronics = "Electronics",
  Footwear = "Footwear",
  HomeAppliance = "Home Appliance",
  Sports = "Sports",
}

export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
};

export type SelectedProduct = Product & { count: number };
