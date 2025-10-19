import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [focusedField, setFocusedField] = useState(null);

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
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Form submitted:', formData);
            alert('Thank you for contacting us! We will get back to you soon.');
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-black mb-4">Contact Us 📞</h1>
                    <p className="text-xl opacity-90">We'd love to hear from you!</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Have a question, feedback, or just want to say hello? We're here to help!
                            Fill out the form or reach us through any of the channels below.
                        </p>

                        {/* Contact Cards */}
                        <div className="space-y-6">
                            {/* Phone */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center">
                                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl mr-4">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-1">Phone</h3>
                                        <p className="text-gray-600">+91 9876543210</p>
                                        <p className="text-sm text-gray-500">24/7 Customer Support</p>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center">
                                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl mr-4">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                                        <p className="text-gray-600">support@eato.com</p>
                                        <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center">
                                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl mr-4">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-1">Office</h3>
                                        <p className="text-gray-600">123 Food Street</p>
                                        <p className="text-gray-600">Mumbai, Maharashtra 400001</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                                <h3 className="font-bold text-gray-800 mb-4">Follow Us</h3>
                                <div className="flex space-x-4">
                                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg hover:shadow-lg transition-all duration-200">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </a>
                                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg hover:shadow-lg transition-all duration-200">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                        </svg>
                                    </a>
                                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg hover:shadow-lg transition-all duration-200">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                                        </svg>
                                    </a>
                                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg hover:shadow-lg transition-all duration-200">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`block w-full px-4 py-3 border ${errors.name ? 'border-red-400 bg-red-50' :
                                            focusedField === 'name' ? 'border-orange-400 bg-orange-50' :
                                                'border-gray-200 bg-gray-50'
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900`}
                                    placeholder="John Doe"
                                />
                                {errors.name && (
                                    <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                        <span className="mr-1">⚠</span> {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email and Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`block w-full px-4 py-3 border ${errors.email ? 'border-red-400 bg-red-50' :
                                                focusedField === 'email' ? 'border-orange-400 bg-orange-50' :
                                                    'border-gray-200 bg-gray-50'
                                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900`}
                                        placeholder="you@example.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                            <span className="mr-1">⚠</span> {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('phone')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`block w-full px-4 py-3 border ${errors.phone ? 'border-red-400 bg-red-50' :
                                                focusedField === 'phone' ? 'border-orange-400 bg-orange-50' :
                                                    'border-gray-200 bg-gray-50'
                                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900`}
                                        placeholder="9876543210"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                            <span className="mr-1">⚠</span> {errors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Subject <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('subject')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`block w-full px-4 py-3 border ${errors.subject ? 'border-red-400 bg-red-50' :
                                            focusedField === 'subject' ? 'border-orange-400 bg-orange-50' :
                                                'border-gray-200 bg-gray-50'
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900`}
                                    placeholder="How can we help you?"
                                />
                                {errors.subject && (
                                    <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                        <span className="mr-1">⚠</span> {errors.subject}
                                    </p>
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('message')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`block w-full px-4 py-3 border ${errors.message ? 'border-red-400 bg-red-50' :
                                            focusedField === 'message' ? 'border-orange-400 bg-orange-50' :
                                                'border-gray-200 bg-gray-50'
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 resize-none`}
                                    placeholder="Tell us more about your inquiry..."
                                />
                                {errors.message && (
                                    <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                        <span className="mr-1">⚠</span> {errors.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
