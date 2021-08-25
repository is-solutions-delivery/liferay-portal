import React from 'react';
import {calculateCircumference, calculateOffset} from '../../utils';

export const ProgressRing = ({
	className,
	strokeColor = '#4C85FF',
	strokeWidth = 2,
	diameter = 24,
	percent = 0,
}) => {
	const radius = diameter / 2;
	const normalizedRadius = radius - strokeWidth * 2;
	const center = (radius - strokeWidth) / 2;

	return (
		<svg className={className} width={diameter} height={diameter}>
			<circle
				className="progress"
				fill="transparent"
				stroke={strokeColor}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				r={normalizedRadius}
				cx={center}
				cy={center}
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
