import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignIn = () => {
    const [formData, setFormData] = useState({
        emailOrPhone: '',
        countryCode: '+91', // Default to India
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [inputType, setInputType] = useState('text'); // 'email' or 'phone'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Detect if input is email or phone
        if (name === 'emailOrPhone') {
            if (value.includes('@')) {
                setInputType('email');
            } else if (/^\d+$/.test(value)) {
                setInputType('phone');
            } else {
                setInputType('text');
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Email or Phone validation
        if (!formData.emailOrPhone) {
            newErrors.emailOrPhone = 'Email or phone number is required';
        } else {
            // Check if it's an email
            if (formData.emailOrPhone.includes('@')) {
                if (!/\S+@\S+\.\S+/.test(formData.emailOrPhone)) {
                    newErrors.emailOrPhone = 'Invalid email format';
                }
            }
            // Check if it's a phone number (Indian format: 10 digits starting with 6-9)
            else if (/^\d+$/.test(formData.emailOrPhone)) {
                if (!/^[6-9]\d{9}$/.test(formData.emailOrPhone)) {
                    newErrors.emailOrPhone = 'Phone number must be 10 digits starting with 6, 7, 8, or 9';
                }
            }
            // Invalid format
            else {
                newErrors.emailOrPhone = 'Enter a valid email or 10-digit phone number';
            }
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Form submitted:', {
                ...formData,
                inputType
            });
            // TODO: Add your API call here
            alert('Sign in successful! (API integration pending)');
        }
    };

    const getPlaceholder = () => {
        if (inputType === 'email') {
            return 'your.email@example.com';
        } else if (inputType === 'phone') {
            return '1234567890';
        }
        return 'Email or phone number';
    };

    const getInputIcon = () => {
        if (inputType === 'email') {
            return (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            );
        } else if (inputType === 'phone') {
            return (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            );
        }
        return (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center items-center space-x-2 mb-4">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                            Eato
                        </h1>
                        <span className="text-4xl">🍽️</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Welcome back!
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Sign In Form */}
                <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-xl" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Email or Phone Input */}
                        <div>
                            <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-1">
                                Email or Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className={`relative ${inputType === 'phone' ? 'flex' : ''}`}>
                                {/* India Country Code - Only shown for phone numbers */}
                                {inputType === 'phone' && (
                                    <div className="flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-100 rounded-l-lg">
                                        <span className="text-gray-700 font-medium">🇮🇳 +91</span>
                                    </div>
                                )}

                                {/* Input Field */}
                                <div className={`relative ${inputType === 'phone' ? 'flex-1' : 'w-full'}`}>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {getInputIcon()}
                                    </div>
                                    <input
                                        id="emailOrPhone"
                                        name="emailOrPhone"
                                        type="text"
                                        required
                                        value={formData.emailOrPhone}
                                        onChange={handleChange}
                                        className={`appearance-none relative block w-full pl-10 pr-4 py-3 border ${errors.emailOrPhone ? 'border-red-500' : 'border-gray-300'
                                            } placeholder-gray-400 text-gray-900 ${inputType === 'phone' ? 'rounded-r-lg' : 'rounded-lg'
                                            } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
                                        placeholder={getPlaceholder()}
                                    />
                                </div>
                            </div>
                            {errors.emailOrPhone && (
                                <p className="mt-1 text-sm text-red-500">{errors.emailOrPhone}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                {inputType === 'email' && '📧 Email detected'}
                                {inputType === 'phone' && '📱 Phone number detected'}
                                {inputType === 'text' && 'Enter your email or 10-digit phone number'}
                            </p>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`appearance-none relative block w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="/forgot-password" className="font-medium text-orange-500 hover:text-orange-600 transition-colors duration-300">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-orange-300 group-hover:text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                            </span>
                            Sign In
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-medium text-orange-500 hover:text-orange-600 transition-colors duration-300">
                                Create one now
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
