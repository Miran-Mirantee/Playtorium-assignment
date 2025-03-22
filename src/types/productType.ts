// Define an enum for product categories
export enum Category {
  Clothing = "Clothing",
  Accessories = "Accessories",
  Electronics = "Electronics",
  Footwear = "Footwear",
  HomeAppliance = "Home Appliance",
  Sports = "Sports",
}

// Define a Product type
export type Product = {
  id: number;
  name: string;
  category: Category;
  price: number;
};
