import { test, expect, describe } from "vitest";
import applyDiscounts, {
  applyFixed,
  applyPercentage,
  applyPercentageCategory,
  applyPoint,
  applySpecial,
  calculateBasePrice,
} from "../src/modules/discount";
import { ProductCategory, SelectedProduct } from "../src/types/productType";
import {
  CampaignCategory,
  CampaignName,
  Campaign,
} from "../src/types/campaignType";

const products: SelectedProduct[] = [
  {
    id: 1,
    name: "T-Shirt",
    category: ProductCategory.Clothing,
    price: 350,
    count: 3,
  },
  {
    id: 2,
    name: "Hoodie",
    category: ProductCategory.Clothing,
    price: 700,
    count: 2,
  },
  {
    id: 12,
    name: "Bluetooth Speaker",
    category: ProductCategory.Electronics,
    price: 3200,
    count: 1,
  },
  {
    id: 13,
    name: "Microwave",
    category: ProductCategory.HomeAppliance,
    price: 6000,
    count: 1,
  },
];

const campaign1: Campaign[] = [
  {
    id: 1,
    name: CampaignName.Fixed,
    category: CampaignCategory.Coupon,
    params: [500],
  },
  {
    id: 2,
    name: CampaignName.Percentage,
    category: CampaignCategory.Coupon,
    params: [0.2],
  },
];

const campaign2: Campaign[] = [
  {
    id: 2,
    name: CampaignName.Percentage,
    category: CampaignCategory.Coupon,
    params: [0.5],
  },
  {
    id: 3,
    name: CampaignName.PercentageCategory,
    category: CampaignCategory.OnTop,
    params: [ProductCategory.Clothing, 0.7],
  },
];

const campaign3: Campaign[] = [
  {
    id: 4,
    name: CampaignName.Point,
    category: CampaignCategory.OnTop,
    params: [1000],
  },
  {
    id: 5,
    name: CampaignName.Special,
    category: CampaignCategory.Seasonal,
    params: [100, 20],
  },
];

const campaign4: Campaign[] = [
  {
    id: 1,
    name: CampaignName.Fixed,
    category: CampaignCategory.Coupon,
    params: [2500],
  },
  {
    id: 5,
    name: CampaignName.Special,
    category: CampaignCategory.Seasonal,
    params: [100, 20],
  },
];

const campaign5: Campaign[] = [
  {
    id: 1,
    name: CampaignName.Fixed,
    category: CampaignCategory.Coupon,
    params: [2500],
  },
  {
    id: 3,
    name: CampaignName.PercentageCategory,
    category: CampaignCategory.OnTop,
    params: [ProductCategory.Clothing, 0.5],
  },
  {
    id: 5,
    name: CampaignName.Special,
    category: CampaignCategory.Seasonal,
    params: [100, 20],
  },
];

describe("applyFixed function", () => {
  test("should return correct sum when applying 'Fixed amount' campaign to total price", () => {
    expect(applyFixed(500, 5000)).toBe(4500);
  });
  test("should return 0 when the 'Fixed amount' campaign value exceeds total price", () => {
    expect(applyFixed(999, 100)).toBe(0);
  });
});
describe("applyPercentage function", () => {
  test("should return correct product when applying 'Percentage discount' campaign to total price", () => {
    expect(applyPercentage(0.9, 2500)).toBe(250);
  });
  test("should return 0 when the discount percentage exceeds 100%", () => {
    expect(applyPercentage(5, 100)).toBe(0);
  });
});
describe("applyPercentageCategory function", () => {
  test("should return correct sum when applying 'Percentage discount by item category' campaign to total price", () => {
    expect(
      applyPercentageCategory(ProductCategory.Clothing, 0.6, products)
    ).toBe(10180);
  });
  test("should return correct sum when the discount percentage exceeds 100%", () => {
    expect(applyPercentageCategory(ProductCategory.Clothing, 5, products)).toBe(
      9200
    );
  });
});
describe("applyPoint function", () => {
  test("should return correct sum when applying 'Discount by point' campaign to total price", () => {
    expect(applyPoint(250, 2500)).toBe(2250);
  });
  test("should return original total price when the customer point exceeds 20% of total price", () => {
    expect(applyPoint(50, 100)).toBe(100);
  });
});
describe("applySpecial function", () => {
  test("should return correct sum when applying 'Special campaigns' campaign to total price", () => {
    expect(applySpecial(30, 3, 399)).toBe(360);
  });
  test("should return 0 when the discount amount exceeds total price", () => {
    expect(applySpecial(10, 50, 100)).toBe(0);
  });
});
describe("calculateBasePrice function", () => {
  test("should return correct total cost when adding the cost of every items in the shopping cart", () => {
    expect(calculateBasePrice(products)).toBe(11650);
  });
  test("should return 0 when the shopping cart is empty", () => {
    expect(calculateBasePrice([])).toBe(0);
  });
});
describe("applyDiscounts function", () => {
  test("should apply only the first campaign when multiple campaigns of the same category exist", () => {
    expect(applyDiscounts(products, campaign1)).toBe(11150);
  });
  test("should apply both 'Coupon' and 'On Top' campaigns and return the correct discounted price", () => {
    expect(applyDiscounts(products, campaign2)).toBe(4967.5);
  });
  test("should apply both 'Seasonal' and 'On Top' campaigns and return the correct discounted price", () => {
    expect(applyDiscounts(products, campaign3)).toBe(8530);
  });
  test("should apply both 'Seasonal' and 'Coupon' campaigns and return the correct discounted price", () => {
    expect(applyDiscounts(products, campaign4)).toBe(6830);
  });
  test("should apply 'On Top', 'Seasonal' and 'Coupon' campaigns and return the correct discounted price", () => {
    expect(applyDiscounts(products, campaign5)).toBe(5845);
  });
});
