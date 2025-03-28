import { useState, useEffect, useRef } from "react";
import { products } from "./data/product";
import { campaigns as campaignData } from "./data/campaign";
import { SelectedProduct, Product, ProductCategory } from "./types/productType";
import { Campaign, CampaignCategory, CampaignName } from "./types/campaignType";
import applyDiscounts, { calculateBasePrice } from "./modules/discount";

function App() {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [campaigns, setCampaigns] = useState<Campaign[]>(campaignData);
  const [selectedCampaigns, setSelectedCampaigns] = useState<Campaign[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const discountedPrice = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const newCurrentPrice = calculateBasePrice(selectedProducts);
    setCurrentPrice(newCurrentPrice);
  }, [selectedProducts]);

  const onClickAddProduct = (product: Product) => {
    setSelectedProducts((s) => {
      if (!s.some((selectedProduct) => selectedProduct.id == product.id)) {
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

  const onClickAddCampaign = (campaign: Campaign) => {
    setSelectedCampaigns((s) => {
      if (
        !s.some(
          (selectedCampaign) =>
            selectedCampaign.category == campaign.category ||
            selectedCampaign.id == campaign.id
        )
      ) {
        return [...s, campaign];
      }
      return s;
    });
  };

  const onClickRemoveCampaign = (campaignId: number) => {
    setSelectedCampaigns((s) => {
      return [...s].filter(
        (selectedCampaign) => selectedCampaign.id != campaignId
      );
    });
  };

  const onChangeCampaignParam = (
    campaignId: number,
    index: number,
    param: any
  ) => {
    setCampaigns((c) =>
      c.map((campaign) =>
        campaign.id === campaignId
          ? {
              ...campaign,
              params: campaign.params.map((p, i) => (i === index ? param : p)),
            } // New object instead of modifying the old one
          : campaign
      )
    );
  };

  const renderInput = (
    campaignId: number,
    value: number,
    onChange: (value: number) => void
  ) => (
    <input
      className="bg-amber-50 w-16 border disabled:bg-amber-300 disabled:cursor-not-allowed ml-auto"
      type="number"
      disabled={selectedCampaigns.some(
        (selectedCampaign) => selectedCampaign.id == campaignId
      )}
      value={!isNaN(value) ? value : ""}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      onBlur={(e) => {
        if (e.target.value === "") {
          onChange(1);
        }
      }}
    />
  );

  const renderAddCampaignBtn = (
    selectedCampaigns: Campaign[],
    campaign: Campaign
  ) => {
    return !selectedCampaigns.some(
      (selectedCampaign) => selectedCampaign.id == campaign.id
    ) ? (
      <button
        className="py-1 px-3 rounded-md bg-green-300 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={selectedCampaigns.some(
          (selectedCampaign) =>
            selectedCampaign.category == campaign.category &&
            selectedCampaign.id != campaign.id
        )}
        onClick={() => onClickAddCampaign(campaign)}
      >
        Add
      </button>
    ) : (
      <button
        className="py-1 px-3 rounded-md bg-red-300 cursor-pointer"
        onClick={() => onClickRemoveCampaign(campaign.id)}
      >
        Remove
      </button>
    );
  };

  const renderProductList = () => (
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
  );

  const renderSelectedProductList = () => (
    <ul className="bg-amber-100 border-2 border-dashed h-1/3 p-4 flex flex-col gap-2 overflow-auto">
      {selectedProducts.map((selectedProduct) => (
        <li key={selectedProduct.id} className="flex justify-between">
          <p>{selectedProduct.name}</p>
          <p className="ml-auto mr-2">{selectedProduct.price} THB</p>
          <input
            className="bg-amber-50 w-16 border mr-2"
            type="number"
            value={!isNaN(selectedProduct.count) ? selectedProduct.count : ""}
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
        </li>
      ))}
    </ul>
  );

  const renderCampaignList = () => (
    <div className="bg-amber-100 border-2 border-dashed h-1/3 p-4 flex flex-col gap-2 overflow-auto">
      <p className="font-bold">{CampaignCategory.OnTop}</p>
      <ul>
        {campaigns
          .filter((campaign) => campaign.category == CampaignCategory.OnTop)
          .map((campaign) => (
            <li key={campaign.id} className="flex gap-4 mb-2">
              {renderAddCampaignBtn(selectedCampaigns, campaign)}
              <p>{campaign.name}</p>
              {campaign.name === CampaignName.PercentageCategory ? (
                <>
                  <select
                    className="bg-amber-50 border ml-auto disabled:bg-amber-300 disabled:cursor-not-allowed"
                    disabled={selectedCampaigns.some(
                      (selectedCampaign) => selectedCampaign.id == campaign.id
                    )}
                    value={campaign.params[0]}
                    onChange={(e) => {
                      onChangeCampaignParam(campaign.id, 0, e.target.value);
                    }}
                  >
                    {Object.values(ProductCategory).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {renderInput(campaign.id, campaign.params[1], (value) =>
                    onChangeCampaignParam(campaign.id, 1, value)
                  )}
                </>
              ) : (
                <>
                  <p className="ml-auto">
                    Maximum points: {Math.round(currentPrice * 0.2)}
                  </p>
                  {renderInput(campaign.id, campaign.params[0], (value) =>
                    onChangeCampaignParam(campaign.id, 0, value)
                  )}
                </>
              )}
            </li>
          ))}
      </ul>
      <p className="font-bold">{CampaignCategory.Seasonal}</p>
      <ul>
        {campaigns
          .filter((campaign) => campaign.category == CampaignCategory.Seasonal)
          .map((campaign) => (
            <li key={campaign.id} className="flex gap-4 mb-2">
              {renderAddCampaignBtn(selectedCampaigns, campaign)}
              <p>{campaign.name}</p>
              <p className="ml-auto">At every</p>
              {renderInput(campaign.id, campaign.params[0], (value) =>
                onChangeCampaignParam(campaign.id, 0, value)
              )}
              <p>subtract by</p>
              {renderInput(campaign.id, campaign.params[1], (value) =>
                onChangeCampaignParam(campaign.id, 1, value)
              )}
            </li>
          ))}
      </ul>
      <p className="font-bold">{CampaignCategory.Coupon}</p>
      <ul>
        {campaigns
          .filter((campaign) => campaign.category == CampaignCategory.Coupon)
          .map((campaign) => (
            <li key={campaign.id} className="flex gap-4 mb-2">
              {renderAddCampaignBtn(selectedCampaigns, campaign)}
              <p>{campaign.name}</p>
              {renderInput(campaign.id, campaign.params[0], (value) =>
                onChangeCampaignParam(campaign.id, 0, value)
              )}
            </li>
          ))}
      </ul>
    </div>
  );

  const renderCostSummary = () => (
    <div className="bg-amber-100 border-2 border-dashed h-1/3 p-4 flex flex-col gap-2 overflow-auto">
      <ul className="flex flex-col gap-2 overflow-auto">
        {selectedProducts.map((selectedProduct) => (
          <li key={selectedProduct.id} className="flex gap-4">
            <p>{selectedProduct.name}</p>
            <p className="ml-auto">{selectedProduct.price} THB</p>
            <p>Amount: {selectedProduct.count}</p>
            <p>Total: {selectedProduct.count * selectedProduct.price} THB</p>
          </li>
        ))}
      </ul>
      <div className="flex mt-auto">
        <p>Total cost:</p>
        <p className="ml-auto">{currentPrice} THB</p>
      </div>
      <div className="flex">
        <p>Discounted price:</p>
        <p ref={discountedPrice} className="ml-auto"></p>
      </div>
      <button
        className="bg-blue-500 text-white cursor-pointer p-1"
        onClick={() =>
          (discountedPrice.current!.textContent = `${applyDiscounts(
            selectedProducts,
            selectedCampaigns
          ).toString()} THB`)
        }
      >
        Apply campaigns
      </button>
    </div>
  );

  return (
    <>
      <div className="bg-amber-200 w-screen h-screen flex justify-center gap-16 p-8">
        {renderProductList()}

        <span className="flex flex-col gap-4 w-2/5">
          {renderSelectedProductList()}
          {renderCampaignList()}
          {renderCostSummary()}
        </span>
      </div>
    </>
  );
}

export default App;
