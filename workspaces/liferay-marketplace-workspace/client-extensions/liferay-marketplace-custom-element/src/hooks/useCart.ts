/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { useState } from "react";

import { createCart, getCart, updateCart } from "../utils/api";

type cartItem = {
	productId: number;
	quantity: number;
	skuId: number;
};

const useCart = () => {
	const [cart, setCart] = useState({});

	const [cartItems, setCartItems] = useState<cartItem[]>([]);

	const addCartItem = (productId: number, quantity: number, skuId: number) => {
		const existingItem = cartItems.find((item) => item.skuId === skuId);

		if (existingItem) {
			setCartItems((prevCart) =>
				prevCart.map((item) =>
					item.skuId === skuId
						? { ...item, quantity: item.quantity + 1 }
						: item,
				),
			);
		} else {
			setCartItems((prevCart) => [
				...prevCart,
				{ productId, quantity: 1, skuId, },
			]);
		}
	};

	const removeFromCart = (skuId: number) => {
		setCartItems((prevCart) =>
			prevCart
				.map((item) =>
					item.skuId === skuId
						? { ...item, quantity: item.quantity - 1 }
						: item,
				)
				.filter((item) => item.quantity > 0),
		);
	};

	const addCart = async (
		accountId: number,
		channelId: any,
		currencyCode: string,
	) => {
		const cartData = await createCart(channelId, accountId, currencyCode);

		return cartData;
	};

	const getCartData = async (cartId: number) => {
		const cartdata = await getCart(cartId);

		return cartdata;
	};

	const updateCartItems = async (cartId: number, data: any) => {
		const response = await updateCart(cartId, data);

		return response;
	};

	const deleteCart = (cartId: number) => {
		return cartId;
	};

	return {
		addCart,
		addCartItem,
		cart,
		cartItems,
		deleteCart,
		getCartData,
		removeFromCart,
		setCart,
		updateCart,
		updateCartItems,
	};
};

export default useCart;
