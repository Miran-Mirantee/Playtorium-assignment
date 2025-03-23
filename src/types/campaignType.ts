// Define an enum for Campaign names
export enum CampaignName {
  Fixed = "Fixed amount",
  Percentage = "Percentage discount",
  PercentageCategory = "Percentage discount by item category",
  Point = "Discount by points",
  Special = "Special campaigns",
}

// Define an enum for Campaign categories
export enum CampaignCategory {
  Coupon = "Coupon",
  OnTop = "On Top",
  Seasonal = "Seasonal",
}

export type Campaign = {
  id: number;
  name: CampaignName;
  category: CampaignCategory;
  params: any[];
};
