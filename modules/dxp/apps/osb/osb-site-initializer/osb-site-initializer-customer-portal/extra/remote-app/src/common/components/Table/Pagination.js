import {ClayPaginationBarWithBasicItems} from '@clayui/pagination-bar';

const TablePagination = ({
	activePage,
	itemsPerPage,
	setActivePage,
	totalCount,
}) => {
	const handlePageChange = (page) => {
		setActivePage(page);
	};

	return (
		<>
			{totalCount > itemsPerPage ? (
				<div className="mb-3 mx-3">
					<ClayPaginationBarWithBasicItems
						activeDelta={5}
						activePage={activePage}
						ellipsisBuffer={3}
						onPageChange={handlePageChange}
						showDeltasDropDown={false}
						spritemap={`${Liferay.ThemeDisplay.getPathThemeImages()}/clay/icons.svg`}
						totalItems={totalCount}
					/>
				</div>
			) : (
				<p className="mb-4 mx-4 text-paragraph">{`Showing 1 to ${totalCount} of ${totalCount} entries.`}</p>
			)}
		</>
	);
};

export default TablePagination;
