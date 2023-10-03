/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { useEffect, useState } from "react";

import { createCart, deleteCart, getCart, updateCart } from "../utils/api";

type cartItem = {
	productId: number;
	quantity: number;
	skuId: number;
};

const useCart = ({
	accountId,
	channelId,
	orderType,
}: {
	accountId: number;
	channelId?: number;
	orderType?: OrderType;
}) => {
	const [cart, setCart] = useState<Cart>();

	const [cartItems, setCartItems] = useState<cartItem[]>([]);

	useEffect(() => {
		(async () => {
			if (cart?.id) {
				const response = await updateCartItems(cart?.id, {
					cartItems: cartItems,
				});

				setCart(response);
			}
		})();
	}, [cartItems]);

	const addCartItem = async (productId: number, skuId: number) => {
		let cartId = 0;

		if (!cart?.id) {
			const response = await addCart({
				accountId,
				channelId: Number(channelId),
				orderTypeExternalReferenceCode:
					orderType?.externalReferenceCode as string,
				orderTypeId: Number(orderType?.id),
			});

			cartId = response.id;

			setCart(response);
		}

		const existingItem = cartItems.find((item) => item?.skuId === skuId);

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
				{ productId, quantity: 1, skuId },
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

	const addCart = async ({
		accountId,
		channelId,
		orderTypeExternalReferenceCode,
		orderTypeId,
	}: {
		accountId: number;
		channelId: number;
		orderTypeExternalReferenceCode: string;
		orderTypeId: number;
	}) => {
		const cartData = await createCart({
			channelId,
			accountId,
			orderTypeExternalReferenceCode,
			orderTypeId,
		});

		setCart(cartData);

		return cartData;
	};

	const updateCartItems = async (cartId: number, data: any) => {
		const response = await updateCart(cartId, data);

		return response;
	};

	const removeCart = (cartId: number) => {
		deleteCart(cartId);
		setCart(undefined);
		setCartItems([]);
	};

	return {
		addCart,
		addCartItem,
		cart,
		cartItems,
		removeCart,
		removeFromCart,
		setCart,
		updateCart,
		updateCartItems,
	};
};

export default useCart;
