import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import {useEffect} from 'react';

const Modal = ({children, footer, handleClose, modalSize = 'medium', show}) => {
	const onCloseButton = () => {
		if (typeof handleClose === 'function') {
			handleClose();
		}
	};

	useEffect(() => {
		const listener = (event) => {
			if (event.path[0].id === 'modal-backdrop') {
				onCloseButton();
			}
		};

		document.addEventListener('mousedown', listener);
		document.addEventListener('touchstart', listener);

		return () => {
			document.removeEventListener('mousedown', listener);
			document.removeEventListener('touchstart', listener);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [show]);

	return (
		<div
			className={classNames('backdrop', {
				show,
			})}
			id="modal-backdrop"
		>
			<div className={`modal-content modal-${modalSize}`}>
				<div className="modal-header">
					<div className="close" onClick={onCloseButton}>
						<ClayIcon symbol="times-small" />
					</div>
				</div>

				{children}
				{footer}
			</div>
		</div>
	);
};

export default Modal;
