import { useEffect, useState } from "react";
import { getChannels } from "../../../utils/api";

const useGetOpenCartInfo = () => {
	const [cart, setCart] = useState<any>();

	useEffect(() => {
		const getChannelInfo = async () => {
			const channels = await getChannels();
			const channel =
				channels.find((channel) => channel.name === "Marketplace Channel") ||
				channels[0];

			setCart(channel);
		};

		getChannelInfo();
	}, []);

	return cart;
};

export default useGetOpenCartInfo;
