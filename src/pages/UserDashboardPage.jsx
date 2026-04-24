import React from 'react';
import useAuth from '../hooks/useAuth';

const UserDashboardPage = () => {
	const { currentUser, logout } = useAuth();

	return (
		<div className="dashboard-shell">
			<section className="dashboard-card">
				<div className="dashboard-header">
					<div>
						<h1>Welcome, {currentUser?.fullName || currentUser?.email}</h1>
					</div>
					<button type="button" className="ghost-btn" onClick={logout}>
						Logout
					</button>
				</div>
			</section>
		</div>
	);
};

export default UserDashboardPage;
