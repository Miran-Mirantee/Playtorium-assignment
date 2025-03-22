import { useState, useEffect } from "react";
import { products } from "./data/product";
import { Product } from "./types/productType";

type SelectedProduct = Product & { count: number };

function App() {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );

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

        {/* Render list of selected products */}
        <ul className="bg-amber-100 border-2 border-dashed w-1/3 h-1/2 p-4 flex flex-col gap-2 overflow-auto">
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
      </div>
    </>
  );
}

export default App;
