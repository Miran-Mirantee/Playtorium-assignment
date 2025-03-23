import { useState, useEffect } from "react";
import { products } from "./data/product";
import { SelectedProduct, Product, ProductCategory } from "./types/productType";
import { Campaign, CampaignCategory, CampaignName } from "./types/campaignType";
import applyDiscounts from "./modules/discount";

function App() {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );

  useEffect(() => {
    // mock
    applyDiscounts(
      [
        {
          id: 6,
          name: "Sunglasses",
          category: ProductCategory.Accessories,
          price: 1500,
          count: 1,
        },
        {
          id: 9,
          name: "Smartphone",
          category: ProductCategory.Electronics,
          price: 25000,
          count: 4,
        },
        {
          id: 12,
          name: "Bluetooth Speaker",
          category: ProductCategory.Electronics,
          price: 3200,
          count: 1,
        },
      ],
      [
        {
          id: 1,
          name: CampaignName.Fixed,
          category: CampaignCategory.Coupon,
          params: [10, 10],
        },
        {
          id: 2,
          name: CampaignName.Percentage,
          category: CampaignCategory.Coupon,
          params: [10, 10],
        },
        {
          id: 3,
          name: CampaignName.PercentageCategory,
          category: CampaignCategory.OnTop,
          params: [10, 10],
        },
        {
          id: 4,
          name: CampaignName.Point,
          category: CampaignCategory.OnTop,
          params: [10, 10],
        },
        {
          id: 5,
          name: CampaignName.Special,
          category: CampaignCategory.Seasonal,
          params: [10, 10],
        },
      ]
    );
  }, []);

  useEffect(() => {
    console.log(selectedProducts);
  }, [selectedProducts]);

  const onClickAddProduct = (product: Product) => {
    setSelectedProducts((s) => {
      if (!s.some((selectedProduct) => selectedProduct.name == product.name)) {
        return [...s, { ...product, count: 1 }];
      }
      return s;
    });
  };

  const onClickRemoveProduct = (productId: number) => {
    setSelectedProducts((s) => {
      return [...s].filter(
        (selectedProduct) => selectedProduct.id != productId
      );
    });
  };

  const onChangeProductCount = (productId: number, count: number) => {
    if (count <= 0) return;
    setSelectedProducts((s) =>
      s.map((selectedProduct) =>
        selectedProduct.id === productId
          ? { ...selectedProduct, count } // New object instead of modifying the old one
          : selectedProduct
      )
    );
  };

  return (
    <>
      <div className="bg-amber-200 w-screen h-screen flex justify-center gap-16 p-8">
        {/* Render list of all products */}
        <div className="bg-amber-100 border-2 border-dashed grid grid-cols-3 gap-4 p-4 overflow-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-3 border rounded-md bg-amber-50 flex items-center space-x-2"
            >
              <button
                className="py-1 px-3 rounded-md bg-green-300 cursor-pointer"
                onClick={() => onClickAddProduct(product)}
              >
                Add
              </button>
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-sm text-gray-700">{product.price} THB</p>
              </div>
            </div>
          ))}
        </div>

        <span className="flex flex-col gap-4 w-1/3">
          {/* Render list of selected products */}
          <ul className="bg-amber-100 border-2 border-dashed h-1/3 p-4 flex flex-col gap-2 overflow-auto">
            {selectedProducts.map((selectedProduct) => (
              <li key={selectedProduct.id} className="flex justify-between">
                <span>{selectedProduct.name}</span>
                <span>
                  <input
                    className="bg-amber-50 w-16 border mr-2"
                    type="number"
                    value={
                      !isNaN(selectedProduct.count) ? selectedProduct.count : ""
                    }
                    onChange={(e) => {
                      onChangeProductCount(
                        selectedProduct.id,
                        parseInt(e.target.value, 10)
                      );
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        onChangeProductCount(selectedProduct.id, 1);
                      }
                    }}
                  />
                  <button
                    className="py-1 px-3 rounded-md bg-red-300 cursor-pointer"
                    onClick={() => onClickRemoveProduct(selectedProduct.id)}
                  >
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>

          {/* Render list of all campaigns */}
          <ul className="bg-amber-100 border-2 border-dashed h-1/3 p-4 flex flex-col gap-2 overflow-auto"></ul>

          {/* Render discount calculation */}
          <ul className="bg-amber-100 border-2 border-dashed h-1/3 p-4 flex flex-col gap-2 overflow-auto"></ul>
        </span>
      </div>
    </>
  );
}

export default App;
