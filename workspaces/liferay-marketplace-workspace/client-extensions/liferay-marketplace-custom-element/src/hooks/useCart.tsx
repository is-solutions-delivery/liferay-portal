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
				{ productId: productId, skuId: skuId, quantity: 1 },
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
