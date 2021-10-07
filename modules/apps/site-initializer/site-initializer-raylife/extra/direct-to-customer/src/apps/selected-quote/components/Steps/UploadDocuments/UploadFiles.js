/* eslint-disable @liferay/empty-line-between-elements */
import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import React, {useEffect, useRef, useState} from 'react';
import Styles from '~/apps/selected-quote/styles/index.scss';
import {InfoBadge} from '~/shared/components/fragments/Badges/Info';

const UploadDocuments = ({
	heightContainer = '120px',
	limitFiles = 4,
	title = '',
	type = 'image',
	widthContainer = '100%',
}) => {
	const [files, setFiles] = useState([]);
	const [width, setWidth] = useState(widthContainer);
	const [height, setHeight] = useState(heightContainer);
	const [showUpload, setShowUpload] = useState(false);
	const [showBadgeInfo, setShowBadgeInfo] = useState(false);

	const inputRef = useRef();
	const buttonRef = useRef();
	const dropAreaRef = useRef();

	const filesRef = useRef(files);
	const _setFiles = (data) => {
		filesRef.current = data;
		setFiles(data);
	};

	const widthRef = useRef(width);
	const _setWidth = (data) => {
		widthRef.current = data;
		setWidth(data);
	};

	const heightRef = useRef(height);
	const _setHeight = (data) => {
		heightRef.current = data;
		setHeight(data);
	};

	const showUploadRef = useRef(showUpload);
	const _setShowUpload = (data) => {
		showUploadRef.current = data;
		setShowUpload(data);
	};

	const removeFile = (item) => {
		const newList = files.filter((file) => file.id !== item.id);
		_setFiles(newList);
	};

	const chooseIcon = (fileType) => {
		let icon = '';

		switch (fileType) {
			case 'application/pdf':
				icon = 'document-pdf';
				break;
			case 'text/plain':
			case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				icon = 'document-text';
				break;
			case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
				icon = 'document-table';
				break;
			case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
				icon = 'document-presentation';
				break;
			default:
				icon = 'document-unknown';
				// eslint-disable-next-line no-console
				console.log('Tipo de arquivo desconhecido');
		}

		return icon;
	};

	const validateExtensions = (fileType) => {
		const validExtensions =
			type === 'image'
				? ['image/jpeg', 'image/jpg', 'image/png']
				: [
						'application/pdf',
						'text/plain',
						'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
						'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
						'application/vnd.openxmlformats-officedocument.presentationml.presentation',
				  ];

		if (validExtensions.includes(fileType)) {
			return true;
		}

		return false;
	};

	const showFile = (currentFiles) => {
		const countFiles = filesRef.current.length + currentFiles.length;

		if (countFiles <= limitFiles) {
			for (let i = 0; i < currentFiles.length; i++) {
				const fileType = currentFiles[i].type;

				if (validateExtensions(fileType)) {
					const fileReader = new FileReader();
					fileReader.onload = () => {
						let fileURL = '';

						if (type === 'image') {
							fileURL = fileReader.result;
						} else {
							const json = JSON.stringify({
								dataURL: fileReader.result,
							});

							fileURL = JSON.parse(json).dataURL;
						}

						currentFiles[i].icon = chooseIcon(fileType);
						currentFiles[i].id = `${
							currentFiles[i].name
						}-${Math.random()}`;
						currentFiles[i].fileURL = fileURL;

						_setFiles([...filesRef.current, currentFiles[i]]);
					};

					fileReader.readAsDataURL(currentFiles[i]);
				} else {
					alert('Invalid file!');
				}
			}
		} else {
			setShowBadgeInfo(true);
		}
	};

	useEffect(() => {
		const dropArea = dropAreaRef.current,
			button = buttonRef.current,
			input = inputRef.current;

		button.onclick = () => {
			input.click();
		};

		input.addEventListener('change', function () {
			const currentFiles = this.files;
			showFile(currentFiles);
		});

		dropArea.addEventListener('dragover', (event) => {
			event.preventDefault();
		});

		dropArea.addEventListener('drop', (event) => {
			event.preventDefault();
			const currentFiles = event.dataTransfer.files;
			showFile(currentFiles);
		});

		if (type === 'image') {
			_setWidth('176px');
			_setHeight('176px');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const countFiles = files.length;

		if (countFiles >= 1 && countFiles < limitFiles) {
			_setWidth('176px');
			_setHeight('176px');
			_setShowUpload(true);
			setShowBadgeInfo(false);
		} else {
			_setShowUpload(true);
			if (countFiles != 0) {
				setShowBadgeInfo(true);
				_setShowUpload(false);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [files]);

	return (
		<>
			<style>{Styles}</style>
			<div className="upload-file">
				<div className="view-file">
					{files?.length > 0 &&
						files.map((file, index) =>
							type === 'image' ? (
								<div className="view-file-image" key={index}>
									<div
										className="div-image"
										title={file.name}
									>
										<img
											alt={file.name}
											src={file.fileURL}
										/>

										<span>{file.name}</span>
									</div>

									<div
										className="close-icon"
										onClick={() => removeFile(file)}
									>
										<ClayIcon symbol="times" />
									</div>
								</div>
							) : (
								<div className="view-file-document" key={index}>
									<div
										className="div-document"
										title={file.name}
									>
										<div className="content">
											<ClayIcon
												class={file.icon}
												symbol={file.icon}
											/>
										</div>

										<span>{file.name}</span>

										<div
											className="close-icon"
											onClick={() => removeFile(file)}
										>
											<ClayIcon symbol="times" />
										</div>
									</div>
								</div>
							)
						)}
				</div>

				<div
					className={classNames('drop-area', {
						hide: !showUpload,
					})}
					ref={dropAreaRef}
					style={{
						height: `${height}`,
						width: `${width}`,
					}}
				>
					<div className="upload-button">
						Drag &amp; drop files or
						{type !== 'image' && <span>&nbsp;</span>}
						<a className="link-button" ref={buttonRef}>
							<ClayIcon symbol="upload" />
							BROWSE FILES
						</a>
						<input
							className="input-file"
							multiple
							name="input-file"
							ref={inputRef}
							style={{
								height: `${height}`,
								top: `-${height}`,
								width: `${width}`,
							}}
							type="file"
						/>
					</div>
				</div>
			</div>
			{showBadgeInfo && (
				<div className="upload-info">
					<InfoBadge>
						<div className="info-content">
							<div className="info-description">
								4 file upload limit reached for {title}.
							</div>

							<div
								className="closeIcon"
								onClick={() => setShowBadgeInfo(!showBadgeInfo)}
							>
								<ClayIcon symbol="times" />
							</div>
						</div>
					</InfoBadge>
				</div>
			)}
		</>
	);
};

export default UploadDocuments;
