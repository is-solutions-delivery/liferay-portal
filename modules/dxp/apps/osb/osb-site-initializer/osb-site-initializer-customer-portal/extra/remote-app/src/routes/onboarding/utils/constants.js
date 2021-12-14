const steps = {
	dxpCloud: 2,
	invites: 1,
	successDxpCloud: 3,
	welcome: 0,
};

const getInitialDxpAdmin = () => ({
	email: '',
	firstName: '',
	github: '',
	lastName: '',
});

const getInitialInvite = () => ({
	email: '',
	roleId: '',
});

export {steps, getInitialInvite, getInitialDxpAdmin};
