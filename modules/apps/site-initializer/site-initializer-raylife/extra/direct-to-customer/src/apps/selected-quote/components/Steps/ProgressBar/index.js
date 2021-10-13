const ProgressBar = ({height, progress, width}) => {
	return (
		<div
			style={{
				background: '#E2E2E4',
				borderRadius: '2px',
				height: `${height}px`,
				width: `${width}px`,
			}}
		>
			<div
				style={{
					background: '#4C85FF',
					borderRadius: '2px',
					height: '4px',
					width: `${progress}%`,
				}}
			></div>
		</div>
	);
};

export default ProgressBar;
