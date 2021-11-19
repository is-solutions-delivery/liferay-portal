import ClayIcon from '@clayui/icon';

import Modal from '~/common/components/modal';

const ProgressSaved = ({handleClose, show}) => {
	return (
		<Modal
			footer={
				<div className="progress-saved-footer">
					<button className="btn btn-flat" onClick={handleClose}>
						Continue Quote
					</button>

					<button className="btn btn-primary">
						Send Link &amp; Exit
					</button>
				</div>
			}
			handleClose={handleClose}
			show={show}
		>
			<div className="progress-saved-content">
				<div className="progress-saved-body">
					<div className="progress-saved-icon">
						<ClayIcon symbol="check" />
					</div>

					<div className="progress-saved-subtitle">
						Your progress is saved
					</div>

					<div className="progress-saved-description">
						We will send a link to
						{` `}
						<b>craftedjewels@gmail.com</b>. Use the link to pick up
						where you left off at any time.
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ProgressSaved;
