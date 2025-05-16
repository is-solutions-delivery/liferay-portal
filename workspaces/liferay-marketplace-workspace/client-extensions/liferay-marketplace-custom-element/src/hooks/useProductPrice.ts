import {useEffect, useState} from 'react';
import { getProductBasePriceAndTrial } from '../pages/GetApp/GetAppOutlet';

export function useProductPrice(product: DeliveryProduct | null) {
	const [productPrice, setProductPrice] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		let isMounted = true;

		const fetchPrice = async () => {
			if (!product) return;

			try {
				const result = await getProductBasePriceAndTrial(product, false);

				if (isMounted) {
					setProductPrice(result);
				}
			} catch (err) {
				if (isMounted) {
					setError(err as Error);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		fetchPrice();

		return () => {
			isMounted = false;
		};
	}, [product]);

	return {productPrice, loading, error};
}

