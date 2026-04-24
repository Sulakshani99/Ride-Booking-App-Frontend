import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
	createDriverByAdmin,
	loginAccount,
	logoutAccount,
	registerUser,
} from '../api/authApi';

const AUTH_STORAGE_KEY = 'ride-booking-auth-user';

export const AuthContext = createContext(null);

const readStoredUser = () => {
	try {
		const stored = localStorage.getItem(AUTH_STORAGE_KEY);
		if (!stored) {
			return null;
		}

		return JSON.parse(stored);
	} catch {
		return null;
	}
};

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(() => readStoredUser());
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (currentUser) {
			localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
			return;
		}

		localStorage.removeItem(AUTH_STORAGE_KEY);
	}, [currentUser]);

	const login = useCallback(async (credentials) => {
		setIsLoading(true);
		try {
			const user = await loginAccount(credentials);
			setCurrentUser(user);
			return user;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const registerAccount = useCallback(async (payload) => {
		setIsLoading(true);
		try {
			return await registerUser(payload);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const createDriverAccount = useCallback(
		async (payload) => {
			if (!currentUser?.accessToken) {
				throw new Error('You need to be logged in as admin to create driver accounts.');
			}

			setIsLoading(true);
			try {
				return await createDriverByAdmin({
					...payload,
					accessToken: currentUser.accessToken,
				});
			} finally {
				setIsLoading(false);
			}
		},
		[currentUser]
	);

	const logout = useCallback(async () => {
		setIsLoading(true);
		try {
			if (currentUser?.accessToken) {
				await logoutAccount({ accessToken: currentUser.accessToken });
			}
		} catch {
			// Local cleanup should still happen even if API logout fails.
		} finally {
			setCurrentUser(null);
			setIsLoading(false);
		}
	}, [currentUser]);

	const value = useMemo(
		() => ({
			currentUser,
			isAuthenticated: Boolean(currentUser?.accessToken),
			isLoading,
			login,
			logout,
			registerAccount,
			createDriverAccount,
		}),
		[currentUser, isLoading, login, logout, registerAccount, createDriverAccount]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
