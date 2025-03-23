import {
  Campaign,
  CampaignCategory,
  CampaignName,
} from "../types/campaignType";
import { ProductCategory } from "../types/productType";

export const campaigns: Campaign[] = [
  {
    id: 1,
    name: CampaignName.Fixed,
    category: CampaignCategory.Coupon,
    params: [50],
  },
  {
    id: 2,
    name: CampaignName.Percentage,
    category: CampaignCategory.Coupon,
    params: [0.2],
  },
  {
    id: 3,
    name: CampaignName.PercentageCategory,
    category: CampaignCategory.OnTop,
    params: [ProductCategory.Clothing, 0.1],
  },
  {
    id: 4,
    name: CampaignName.Point,
    category: CampaignCategory.OnTop,
    params: [20],
  },
  {
    id: 5,
    name: CampaignName.Special,
    category: CampaignCategory.Seasonal,
    params: [100, 20],
  },
];
