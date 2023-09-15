/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayBadge from "@clayui/badge";
import { useEffect, useState } from "react";
import { getProductById } from "../../utils/api";
import { object } from "zod";

export default function GetAppPage() {
  const [showAccount, setShowAccount] = useState(false);
  const [product, setProduct] = useState<Product[]>([]);

  useEffect(() => {
    getProdut();
  }, []);

  const getProdut = async () => {
    getProductById({ productId: 48712, nestedFields: "skus" }).then(
      (item: Product) => setProduct([item])
    );
  };

  const currentValue = product[0];

  console.log("PRODUCT", currentValue);

  let skuValues: SKU;
  if (currentValue) {
    Object.values(currentValue?.skus).map((item: SKU) => {
      skuValues = item;
    });
  }
  let setHeight;

  if (showAccount) {
    setHeight = 176;
  } else {
    setHeight = 112;
  }

  return (
    <div
      className="d-flex flex-column rounded justify-content-between"
      style={{ width: 600, height: setHeight, backgroundColor: "#F7F7F8" }}
    >
      {currentValue && skuValues && (
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex justify-content-start align-items-start align-self-start col-8">
            <div className="ml-5 mt-4 d-flex justify-content-center align-items-center align-self-center">
              <img
                src={currentValue.thumbnail}
                style={{ width: 64, height: 64 }}
              />
            </div>
            <div
              style={{ height: 64 }}
              className="d-flex align-self-start ml-5 mt-4 flex-column"
            >
              <span className="text-7 ttext-weight-semi-bold">
                {Object.values(currentValue.name)}
              </span>
              <span className="text-2">
                {" "}
                {Object.values(currentValue.description)}{" "}
              </span>
            </div>
          </div>

          <div className="d-flex mt-3 mr-4 flex-column col-4">
            <span className="d-flex align-self-end text-4">Price</span>
            <span className="d-flex align-self-end text-5 text-weight-bolder">
              $ {skuValues?.price}
            </span>
            <div className="text-center d-flex align-self-end text-5">
              <ClayBadge displayType="secondary" label="TEST" />
            </div>
          </div>
        </div>
      )}

      {showAccount && (
        <div className="d-flex flex-column ">
          <div className="d-flex align-self-center align-content-center align-items-center">
            <div className="card-divider" style={{ width: 550 }}></div>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <div className="d-flex col-6 ml-3">
              <p className="text-3">Account Selected</p>
            </div>

            <div className=" col-6  d-flex flex-row justify-content-between">
              <div className="col-10 d-flex flex-column mb-2">
                <span className="d-flex align-self-end text-3 mr-2"></span>
                <span className="d-flex align-self-end text-2"></span>
              </div>

              <div className="col-2 d-flex justify-content-end align-items-center">
                <span className="sticker sticker-sm sticker-user-icon">
                  <span className="sticker-overlay">
                    <img
                      className="sticker-img"
                      src="/images/thumbnail_dock.jpg"
                    />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
