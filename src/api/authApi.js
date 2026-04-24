import axiosInstance from './axiosInstance';

const getMessageFromError = (error, fallbackMessage) => {
	const details = error?.response?.data?.details;
	if (Array.isArray(details) && details.length > 0) {
		return details[0];
	}

	if (typeof details === 'string' && details.trim()) {
		return details;
	}

	const message = error?.response?.data?.message;
	if (typeof message === 'string' && message.trim()) {
		return message;
	}

	return fallbackMessage;
};

const toSessionUser = ({ email, role, tokens }) => ({
	id: email,
	fullName: email,
	email,
	role,
	tokenType: tokens.tokenType || 'Bearer',
	accessToken: tokens.accessToken,
	refreshToken: tokens.refreshToken,
});

export const registerUser = async ({ fullName, email, phoneNumber, password }) => {
	try {
		const response = await axiosInstance.post('/api/v1/auth/register', {
			fullName,
			email,
			phoneNumber,
			password,
		});

		return response.data;
	} catch (error) {
		throw new Error(getMessageFromError(error, 'Unable to register user.'));
	}
};

export const loginAccount = async ({ email, password }) => {
	try {
		const response = await axiosInstance.post('/api/v1/auth/login', {
			email,
			password,
		});

		return toSessionUser({
			email,
			role: response.data.role,
			tokens: response.data,
		});
	} catch (error) {
		throw new Error(getMessageFromError(error, 'Invalid email or password.'));
	}
};

export const createDriverByAdmin = async ({ fullName, email, phoneNumber, password, accessToken }) => {
	try {
		const response = await axiosInstance.post(
			'/api/v1/auth/admin/drivers/create',
			{
				fullName,
				email,
				phoneNumber,
				password,
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		return response.data;
	} catch (error) {
		throw new Error(getMessageFromError(error, 'Unable to create driver account.'));
	}
};

export const logoutAccount = async ({ accessToken }) => {
	try {
		await axiosInstance.post(
			'/api/v1/auth/logout',
			{},
			{
				headers: accessToken
					? {
						Authorization: `Bearer ${accessToken}`,
					}
					: {},
			}
		);
	} catch (error) {
		throw new Error(getMessageFromError(error, 'Unable to logout right now.'));
	}
};
