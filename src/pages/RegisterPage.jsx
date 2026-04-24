import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RegisterPage = () => {
	const navigate = useNavigate();
	const { isAuthenticated, isLoading, registerAccount } = useAuth();
	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		phoneNumber: '',
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = useState('');

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError('');

		if (!formData.fullName.trim() || !formData.email.trim() || !formData.phoneNumber.trim() || !formData.password.trim()) {
			setError('Full name, email, phone number, and password are required.');
			return;
		}

		if (!/^\d{10}$/.test(formData.phoneNumber)) {
			setError('Phone number must contain exactly 10 digits.');
			return;
		}

		if (formData.password.length < 6) {
			setError('Password must be at least 6 characters long.');
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError('Password and confirm password do not match.');
			return;
		}

		try {
			await registerAccount({
				fullName: formData.fullName,
				email: formData.email,
				phoneNumber: formData.phoneNumber,
				password: formData.password,
			});
			navigate('/login', { state: { registered: true } });
		} catch (apiError) {
			setError(apiError.message);
		}
	};

	return (
		<div className="auth-shell">
			<div className="auth-card">
				<div className="brand-pill">Ride Booking</div>
				<h1 className="auth-title">Create account</h1>
				<form onSubmit={handleSubmit} className="auth-form">
					<label htmlFor="fullName">Full Name</label>
					<input
						id="fullName"
						name="fullName"
						type="text"
						value={formData.fullName}
						onChange={handleChange}
						autoComplete="name"
						placeholder="Enter your full name"
					/>

					<label htmlFor="email">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						value={formData.email}
						onChange={handleChange}
						autoComplete="email"
						placeholder="name@example.com"
					/>

					<label htmlFor="phoneNumber">Phone Number</label>
					<input
						id="phoneNumber"
						name="phoneNumber"
						type="text"
						value={formData.phoneNumber}
						onChange={handleChange}
						autoComplete="tel"
						placeholder="0771234567"
					/>

					<label htmlFor="password">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						value={formData.password}
						onChange={handleChange}
						autoComplete="new-password"
						placeholder="Create password"
					/>

					<label htmlFor="confirmPassword">Confirm Password</label>
					<input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						value={formData.confirmPassword}
						onChange={handleChange}
						autoComplete="new-password"
						placeholder="Re-enter password"
					/>

					{error && <p className="auth-error">{error}</p>}

					<button type="submit" className="cta-btn" disabled={isLoading}>
						{isLoading ? 'Creating account...' : 'Create account'}
					</button>
				</form>

				<p className="auth-footnote">
					Already have an account? <Link to="/login">Sign in</Link>
				</p>
			</div>
		</div>
	);
};

export default RegisterPage;
