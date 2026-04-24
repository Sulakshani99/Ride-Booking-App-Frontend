import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AdminDashboardPage = () => {
	const { currentUser, isAuthenticated, isLoading, createDriverAccount, logout } = useAuth();
	const [driverForm, setDriverForm] = useState({
		fullName: '',
		email: '',
		phoneNumber: '',
		password: '',
	});
	const [statusMessage, setStatusMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	const handleDriverChange = (event) => {
		const { name, value } = event.target;
		setDriverForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleCreateDriver = async (event) => {
		event.preventDefault();
		setErrorMessage('');
		setStatusMessage('');

		if (!/^\d{10}$/.test(driverForm.phoneNumber)) {
			setErrorMessage('Phone number must contain exactly 10 digits.');
			return;
		}

		try {
			const result = await createDriverAccount(driverForm);
			setStatusMessage(`Driver created: ${result.email}`);
			setDriverForm({
				fullName: '',
				email: '',
				phoneNumber: '',
				password: '',
			});
		} catch (apiError) {
			setErrorMessage(apiError.message);
		}
	};

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

				{currentUser?.role === 'ADMIN' && (
					<section className="admin-panel">
						<h2>Create Driver Account (Admin)</h2>
						<form onSubmit={handleCreateDriver} className="auth-form">
							<label htmlFor="fullName">Driver Full Name</label>
							<input id="fullName" name="fullName" type="text" value={driverForm.fullName} onChange={handleDriverChange} required />

							<label htmlFor="email">Driver Email</label>
							<input id="email" name="email" type="email" value={driverForm.email} onChange={handleDriverChange} required />

							<label htmlFor="phoneNumber">Driver Phone Number</label>
							<input id="phoneNumber" name="phoneNumber" type="text" value={driverForm.phoneNumber} onChange={handleDriverChange} required />

							<label htmlFor="password">Temporary Password</label>
							<input id="password" name="password" type="password" value={driverForm.password} onChange={handleDriverChange} required />

							{statusMessage && <p className="auth-success">{statusMessage}</p>}
							{errorMessage && <p className="auth-error">{errorMessage}</p>}

							<button type="submit" className="cta-btn" disabled={isLoading}>
								{isLoading ? 'Creating driver...' : 'Create Driver'}
							</button>
						</form>
					</section>
				)}
			</section>
		</div>
	);
};

export default AdminDashboardPage;
