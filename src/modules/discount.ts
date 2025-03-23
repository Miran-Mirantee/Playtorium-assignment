import { SelectedProduct, ProductCategory } from "../types/productType";
import {
  Campaign,
  CampaignCategory,
  CampaignName,
} from "../types/campaignType";

export default function applyDiscounts(
  selectedProducts: SelectedProduct[],
  campaigns: Campaign[]
): number {
  let finalPrice = calculateBasePrice(selectedProducts); // Assume you calculate the base price of the items

  // 1. Apply OnTop campaigns first
  const onTop = campaigns.find(
    (campaign) => campaign.category === CampaignCategory.OnTop
  );

  switch (onTop?.name) {
    case CampaignName.PercentageCategory:
      finalPrice = applyPercentageCategory(
        onTop.params[0],
        onTop.params[1],
        selectedProducts
      );
      break;

    case CampaignName.Point:
      finalPrice = applyPoint(onTop.params[0], finalPrice);
      break;

    default:
      break;
  }

  console.log(onTop);

  // 2. Apply Seasonal campaigns
  const seasonal = campaigns.find(
    (campaign) => campaign.category === CampaignCategory.Seasonal
  );

  switch (seasonal?.name) {
    case CampaignName.Special:
      finalPrice = applySpecial(
        seasonal.params[0],
        seasonal.params[1],
        finalPrice
      );
      break;

    default:
      break;
  }

  console.log(seasonal);

  // 3. Apply Coupon campaigns last
  const coupon = campaigns.find(
    (campaign) => campaign.category === CampaignCategory.Coupon
  );

  switch (coupon?.name) {
    case CampaignName.Fixed:
      finalPrice = applyFixed(coupon.params[0], finalPrice);
      break;

    case CampaignName.Percentage:
      finalPrice = applyPercentage(coupon.params[0], finalPrice);
      break;

    default:
      break;
  }

  console.log(coupon);

  //   campaigns
  //     .filter(
  //       (campaign) =>
  //         campaign.category === CampaignCategory.Coupon &&
  //         !appliedCampaigns.has(campaign.category)
  //     )
  //     .forEach((campaign) => {
  //       console.log(campaign);
  //       console.log(appliedCampaigns);

  //       //   finalPrice = applyCampaign(finalPrice, campaign);
  //       appliedCampaigns.add(campaign.category);
  //     });

  return finalPrice;
}

const calculateBasePrice = (selectedProducts: SelectedProduct[]): number => {
  return selectedProducts.reduce(
    (total, selectedProduct) =>
      total + selectedProduct.price * selectedProduct.count,
    0
  );
};

/**
 * Apply "Percentage discount by item category" campaign (On Top)
 * Discount the entire amount of a specific category of items in cart
 *
 * @param category the category of items to apply the discount to.
 * @param discountPercentage the discount percentage (expressed as a decimal, e.g., 0.15 for 15%).
 * @param selectedProducts current items in shopping cart
 * @returns discounted price after applying the campaign
 */
const applyPercentageCategory = (
  category: ProductCategory,
  discountPercentage: number,
  selectedProducts: SelectedProduct[]
) => {
  const discountedPrice = selectedProducts.reduce((total, selectedProduct) => {
    if (selectedProduct.category === category) {
      return (
        total +
        selectedProduct.price * (1 - discountPercentage) * selectedProduct.count
      );
    } else {
      return total + selectedProduct.price * selectedProduct.count;
    }
  }, 0);

  return discountedPrice;
};

/**
 * Apply "Percentage discount by item category" campaign (On Top)
 * Users spent points for a fixed amount of discount (1 point = 1 THB).
 * The amount will be capped at 20% of total price
 *
 * @param customerPoint amount of customer point to reduce the total price (cannot be more that 20% of total price)
 * @param currentPrice current total price of the items in shopping cart
 * @returns discounted price after applying the campaign
 */
const applyPoint = (customerPoint: number, currentPrice: number) => {
  let discountedPrice = currentPrice;
  if (Math.round(currentPrice * 0.2) >= customerPoint) {
    discountedPrice -= customerPoint;
  }

  return discountedPrice;
};

/**
 * Apply "Special campaigns" campaign (Seasonal)
 * From the total price, at every X THB, subtracting a fixed amount Y THB
 *
 * @param threshold the spending threshold (X THB) at which the discount applies.
 * @param discountAmount the fixed discount (Y THB) applied at each threshold interval.
 * @param currentPrice current total price of the items in shopping cart
 * @returns discounted price after applying the campaign
 */
const applySpecial = (
  threshold: number,
  discountAmount: number,
  currentPrice: number
) => {
  if (currentPrice < threshold) return currentPrice;

  const discountTimes = Math.floor(currentPrice / threshold);
  const totalDiscount = discountTimes * discountAmount;
  return Math.max(0, currentPrice - totalDiscount); // Ensure price never goes below zero
};

/**
 * Apply "Fixed amount" campaign (Coupon)
 * Discounts the entire cart by subtracting an amount from the total price
 *
 * @param discountAmount the fixed discount applies to the current price
 * @param currentPrice current total price of the items in shopping cart
 * @returns discounted price after applying the campaign
 */
const applyFixed = (discountAmount: number, currentPrice: number) => {
  return Math.max(0, currentPrice - discountAmount);
};

/**
 * Apply "Percentage discount" campaign (Coupon)
 * Discounts the entire cart by subtracting a percentage from the total price
 *
 * @param discountPercentage the discount percentage (expressed as a decimal, e.g., 0.15 for 15%).
 * @param currentPrice current total price of the items in shopping cart
 * @returns discounted price after applying the campaign
 */
const applyPercentage = (discountPercentage: number, currentPrice: number) => {
  return currentPrice * (1 - discountPercentage);
};
