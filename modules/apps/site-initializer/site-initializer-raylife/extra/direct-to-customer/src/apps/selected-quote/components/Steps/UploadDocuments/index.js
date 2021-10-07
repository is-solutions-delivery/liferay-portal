import UploadFiles from './UploadFiles';

const sections = [
	{
		required: true,
		subtitle: 'Upload a copy of your business license',
		title: 'Business License',
		type: 'document',
	},
	{
		required: false,
		subtitle: 'Upload a copy of your additional documents.',
		title: 'Additional Documents',
		type: 'document',
	},
	{
		required: true,
		subtitle: 'Upload 4 photos of your building interior',
		title: 'Building Interior Photos',
		type: 'image',
	},
];

const UploadDocuments = () => {
	return (
		<div className="upload-container">
			{sections?.map((section, index) => (
				<div className="upload-section" key={index}>
					<div className="header">
						<div className="title">
							{section.title}
							{section.required ? (
								<span className="required">*</span>
							) : (
								<span className="optional">(optional)</span>
							)}
						</div>

						<div className="subtitle">{section.subtitle}</div>
					</div>

					<div className="upload-content">
						<UploadFiles
							title={section.title}
							type={section.type}
						/>
					</div>
				</div>
			))}
			<div className="upload-footer">
				<a
					onClick={() => {
						// eslint-disable-next-line no-console
						console.log('Upload button');
					}}
				>
					CONFIRM UPLOADS
				</a>
			</div>
		</div>
	);
};

export default UploadDocuments;
