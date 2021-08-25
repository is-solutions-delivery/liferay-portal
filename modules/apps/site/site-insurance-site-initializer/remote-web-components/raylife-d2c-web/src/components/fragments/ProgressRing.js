import React from 'react';
import {calculateCircumference, calculateOffset} from '../../utils';

export const ProgressRing = ({
	className,
	diameter = 24,
	percent = 0,
	strokeColor = '#4C85FF',
	strokeWidth = 2,
}) => {
	const radius = diameter / 2;
	const normalizedRadius = radius - strokeWidth * 2;
	const center = (radius - strokeWidth) / 2;

	return (
		<svg className={className} width={diameter} height={diameter}>
			<circle
				className="progress"
				cx={center}
				cy={center}
				fill="transparent"
				r={normalizedRadius}
				stroke={strokeColor}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				style={{
					strokeDasharray: `${calculateCircumference(
						normalizedRadius
					)} ${calculateCircumference(normalizedRadius)}`,
					strokeDashoffset: calculateOffset(
						percent,
						calculateCircumference(normalizedRadius)
					),
				}}
			/>
		</svg>
	);
};
