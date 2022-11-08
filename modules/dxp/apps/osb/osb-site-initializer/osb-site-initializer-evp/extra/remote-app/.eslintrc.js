module.exports = {
	env: {
		jest: true,
		node: true,
	},
	rules: {
		'@liferay/group-imports': 'off',
		'@liferay/portal/no-loader-import-specifier': 'off',
		'@liferay/portal/no-react-dom-render': 'off',
		'no-case-declarations': 'off',
		'no-empty': ['error', {allowEmptyCatch: true}],
		'no-prototype-builtins': 'off',
	},
};
