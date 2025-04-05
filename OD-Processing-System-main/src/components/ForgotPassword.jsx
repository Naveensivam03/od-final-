import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';
import '../styles/ForgotPassword.css';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockIcon from '@mui/icons-material/Lock';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState('forgot'); // 'forgot', 'verify', 'reset'
    const [isLoading, setIsLoading] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const response = await axios.post(API_ENDPOINTS.SEND_OTP, { email });
            
            if (response.data.message === 'OTP sent successfully') {
                setStep('verify');
                setMessage('OTP has been sent to your email');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const response = await axios.post(API_ENDPOINTS.VERIFY_OTP, { email, otp });
            
            if (response.data.success) {
                setStep('reset');
                setMessage('OTP verified successfully');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to verify OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }
        
        try {
            const response = await axios.post(API_ENDPOINTS.RESET_PASSWORD, {
                email,
                otp,
                newPassword
            });
            
            if (response.data.success) {
                setMessage('Password reset successfully');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                <div className="logo-container">
                    <img src="/ssn-logo.webp" alt="SSN Logo" className="ssn-logo" />
                </div>
                <h2 className="forgot-password-title">Reset Password</h2>
                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}

                {step === 'forgot' && (
                    <form onSubmit={handleForgotPassword}>
                        <div className="form-group">
                            <div className="input-group">
                                <PersonOutlineIcon className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="submit-button" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 'verify' && (
                    <form onSubmit={handleVerifyOTP}>
                        <div className="form-group">
                            <div className="input-group">
                                <LockIcon className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength="6"
                                />
                            </div>
                        </div>
                        <button type="submit" className="submit-button" disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                )}

                {step === 'reset' && (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <div className="input-group">
                                <LockIcon className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength="6"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="input-group">
                                <LockIcon className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength="6"
                                />
                            </div>
                        </div>
                        <button type="submit" className="submit-button" disabled={isLoading}>
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <div className="back-to-login">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;