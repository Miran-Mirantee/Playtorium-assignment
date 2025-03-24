# Discount module

Kantawat Samarntrakulchai

## Changes Made from the Original Requirements

I changed the order of applying campaigns from **Coupon > On Top > Seasonal** to **On Top > Seasonal > Coupon**. The reason for this change is that it doesn't make sense to apply the coupon before any other campaigns. For example, if we apply a "Fixed Amount" campaign (a coupon) first, how can we calculate the discounted price when we apply a "Percentage Discount by Item Category" campaign afterward? The "Fixed Amount" reduces the total price after summing the costs of all items, whereas the "Percentage Discount by Item Category" applies to specific items.

As for applying the coupon campaign after the seasonal campaign, if we apply a "Fixed Amount" coupon before a seasonal campaign like "Special Campaigns," the customer might not get the most value out of the campaign. A campaign like "Fixed Amount" reduces the total cost of the shopping cart, while "Special Campaigns" reduces the total cost by a fixed amount (Y THB) for every threshold (X THB) in the total price. By applying the "Fixed Amount" first, we could reduce the effectiveness of the "Special Campaigns."

For example, if a customer is buying an item that costs **2,800** THB, and we apply a "Fixed Amount" campaign first, reducing the total price by 400 THB, the price would be 2,400 THB. Applying the "Special Campaigns" afterward (which gives 20 THB off for every 100 THB spent) would reduce the price by 480 THB **(2,400 / 100 \* 20)**, leaving a final price of **1,920** THB.

However, if we apply the "Special Campaigns" first and then the "Fixed Amount" coupon, the total price would be reduced by 560 THB **(2,800 / 100 \* 20)**, bringing the price down to 2,240 THB. Applying the "Fixed Amount" afterward would further reduce it by 400 THB, leading to a final price of **1,840** THB, which offers better value for the customer.

## Technologies

- Vite
- React
- TypeScript
- TailwindCSS

## Live

https://playtorium-assignment-virid.vercel.app/
