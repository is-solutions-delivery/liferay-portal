import { useState } from 'react';
import Button from '@clayui/button';
import Icon from '@clayui/icon';
import ClayCard from '@clayui/card';

export type ActivationKeyAlertProps = {
    className?: string;
    message?: string;
    onClose?: () => void;
    title?: string;
};

export default function ActivationKeyAlert({
    className,
    message =
    'Thanks for choosing Liferay DXP! Download your activation key below and, if needed, the software bundle to get started.',
    onClose,
    title = 'Your Free Activation Key Has Been Generated!',
}: ActivationKeyAlertProps) {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    const handleClose = () => {
        setVisible(false);
        onClose?.();
    };

    return (
        <ClayCard
            className={`license-alert-card d-flex align-items-start ${className ?? ''}`}
        >
            <div >
                <Icon className="license-alert-icon" symbol="check-circle" />
            </div>

            <div className="flex-grow-1">
                <p className="license-alert-title">{title}</p>
                <p className="license-alert-subtitle">{message}</p>
            </div>

            <Button
                aria-label="Close"
                className="close"
                displayType="unstyled"
                onClick={handleClose}
            >
                <Icon className="close-license-alert-icon" symbol="times" />
            </Button>
        </ClayCard>
    );
}
