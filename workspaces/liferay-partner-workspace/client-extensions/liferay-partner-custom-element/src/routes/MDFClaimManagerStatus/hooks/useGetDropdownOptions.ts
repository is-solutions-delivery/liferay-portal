import useGetPermissions from './useGetPermissions';

export enum ClaimStatus {
	PendingMarketingReview = 'pendingMarketingReview',
	Approved = 'approved',
	MoreInfoRequested = 'moreInfoRequested',
	Rejected = 'rejected',
	InDirectorReview = 'inDirectorReview',
	Canceled = 'canceled',
	InFinanceReview = 'inFinanceReview',
}

interface IProps {
	mdfClaimStatusKey: ClaimStatus;
	openModal: () => void;
}

type DropdownOption = {
	label: string;
	onClick: (param?: any) => void;
	permissionCheck?: boolean;
};

type OptionsMap = {
	[key in ClaimStatus]: DropdownOption[];
};

const useGetDropdownOptions = ({mdfClaimStatusKey, openModal}: IProps) => {
	const {
		hasMarketingReviewAction,
		hasApproveAction,
		hasFinanceReviewAction,
		hasRequestMoreInfoAction,
		hasRejectAction,
		hasDirectorReviewAction,
		hasClaimPaidAction,
	} = useGetPermissions();

	const dropdownOptionsMap: OptionsMap = {
		[ClaimStatus.PendingMarketingReview]: [
			{
				label: 'Request More Info',
				onClick: () => openModal(),
				permissionCheck: hasRequestMoreInfoAction,
			},
			{
				label: 'Rejected',
				onClick: () => openModal(),
				permissionCheck: hasRejectAction,
			},
			{
				label: 'In Finance Review',
				onClick: () => openModal(),
				permissionCheck: hasFinanceReviewAction,
			},
		],
		[ClaimStatus.Approved]: [
			{
				label: 'In Finance Review',
				onClick: () => openModal(),
				permissionCheck: hasFinanceReviewAction,
			},
		],
		[ClaimStatus.MoreInfoRequested]: [
			{
				label: 'Pending Marketing Review',
				onClick: () => openModal(),
				permissionCheck: hasMarketingReviewAction,
			},
			{
				label: 'In Finance Review',
				onClick: () => openModal(),
				permissionCheck: hasFinanceReviewAction,
			},
			{
				label: 'Rejected',
				onClick: () => openModal(),
				permissionCheck: hasRejectAction,
			},
		],
		[ClaimStatus.Rejected]: [
			{
				label: 'Pending Marketing Review',
				onClick: () => openModal(),
				permissionCheck: hasMarketingReviewAction,
			},
		],
		[ClaimStatus.InDirectorReview]: [
			{
				label: 'In Finance Review',
				onClick: () => openModal(),
				permissionCheck: hasFinanceReviewAction,
			},
			{
				label: 'Rejected',
				onClick: () => openModal(),
				permissionCheck: hasRejectAction,
			},
			{
				label: 'Request More Info',
				onClick: () => openModal(),
				permissionCheck: hasRequestMoreInfoAction,
			},
		],
		[ClaimStatus.InFinanceReview]: [
			{
				label: 'Claim Paid',
				onClick: () => openModal(),
				permissionCheck: hasClaimPaidAction,
			},
			{
				label: 'Request More Info',
				onClick: () => openModal(),
				permissionCheck: hasRequestMoreInfoAction,
			},
			{
				label: 'Rejected',
				onClick: () => openModal(),
				permissionCheck: hasRejectAction,
			},
			{
				label: 'In Director Review',
				onClick: () => openModal(),
				permissionCheck: hasDirectorReviewAction,
			},
		],
		[ClaimStatus.Canceled]: [
			{
				label: 'Approved',
				onClick: () => openModal(),
				permissionCheck: hasApproveAction,
			},
		],
	};

	const options = dropdownOptionsMap[mdfClaimStatusKey] || [];
	const filteredOptions = options.filter((option) => option.permissionCheck);

	const dropdownOptions: DropdownOption[] = filteredOptions.map((option) => ({
		label: option.label,
		onClick: option.onClick,
	}));

	return {dropdownOptions, hasOptions: !!dropdownOptions.length};
};

export default useGetDropdownOptions;
