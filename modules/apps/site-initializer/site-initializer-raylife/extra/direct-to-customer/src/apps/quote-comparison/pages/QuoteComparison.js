import React, {useEffect, useState} from 'react';

import ProductComparison from '~/shared/components/product-comparison';
import {LiferayService} from '~/shared/services/liferay';

const QuoteComparison = () => {
	const [quotes, setQuotes] = useState([]);

	useEffect(() => {
		LiferayService.LiferayAPI.get('/o/c/quotecomparisons')
			.then((response) => setQuotes(response.data.items))
			.catch((error) => console.error(error.message));
	}, []);

	const onClickPurchase = () => {};

	const onClickPolicyDetails = () => {};

	return (
		<>
			<div className="quote-comparison">
				{quotes.map((quote, index) => (
					<ProductComparison
						key={index}
						onClickPolicyDetails={onClickPolicyDetails}
						onClickPurchase={onClickPurchase}
						product={quote}
					/>
				))}
			</div>
		</>
	);
};

export default QuoteComparison;
