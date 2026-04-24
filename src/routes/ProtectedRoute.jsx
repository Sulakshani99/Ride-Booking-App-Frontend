import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const roleToPath = {
	ADMIN: '/admin-dashboard',
	USER: '/user-dashboard',
	DRIVER: '/driver-dashboard',
};

const ProtectedRoute = ({ children, allowedRoles }) => {
	const { isAuthenticated, currentUser } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
		return <Navigate to={roleToPath[currentUser?.role] || '/login'} replace />;
	}

	return children;
};

export default ProtectedRoute;
