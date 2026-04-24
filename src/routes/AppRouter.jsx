import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import DriverDashboardPage from '../pages/DriverDashboardPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import UserDashboardPage from '../pages/UserDashboardPage';
import useAuth from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';

const roleToPath = {
	ADMIN: '/admin-dashboard',
	USER: '/user-dashboard',
	DRIVER: '/driver-dashboard',
};

const RoleLanding = () => {
	const { isAuthenticated, currentUser } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <Navigate to={roleToPath[currentUser?.role] || '/login'} replace />;
};

const AppRouter = () => {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
			<Route path="/" element={<RoleLanding />} />
			<Route
				path="/admin-dashboard"
				element={
					<ProtectedRoute allowedRoles={['ADMIN']}>
						<AdminDashboardPage />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/user-dashboard"
				element={
					<ProtectedRoute allowedRoles={['USER']}>
						<UserDashboardPage />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/driver-dashboard"
				element={
					<ProtectedRoute allowedRoles={['DRIVER']}>
						<DriverDashboardPage />
					</ProtectedRoute>
				}
			/>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
};

export default AppRouter;
