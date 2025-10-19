import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignUpValidations } from '../utils/Validations';

const SignUp = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        countryCode: '+91', // Default to India
        mobileNumber: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const validationErrors = SignUpValidations(formData);

        if (!formData.confirmPassword) {
            validationErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            validationErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Form submitted:', formData);
            alert('Sign up successful! (API integration pending)');
        }
    };

    const passwordStrength = () => {
        const pwd = formData.password;
        if (!pwd) return 0;
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
        if (/\d/.test(pwd)) strength++;
        if (/[^a-zA-Z\d]/.test(pwd)) strength++;
        return strength;
    };

    const strength = passwordStrength();

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center space-x-2 mb-4 bg-white px-6 py-3 rounded-2xl shadow-lg">
                        <h1 className="text-5xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
                            Eato
                        </h1>
                        <span className="text-4xl">🍽️</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Create your account
                    </h2>
                    <p className="text-gray-600">
                        Join thousands of food lovers and start your culinary journey
                    </p>
                </div>

                {/* Sign Up Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                    {/* Name Fields - 3 Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* First Name */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                                First Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('firstName')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`block w-full pl-10 pr-3 py-3 border ${errors.firstName ? 'border-red-400 bg-red-50' :
                                        focusedField === 'firstName' ? 'border-orange-400 bg-orange-50' :
                                            'border-gray-200 bg-gray-50'
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900`}
                                    placeholder="John"
                                />
                            </div>
                            {errors.firstName && (
                                <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                    <span className="mr-1">⚠</span> {errors.firstName}
                                </p>
                            )}
                        </div>

                        {/* Middle Name */}
                        <div>
                            <label htmlFor="middleName" className="block text-sm font-semibold text-gray-700 mb-2">
                                Middle
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    id="middleName"
                                    name="middleName"
                                    type="text"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('middleName')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`block w-full pl-10 pr-3 py-3 border ${errors.middleName ? 'border-red-400 bg-red-50' :
                                        focusedField === 'middleName' ? 'border-orange-400 bg-orange-50' :
                                            'border-gray-200 bg-gray-50'
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900`}
                                    placeholder="M."
                                />
                            </div>
                            {errors.middleName && (
                                <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                    <span className="mr-1">⚠</span> {errors.middleName}
                                </p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                                Last Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('lastName')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`block w-full pl-10 pr-3 py-3 border ${errors.lastName ? 'border-red-400 bg-red-50' :
                                        focusedField === 'lastName' ? 'border-orange-400 bg-orange-50' :
                                            'border-gray-200 bg-gray-50'
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900`}
                                    placeholder="Doe"
                                />
                            </div>
                            {errors.lastName && (
                                <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                    <span className="mr-1">⚠</span> {errors.lastName}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email & Phone - 2 Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-400 bg-red-50' :
                                        focusedField === 'email' ? 'border-orange-400 bg-orange-50' :
                                            'border-gray-200 bg-gray-50'
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                    <span className="mr-1">⚠</span> {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative flex">
                                {/* India Country Code - Static */}
                                <div className="flex items-center px-3 py-3 border border-r-0 border-gray-200 bg-gray-100 rounded-l-xl">
                                    <span className="text-gray-700 font-medium">🇮🇳 +91</span>
                                </div>

                                {/* Phone Number Input */}
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="mobileNumber"
                                        name="mobileNumber"
                                        type="tel"
                                        required
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('mobileNumber')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`block w-full pl-10 pr-3 py-3 border ${errors.mobileNumber ? 'border-red-400 bg-red-50' :
                                                focusedField === 'mobileNumber' ? 'border-orange-400 bg-orange-50' :
                                                    'border-gray-200 bg-gray-50'
                                            } rounded-r-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900`}
                                        placeholder="1234567890"
                                    />
                                </div>
                            </div>
                            {errors.mobileNumber && (
                                <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                    <span className="mr-1">⚠</span> {errors.mobileNumber}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Password Fields - 2 Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-400 bg-red-50' :
                                        focusedField === 'password' ? 'border-orange-400 bg-orange-50' :
                                            'border-gray-200 bg-gray-50'
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
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
                            {formData.password && !errors.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= strength
                                                    ? strength === 1
                                                        ? 'bg-red-500'
                                                        : strength === 2
                                                            ? 'bg-yellow-500'
                                                            : strength === 3
                                                                ? 'bg-blue-500'
                                                                : 'bg-green-500'
                                                    : 'bg-gray-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {strength === 1 && 'Weak password'}
                                        {strength === 2 && 'Fair password'}
                                        {strength === 3 && 'Good password'}
                                        {strength === 4 && 'Strong password'}
                                    </p>
                                </div>
                            )}
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                    <span className="mr-1">⚠</span> {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('confirmPassword')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`block w-full pl-10 pr-10 py-3 border ${errors.confirmPassword ? 'border-red-400 bg-red-50' :
                                        focusedField === 'confirmPassword' ? 'border-orange-400 bg-orange-50' :
                                            'border-gray-200 bg-gray-50'
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? (
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
                            {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                                <p className="mt-1.5 text-xs text-green-600 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Passwords match
                                </p>
                            )}
                            {errors.confirmPassword && (
                                <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                    <span className="mr-1">⚠</span> {errors.confirmPassword}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Create Account
                        </button>
                    </div>

                    {/* Sign In Link */}
                    <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/signin" className="font-semibold text-orange-600 hover:text-orange-700 transition-colors duration-200">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>

                {/* Trust Indicators */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        By signing up, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;