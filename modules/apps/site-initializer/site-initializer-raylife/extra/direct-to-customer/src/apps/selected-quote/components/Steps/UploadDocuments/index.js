/* eslint-disable no-console */
import axios from 'axios';
import {useState} from 'react';

import {LiferayService} from '~/shared/services/liferay';

import UploadFiles from './UploadFiles';

const dropAreaProps = {
	heightContainer: '120px',
	limitFiles: 4,
	widthContainer: '100%',
};

const UploadDocuments = () => {
	const [sections, setSections] = useState([
		{
			files: [],
			required: true,
			subtitle: 'Upload a copy of your business license',
			title: 'Business License',
			type: 'document',
		},
		{
			files: [],
			required: false,
			subtitle: 'Upload a copy of your additional documents.',
			title: 'Additional Documents',
			type: 'document',
		},
		{
			files: [],
			required: true,
			subtitle: 'Upload 4 photos of your building interior',
			title: 'Building Interior Photos',
			type: 'image',
		},
	]);

	const onSetFiles = (_section, files) => {
		setSections((sections) =>
			sections.map((section) => {
				if (section.title === _section.title) {
					return {
						...section,
						files,
					};
				}

				return section;
			})
		);
	};

	const onSetSections = (fileEntry, progress) => {
		setSections((sections) => {
			return sections.map((section) => {
				return {
					...section,
					files: [
						...section.files.map((_fileEntry) => {
							if (fileEntry.id === _fileEntry.id) {
								_fileEntry.progress = progress;

								return _fileEntry;
							}

							return _fileEntry;
						}),
					],
				};
			});
		});
	};

	const sendFileToDocumentsAndMedia = async (folderId, fileEntry) => {
		const formData = new FormData();

		formData.append('file', fileEntry);

		await axios.post(
			`http://localhost:8080/o/headless-delivery/v1.0/document-folders/${folderId}/documents`,
			formData,
			{
				headers: {
					'x-csrf-token': LiferayService.getLiferayAuthenticationToken(),
				},
				onUploadProgress: (event) => {
					const progress = Math.round(
						(event.loaded * 100) / event.total
					);

					onSetSections(fileEntry, progress);

					console.log(`A arquivo está ${progress}% carregada... `);
				},
			}
		);
	};

	const onClickConfirmUpload = async () => {
		const folderId = 54027;

		// const folderId = 53397; // keven

		const fileEntries = sections.map(({files}) => files).flat();

		for (const fileEntry of fileEntries) {
			await sendFileToDocumentsAndMedia(folderId, fileEntry);
		}
	};

	return (
		<div className="upload-container">
			{sections.map((section, index) => (
				<div className="upload-section" key={index}>
					<div className="header">
						<h3 className="title">
							{section.title}
							{section.required ? (
								<span className="required">*</span>
							) : (
								<span className="optional">(optional)</span>
							)}
						</h3>

						<span className="subtitle">{section.subtitle}</span>
					</div>

					<div className="upload-content">
						<UploadFiles
							dropAreaProps={{
								...dropAreaProps,
								type: section.type,
							}}
							files={section.files}
							setFiles={(files) => onSetFiles(section, files)}
							title={section.title}
						/>
					</div>
				</div>
			))}
			<div className="upload-footer">
				<button onClick={onClickConfirmUpload}>CONFIRM UPLOADS</button>
			</div>
		</div>
	);
};

export default UploadDocuments;
