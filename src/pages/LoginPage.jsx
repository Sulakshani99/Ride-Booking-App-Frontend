import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const roleToPath = {
	ADMIN: '/admin-dashboard',
	USER: '/user-dashboard',
	DRIVER: '/driver-dashboard',
};

const LoginPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { isAuthenticated, isLoading, login } = useAuth();
	const [formData, setFormData] = useState({ email: '', password: '' });
	const [error, setError] = useState('');
	const [successMessage, setSuccessMessage] = useState(
		location.state?.registered ? 'Registration successful. Please login.' : ''
	);

	if (isAuthenticated) {
		return <Navigate to="/" replace />;    //replace means, don’t keep login page in history
	}

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();                 //Stops page reload
		setError('');
		setSuccessMessage('');

		if (!formData.email.trim() || !formData.password.trim()) {
			setError('Please enter both email and password.');
			return;
		}

		try {
			const user = await login(formData);
			navigate(roleToPath[user.role] || '/login', { replace: true });
		} catch (apiError) {
			setError(apiError.message);
		}
	};

	return (
		<div className="auth-shell">
			<div className="auth-card">
				<div className="brand-pill">Ride Booking</div>
				<h1 className="auth-title">Sign in</h1>
			
				<form onSubmit={handleSubmit} className="auth-form">
					<label htmlFor="email">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						value={formData.email}
						onChange={handleChange}
						autoComplete="email"
						placeholder="Enter email"
					/>

					<label htmlFor="password">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						value={formData.password}
						onChange={handleChange}
						autoComplete="current-password"
						placeholder="Enter password"
					/>

					{successMessage && <p className="auth-success">{successMessage}</p>}
					{error && <p className="auth-error">{error}</p>}

					<button type="submit" className="cta-btn" disabled={isLoading}>
						{isLoading ? 'Signing in...' : 'Sign in'}
					</button>
				</form>

				<p className="auth-footnote">
					New user? <Link to="/register">Create an account</Link>
				</p>
				
			</div>
		</div>
	);
};

export default LoginPage;
