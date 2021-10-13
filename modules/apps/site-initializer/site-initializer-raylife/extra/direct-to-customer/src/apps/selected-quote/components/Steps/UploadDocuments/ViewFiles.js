import ClayIcon from '@clayui/icon';
import ProgressBar from '../ProgressBar';
import ViewDocuments from './ViewDocuments';

const ViewBody = ({
	file,
	onRemoveFile,
	showCloseButton = true,
	showName = true,
}) => (
	<>
		{showName && <span className="ellipsis">{file.name}</span>}

		{showCloseButton && (
			<div className="close-icon" onClick={() => onRemoveFile(file)}>
				<ClayIcon symbol="times" />
			</div>
		)}
	</>
);

const ViewFiles = ({files = [], onRemoveFile, type}) => {
	// eslint-disable-next-line no-console
	console.log('Files01', files);

	return (
		<>
			<div className="view-file">
				{files.map((file, index) => {
					if (file.progress < 100) {
						return (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<div
									style={{
										alignItems: 'center',
										background: '#F0F5FF',
										borderRadius: '16px',
										display: 'flex',
										flexDirection: 'column',
										flexShrink: 0,
										height: '176px',
										justifyContent: 'center',
										marginRight: '20px',
										width: '176px',
									}}
								>
									<p>Uploading...</p>

									<ProgressBar
										height="4"
										progress={file.progress}
										width="144"
									/>
								</div>

								<ViewBody
									file={file}
									onRemoveFile={onRemoveFile}
									showCloseButton={false}
								/>
							</div>
						);
					} else if (type === 'image') {
						<ViewDocuments
							file={file}
							onRemoveFile={onRemoveFile}
							type={type}
						/>;
					}

					return (
						<ViewDocuments
							file={file}
							key={index}
							onRemoveFile={onRemoveFile}
							type={type}
						/>
					);
				})}
			</div>
		</>
	);
};

export default ViewFiles;
