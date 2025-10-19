import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent mb-4">
                        Welcome to Eato! 🍽️
                    </h1>
                    <p className="text-2xl text-gray-700 mb-8">
                        Your favorite food is just a click away
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/signin"
                            className="px-8 py-3 bg-white text-orange-600 border-2 border-orange-500 rounded-xl font-semibold hover:bg-orange-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                    {/* Feature 1 */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="text-5xl mb-4">🍕</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Wide Variety</h3>
                        <p className="text-gray-600">
                            Explore thousands of dishes from your favorite restaurants. Pizza, burgers, sushi, and more!
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="text-5xl mb-4">🚀</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Fast Delivery</h3>
                        <p className="text-gray-600">
                            Get your food delivered hot and fresh in 30 minutes or less. Track your order in real-time.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="text-5xl mb-4">💳</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Easy Payment</h3>
                        <p className="text-gray-600">
                            Multiple payment options including cards, UPI, and cash on delivery. Simple and secure.
                        </p>
                    </div>
                </div>

                {/* Popular Categories */}
                <div className="mt-16">
                    <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
                        Popular Categories
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {[
                            { emoji: '🍔', name: 'Burgers' },
                            { emoji: '🍕', name: 'Pizza' },
                            { emoji: '🍰', name: 'Cake' }
                        ].map((category, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 cursor-pointer"
                            >
                                <div className="text-5xl mb-2">{category.emoji}</div>
                                <p className="font-semibold text-gray-700">{category.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <h3 className="text-5xl font-bold mb-2">50K+</h3>
                            <p className="text-xl">Happy Customers</p>
                        </div>
                        <div>
                            <h3 className="text-5xl font-bold mb-2">200+</h3>
                            <p className="text-xl">Restaurant Partners</p>
                        </div>
                        <div>
                            <h3 className="text-5xl font-bold mb-2">99%</h3>
                            <p className="text-xl">Satisfaction Rate</p>
                        </div>
                    </div>
                </div>

                {/* Temporary Bypass Notice */}
                <div className="mt-16 bg-yellow-100 border-l-4 border-yellow-500 p-6 rounded-lg">
                    <div className="flex items-start">
                        <div className="text-3xl mr-4">⚠️</div>
                        <div>
                            <h4 className="text-lg font-bold text-yellow-800 mb-2">
                                Development Mode
                            </h4>
                            <p className="text-yellow-700">
                                Authentication is currently bypassed for development.
                                In production, users will need to sign up/sign in to access the platform.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
